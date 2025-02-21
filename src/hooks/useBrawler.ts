
import { useQuery } from "@tanstack/react-query";
import { fetchBrawlerById } from "@/api";

export const useBrawler = (id: string) => {
    return useQuery({
        queryKey: ["brawler", id],
        queryFn: () => fetchBrawlerById(id),
    });
};
