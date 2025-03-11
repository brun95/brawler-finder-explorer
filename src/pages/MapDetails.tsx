
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { useMap } from "@/hooks/useMaps";

const MapDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: map, isLoading } = useMap(Number(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!map) {
    return <div>Map not found</div>;
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
          Back to Maps
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm"
          >
            <img
              src={`https://cdn.brawlify.com/map/${map.id}.png`}
              alt={map.name}
              className="w-full aspect-[3/4] object-cover"
              onError={(e) => {
                // Fallback to original image if CDN fails
                e.currentTarget.src = map.image;
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
              <p className="text-gray-600 dark:text-gray-400 mt-2">{map.type}</p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                Brawler Win Rates
              </h2>
              <div className="space-y-2">
                {map.brawlerWinRates
                  .sort((a, b) => b.winRate - a.winRate)
                  .map((stat) => (
                    <div
                      key={stat.brawlerId}
                      className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm"
                    >
                      <div className="flex items-center">
                        <img
                          src={`https://cdn.brawlify.com/brawler/${stat.brawlerId}.png`}
                          alt={stat.brawlerName}
                          className="w-8 h-8 rounded-full mr-2"
                          onError={(e) => {
                            // Fallback to local image if CDN fails
                            e.currentTarget.src = `/brawlers/${stat.brawlerId}.webp`;
                          }}
                        />
                        <span className="font-medium dark:text-gray-100">{stat.brawlerName}</span>
                      </div>
                      <div className="flex items-center text-green-600 dark:text-green-400">
                        <Trophy className="w-4 h-4 mr-2" />
                        {stat.winRate.toFixed(1)}%
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default MapDetails;
