
import { fetchPlayerData } from "@/api";
import { motion } from "framer-motion";
import { Search, Users } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePreviousSearches } from "@/hooks/usePreviousSearches";
import { usePreviousClubSearches } from "@/hooks/usePreviousClubSearches";
import { PreviousSearches } from "./PreviousSearches";
import { PreviousClubSearches } from "./PreviousClubSearches";
import { useLanguage } from "@/hooks/useLanguage";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [clubQuery, setClubQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { addSearch } = usePreviousSearches();
  const { addSearch: addClubSearch } = usePreviousClubSearches();
  const { t } = useLanguage();

  const handlePlayerSearch = async () => {
    if (!searchQuery.startsWith("#")) {
      setErrorMessage(t.search.error.invalidTag);
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    const playerTag = searchQuery.substring(1);
    try {
      const playerData = await fetchPlayerData(playerTag);
      addSearch(playerTag, playerData.name);
      navigate(`/player/${playerTag}`);
    } catch (error) {
      setErrorMessage(t.search.error.fetchError);
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  const handleClubSearch = () => {
    if (!clubQuery.startsWith("#")) {
      setErrorMessage(t.search.error.invalidTag);
      setTimeout(() => setErrorMessage(""), 3000);
      return;
    }
    
    const clubTag = clubQuery.substring(1);
    navigate(`/club/${clubTag}`);
  };

  const handleKeyPress = (e: React.KeyboardEvent, type: 'player' | 'club') => {
    if (e.key === "Enter") {
      if (type === 'player') {
        handlePlayerSearch();
      } else {
        handleClubSearch();
      }
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
          Your all-in-one <span className="text-primary"> Brawl Stars</span> stats platform
          
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <Tabs defaultValue="player" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="player">Player</TabsTrigger>
              <TabsTrigger value="club">Club</TabsTrigger>
            </TabsList>
            
            <TabsContent value="player">
              <div className="relative">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'player')}
                  placeholder={t.search.placeholder}
                  className="w-full px-6 py-6 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <Button 
                  onClick={handlePlayerSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                  size="icon"
                >
                  <Search className="w-5 h-5" />
                </Button>
              </div>
              <PreviousSearches />
            </TabsContent>
            
            <TabsContent value="club">
              <div className="relative">
                <Input
                  type="text"
                  value={clubQuery}
                  onChange={(e) => setClubQuery(e.target.value)}
                  onKeyPress={(e) => handleKeyPress(e, 'club')}
                  placeholder={t.search.clubPlaceholder}
                  className="w-full px-6 py-6 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                />
                <Button 
                  onClick={handleClubSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2"
                  size="icon"
                >
                  <Users className="w-5 h-5" />
                </Button>
              </div>
              <PreviousClubSearches />
            </TabsContent>
          </Tabs>
          
          {errorMessage && (
            <p className="text-red-500 mt-2 text-sm">{errorMessage}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
};
