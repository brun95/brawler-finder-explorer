'use client';

import { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { MetaTierList } from '@/components/meta/MetaTierList';
import { useBrawlers } from '@/hooks/useBrawlers';

interface TierData {
  id: number;
  brawlerId: number;
  tier: string;
  position: number;
  updatedAt: string;
}

export default function MetaPage() {
  const { data: brawlers, isLoading: brawlersLoading } = useBrawlers();
  const [tierData, setTierData] = useState<TierData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTierData = async () => {
      try {
        const response = await fetch('/api/meta');
        const data = await response.json();
        setTierData(data);
      } catch (error) {
        console.error('Failed to load tier data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTierData();
  }, []);

  const lastUpdated = tierData.length > 0
    ? new Date(Math.max(...tierData.map(t => new Date(t.updatedAt).getTime())))
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Meta Tier List</h1>
          <p className="text-gray-600">
            Current brawler rankings based on competitive meta
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {lastUpdated.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          )}
        </div>

        {isLoading || brawlersLoading ? (
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex gap-2 animate-pulse">
                <div className="w-16 h-24 bg-gray-200 rounded-lg" />
                <div className="flex-1 h-24 bg-gray-200 rounded-lg" />
              </div>
            ))}
          </div>
        ) : tierData.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-lg">
              No tier data available yet. Check back soon!
            </p>
          </div>
        ) : brawlers ? (
          <MetaTierList tierData={tierData} brawlers={brawlers} />
        ) : null}
      </main>
    </div>
  );
}
