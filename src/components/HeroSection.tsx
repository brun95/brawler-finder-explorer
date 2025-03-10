import { fetchPlayerData } from "@/api";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePreviousSearches } from "@/hooks/usePreviousSearches";
import { PreviousSearches } from "./PreviousSearches";

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { addSearch } = usePreviousSearches();

  const handleSearch = async () => {
    if (!searchQuery.startsWith("#")) {
      setErrorMessage("Please enter a valid player tag starting with #");
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    const playerTag = searchQuery.substring(1);
    try {
      const playerData = await fetchPlayerData(playerTag);
      addSearch(playerTag, playerData.name);
      navigate(`/player/${playerTag}`);
    } catch (error) {
      setErrorMessage("Failed to fetch player data. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-gray-900 dark:to-gray-800">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="relative max-w-5xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Discover the World of
          <span className="text-primary"> Brawl Stars</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-xl text-gray-600 mb-8"
        >
          Enter your player tag (e.g., #2G0VQ0YLC) to see your stats
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-md mx-auto"
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter player tag (#2G0VQ0YLC)"
              className="w-full px-6 py-4 rounded-full border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button 
              onClick={handleSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-primary hover:bg-primary-hover text-white rounded-full transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
          {errorMessage && (
            <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
          )}
        </motion.div>
        <PreviousSearches />
      </div>
    </div>
  );
};
