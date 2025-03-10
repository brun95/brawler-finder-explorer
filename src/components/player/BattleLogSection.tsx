
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
            className="bg-white rounded-lg shadow-sm p-6"
        >
            <h2 className="text-xl font-semibold mb-4">
                Recent Battles ({wins}W • {losses}L • {draws}D)
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                {battles?.map((battle, index) => (
                    <div
                        key={index}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                            battle.battle.result === "victory"
                                ? "bg-green-50"
                                : battle.battle.result === "defeat"
                                ? "bg-red-50"
                                : "bg-gray-50"
                        }`}
                    >
                        {battle.battle.teams?.[1].map(player => (
                            player.brawler && (
                                <img
                                    key={player.tag}
                                    src={`/brawlers/${player.brawler.id}.webp`}
                                    alt={player.brawler.name}
                                    className="w-8 h-8 rounded-full"
                                />
                            )
                        ))}
                        <span className="flex-1">{battle.event.mode}</span>
                        <span
                            className={`text-sm font-medium ${
                                battle.battle.result === "victory"
                                    ? "text-green-600"
                                    : battle.battle.result === "defeat"
                                    ? "text-red-600"
                                    : "text-gray-600"
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
