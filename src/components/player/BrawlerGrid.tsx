
'use client'

import { motion } from "framer-motion";
import { useState } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Trophy, Star, Crown } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createBrawlerSlug } from "@/lib/utils";

interface Brawler {
    id: number;
    name: string;
    power: number;
    rank: number;
    trophies?: number;
    highestTrophies?: number;
}

interface BrawlerGridProps {
    brawlers: Brawler[];
}

export const BrawlerGrid = ({ brawlers }: BrawlerGridProps) => {
    const [sortBy, setSortBy] = useState<'name' | 'power' | 'rank'>('name');

    const sortedBrawlers = [...brawlers].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'power':
                return b.power - a.power;
            case 'rank':
                return b.rank - a.rank;
            default:
                return 0;
        }
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-200 rounded-lg shadow-sm p-6 my-8"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Brawlers</h2>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'power' | 'rank')}
                    className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-gray-900"
                >
                    <option value="name">Sort by Name</option>
                    <option value="power">Sort by Power</option>
                    <option value="rank">Sort by Rank</option>
                </select>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {sortedBrawlers.map((brawler) => (
                    <HoverCard key={brawler.id} openDelay={200}>
                        <HoverCardTrigger asChild>
                            <Link
                                href={`/brawlers/${createBrawlerSlug(brawler.name)}`}
                                className="flex flex-col items-center p-3 rounded-lg bg-white hover:bg-gray-50 border border-gray-200 transition-all cursor-pointer group"
                            >
                                <div className="relative w-12 h-12 mb-2">
                                    <Image
                                        src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`}
                                        alt={brawler.name}
                                        fill
                                        className="rounded-full object-cover group-hover:scale-110 transition-transform"
                                        sizes="48px"
                                    />
                                </div>
                                <span className="text-sm font-medium text-gray-900">{brawler.name}</span>
                                <span className="text-xs text-gray-700">
                                    Power {brawler.power}
                                </span>
                                <span className="text-xs text-gray-700">
                                    Rank {brawler.rank}
                                </span>
                            </Link>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80 bg-gray-200 border-gray-300" side="top">
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="relative w-16 h-16">
                                        <Image
                                            src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`}
                                            alt={brawler.name}
                                            fill
                                            className="rounded-lg object-cover"
                                            sizes="64px"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-bold text-gray-900">{brawler.name}</h3>
                                        <p className="text-sm text-gray-600">Click to view full details</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
                                        <Star className="h-4 w-4 text-yellow-400" />
                                        <div>
                                            <p className="text-xs text-gray-600">Power</p>
                                            <p className="text-sm font-semibold text-gray-900">{brawler.power}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
                                        <Crown className="h-4 w-4 text-purple-400" />
                                        <div>
                                            <p className="text-xs text-gray-600">Rank</p>
                                            <p className="text-sm font-semibold text-gray-900">{brawler.rank}</p>
                                        </div>
                                    </div>

                                    {brawler.trophies !== undefined && (
                                        <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
                                            <Trophy className="h-4 w-4 text-blue-400" />
                                            <div>
                                                <p className="text-xs text-gray-600">Trophies</p>
                                                <p className="text-sm font-semibold text-gray-900">{brawler.trophies}</p>
                                            </div>
                                        </div>
                                    )}

                                    {brawler.highestTrophies !== undefined && (
                                        <div className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg">
                                            <Trophy className="h-4 w-4 text-green-400" />
                                            <div>
                                                <p className="text-xs text-gray-600">Best</p>
                                                <p className="text-sm font-semibold text-gray-900">{brawler.highestTrophies}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </HoverCardContent>
                    </HoverCard>
                ))}
            </div>
        </motion.div>
    );
};
