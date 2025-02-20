
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Map, Trophy } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { useBrawler } from "@/hooks/useBrawler";
import { getBrawlerClassColor } from "@/types/brawler";

const BrawlerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: brawler, isLoading } = useBrawler(Number(id));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!brawler) {
    return <div>Brawler not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <button
          onClick={() => navigate("/brawlers")}
          className="flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Brawlers
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className={`bg-white rounded-lg overflow-hidden shadow-sm border-2 ${getBrawlerClassColor(
              brawler.class
            )}`}
          >
            <img
              src={brawler.image}
              alt={brawler.name}
              className="w-full h-64 object-cover"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{brawler.name}</h1>
              <div className="flex items-center mt-2">
                <span className="text-gray-600">{brawler.class}</span>
                <span className="mx-2">•</span>
                <span className="flex items-center text-yellow-500">
                  <Star className="w-4 h-4 mr-1" />
                  {brawler.rarity}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Stats</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-600 text-sm">Health</p>
                  <p className="text-xl font-semibold text-gray-900">{brawler.stats.health}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-600 text-sm">Damage</p>
                  <p className="text-xl font-semibold text-gray-900">{brawler.stats.damage}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-600 text-sm">Speed</p>
                  <p className="text-xl font-semibold text-gray-900">{brawler.stats.speed}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-gray-900">Best Maps</h2>
              <div className="space-y-2">
                {brawler.bestMaps.map((map) => (
                  <div
                    key={map}
                    className="flex items-center bg-white p-3 rounded-lg shadow-sm"
                  >
                    <Map className="w-5 h-5 text-primary mr-2" />
                    <span>{map}</span>
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

export default BrawlerDetails;
