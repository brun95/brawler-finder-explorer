'use client'

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchBrawlerBySlug } from '@/api';
import BrawlerDetailsClient from './BrawlerDetailsClient';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';

interface Props {
    params: Promise<{ slug: string }>
}

export default function BrawlerDetailPage({ params }: Props) {
    const { slug } = use(params);

    const { data: brawler, isLoading, error } = useQuery({
        queryKey: ['brawler', slug],
        queryFn: () => fetchBrawlerBySlug(slug),
        retry: 1,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900">
                <NavBar />
                <div className="pt-24 text-center text-gray-300">Loading...</div>
                <Footer />
            </div>
        );
    }

    if (error || !brawler) {
        return (
            <div className="min-h-screen bg-gray-900">
                <NavBar />
                <div className="pt-24 text-center text-gray-300">Brawler not found</div>
                <Footer />
            </div>
        );
    }

    return <BrawlerDetailsClient brawler={brawler} />;
}
