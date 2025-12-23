'use client'

import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createBrawlerSlug } from "@/lib/utils";

interface TierBrawler {
  brawlerId: number;
  tier: string;
  position: number;
  brawler?: any;
}

interface MetaTierListProps {
  tierData: TierBrawler[];
  brawlers: any[];
}

const TIER_CONFIG = {
  S: { label: 'S', color: 'bg-red-500', textColor: 'text-white' },
  A: { label: 'A', color: 'bg-orange-400', textColor: 'text-white' },
  B: { label: 'B', color: 'bg-yellow-400', textColor: 'text-gray-900' },
  C: { label: 'C', color: 'bg-lime-400', textColor: 'text-gray-900' },
  D: { label: 'D', color: 'bg-green-400', textColor: 'text-gray-900' },
  F: { label: 'F', color: 'bg-green-500', textColor: 'text-white' },
};

export const MetaTierList = ({ tierData, brawlers }: MetaTierListProps) => {
  const router = useRouter();

  // Group brawlers by tier
  const tierGroups = tierData.reduce((acc, item) => {
    if (!acc[item.tier]) {
      acc[item.tier] = [];
    }
    const brawler = brawlers.find((b) => b.id === item.brawlerId);
    if (brawler) {
      acc[item.tier].push({ ...item, brawler });
    }
    return acc;
  }, {} as Record<string, TierBrawler[]>);

  // Sort within each tier by position
  Object.keys(tierGroups).forEach((tier) => {
    tierGroups[tier].sort((a, b) => a.position - b.position);
  });

  return (
    <div className="space-y-2">
      {Object.entries(TIER_CONFIG).map(([tier, config]) => {
        const brawlersInTier = tierGroups[tier] || [];

        return (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            {/* Tier Label */}
            <div
              className={`${config.color} ${config.textColor} w-16 sm:w-20 flex items-center justify-center font-bold text-2xl sm:text-3xl rounded-l-lg`}
            >
              {config.label}
            </div>

            {/* Brawlers Grid */}
            <div className="flex-1 bg-gray-800 rounded-r-lg p-2 min-h-[80px] flex flex-wrap gap-1">
              {brawlersInTier.map((item) => (
                <motion.div
                  key={item.brawlerId}
                  whileHover={{ scale: 1.1, zIndex: 10 }}
                  className="cursor-pointer relative group"
                  onClick={() => router.push(`/brawlers/${createBrawlerSlug(item.brawler.name)}`)}
                >
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 border-gray-700 hover:border-primary transition-colors">
                    <Image
                      src={`https://cdn.brawlify.com/brawlers/borderless/${item.brawlerId}.png`}
                      alt={item.brawler.name}
                      fill
                      sizes="64px"
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {item.brawler.name}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
