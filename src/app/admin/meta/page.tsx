'use client'

import { useState, useEffect } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, closestCenter } from '@dnd-kit/core';
import { SortableContext, arrayMove, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { NavBar } from '@/components/NavBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useBrawlers } from '@/hooks/useBrawlers';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import { Save, RefreshCw } from 'lucide-react';

const TIER_CONFIG = {
  S: { label: 'S', color: 'bg-red-500' },
  A: { label: 'A', color: 'bg-orange-400' },
  B: { label: 'B', color: 'bg-yellow-400' },
  C: { label: 'C', color: 'bg-lime-400' },
  D: { label: 'D', color: 'bg-green-400' },
  F: { label: 'F', color: 'bg-green-500' },
};

interface TierBrawler {
  brawlerId: number;
  tier: string;
  position: number;
  brawler?: any;
}

const SortableBrawler = ({ item }: { item: TierBrawler }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `${item.tier}-${item.brawlerId}`,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} className="cursor-move">
      <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-primary transition-colors">
        <Image
          src={`https://cdn.brawlify.com/brawlers/borderless/${item.brawlerId}.png`}
          alt={item.brawler?.name || 'Brawler'}
          fill
          sizes="64px"
          className="object-cover"
          loading="lazy"
        />
      </div>
      <p className="text-xs text-center mt-1 text-gray-300 truncate">{item.brawler?.name}</p>
    </div>
  );
};

export default function MetaAdminPage() {
  const { data: brawlers } = useBrawlers();
  const { toast } = useToast();
  const [tierData, setTierData] = useState<Record<string, TierBrawler[]>>({
    S: [], A: [], B: [], C: [], D: [], F: []
  });
  const [availableBrawlers, setAvailableBrawlers] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load existing tier data
  useEffect(() => {
    const loadTierData = async () => {
      try {
        const response = await fetch('/api/meta');
        const data = await response.json();

        const grouped: Record<string, TierBrawler[]> = {
          S: [], A: [], B: [], C: [], D: [], F: []
        };

        data.forEach((item: TierBrawler) => {
          const brawler = brawlers?.find((b: any) => b.id === item.brawlerId);
          if (brawler) {
            grouped[item.tier].push({ ...item, brawler });
          }
        });

        // Sort by position
        Object.keys(grouped).forEach((tier) => {
          grouped[tier].sort((a, b) => a.position - b.position);
        });

        setTierData(grouped);

        // Set available brawlers (not in any tier)
        if (brawlers) {
          const tieredIds = data.map((item: TierBrawler) => item.brawlerId);
          setAvailableBrawlers(brawlers.filter((b: any) => !tieredIds.includes(b.id)));
        }
      } catch (error) {
        console.error('Error loading tier data:', error);
      }
    };

    if (brawlers) {
      loadTierData();
    }
  }, [brawlers]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Parse tier and brawlerId from the id
    const [activeTier, activeBrawlerId] = activeId.split('-');
    const [overTier] = overId.split('-');

    if (activeTier === overTier) {
      // Reordering within the same tier
      setTierData((prev) => {
        const tierItems = [...prev[activeTier]];
        const oldIndex = tierItems.findIndex((item) => item.brawlerId === parseInt(activeBrawlerId));
        const newIndex = tierItems.findIndex((item) => `${overTier}-${item.brawlerId}` === overId);

        const reordered = arrayMove(tierItems, oldIndex, newIndex);
        reordered.forEach((item, index) => {
          item.position = index;
        });

        return { ...prev, [activeTier]: reordered };
      });
    } else {
      // Moving to a different tier
      setTierData((prev) => {
        const sourceTier = [...prev[activeTier]];
        const targetTier = [...prev[overTier]];

        const itemIndex = sourceTier.findIndex((item) => item.brawlerId === parseInt(activeBrawlerId));
        const [movedItem] = sourceTier.splice(itemIndex, 1);

        movedItem.tier = overTier;
        movedItem.position = targetTier.length;
        targetTier.push(movedItem);

        // Update positions
        sourceTier.forEach((item, index) => {
          item.position = index;
        });

        return { ...prev, [activeTier]: sourceTier, [overTier]: targetTier };
      });
    }

    setActiveId(null);
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
          description: 'Meta tier list updated successfully!',
        });
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save tier list',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Meta Tier List Admin</h1>
            <p className="text-gray-600">Drag and drop brawlers to organize the tier list</p>
          </div>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Save Changes
          </Button>
        </div>

        <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="space-y-4">
            {Object.entries(TIER_CONFIG).map(([tier, config]) => (
              <Card key={tier} className="bg-gray-800 border-gray-700">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`${config.color} w-12 h-12 rounded flex items-center justify-center font-bold text-2xl text-white`}>
                      {config.label}
                    </div>
                    <CardTitle className="text-white">
                      Tier {tier} ({tierData[tier]?.length || 0} brawlers)
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <SortableContext items={tierData[tier]?.map((item) => `${tier}-${item.brawlerId}`) || []}>
                    <div className="flex flex-wrap gap-3 min-h-[100px] bg-gray-900 p-4 rounded-lg">
                      {tierData[tier]?.map((item) => (
                        <SortableBrawler key={`${tier}-${item.brawlerId}`} item={item} />
                      ))}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            ))}
          </div>
        </DndContext>

        {/* Available Brawlers */}
        <Card className="mt-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Available Brawlers ({availableBrawlers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {availableBrawlers.map((brawler) => (
                <div key={brawler.id} className="text-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-gray-600">
                    <Image
                      src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`}
                      alt={brawler.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{brawler.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
