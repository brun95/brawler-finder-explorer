
import { useQuery } from "@tanstack/react-query";
import { 
  fetchPlayerTrophyHistory, 
  fetchPlayerWinRates, 
  fetchDetailedBattleHistory 
} from "@/api";

export const usePlayerTrophyHistory = (tag: string | undefined) => {
  return useQuery({
    queryKey: ["player-trophy-history", tag],
    queryFn: () => fetchPlayerTrophyHistory(tag!),
    enabled: !!tag,
  });
};

export const usePlayerWinRates = (tag: string | undefined) => {
  return useQuery({
    queryKey: ["player-win-rates", tag],
    queryFn: () => fetchPlayerWinRates(tag!),
    enabled: !!tag,
  });
};

export const useDetailedBattleHistory = (tag: string | undefined) => {
  return useQuery({
    queryKey: ["player-detailed-battles", tag],
    queryFn: () => fetchDetailedBattleHistory(tag!),
    enabled: !!tag,
  });
};
