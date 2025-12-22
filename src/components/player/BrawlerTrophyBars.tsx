'use client'

import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import Image from "next/image";
import { useBrawlers } from "@/hooks/useBrawlers";

interface PlayerBrawler {
    id: number;
    name: string;
    power: number;
    rank: number;
    trophies?: number;
    highestTrophies?: number;
}

interface BrawlerWithRarity extends PlayerBrawler {
    rarity?: string;
}

interface BrawlerTrophyBarsProps {
    brawlers: PlayerBrawler[];
}

// Official Brawl Stars rarity colors
const RARITY_COLORS: Record<string, string> = {
    'Common': '#94D7F4',
    'Rare': '#2DDD1D',
    'Super Rare': '#0087FA',
    'Epic': '#B115ED',
    'Mythic': '#D6001A',
    'Legendary': '#FFF11F',
    'Ultra Legendary': '#ffffff',
    'Chromatic': '#F88F58',
    'Trophy Road': '#94D7F4',
    'Starting': '#94D7F4',
};

const getRarityColor = (rarityName: string | undefined): string => {
    if (!rarityName) return '#94D7F4'; // default fallback
    return RARITY_COLORS[rarityName] || '#94D7F4';
};

// Convert hex color to rgba with opacity
const hexToRgba = (hex: string, opacity: number): string => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const calculateBarHeight = (trophies: number, maxTrophies: number): number => {
    const MIN_HEIGHT = 20; // Minimum visible height in pixels
    const MAX_HEIGHT = 200; // Container height

    if (maxTrophies === 0) return MIN_HEIGHT;

    // Scale linearly from MIN_HEIGHT to MAX_HEIGHT
    const scaledHeight = MIN_HEIGHT + ((trophies / maxTrophies) * (MAX_HEIGHT - MIN_HEIGHT));
    return Math.max(MIN_HEIGHT, Math.min(scaledHeight, MAX_HEIGHT));
};

export const BrawlerTrophyBars = ({ brawlers }: BrawlerTrophyBarsProps) => {
    const { data: allBrawlers, isLoading: isLoadingBrawlers } = useBrawlers();

    console.log('All Brawlers data structure:', allBrawlers);
    console.log('Sample brawler from API:', allBrawlers?.[0]);

    // Join player brawlers with full brawler data to get rarity
    const brawlersWithRarity: BrawlerWithRarity[] = brawlers.map(pb => {
        // allBrawlers is now directly an array (not wrapped in .list or .items)
        const matchedBrawler = allBrawlers?.find((b: any) => b.id === pb.id);
        const rarity = matchedBrawler?.rarity?.name || matchedBrawler?.rarity;

        console.log('Brawler:', pb.name, 'ID:', pb.id, 'Matched:', !!matchedBrawler, 'Rarity:', rarity, 'Rarity object:', matchedBrawler?.rarity);

        return {
            ...pb,
            rarity
        };
    });

    // Filter to only brawlers with trophies and sort by trophies descending
    const sortedBrawlers = brawlersWithRarity
        .filter(b => b.trophies !== undefined)
        .sort((a, b) => (b.trophies || 0) - (a.trophies || 0));

    // Calculate max trophies for scaling
    const maxTrophies = Math.max(...sortedBrawlers.map(b => b.trophies || 0));

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.01, // Stagger by 10ms
            }
        }
    };

    const barVariants = {
        hidden: { opacity: 0, scaleY: 0 },
        visible: {
            opacity: 1,
            scaleY: 1,
            transition: { duration: 0.3 }
        }
    };

    if (isLoadingBrawlers) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Brawler Trophy Ranking</CardTitle>
                    <CardDescription>Loading brawler data...</CardDescription>
                </CardHeader>
                <CardContent className="h-72 flex items-center justify-center">
                    <div className="text-gray-600">Loading...</div>
                </CardContent>
            </Card>
        );
    }

    if (sortedBrawlers.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Brawler Trophy Ranking</CardTitle>
                    <CardDescription>No brawler trophy data available</CardDescription>
                </CardHeader>
                <CardContent className="h-72 flex items-center justify-center">
                    <div className="text-gray-600">No trophy data found</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Brawler Trophy Ranking</CardTitle>
                <CardDescription>
                    {sortedBrawlers.length} unlocked brawler{sortedBrawlers.length !== 1 ? 's' : ''} sorted by current trophies
                </CardDescription>
            </CardHeader>
            <CardContent className="h-72">
                <motion.div
                    className="flex items-end h-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800 pb-2"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {sortedBrawlers.map((brawler) => {
                        const barHeight = calculateBarHeight(brawler.trophies || 0, maxTrophies);
                        const rarityColor = getRarityColor(brawler.rarity);
                        const barColor = hexToRgba(rarityColor, 0.6); // 60% opacity for bars

                        console.log('Rendering bar for:', brawler.name, 'Rarity:', brawler, 'Color:', rarityColor);

                        return (
                            <HoverCard key={brawler.id} openDelay={200}>
                                <HoverCardTrigger asChild>
                                    <motion.div
                                        className="flex flex-col items-center cursor-pointer w-[12px] md:w-[14px] lg:w-[16px] flex-shrink-0"
                                        variants={barVariants}
                                        whileHover={{ scale: 1.05, y: -4 }}
                                    >
                                        {/* Square image on top */}
                                        <div
                                            className="w-full aspect-square bg-gray-700 overflow-hidden mb-0.5 relative"
                                            style={{
                                                backgroundColor: rarityColor,
                                            }}
                                        >
                                            <Image
                                                src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`}
                                                alt={brawler.name}
                                                fill
                                                className="object-cover"
                                                sizes="16px"
                                                onError={(e) => {
                                                    e.currentTarget.src = `/brawlers/${brawler.id}.webp`;
                                                }}
                                            />
                                        </div>

                                        {/* Trophy bar */}
                                        <div
                                            className="w-full transition-all"
                                            style={{
                                                height: `${barHeight}px`,
                                                backgroundColor: barColor,
                                            }}
                                        />
                                    </motion.div>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-80 bg-gray-200 border-gray-300" side="top">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12">
                                                <Image
                                                    src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`}
                                                    alt={brawler.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-lg object-cover"
                                                    onError={(e) => {
                                                        e.currentTarget.src = `/brawlers/${brawler.id}.webp`;
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{brawler.name}</h3>
                                                <p className="text-sm text-gray-600">{brawler.rarity || 'Unknown'}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg">
                                                <Trophy className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-gray-600">Current</p>
                                                    <p className="text-sm font-semibold text-gray-900">{brawler.trophies}</p>
                                                </div>
                                            </div>
                                            {brawler.highestTrophies !== undefined && (
                                                <div className="flex items-center gap-2 p-2 bg-gray-700 rounded-lg">
                                                    <Trophy className="h-4 w-4 text-green-400 flex-shrink-0" />
                                                    <div className="min-w-0">
                                                        <p className="text-xs text-gray-600">Highest</p>
                                                        <p className="text-sm font-semibold text-gray-900">{brawler.highestTrophies}</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </HoverCardContent>
                            </HoverCard>
                        );
                    })}
                </motion.div>
            </CardContent>
        </Card>
    );
};
