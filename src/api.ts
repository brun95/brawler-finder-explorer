import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";

// Helper to get the base URL - works for both client and server
const getBaseUrl = () => {
    // Server-side
    if (typeof window === 'undefined') {
        // Try to get from environment variable first
        if (process.env.NEXT_PUBLIC_SITE_URL) {
            return process.env.NEXT_PUBLIC_SITE_URL;
        }
        // Fallback for local development
        return 'http://localhost:3055';
    }
    // Client-side
    return '';
};

const BASE_URL = "/api";
// const BASE_CDN_URL = "/cdnapi";
const BASE_CDN_URL = "/api";
const API_KEY = process.env.SECRET_API_KEY;


export const fetchBrawlers = async () => {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}${BASE_URL}/brawlers`);

        if (!response.ok) {
            throw new Error("Failed to fetch brawlers");
        }

        const data = await response.json();
        console.log('Brawlers API Response:', data);
        console.log('First brawler sample:', data.list?.[0] || data.items?.[0]);

        // CDN returns data.list, official API returns data.items
        return data.list || data.items || data;
    } catch (error) {
        console.error("Error fetching brawlers:", error);
        throw error;
    }
};

export const fetchBrawlerById = async (id: number) => {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}${BASE_URL}/brawlers/${id}`);

        if (!response.ok) {
            throw new Error("Failed to fetch brawler");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching brawler:", error);
        throw error;
    }
};

export const fetchBrawlerBySlug = async (slug: string) => {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}${BASE_URL}/brawlers/${slug}`);

        if (!response.ok) {
            throw new Error("Failed to fetch brawler");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching brawler:", error);
        throw error;
    }
};

export const fetchPlayerData = async (tag: string) => {
    try {
        if (!tag || typeof tag !== "string") {
            throw new Error("Invalid tag provided");
        }

        const formattedTag = tag.replace("#", "");

        const response = await fetch(`${BASE_URL}/players/${formattedTag}`);

        if (!response.ok) {
            const error: any = new Error("Failed to fetch player data");
            error.response = {
                status: response.status,
                statusText: response.statusText,
                data: await response.json().catch(() => ({}))
            };
            throw error;
        }
        const playerData = await response.json();

        const responseBattleLog = await fetch(`${BASE_URL}/players/${formattedTag}/battlelog`);

        if (!responseBattleLog.ok) {
            throw new Error("Failed to fetch player battle log");
        }
        const battleData = await responseBattleLog.json();

        // Store player data in Supabase (only if configured)
        // Now this only updates the player info and visited_at timestamp
        // Trophy data is collected via a daily cron job
        if (isSupabaseConfigured) {
            try {
                const { error } = await supabase.rpc('store_player_data', {
                    p_tag             : formattedTag,
                    p_name            : playerData.name,
                    p_trophies        : playerData.trophies,
                    p_highest_trophies: playerData.highestTrophies,
                    p_battles         : battleData.items
                })

                if (error) {
                    console.warn("Failed to store player data in Supabase:", error);
                }

            } catch (storeError) {
                console.warn("Failed to store player data in Supabase:", storeError);
                // Continue even if storing failed
            }
        }

        return playerData;
    } catch (error) {
        console.error("Error fetching player data:", error);
        throw error;
    }
};

export const fetchPlayerBattleLog = async (tag: string) => {
    try {
        if (!tag || typeof tag !== "string") {
            throw new Error("Invalid tag provided");
        }

        const formattedTag = tag.replace("#", "");
        // Remove the %23 prefix since formattedTag already has # removed
        const response = await fetch(`${BASE_URL}/players/${formattedTag}/battlelog`, {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch player battle log");
        }

        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error("Error fetching player battle log:", error);
        throw error;
    }
};

export const fetchClubData = async (tag: string) => {
    try {
        if (!tag || typeof tag !== "string") {
            throw new Error("Invalid club tag provided");
        }

        const formattedTag = tag.replace("#", "");
        const response = await fetch(`${BASE_URL}/clubs/${formattedTag}`, {
            method: "GET",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${API_KEY}` },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch club data");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching club data:", error);
        throw error;
    }
};

