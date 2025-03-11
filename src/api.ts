
const BASE_URL = "http://localhost:5000";

export const fetchBrawlers = async () => {
    try {
        const response = await fetch(`${BASE_URL}/brawlers`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch brawlers");
        }

        const data = await response.json();
        return data.items;
    } catch (error) {
        console.error("Error fetching brawlers:", error);
        throw error;
    }
};

export const fetchBrawlerById = async (id: number) => {
    try {
        const response = await fetch(`${BASE_URL}/brawlers/${id}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

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
        console.log(`${BASE_URL}/players/${formattedTag}`);

        const response = await fetch(`${BASE_URL}/players/${formattedTag}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch player data");
        }

        return await response.json();
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
        const response = await fetch(`${BASE_URL}/players/${formattedTag}/battlelog`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
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

export const fetchEvents = async () => {
    try {
        const response = await fetch("https://api.brawlify.com/v1/events", {
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
        const response = await fetch("https://api.brawlify.com/v1/maps", {
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
        const response = await fetch("https://api.brawlify.com/v1/gamemodes", {
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
