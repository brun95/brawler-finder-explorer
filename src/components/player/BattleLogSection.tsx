
'use client'

import { motion } from "framer-motion";
import { BattleLog } from "@/types/api";
import { Circle, Flame, Swords, Star, Trophy, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchGameModes } from "@/api";
import { useEffect, useState } from "react";

interface BattleLogSectionProps {
    battles: BattleLog[];
    stats: {
        wins: number;
        losses: number;
        draws: number;
    };
    playerTag?: string;
}

export const BattleLogSection = ({ battles, stats, playerTag }: BattleLogSectionProps) => {
    const { wins, losses, draws } = stats;

    const [gameModeMap, setGameModeMap] = useState<Record<string, string>>({});

    // Fetch game modes and store the mapping
    useEffect(() => {
        const loadGameModes = async () => {
            try {
                const gameModes = await fetchGameModes();
                const modeMapping: Record<string, string> = {};

                gameModes.forEach((mode: { scHash: string; scId: string }) => {
                    modeMapping[mode.scHash] = mode.scId;
                });

                setGameModeMap(modeMapping);
            } catch (error) {
                console.error("Failed to fetch game modes:", error);
            }
        };

        loadGameModes();
    }, []);

    // Function to get the correct game mode ID
    const getGameModeId = (mode: string) => {
        return gameModeMap[mode] || "default";
    };

    // Count star player occurrences
    const starPlayerCount = battles.filter(
        battle => battle.battle.starPlayer?.tag === `#${playerTag}`
    ).length;

    // Find player's brawler in a battle
    const getPlayerBrawler = (battle: BattleLog) => {
        if (!playerTag) return null;

        const formattedPlayerTag = playerTag.startsWith('#') ? playerTag : `#${playerTag}`;
        
        // For regular team modes
        if (battle.battle.teams) {
            for (const team of battle.battle.teams) {
                for (const player of team) {
                    if (player.tag === formattedPlayerTag && player.brawler) {
                        return player.brawler;
                    }
                }
            }
        }
        
        // For showdown modes (players array)
        if (battle.battle.players) {
            for (const player of battle.battle.players) {
                if (player.tag === formattedPlayerTag && player.brawler) {
                    return player.brawler;
                }
            }
        }
        
        return null;
    };

    // Check if player was star player
    const isStarPlayer = (battle: BattleLog) => {
        if (!playerTag) return false;
        
        const formattedPlayerTag = playerTag.startsWith('#') ? playerTag : `#${playerTag}`;
        return battle.battle.starPlayer?.tag === formattedPlayerTag;
    };

    // Get player rank in showdown
    const getPlayerRank = (battle: BattleLog) => {
        if (!playerTag || !battle.battle.players) return null;
        
        const formattedPlayerTag = playerTag.startsWith('#') ? playerTag : `#${playerTag}`;
        
        for (const player of battle.battle.players) {
            if (player.tag === formattedPlayerTag) {
                return player.rank;
            }
        }
        
        return null;
    };

    // Determine if battle was a victory
    const getBattleResult = (battle: BattleLog) => {
        // For regular modes, use the result field
        if (battle.battle.result) {
            return battle.battle.result;
        }
        
        // For showdown modes, determine based on rank
        if (battle.battle.mode?.toLowerCase().includes('showdown')) {
            const rank = getPlayerRank(battle);
            
            if (rank) {
                if (battle.battle.mode.toLowerCase() === 'duoshowdown') {
                    // For Duo Showdown: ranks 1-3 are victories
                    return rank <= 3 ? 'victory' : 'defeat';
                } else {
                    // For Solo Showdown: ranks 1-5 are victories
                    return rank <= 5 ? 'victory' : 'defeat';
                }
            }
        }
        
        return 'unknown';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="bg-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold flex items-center gap-2">
                        Recent Battles
                        {/* <span className="flex gap-1 text-sm font-normal ml-2">
                            <span className="px-2 py-0.5 bg-green-100 rounded text-green-700">{wins}W</span>
                            <span className="px-2 py-0.5 bg-red-100 rounded text-red-700">{losses}L</span>
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700">{draws}D</span>
                            {starPlayerCount > 0 && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 rounded text-yellow-700 text-sm font-normal">
                                    <Star className="h-3 w-3" /> {starPlayerCount}
                                </span>
                            )}
                        </span> */}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
                        {battles
                        ?.filter((battle) => getGameModeId(battle.event.mode) !== "default")
                        ?.map((battle, index) => {
                            const playerBrawler = getPlayerBrawler(battle);
                            const wasStarPlayer = isStarPlayer(battle);
                            const result = getBattleResult(battle);
                            const gameModeId = getGameModeId(battle.event.mode);

                            return (
                            <div key={index} className="relative flex flex-col items-center">
                                <div
                                className={`relative w-full aspect-square flex items-center justify-center rounded-lg 
                                    ${result === "victory" ? "bg-green-500/20[#28A745]" : 
                                    result === "defeat" ? "bg-red-500/20[#DC3545]" : 
                                    "bg-gray-500/20"}
                                    ${wasStarPlayer ? "border-b-4 border-yellow-400" : ""}`}
                                >
                                {/* Game Mode Image (Bigger, Centered) */}
                                <img
                                    src={`https://cdn.brawlify.com/game-modes/regular/${gameModeId}.png`}
                                    alt={battle.event.mode}
                                    className="w-10 h-10 object-contain"
                                    onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                    e.currentTarget.parentElement!.appendChild(
                                        document.createTextNode(battle.event.mode.slice(0, 2))
                                    );
                                    }}
                                />

                                {/* Brawler Image (Top-Right Corner, Smaller) */}
                                {playerBrawler && (
                                    <div className="absolute top-1 right-0 w-6 h-6">
                                    <img
                                        src={`https://cdn.brawlify.com/brawlers/emoji/${playerBrawler.id}.png`}
                                        alt={playerBrawler.name}
                                        className="w-full h-full rounded-full"
                                    />
                                    </div>
                                )}
                                </div>
                            </div>
                            );
                        })}
                    </div>
                    </CardContent>

            </Card>
        </motion.div>
    );
};
