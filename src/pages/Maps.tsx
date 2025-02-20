
import { NavBar } from "@/components/NavBar";
import { MapCard } from "@/components/MapCard";
import { useMaps } from "@/hooks/useMaps";
import { MapType } from "@/types/map";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const mapTypes: { type: MapType; count: number }[] = [
  { type: "Gem Grab", count: 12 },
  { type: "Heist", count: 6 },
  { type: "Bounty", count: 6 },
  { type: "Brawl Ball", count: 12 },
  { type: "Solo Showdown", count: 12 },
  { type: "Duo Showdown", count: 13 },
  { type: "Hot Zone", count: 6 },
  { type: "Knockout", count: 12 },
  { type: "Duels", count: 6 },
  { type: "Wipeout", count: 6 },
  { type: "Wipeout 5v5", count: 4 },
  { type: "Brawl Ball 5v5", count: 4 },
];

const Maps = () => {
  const navigate = useNavigate();
  const { data: maps, isLoading } = useMaps();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Maps</h1>
          <p className="text-gray-600">Explore all Brawl Stars maps and their statistics</p>
        </motion.div>

        {mapTypes.map(({ type, count }) => (
          <section key={type} className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{type}</h2>
              <span className="text-gray-500">{count} maps</span>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: count }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] bg-gray-200 rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {maps
                  ?.filter((map) => map.type === type)
                  .map((map) => (
                    <MapCard
                      key={map.id}
                      map={map}
                      onClick={() => navigate(`/maps/${map.id}`)}
                    />
                  ))}
              </div>
            )}
          </section>
        ))}
      </main>
    </div>
  );
};

export default Maps;
