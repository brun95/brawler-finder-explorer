
import { motion } from "framer-motion";
import { Brawler, getBrawlerClassColor } from "@/types/brawler";

interface BrawlerCardProps {
  brawler: Brawler;
  onClick: () => void;
}

export const BrawlerCard = ({ brawler, onClick }: BrawlerCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`cursor-pointer bg-white rounded-lg overflow-hidden shadow-sm border-2 ${getBrawlerClassColor(
        brawler.class
      )} hover:shadow-md transition-shadow`}
    >
      <div className="aspect-square relative">
        <img
          src={`/brawlers/${brawler.id}.webp`}
          alt={brawler.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to local image if CDN fails
            e.currentTarget.src = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
          <h3 className="text-white text-sm font-medium truncate">{brawler.name}</h3>
          <p className="text-white/80 text-xs truncate">{brawler.class}</p>
        </div>
      </div>
    </motion.div>
  );
};
