
import { motion } from "framer-motion";
import { Brawler, getBrawlerClassColor } from "@/types/brawler";
import Image from "next/image";

interface BrawlerCardProps {
  brawler: any; // Using any to accept API brawler with rarity.name
  onClick: () => void;
}

// Official Brawl Stars rarity colors
const RARITY_COLORS: Record<string, string> = {
  'Common': '#94D7F4',
  'Rare': '#2DDD1D',
  'Super Rare': '#0087FA',
  'Epic': '#B115ED',
  'Mythic': '#D6001A',
  'Legendary': '#FFF11F',
  'Ultra Legendary': '#ffffff',
  'Chromatic': '#F88F58',
  'Trophy Road': '#94D7F4',
  'Starting': '#94D7F4',
};

const getRarityColor = (rarityName: string | undefined): string => {
  if (!rarityName) return '#94D7F4';
  return RARITY_COLORS[rarityName] || '#94D7F4';
};

const hexToRgba = (hex: string, opacity: number): string => {
  try {
    const cleanHex = hex.replace('#', '');
    const r = parseInt(cleanHex.slice(0, 2), 16);
    const g = parseInt(cleanHex.slice(2, 4), 16);
    const b = parseInt(cleanHex.slice(4, 6), 16);

    if (isNaN(r) || isNaN(g) || isNaN(b)) {
      return 'rgba(55, 65, 81, 0.5)'; // fallback gray
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  } catch (error) {
    return 'rgba(55, 65, 81, 0.5)'; // fallback gray
  }
};

export const BrawlerCard = ({ brawler, onClick }: BrawlerCardProps) => {
  const rarityColor = getRarityColor(brawler?.rarity?.name);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="cursor-pointer rounded-lg overflow-hidden shadow-sm border-2 border-gray-300 hover:shadow-md transition-shadow"
      style={{ backgroundColor: rarityColor }}
    >
      <div className="aspect-square relative">
        <Image
          src={`https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`}
          alt={brawler.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          className="object-cover"
          loading="lazy"
          quality={85}
          priority={false}
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2 z-10">
          <h3 className="text-white text-sm font-medium truncate">{brawler.name}</h3>
          <p className="text-white/80 text-xs truncate">
            {typeof brawler.class === 'object' ? brawler.class?.name : brawler.class}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
