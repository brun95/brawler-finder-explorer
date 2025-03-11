
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Star, Award } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { useMap } from "@/hooks/useMaps";
import { useLanguage } from "@/hooks/useLanguage";
import { Loader2 } from "lucide-react";

const MapDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { data: map, isLoading } = useMap(Number(id));

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

  if (!map) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <NavBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">{t.maps.notFound}</h2>
            <p className="text-gray-600 dark:text-gray-400">{t.maps.notFoundDesc}</p>
            <button
              onClick={() => navigate("/maps")}
              className="mt-4 inline-flex items-center text-primary hover:text-primary-hover transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              {t.maps.backToMaps}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <button
          onClick={() => navigate("/maps")}
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t.maps.backToMaps}
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm"
          >
            <div 
              className="h-2"
              style={{ backgroundColor: map.gameMode.bgColor }}
            />
            <img
              src={map.imageUrl}
              alt={map.name}
              className="w-full aspect-[3/4] object-cover"
              onError={(e) => {
                // Fallback to placeholder if image fails to load
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{map.name}</h1>
              <div className="flex items-center mt-2">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: map.gameMode.bgColor }}
                />
                <p className="text-gray-600 dark:text-gray-400">{map.gameMode.name}</p>
              </div>
              {map.credit && (
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                  {t.maps.createdBy}: {map.credit}
                </p>
              )}
            </div>

            {map.stats && map.stats.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {t.maps.topBrawlers}
                </h2>
                <div className="space-y-2">
                  {map.stats
                    .sort((a, b) => b.winRate - a.winRate)
                    .slice(0, 5)
                    .map((stat) => (
                      <div
                        key={stat.brawler}
                        className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center">
                          <img
                            src={`https://cdn.brawlify.com/brawler/${stat.brawler}.png`}
                            alt={`Brawler ${stat.brawler}`}
                            className="w-8 h-8 rounded-full mr-2"
                            onError={(e) => {
                              // Fallback to local image if CDN fails
                              e.currentTarget.src = `/brawlers/${stat.brawler}.webp`;
                            }}
                          />
                          <span className="font-medium dark:text-gray-100">Brawler #{stat.brawler}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <Trophy className="w-4 h-4 mr-1" />
                            {stat.winRate.toFixed(1)}%
                          </div>
                          <div className="flex items-center text-blue-600 dark:text-blue-400">
                            <Star className="w-4 h-4 mr-1" />
                            {stat.useRate.toFixed(1)}%
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {map.teamStats && map.teamStats.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                  {t.maps.topTeams}
                </h2>
                <div className="space-y-2">
                  {map.teamStats
                    .sort((a, b) => b.data.winRate - a.data.winRate)
                    .slice(0, 3)
                    .map((team) => (
                      <div
                        key={team.hash}
                        className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium dark:text-gray-100">{team.name}</span>
                          <div className="flex items-center text-green-600 dark:text-green-400">
                            <Award className="w-4 h-4 mr-1" />
                            {team.data.winRate.toFixed(1)}%
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <img
                            src={`https://cdn.brawlify.com/brawler/${team.brawler1}.png`}
                            alt={`Brawler ${team.brawler1}`}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = `/brawlers/${team.brawler1}.webp`;
                            }}
                          />
                          <img
                            src={`https://cdn.brawlify.com/brawler/${team.brawler2}.png`}
                            alt={`Brawler ${team.brawler2}`}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = `/brawlers/${team.brawler2}.webp`;
                            }}
                          />
                          <img
                            src={`https://cdn.brawlify.com/brawler/${team.brawler3}.png`}
                            alt={`Brawler ${team.brawler3}`}
                            className="w-8 h-8 rounded-full"
                            onError={(e) => {
                              e.currentTarget.src = `/brawlers/${team.brawler3}.webp`;
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MapDetails;
