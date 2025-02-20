
import { useQuery } from "@tanstack/react-query";
import { Brawler } from "@/types/brawler";

// Temporary mock data - replace with actual API call later
const mockBrawlers: Brawler[] = [
  {
    id: 1,
    name: "Shelly",
    class: "Damage Dealer",
    image: "https://cdn.brawlify.com/brawler/Shelly.png",
    rarity: "Starting Brawler",
    stats: {
      health: 3800,
      damage: 1680,
      speed: 720,
    },
    bestMaps: ["Snake Prairie", "Cavern Churn"],
  },
  // Add more mock brawlers here
];

export const useBrawlers = () => {
  return useQuery({
    queryKey: ["brawlers"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockBrawlers;
    },
  });
};
