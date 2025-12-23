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
  S: { label: 'S', color: 'bg-[#f66]', textColor: 'text-white' },
  A: { label: 'A', color: 'bg-[#f96]', textColor: 'text-white' },
  B: { label: 'B', color: 'bg-[#fc6]', textColor: 'text-gray-900' },
  C: { label: 'C', color: 'bg-[#cf6]', textColor: 'text-gray-900' },
  D: { label: 'D', color: 'bg-[#6c6]', textColor: 'text-gray-900' },
  F: { label: 'F', color: 'bg-[#6fc]', textColor: 'text-gray-900' },
};

const TIER_ORDER = ['S', 'A', 'B', 'C', 'D', 'F'] as const;

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
    <div className="space-y-4">
      {TIER_ORDER.map((tier) => {
        const config = TIER_CONFIG[tier];
        const brawlersInTier = tierGroups[tier] || [];

        return (
          <motion.div
            key={tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2 items-stretch"
          >
            {/* Tier Label */}
            <div
              className={`${config.color} ${config.textColor} w-16 flex items-center justify-center font-bold text-2xl rounded-lg flex-shrink-0`}
            >
              {config.label}
            </div>

            {/* Brawlers Grid */}
            <div className="flex-1 bg-white rounded-lg border border-gray-200 p-3 min-h-[100px]">
              {brawlersInTier.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                  No brawlers in this tier
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {brawlersInTier.map((item) => (
                    <motion.div
                      key={item.brawlerId}
                      whileHover={{ scale: 1.05 }}
                      className="cursor-pointer relative group"
                      onClick={() => router.push(`/brawlers/${createBrawlerSlug(item.brawler.name)}`)}
                    >
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden border-2 border-gray-300 hover:border-primary transition-all">
                        <Image
                          src={`https://cdn.brawlify.com/brawlers/borderless/${item.brawlerId}.png`}
                          alt={item.brawler.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                          loading="lazy"
                        />
                      </div>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {item.brawler.name}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};
