
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, Map, Trophy } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useBrawler } from "@/hooks/useBrawler";
import { getBrawlerClassColor } from "@/types/brawler";
import { AdBanner } from "@/components/ads/AdBanner";

const BrawlerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: brawler, isLoading } = useBrawler(Number(id));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-24 text-center">Loading...</div>
      </div>
    );
  }

  if (!brawler) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-24 text-center">Brawler not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <AdBanner slot="brawler-top" />
        
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
            className="bg-white rounded-lg overflow-hidden shadow-sm p-6"
          >
            <img
              src={`/brawlers/${brawler.id}.png`}
              alt={brawler.name}
              className="w-full h-64 object-contain mb-6"
            />
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{brawler.name}</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Star Powers</h2>
              <div className="space-y-4">
                {brawler.starPowers.map((starPower) => (
                  <div
                    key={starPower.id}
                    className="flex items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <Star className="w-5 h-5 text-yellow-500 mr-3" />
                    <span>{starPower.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Gadgets</h2>
              <div className="space-y-4">
                {brawler.gadgets.map((gadget) => (
                  <div
                    key={gadget.id}
                    className="flex items-center bg-gray-50 p-3 rounded-lg"
                  >
                    <Trophy className="w-5 h-5 text-primary mr-3" />
                    <span>{gadget.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
        
        <AdBanner slot="brawler-bottom" />
      </main>
      <Footer />
    </div>
  );
};

export default BrawlerDetails;
