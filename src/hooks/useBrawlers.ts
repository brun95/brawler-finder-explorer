
import { useQuery } from "@tanstack/react-query";
import { fetchBrawlers } from "@/api";

export const useBrawlers = () => {
    return useQuery({
        queryKey: ["brawlers"],
        queryFn: fetchBrawlers,
        staleTime: 1000 * 60 * 60, // 1 hour - brawlers data rarely changes
        gcTime: 1000 * 60 * 60 * 2, // 2 hours - keep in cache
    });
};
