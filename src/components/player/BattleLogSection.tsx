
import { motion } from "framer-motion";
import { BattleLog } from "@/types/api";
import { Circle, Flame, Swords, Star, Trophy } from "lucide-react";
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
                return <Flame className="h-6 w-6" />;
            case "brawlball":
                return <Circle className="h-6 w-6" />;
            case "knockout":
                return <Swords className="h-6 w-6" />;
            case "bounty":
                return <Trophy className="h-6 w-6" />;
            default:
                return <Swords className="h-6 w-6" />;
        }
    };

    // Find player's brawler in a battle
    const getPlayerBrawler = (battle: BattleLog) => {
        if (!playerTag) return null;

        const formattedPlayerTag = playerTag.startsWith('#') ? playerTag : `#${playerTag}`;
        
        for (const team of battle.battle.teams || []) {
            for (const player of team) {
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

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
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
                        </span>
                        {starPlayerCount > 0 && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 dark:bg-yellow-900/30 rounded text-yellow-700 dark:text-yellow-400 text-sm font-normal">
                                <Star className="h-3 w-3" /> {starPlayerCount}
                            </span>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
                        {battles?.map((battle, index) => {
                            const playerBrawler = getPlayerBrawler(battle);
                            const wasStarPlayer = isStarPlayer(battle);
                            
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
                                                className="w-8 h-8 rounded-full border-2 border-gray-800 dark:border-gray-200"
                                                onError={(e) => {
                                                    // Fallback to local image if CDN fails
                                                    e.currentTarget.src = `https://cdn.brawlify.com/brawlers/borderless/${playerBrawler.id}.png`;
                                                }}
                                            />
                                        </div>
                                    )}
                                    <div 
                                        className={`w-full aspect-square flex items-center justify-center rounded-lg pt-3
                                            ${battle.battle.result === "victory"
                                                ? "bg-green-500/20 dark:bg-green-600/30"
                                                : battle.battle.result === "defeat"
                                                ? "bg-red-500/20 dark:bg-red-600/30"
                                                : "bg-gray-500/20 dark:bg-gray-600/30"
                                            }
                                            ${wasStarPlayer ? "border-b-4 border-yellow-400" : ""}
                                        `}
                                    >
                                        {getModeIcon(battle.event.mode)}
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
