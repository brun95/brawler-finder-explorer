
const BASE_URL = "http://localhost:5000"; // Proxy server URL

// Fetch list of brawlers (Still calls the main API directly)
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
    }
};

// Fetch player data (Now calls the **proxy server**)
export const fetchPlayerData = async (tag: string) => {
    try {
        if (!tag || typeof tag !== "string") {
            throw new Error("Invalid tag provided");
        }

        const formattedTag = tag.replace("#", ""); // Remove '#' before sending to proxy
        console.log(`${BASE_URL}/players/${formattedTag}`);

        const response = await fetch(`${BASE_URL}/players/${formattedTag}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch player data");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching player data:", error);
        throw error;
    }
};

// Fetch player battle log (Now calls the **proxy server**)
export const fetchPlayerBattleLog = async (tag: string) => {
    try {
        if (!tag || typeof tag !== "string") {
            throw new Error("Invalid tag provided");
        }

        const formattedTag = tag.replace("#", ""); // Remove '#' before sending to proxy
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
