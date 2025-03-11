
import { useQuery } from "@tanstack/react-query";
import { Map, MapsResponse, GameMode, GameModesResponse } from "@/types/map";

export const useMaps = () => {
  return useQuery({
    queryKey: ["maps"],
    queryFn: async (): Promise<Map[]> => {
      const response = await fetch("https://api.brawlify.com/v1/maps");
      const data: MapsResponse = await response.json();
      return data.list;
    },
  });
};

export const useMap = (id: number) => {
  return useQuery({
    queryKey: ["map", id],
    queryFn: async (): Promise<Map | undefined> => {
      const response = await fetch("https://api.brawlify.com/v1/maps");
      const data: MapsResponse = await response.json();
      return data.list.find((map) => map.id === id);
    },
  });
};

export const useGameModes = () => {
  return useQuery({
    queryKey: ["gamemodes"],
    queryFn: async (): Promise<GameMode[]> => {
      const response = await fetch("https://api.brawlify.com/v1/gamemodes");
      const data: GameModesResponse = await response.json();
      return data.list;
    },
  });
};

export const useGameMode = (id: number) => {
  return useQuery({
    queryKey: ["gamemode", id],
    queryFn: async (): Promise<GameMode | undefined> => {
      if (!id) return undefined;
      const response = await fetch(`https://api.brawlify.com/v1/gamemodes/${id}`);
      return await response.json();
    },
  });
};
