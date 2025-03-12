import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const BASE_URL     = process.env.VITE_PUBLIC_BASE_URL;
const BASE_CDN_URL = process.env.VITE_PUBLIC_BASE_CDN_URL;
const API_KEY      = process.env.VITE_SECRET_API_KEY;

const getHeaders = () => ({
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
});
const getCdnHeaders = () => ({
    "Content-Type": "application/json",
});

// ✅ Fetch player data
app.get("/players/:tag", async (req, res) => {
    try {
        const { tag } = req.params;
        const formattedTag = `%23${tag}`;
        const response = await axios.get(`${BASE_URL}/players/${formattedTag}`, {
            headers: getHeaders(),
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// ✅ Fetch player battle log
app.get("/players/:tag/battlelog", async (req, res) => {
    try {
        const { tag } = req.params;
        const formattedTag = `%23${tag}`;
        const response = await axios.get(`${BASE_URL}/players/${formattedTag}/battlelog`, {
            headers: getHeaders(),
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// ✅ Fetch list of brawlers
app.get("/brawlers", async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/brawlers`, {
            headers: getHeaders(),
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// ✅ Fetch a single brawler by ID
app.get("/brawlers/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(`${BASE_URL}/brawlers/${id}`, {
            headers: getHeaders(),
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// ✅ Fetch active event rotation
/* app.get("/events/rotation", async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/events/rotation`, {
            headers: getHeaders(),
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
}); */

// ✅ Fetch active event rotation
app.get("/events", async (req, res) => {
    try {
        const response = await axios.get(`${BASE_CDN_URL}/events`, {
            headers: getCdnHeaders(),
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// ✅ Fetch list of maps
app.get("/maps", async (req, res) => {
    try {
        const response = await axios.get(`${BASE_CDN_URL}/maps`, {
            headers: getCdnHeaders(),
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

// ✅ Fetch list of game modes
app.get("/gamemodes", async (req, res) => {
    try {
        const response = await axios.get(`${BASE_CDN_URL}/gamemodes`, {
            headers: getCdnHeaders(),
        });

        res.json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json({ error: error.message });
    }
});

app.listen(PORT, () => console.log(`🚀 Proxy server running on http://localhost:${PORT}`));