export const fetchEvents = async () => {
    try {
        const response = await fetch(`${BASE_CDN_URL}/events`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch events");
        }

        return await response.json();
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
};

export const fetchMaps = async () => {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}${BASE_CDN_URL}/maps`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch maps");
        }

        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error("Error fetching maps:", error);
        throw error;
    }
};

export const fetchGameModes = async () => {
    try {
        const baseUrl = getBaseUrl();
        const response = await fetch(`${baseUrl}${BASE_CDN_URL}/gamemodes`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch game modes");
        }

        const data = await response.json();
        return data.list;
    } catch (error) {
        console.error("Error fetching game modes:", error);
        throw error;
    }
};

// New functions to fetch historical data from Supabase
export const fetchPlayerTrophyHistory = async (tag: string) => {
    if (!isSupabaseConfigured) {
        console.warn("Supabase is not configured. Skipping trophy history fetch.");
        return [];
    }

    try {
        const formattedTag = tag.replace("#", "");
        const { data, error } = await supabase
            .from('player_trophies')
            .select('trophies, highest_trophies, recorded_at')
            .eq('player_tag', formattedTag)
            .order('recorded_at', { ascending: true });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.warn("Error fetching trophy history:", error);
        return [];
    }
};

export const fetchPlayerWinRates = async (tag: string) => {
    if (!isSupabaseConfigured) {
        console.warn("Supabase is not configured. Skipping win rates fetch.");
        return { byMode: [], byBrawler: [] };
    }

    try {
        const formattedTag = tag.replace("#", "");
        const { data, error } = await supabase
            .from('brawler_stats')
            .select('brawler_id, brawler_name, game_mode, map_name, result')
            .eq('player_tag', formattedTag);

        if (error) throw error;

        // Calculate win rates by game mode and brawler
        const stats = data || [];

        // By game mode
        const modeWinRates = stats.reduce((acc: Record<string, {wins: number, total: number}>, stat) => {
            const mode = stat.game_mode;
            if (!acc[mode]) {
                acc[mode] = { wins: 0, total: 0 };
            }
            acc[mode].total += 1;
            if (stat.result === 'victory') {
                acc[mode].wins += 1;
            }
            return acc;
        }, {});

        // By brawler
        const brawlerWinRates = stats.reduce((acc: Record<string, {wins: number, total: number}>, stat) => {
            const brawler = stat.brawler_name;
            if (!acc[brawler]) {
                acc[brawler] = { wins: 0, total: 0 };
            }
            acc[brawler].total += 1;
            if (stat.result === 'victory') {
                acc[brawler].wins += 1;
            }
            return acc;
        }, {});

        return {
            byMode: Object.entries(modeWinRates).map(([mode, stats]) => ({
                mode,
                winRate: (stats.wins / stats.total) * 100,
                matches: stats.total
            })),
            byBrawler: Object.entries(brawlerWinRates).map(([brawler, stats]) => ({
                brawler,
                winRate: (stats.wins / stats.total) * 100,
                matches: stats.total
            }))
        };
    } catch (error) {
        console.warn("Error calculating win rates:", error);
        return { byMode: [], byBrawler: [] };
    }
};

export const fetchDetailedBattleHistory = async (tag: string) => {
    if (!isSupabaseConfigured) {
        console.warn("Supabase is not configured. Skipping detailed battle history fetch.");
        return [];
    }

    try {
        const formattedTag = tag.replace("#", "");
        const { data, error } = await supabase
            .from('player_battles')
            .select('battle_data, player_battles.battle_time')
            .eq('player_tag', formattedTag)
            .order('player_battles.battle_time', { ascending: false });

        if (error) throw error;
        return data || [];
    } catch (error) {
        console.warn("Error fetching detailed battle history:", error);
        return [];
    }
};
