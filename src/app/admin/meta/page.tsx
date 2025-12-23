'use client';

import { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { useBrawlers } from '@/hooks/useBrawlers';
import { Brawler } from '@/types/brawler';
import Image from 'next/image';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  useSortable,
} from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TierBrawler {
  brawlerId: number;
  position: number;
  brawler?: Brawler;
}

interface TierData {
  id: number;
  brawlerId: number;
  tier: string;
  position: number;
}

const TIER_CONFIG = {
  S: { label: 'S', color: 'bg-[#f66]', textColor: 'text-white' },
  A: { label: 'A', color: 'bg-[#f96]', textColor: 'text-white' },
  B: { label: 'B', color: 'bg-[#fc6]', textColor: 'text-gray-900' },
  C: { label: 'C', color: 'bg-[#cf6]', textColor: 'text-gray-900' },
  D: { label: 'D', color: 'bg-[#6c6]', textColor: 'text-gray-900' },
  F: { label: 'F', color: 'bg-[#6fc]', textColor: 'text-gray-900' },
} as const;

const TIERS = ['S', 'A', 'B', 'C', 'D', 'F'] as const;

function SortableBrawlerItem({ brawler, tier }: { brawler: Brawler; tier: string }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `${tier}-${brawler.id}`,
    data: { brawler, tier, type: 'brawler' },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move"
    >
      <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-300 hover:border-primary transition-all">
        <Image
          src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`}
          alt={brawler.name}
          fill
          sizes="64px"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-center mt-1 truncate">{brawler.name}</p>
    </div>
  );
}

function DroppableTierZone({ tier, children, isEmpty }: { tier: string; children: React.ReactNode; isEmpty: boolean }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `tier-zone-${tier}`,
    data: { tier, type: 'tier-zone' },
  });

  // Only use droppable for empty tiers, otherwise let SortableContext handle it
  if (!isEmpty) {
    return (
      <div className="flex-1 bg-white rounded-lg border-2 border-dashed border-gray-300 p-4 min-h-[120px]">
        {children}
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex-1 bg-white rounded-lg border-2 border-dashed p-4 min-h-[120px] transition-colors ${
        isOver ? 'border-primary bg-blue-50' : 'border-gray-300'
      }`}
    >
      {children}
    </div>
  );
}

