import { NextResponse } from "next/server";
import axios from "axios";

const { NEXT_PUBLIC_PUBLIC_BASE_CDN_URL } = process.env;

function createBrawlerSlug(name) {
    return name.toLowerCase()
        .replace(/\./g, '-')
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
}

export async function GET(request, context) {
    try {
        // In Next.js 15+, params is a promise
        const params = await context.params;
        const { slug } = params;

        // Fetch all brawlers
        const response = await axios.get(`${NEXT_PUBLIC_PUBLIC_BASE_CDN_URL}/brawlers`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        const brawlers = response.data.list || response.data;

        // Find brawler by matching slug
        const brawler = brawlers.find(b => createBrawlerSlug(b.name) === slug);

        if (!brawler) {
            return NextResponse.json({ message: "Brawler not found" }, { status: 404 });
        }

        return NextResponse.json(brawler, { status: 200 });
    } catch (err) {
        console.error(`Error fetching brawler ${slug}:`, err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
