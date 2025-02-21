
import { useQuery } from "@tanstack/react-query";
import { fetchBrawlers } from "@/api";

export const useBrawlers = () => {
    return useQuery({
        queryKey: ["brawlers"],
        queryFn: fetchBrawlers
    });
};