export default function MetaAdminPage() {
  const { data: brawlers } = useBrawlers();
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [tierData, setTierData] = useState<Record<string, TierBrawler[]>>({
    S: [],
    A: [],
    B: [],
    C: [],
    D: [],
    F: [],
  });
  const [activeDragId, setActiveDragId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadTierData = async () => {
      try {
        const response = await fetch('/api/meta');
        const data: TierData[] = await response.json();

        const grouped: Record<string, TierBrawler[]> = {
          S: [],
          A: [],
          B: [],
          C: [],
          D: [],
          F: [],
        };

        data.forEach((item) => {
          if (item.tier in grouped) {
            const brawler = brawlers?.find((b) => b.id === item.brawlerId);
            grouped[item.tier].push({
              brawlerId: item.brawlerId,
              position: item.position,
              brawler,
            });
          }
        });

        Object.keys(grouped).forEach((tier) => {
          grouped[tier].sort((a, b) => a.position - b.position);
        });

        setTierData(grouped);
      } catch (error) {
        console.error('Failed to load tier data:', error);
      }
    };

    if (brawlers) {
      loadTierData();
    }
  }, [brawlers]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
    console.log('Drag started:', event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    console.log('Drag over - active:', activeId, 'over:', overId);

    // Allow visual feedback by not preventing the drag
    const [activeTier] = activeId.split('-');
    const isFromAvailable = activeTier === 'available';

    // If dragging from available, we need to allow it to move over tier items
    if (isFromAvailable) {
      return;
    }

    // For items already in tiers, allow reordering
    const [overTier] = overId.split('-');
    if (activeTier !== overTier && !overId.startsWith('tier-zone-')) {
      // Allow cross-tier dragging
      return;
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDragId(null);

    console.log('Drag end - active:', active.id, 'over:', over?.id);

    if (!over) {
      console.log('No drop target detected');
      return;
    }

    const activeId = active.id as string;
    let overId = over.id as string;

    // Handle drops on tier zones
    if (overId.startsWith('tier-zone-')) {
      const targetTier = overId.replace('tier-zone-', '');
      const [activeTier, activeBrawlerId] = activeId.split('-');

      // Ignore drops on available tier
      if (targetTier === 'available') return;

      // Adding from available to a tier
      if (activeTier === 'available') {
        const brawler = brawlers?.find((b) => b.id === Number(activeBrawlerId));
        if (!brawler) return;

        const destItems = tierData[targetTier] || [];
        const newItem: TierBrawler = {
          brawlerId: Number(activeBrawlerId),
          position: destItems.length,
          brawler,
        };

        const reindexedDestItems = [...destItems, newItem].map((item, index) => ({
          ...item,
          position: index,
        }));

        setTierData({
          ...tierData,
          [targetTier]: reindexedDestItems,
        });
        return;
      }

      // Moving from tier to tier (drop on zone)
      if (activeTier !== targetTier) {
        const sourceItems = tierData[activeTier];
        const destItems = tierData[targetTier] || [];

        const movingItem = sourceItems.find((i) => i.brawlerId === Number(activeBrawlerId));
        if (!movingItem) return;

        const newSourceItems = sourceItems
          .filter((i) => i.brawlerId !== Number(activeBrawlerId))
          .map((item, index) => ({ ...item, position: index }));

        const reindexedDestItems = [...destItems, movingItem].map((item, index) => ({
          ...item,
          position: index,
        }));

        setTierData({
          ...tierData,
          [activeTier]: newSourceItems,
          [targetTier]: reindexedDestItems,
        });
      }
      return;
    }

    const [activeTier, activeBrawlerId] = activeId.split('-');
    const [overTier, overBrawlerId] = overId.split('-');

    // Ignore drops on available tier
    if (overTier === 'available') return;

    // Adding from available to a tier
    if (activeTier === 'available') {
      const brawler = brawlers?.find((b) => b.id === Number(activeBrawlerId));
      if (!brawler) return;

      const destItems = tierData[overTier] || [];
      const insertIndex = destItems.findIndex((i) => i.brawlerId === Number(overBrawlerId));

      const newItem: TierBrawler = {
        brawlerId: Number(activeBrawlerId),
        position: 0,
        brawler,
      };

      const newDestItems = [...destItems];
      newDestItems.splice(insertIndex >= 0 ? insertIndex : destItems.length, 0, newItem);
      const reindexedDestItems = newDestItems.map((item, index) => ({ ...item, position: index }));

      setTierData({
        ...tierData,
        [overTier]: reindexedDestItems,
      });
      return;
    }

    if (activeTier === overTier) {
      // Reordering within same tier
      const items = tierData[activeTier];
      const oldIndex = items.findIndex((i) => i.brawlerId === Number(activeBrawlerId));
      const newIndex = items.findIndex((i) => i.brawlerId === Number(overBrawlerId));

      if (oldIndex !== newIndex) {
        const newItems = arrayMove(items, oldIndex, newIndex).map((item, index) => ({
          ...item,
          position: index,
        }));

        setTierData({
          ...tierData,
          [activeTier]: newItems,
        });
      }
    } else {
      // Moving to different tier
      const sourceItems = tierData[activeTier];
      const destItems = tierData[overTier];

      const movingItem = sourceItems.find((i) => i.brawlerId === Number(activeBrawlerId));
      if (!movingItem) return;

      const newSourceItems = sourceItems
        .filter((i) => i.brawlerId !== Number(activeBrawlerId))
        .map((item, index) => ({ ...item, position: index }));

      const insertIndex = destItems.findIndex((i) => i.brawlerId === Number(overBrawlerId));
      const newDestItems = [...destItems];
      newDestItems.splice(insertIndex >= 0 ? insertIndex : destItems.length, 0, movingItem);
      const reindexedDestItems = newDestItems.map((item, index) => ({ ...item, position: index }));

      setTierData({
        ...tierData,
        [activeTier]: newSourceItems,
        [overTier]: reindexedDestItems,
      });
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updates = Object.entries(tierData).flatMap(([tier, items]) =>
        items.map((item) => ({
          brawlerId: item.brawlerId,
          tier,
          position: item.position,
        }))
      );

      const response = await fetch('/api/meta/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Tier list saved successfully!',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving tier data:', error);
      toast({
        title: 'Error',
        description: 'Failed to save tier list',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const rankedBrawlerIds = new Set(
    Object.values(tierData).flatMap((tier) => tier.map((item) => item.brawlerId))
  );

  const availableBrawlers = brawlers?.filter((b) => !rankedBrawlerIds.has(b.id)) || [];

  const activeBrawler = activeDragId
    ? brawlers?.find((b) => activeDragId.endsWith(`-${b.id}`))
    : null;

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-600">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Meta Tier List Admin</h1>
            <p className="text-gray-600">Drag and drop brawlers to organize the tier list</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-4 mb-8">
            {TIERS.map((tier) => {
              const config = TIER_CONFIG[tier];
              const items = tierData[tier] || [];

              return (
                <div key={tier} className="flex gap-2 items-stretch">
                  <div
                    className={`${config.color} ${config.textColor} w-16 flex items-center justify-center font-bold text-2xl rounded-lg flex-shrink-0`}
                  >
                    {config.label}
                  </div>

                  <DroppableTierZone tier={tier} isEmpty={items.length === 0}>
                    <SortableContext items={items.map((item) => `${tier}-${item.brawlerId}`)}>
                      <div className="flex flex-wrap gap-3">
                        {items.length === 0 ? (
                          <div className="w-full text-center text-gray-400 text-sm py-8">
                            Drop brawlers here
                          </div>
                        ) : (
                          items.map(
                            (item) =>
                              item.brawler && (
                                <SortableBrawlerItem
                                  key={item.brawlerId}
                                  brawler={item.brawler}
                                  tier={tier}
                                />
                              )
                          )
                        )}
                      </div>
                    </SortableContext>
                  </DroppableTierZone>
                </div>
              );
            })}
          </div>

          {availableBrawlers.length > 0 && (
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Brawlers</h2>
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <SortableContext items={availableBrawlers.map((b: Brawler) => `available-${b.id}`)}>
                  <div className="flex flex-wrap gap-3">
                    {availableBrawlers.map((brawler: Brawler) => (
                      <SortableBrawlerItem
                        key={brawler.id}
                        brawler={brawler}
                        tier="available"
                      />
                    ))}
                  </div>
                </SortableContext>
              </div>
            </div>
          )}

          <DragOverlay>
            {activeBrawler ? (
              <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-primary opacity-90">
                <Image
                  src={`https://cdn.brawlify.com/brawlers/borderless/${activeBrawler.id}.png`}
                  alt={activeBrawler.name}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
    </div>
  );
}
