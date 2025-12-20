import { NextResponse } from "next/server";
import axios from "axios";
import { withRateLimit, ratelimit } from "@/lib/ratelimit";

const { NEXT_PUBLIC_PUBLIC_BASE_URL, SECRET_API_KEY } = process.env;

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
                { message: "Player tag is required" },
                { status: 400 }
            );
        }

        const response = await axios.get(
            `${NEXT_PUBLIC_PUBLIC_BASE_URL}/players/%23${tag}/battlelog`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${SECRET_API_KEY}`,
                },
            }
        );

        return NextResponse.json(response.data, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=150"
            }
        });
    } catch (err) {
        console.error(`Error fetching battle log:`, err.message);
        const status = err.response?.status || 500;
        const message = err.response?.data?.message || "Internal server error";
        return NextResponse.json({ message }, { status });
    }
}
