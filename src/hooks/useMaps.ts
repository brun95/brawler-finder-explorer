
import { useQuery } from "@tanstack/react-query";
import { Map } from "@/types/map";

// Temporary mock data
const mockMaps: Map[] = [
  {
    id: 1,
    name: "Snake Prairie",
    type: "Gem Grab",
    image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
    brawlerWinRates: [
      { brawlerId: 1, brawlerName: "Shelly", winRate: 56.5 },
      { brawlerId: 2, brawlerName: "Bo", winRate: 62.3 },
    ],
  },
  // Add more mock maps here
];

export const useMaps = () => {
  return useQuery({
    queryKey: ["maps"],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockMaps;
    },
  });
};

export const useMap = (id: number) => {
  return useQuery({
    queryKey: ["map", id],
    queryFn: async () => {
      // TODO: Replace with actual API call
      return mockMaps.find((map) => map.id === id);
    },
  });
};
