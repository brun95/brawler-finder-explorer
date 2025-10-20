import type { Metadata } from 'next'
import { Providers } from './providers'
import { BottomNav } from '@/components/BottomNav'
import '../index.css'

export const metadata: Metadata = {
    title      : 'StarBrawl - Your all-in-one Brawl Stars stats platform',
    description: 'Find comprehensive Brawl Stars statistics, track player progress, explore brawlers, maps, and upcoming events all in one place.',
    keywords   : 'Brawl Stars, stats, statistics, brawlers, maps, events, player tracking, club stats',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en" className="dark">
        <head>
            <meta name="keywords" content="Brawl Stars, stats, statistics, brawlers, maps, events, player tracking, club stats" />
            <meta name="author" content="StarBrawl" />

            <meta property="og:type" content="website" />
            <meta property="og:url" content="https://starbrawl.gg/" />
            <meta property="og:title" content="StarBrawl - Your all-in-one Brawl Stars stats platform" />
            <meta property="og:description" content="Find comprehensive Brawl Stars statistics, track player progress, explore brawlers, maps, and upcoming events all in one place." />
            <meta property="og:image" content="/og-image.png" />

            <link rel="icon" type="image/png" href="/favicon.ico" />

            {/* <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
            <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script> */}
        </head>
        <body>
            <Providers>
                {children}
                <BottomNav />
            </Providers>
        </body>
        </html>
    )
}