
import { useQuery } from "@tanstack/react-query";
import { Brawler } from "@/types/brawler";

export const useBrawler = (id: number) => {
  return useQuery({
    queryKey: ["brawler", id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // For now, return mock data
      const mockBrawler: Brawler = {
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
      };
      return mockBrawler;
    },
  });
};
