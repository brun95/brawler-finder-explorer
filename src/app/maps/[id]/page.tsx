import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MapDetailsClient from './MapDetailsClient';
import { fetchMaps } from '@/api';

interface Props {
    params: Promise<{ id: string }>
}

// Enable ISR with 1 hour revalidation
export const revalidate = 3600;

// Generate static params for all maps at build time
export async function generateStaticParams() {
    try {
        const maps = await fetchMaps();
        return maps.map((map: any) => ({
            id: map.id.toString(),
        }));
    } catch (error) {
        console.error('Error generating static params:', error);
        return [];
    }
}

// Generate metadata for each map page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    try {
        const maps = await fetchMaps();
        const map = maps.find((m: any) => m.id === Number(id));

        if (!map) {
            return {
                title: 'Map Not Found - StarBrawl',
                description: 'Map information not available',
            };
        }

        return {
            title: `${map.name} - ${map.gameMode.name} - StarBrawl`,
            description: `View detailed stats and top brawlers for ${map.name} in ${map.gameMode.name}`,
        };
    } catch (error) {
        return {
            title: 'Map Not Found - StarBrawl',
            description: 'Map information not available',
        };
    }
}

export default async function MapDetailPage({ params }: Props) {
    const { id } = await params;

    try {
        const maps = await fetchMaps();
        const map = maps.find((m: any) => m.id === Number(id));

        if (!map) {
            notFound();
        }

        return <MapDetailsClient map={map} />;
    } catch (error) {
        notFound();
    }
}
