
import { motion } from "framer-motion";
import { BattleLog } from "@/types/api";
import { Circle, Flame, Swords, Star, Trophy, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    
    // Count star player occurrences
    const starPlayerCount = battles.filter(
        battle => battle.battle.starPlayer?.tag === playerTag
    ).length;

    // Get game mode icon
    const getModeIcon = (mode: string) => {
        switch (mode.toLowerCase()) {
            case "gemgrab":
                return <Circle className="h-6 w-6" />;
            case "hotzone":
            case "hotzone":
                return <Flame className="h-6 w-6" />;
            case "brawlball":
                return <Circle className="h-6 w-6" />;
            case "knockout":
                return <Swords className="h-6 w-6" />;
            case "bounty":
                return <Trophy className="h-6 w-6" />;
            case "showdown":
            case "duoshowdown":
                return <Award className="h-6 w-6" />;
            default:
                return <Swords className="h-6 w-6" />;
        }
    };

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
            <Card className="bg-white dark:bg-gray-800">
                <CardHeader className="pb-2">
                    <CardTitle className="text-xl font-semibold dark:text-gray-100 flex items-center gap-2">
                        Recent Battles
                        <span className="flex gap-1 text-sm font-normal ml-2">
                            <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 rounded text-green-700 dark:text-green-400">{wins}W</span>
                            <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 rounded text-red-700 dark:text-red-400">{losses}L</span>
                            <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-400">{draws}D</span>
                            {starPlayerCount > 0 && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-yellow-700 dark:text-yellow-400 text-sm font-normal">
                                    <Star className="h-3 w-3" /> {starPlayerCount}
                                </span>
                            )}
                        </span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                        {battles?.map((battle, index) => {
                            const playerBrawler = getPlayerBrawler(battle);
                            const wasStarPlayer = isStarPlayer(battle);
                            const result = getBattleResult(battle);
                            
                            return (
                                <div
                                    key={index}
                                    className="relative flex flex-col items-center"
                                >
                                    {playerBrawler && (
                                        <div className="absolute -top-3 z-10">
                                            <img
                                                src={`/brawlers/${playerBrawler.id}.webp`}
                                                alt={playerBrawler.name}
                                                className="w-8 h-8 rounded-full"
                                                onError={(e) => {
                                                    // Fallback to API image if local image fails
                                                    e.currentTarget.src = `https://cdn.brawlify.com/brawlers/borderless/${playerBrawler.id}.png`;
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div 
                                        className={`w-full aspect-square flex items-center justify-center rounded-lg pt-3
                                            ${result === "victory"
                                                ? "bg-green-500/20 dark:bg-green-600/30"
                                                : result === "defeat"
                                                ? "bg-red-500/20 dark:bg-red-600/30"
                                                : "bg-gray-500/20 dark:bg-gray-600/30"
                                            }
                                            ${wasStarPlayer ? "border-b-4 border-yellow-400" : ""}
                                        `}
                                    >
                                        <div className="w-8 h-8 rounded-lg flex items-center justify-center">
                                            <img 
                                                src={`https://cdn.brawlify.com/gamemode/${battle.event.mode.toLowerCase()}.png`}
                                                alt={battle.event.mode}
                                                className="w-6 h-6 object-contain"
                                                onError={(e) => {
                                                    // Fallback to icon if image fails
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.parentElement!.appendChild(
                                                        document.createTextNode(battle.event.mode.slice(0, 2))
                                                    );
                                                }}
                                            />
                                        </div>
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
