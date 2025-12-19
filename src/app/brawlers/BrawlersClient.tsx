'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Search } from "lucide-react";
import { BrawlerCard } from "@/components/BrawlerCard";
import { useBrawlers } from "@/hooks/useBrawlers";
import { createBrawlerSlug } from "@/lib/utils";

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
  if (!rarityName) return '#94D7F4';
  return RARITY_COLORS[rarityName] || '#94D7F4';
};

// Convert hex color to rgba with opacity
const hexToRgba = (hex: string, opacity: number): string => {
  try {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return 'rgba(55, 65, 81, 0.5)'; // fallback gray
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch (error) {
    return 'rgba(55, 65, 81, 0.5)'; // fallback gray
  }
};

export default function BrawlersClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("All");
  const { data: initialBrawlers, isLoading } = useBrawlers();

  // Get unique classes from brawlers data
  const classes = ["All", ...(initialBrawlers ? Array.from(new Set(
    initialBrawlers.map((b: any) => typeof b.class === 'object' ? b.class?.name : b.class).filter(Boolean)
  )) : [])];

  const filteredBrawlers = initialBrawlers?.filter((brawler: any) => {
    const matchesSearch = brawler.name.toLowerCase().includes(searchTerm.toLowerCase());
    const brawlerClassName = typeof brawler.class === 'object' ? brawler.class?.name : brawler.class;
    const matchesClass = selectedClass === "All" || brawlerClassName === selectedClass;
    return matchesSearch && matchesClass;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <div className="pt-24 text-center text-gray-300">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">Brawlers</h1>
          <p className="text-gray-400">Discover and learn about all Brawl Stars characters</p>
        </motion.div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search brawlers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {filteredBrawlers?.map((brawler: any) => (
            <BrawlerCard
              key={brawler.id}
              brawler={brawler}
              onClick={() => router.push(`/brawlers/${createBrawlerSlug(brawler.name)}`)}
            />
          ))}
        </motion.div>
      </main>
    </div>
  );
}
