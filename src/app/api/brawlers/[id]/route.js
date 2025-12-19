import { NextResponse } from "next/server";
import axios from "axios";

const { NEXT_PUBLIC_PUBLIC_BASE_CDN_URL } = process.env;

export async function GET(request, context) {
    try {
        // In Next.js 15+, params is a promise
        const params = await context.params;
        const { id } = params;
        const response = await axios.get(`${NEXT_PUBLIC_PUBLIC_BASE_CDN_URL}/brawlers/${id}`, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        return NextResponse.json(response.data, { status: 200 });
    } catch (err) {
        console.error(`Error fetching brawler ${id}:`, err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
