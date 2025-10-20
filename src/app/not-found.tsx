'use client'

import Link from 'next/link';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <NavBar />
            <main className="flex-1 flex items-center justify-center px-4">
                <div className="text-center">
                    <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-300 mb-2">Page Not Found</h2>
                    <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>
                    <Link href="/">
                        <Button className="gap-2">
                            <Home className="h-4 w-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}