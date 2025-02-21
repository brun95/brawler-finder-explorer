import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const BASE_URL = process.env.VITE_PUBLIC_BASE_URL;
const API_KEY  = process.env.VITE_SECRET_API_KEY;

const getHeaders = () => ({
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
});

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

app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));