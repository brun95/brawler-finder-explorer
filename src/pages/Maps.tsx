
import { NavBar } from "@/components/NavBar";
import { MapCard } from "@/components/MapCard";
import { useMaps, useGameModes } from "@/hooks/useMaps";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";

const Maps = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: maps, isLoading: mapsLoading } = useMaps();
  const { data: gameModes, isLoading: modesLoading } = useGameModes();

  const isLoading = mapsLoading || modesLoading;

  // Group maps by game mode
  const mapsByGameMode = maps?.filter(map => !map.disabled).reduce((acc, map) => {
    const gameModeName = map.gameMode.name;
    if (!acc[gameModeName]) {
      acc[gameModeName] = [];
    }
    acc[gameModeName].push(map);
    return acc;
  }, {} as Record<string, typeof maps>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">{t.common.loading}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">{t.maps.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{t.maps.subtitle}</p>
        </motion.div>

        {gameModes && mapsByGameMode && Object.entries(mapsByGameMode).map(([gameMode, gameMaps]) => (
          <section key={gameMode} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{gameMode}</h2>
              <span className="text-gray-500 dark:text-gray-400">{gameMaps.length} maps</span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {gameMaps.map((map) => (
                <MapCard
                  key={map.id}
                  map={map}
                  onClick={() => navigate(`/maps/${map.id}`)}
                />
              ))}
            </div>
          </section>
        ))}

        {(!mapsByGameMode || Object.keys(mapsByGameMode).length === 0) && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">{t.maps.noMaps}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Maps;
