import { NextResponse } from "next/server";
import axios from "axios";
import { withRateLimit, ratelimit } from "@/lib/ratelimit";

const { NEXT_PUBLIC_PUBLIC_BASE_URL, NEXT_PUBLIC_SECRET_API_KEY } = process.env;

export async function GET(request) {
    // Apply rate limiting
    const rateLimitResult = await withRateLimit(request, undefined, ratelimit);
    if (rateLimitResult) {
        return rateLimitResult;
    }

    try {
        const response = await axios.get(`${NEXT_PUBLIC_PUBLIC_BASE_URL}/brawlers`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${NEXT_PUBLIC_SECRET_API_KEY}`,
            },
        });

        return NextResponse.json(response.data, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=1800"
            }
        });
    } catch (err) {
        console.error("Error fetching brawlers:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
