import { NextResponse } from "next/server";
import axios from "axios";
import { withRateLimit, strictRatelimit } from "@/lib/ratelimit";

const { NEXT_PUBLIC_PUBLIC_BASE_URL, SECRET_API_KEY } = process.env;

export async function GET(request, context) {
    let tag;

    try {
        // In Next.js 15+, params is a promise
        const params = await context.params;
        tag = params?.tag;

        if (!tag) {
            return NextResponse.json({
                message: "Tag parameter is required",
                hint: "Player tag should be provided in the format: #ABC123 or ABC123"
            }, { status: 400 });
        }

        // Apply strict rate limiting for player data (expensive operation)
        const rateLimitResult = await withRateLimit(request, undefined, strictRatelimit);
        if (rateLimitResult) {
            return rateLimitResult;
        }

        // Remove # if present and convert to uppercase
        tag = tag.replace('#', '').toUpperCase();

        // Format tag with URL-encoded # for Brawl Stars API
        const formattedTag = `%23${tag}`;

        console.log(`[API] Fetching player data for tag: ${formattedTag}`);

        const response = await axios.get(`${NEXT_PUBLIC_PUBLIC_BASE_URL}/players/${formattedTag}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${SECRET_API_KEY}`,
            },
            timeout: 10000, // 10 second timeout
        });

        console.log(`[API] Successfully fetched player data for: ${tag}`);

        return NextResponse.json(response.data, {
            status: 200,
            headers: {
                "Cache-Control": "public, s-maxage=300, stale-while-revalidate=150"
            }
        });
    } catch (err) {
        console.error(`[API] Error fetching player data for tag: ${tag}`);
        console.error(`[API] Error message:`, err.message);
        console.error(`[API] Response status:`, err.response?.status);
        console.error(`[API] Response data:`, JSON.stringify(err.response?.data));
        console.error(`[API] Full error:`, err);

        if (err.response?.status === 404) {
            return NextResponse.json({
                message: "Player not found",
                hint: "Please verify the player tag is correct. Tags are case-sensitive and should be in the format: #ABC123",
                tag: tag
            }, { status: 404 });
        }

        if (err.response?.status === 403) {
            return NextResponse.json({
                message: "Invalid API key or unauthorized",
                hint: "Please check your Brawl Stars API key configuration"
            }, { status: 403 });
        }

        if (err.response?.status === 429) {
            return NextResponse.json({
                message: "Rate limit exceeded",
                hint: "Too many requests to Brawl Stars API. Please try again later."
            }, { status: 429 });
        }

        if (err.code === 'ECONNABORTED' || err.message.includes('timeout')) {
            return NextResponse.json({
                message: "Request timeout",
                hint: "The request took too long. Please try again."
            }, { status: 504 });
        }

        return NextResponse.json({
            message: "Internal server error",
            error: err.message,
            hint: "An unexpected error occurred while fetching player data",
            details: process.env.NODE_ENV === 'development' ? {
                tag,
                status: err.response?.status,
                statusText: err.response?.statusText,
            } : undefined
        }, { status: 500 });
    }
}
