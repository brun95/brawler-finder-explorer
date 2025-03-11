
import { motion } from "framer-motion";
import { useState } from "react";

interface Brawler {
    id: number;
    name: string;
    power: number;
    rank: number;
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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6"
        >
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold dark:text-gray-100">Brawlers</h2>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'power' | 'rank')}
                    className="px-3 py-2 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                >
                    <option value="name">Sort by Name</option>
                    <option value="power">Sort by Power</option>
                    <option value="rank">Sort by Rank</option>
                </select>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                {sortedBrawlers.map((brawler) => (
                    <div
                        key={brawler.id}
                        className="flex flex-col items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700"
                    >
                        <img
                            src={`/brawlers/${brawler.id}.webp`}
                            alt={brawler.name}
                            className="w-12 h-12 rounded-full mb-2"
                            onError={(e) => {
                                // Fallback to local image if CDN fails
                                e.currentTarget.src = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;
                            }}
                        />
                        <span className="text-sm font-medium dark:text-gray-100">{brawler.name}</span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                            Power {brawler.power}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                            Rank {brawler.rank}
                        </span>
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
