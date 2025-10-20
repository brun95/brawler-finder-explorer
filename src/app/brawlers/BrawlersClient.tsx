'use client'

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/NavBar";
import { Search, Grid3x3, List } from "lucide-react";
import { BrawlerCard } from "@/components/BrawlerCard";
import { BrawlerClass } from "@/types/brawler";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useBrawlers } from "@/hooks/useBrawlers";

export default function BrawlersClient() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<BrawlerClass | "All">("All");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data: initialBrawlers, isLoading } = useBrawlers();

  const filteredBrawlers = initialBrawlers?.filter((brawler: any) => {
    const matchesSearch = brawler.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "All" || brawler.class === selectedClass;
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

  const classes: (BrawlerClass | "All")[] = [
    "All",
    "Damage Dealer",
    "Hybrid",
    "Support",
    "Tank",
    "Assassin",
  ];

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
            onChange={(e) => setSelectedClass(e.target.value as BrawlerClass | "All")}
            className="px-4 py-2 rounded-lg border border-gray-700 bg-gray-800 text-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            {classes.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <ToggleGroup type="single" value={viewMode} onValueChange={(value) => value && setViewMode(value as 'grid' | 'list')}>
            <ToggleGroupItem value="grid" aria-label="Grid view">
              <Grid3x3 className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem value="list" aria-label="List view">
              <List className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={viewMode === 'grid' ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" : "space-y-3"}
        >
          {filteredBrawlers?.map((brawler: any) => (
            viewMode === 'grid' ? (
              <BrawlerCard
                key={brawler.id}
                brawler={brawler}
                onClick={() => router.push(`/brawlers/${brawler.id}`)}
              />
            ) : (
              <div
                key={brawler.id}
                onClick={() => router.push(`/brawlers/${brawler.id}`)}
                className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg border border-gray-700 hover:border-primary cursor-pointer transition-all"
              >
                <img
                  src={`/brawlers/${brawler.id}.webp`}
                  alt={brawler.name}
                  className="w-16 h-16 rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;
                  }}
                />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-100">{brawler.name}</h3>
                  <p className="text-sm text-gray-400">{brawler.class}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase">Rarity</p>
                  <p className="text-sm font-medium text-gray-300">{brawler.rarity?.name || 'Unknown'}</p>
                </div>
              </div>
            )
          ))}
        </motion.div>
      </main>
    </div>
  );
}
