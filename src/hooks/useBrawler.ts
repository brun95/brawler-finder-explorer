
import { useQuery } from "@tanstack/react-query";
import { fetchBrawlerById } from "@/api";

export const useBrawler = (id: number) => {
    return useQuery({
        queryKey: ["brawler", id],
        queryFn: () => fetchBrawlerById(id),
        staleTime: 1000 * 60 * 60, // 1 hour - brawler data rarely changes
        gcTime: 1000 * 60 * 60 * 2, // 2 hours - keep in cache
    });
};
