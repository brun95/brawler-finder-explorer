'use client'

import { NavBar } from "@/components/NavBar";
import { MapCard } from "@/components/MapCard";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useMaps } from "@/hooks/useMaps";

export default function MapsClient() {
  const router = useRouter();
  const { t } = useLanguage();
  const { data: initialMaps, isLoading } = useMaps();

  // Group maps by game mode
  const mapsByGameMode = initialMaps?.filter(map => !map.disabled).reduce((acc, map) => {
    const gameModeName = map.gameMode.name;
    if (!acc[gameModeName]) {
      acc[gameModeName] = [];
    }
    acc[gameModeName].push(map);
    return acc;
  }, {} as Record<string, any[]>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="pt-24 text-center text-gray-300">Loading...</div>
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

        {mapsByGameMode && (Object.entries(mapsByGameMode) as [string, any[]][]).map(([gameMode, gameMaps]) => (
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
                  onClick={() => router.push(`/maps/${map.id}`)}
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
}
