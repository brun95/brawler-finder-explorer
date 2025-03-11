
import { motion } from "framer-motion";
import { BattleLog } from "@/types/api";

interface BattleLogSectionProps {
    battles: BattleLog[];
    stats: {
        wins: number;
        losses: number;
        draws: number;
    };
}

export const BattleLogSection = ({ battles, stats }: BattleLogSectionProps) => {
    const { wins, losses, draws } = stats;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
            <h2 className="text-xl font-semibold mb-4 dark:text-gray-100">
                Recent Battles ({wins}W • {losses}L • {draws}D)
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {battles?.map((battle, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                            battle.battle.result === "victory"
                                ? "bg-green-50 dark:bg-green-900/20"
                                : battle.battle.result === "defeat"
                                ? "bg-red-50 dark:bg-red-900/20"
                                : "bg-gray-50 dark:bg-gray-700"
                        }`}
                    >
                        {battle.battle.teams?.[1].map(player => (
                            player.brawler && (
                                <img
                                    key={player.tag}
                                    src={`https://cdn.brawlify.com/brawler/${player.brawler.id}.png`}
                                    alt={player.brawler.name}
                                    className="w-8 h-8 rounded-full"
                                    onError={(e) => {
                                        // Fallback to local image if CDN fails
                                        e.currentTarget.src = `/brawlers/${player.brawler.id}.webp`;
                                    }}
                                />
                            )
                        ))}
                        <span className="flex-1 dark:text-gray-200">{battle.event.mode}</span>
                        <span
                            className={`text-sm font-medium ${
                                battle.battle.result === "victory"
                                    ? "text-green-600 dark:text-green-400"
                                    : battle.battle.result === "defeat"
                                    ? "text-red-600 dark:text-red-400"
                                    : "text-gray-600 dark:text-gray-400"
                            }`}
                        >
                            {battle.battle.result}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
