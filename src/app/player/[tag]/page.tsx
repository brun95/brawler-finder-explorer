'use client'

import dynamic from 'next/dynamic';

// Lazy load the heavy PlayerStatsContent component
const PlayerStatsContent = dynamic(() => import('@/components/pages/PlayerStatsContent'), {
    loading: () => (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-gray-700">Loading player stats...</div>
        </div>
    ),
    ssr: false
});

interface Props {
    params: Promise<{ tag: string }>
}

export default function PlayerStatsPage({ params }: Props) {
    return <PlayerStatsContent />;
}