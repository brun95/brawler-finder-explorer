import { NextResponse } from "next/server";
import axios from "axios";
import { withRateLimit, ratelimit } from "@/lib/ratelimit";

const { NEXT_PUBLIC_PUBLIC_BASE_URL, NEXT_PUBLIC_SECRET_API_KEY } = process.env;

export async function GET(request, context) {
    // Apply rate limiting
    const rateLimitResult = await withRateLimit(request, undefined, ratelimit);
    if (rateLimitResult) {
        return rateLimitResult;
    }

    try {
        // In Next.js 15+, params is a promise
        const params = await context.params;
        const { tag } = params;

        if (!tag) {
            return NextResponse.json(
                { message: "Club tag is required" },
                { status: 400 }
            );
        }

        const response = await axios.get(
            `${NEXT_PUBLIC_PUBLIC_BASE_URL}/clubs/%23${tag}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${NEXT_PUBLIC_SECRET_API_KEY}`,
                },
            }
        );

        return NextResponse.json(response.data, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=600, stale-while-revalidate=300"
            }
        });
    } catch (err) {
        console.error("Error fetching club data:", err);
        const status = err.response?.status || 500;
        const message = err.response?.data?.message || "Internal server error";
        return NextResponse.json({ message }, { status });
    }
}
