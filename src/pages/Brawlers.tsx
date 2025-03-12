
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Search } from "lucide-react";
import { BrawlerCard } from "@/components/BrawlerCard";
import { BrawlerClass } from "@/types/brawler";
import { useBrawlers } from "@/hooks/useBrawlers";

const Brawlers = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState<BrawlerClass | "All">("All");
  const { data: brawlers, isLoading } = useBrawlers();

  const filteredBrawlers = brawlers?.filter((brawler) => {
    const matchesSearch = brawler.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClass = selectedClass === "All" || brawler.class === selectedClass;
    return matchesSearch && matchesClass;
  });

  const classes: (BrawlerClass | "All")[] = [
    "All",
    "Damage Dealer",
    "Hybrid",
    "Support",
    "Tank",
    "Assassin",
  ];

  return (
    <div className="min-h-screen bg-background">
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
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square bg-gray-800 rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4"
          >
            {filteredBrawlers?.map((brawler) => (
              <BrawlerCard
                key={brawler.id}
                brawler={brawler}
                onClick={() => navigate(`/brawlers/${brawler.id}`)}
              />
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Brawlers;
