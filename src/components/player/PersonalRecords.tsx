
import { motion } from "framer-motion";
import { StatRow } from "./StatRow";
import { Trophy, Users, Swords, Timer } from "lucide-react";

interface PersonalRecordsProps {
    stats: {
        brawlersCount: number;
        victories3v3: number;
        soloVictories: number;
        duoVictories: number;
        bestRoboRumbleTime: number;
    };
}

export const PersonalRecords = ({ stats }: PersonalRecordsProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6"
        >
            <h2 className="text-xl font-semibold mb-4">Personal Records</h2>
            <div className="space-y-4">
                <StatRow
                    icon={Users}
                    label="Unlocked Brawlers"
                    value={`${stats.brawlersCount}`}
                />
                <StatRow
                    icon={Swords}
                    label="3 vs 3 Victories"
                    value={stats.victories3v3}
                />
                <StatRow
                    icon={Trophy}
                    label="Solo Victories"
                    value={stats.soloVictories}
                />
                <StatRow
                    icon={Users}
                    label="Duo Victories"
                    value={stats.duoVictories}
                />
                <StatRow
                    icon={Timer}
                    label="Best Robo Rumble Time"
                    value={`Level ${stats.bestRoboRumbleTime}`}
                />
            </div>
        </motion.div>
    );
};
