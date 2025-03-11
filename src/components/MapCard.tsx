
import { motion } from "framer-motion";
import { Map } from "@/types/map";

interface MapCardProps {
  map: Map;
  onClick: () => void;
}

export const MapCard = ({ map, onClick }: MapCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="aspect-[3/4] relative">
        <img
          src={map.imageUrl}
          alt={map.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
        <div 
          className="absolute top-0 left-0 right-0 h-2"
          style={{ backgroundColor: map.gameMode.bgColor }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
          <h3 className="text-white text-sm font-medium">{map.name}</h3>
          <p className="text-white/80 text-xs">{map.gameMode.name}</p>
        </div>
      </div>
    </motion.div>
  );
};
