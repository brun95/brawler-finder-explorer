import { NextResponse } from 'next/server'

const baseUrl = 'https://starbrawl.gg'

export async function GET() {
    // Static pages
    const staticPages = [
        '',
        '/brawlers',
        '/maps',
        '/events'
    ]

    // Generate dynamic URLs (you could fetch these from your API)
    const dynamicPages = [
        // Add some example brawlers - in production you'd fetch these
        '/brawlers/16000000', // Shelly
        '/brawlers/16000001', // Colt
        '/brawlers/16000002', // Bull
        // Add more as needed
    ]

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${staticPages.map(page => `
    <url>
        <loc>${baseUrl}${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>${page === '' ? '1.0' : '0.8'}</priority>
    </url>
    `).join('')}
    ${dynamicPages.map(page => `
    <url>
        <loc>${baseUrl}${page}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.6</priority>
    </url>
    `).join('')}
</urlset>`

    return new NextResponse(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    })
}