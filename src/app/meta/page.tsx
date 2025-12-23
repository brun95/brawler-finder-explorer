'use client'

import { useEffect, useState } from 'react';
import { NavBar } from '@/components/NavBar';
import { Footer } from '@/components/Footer';
import { MetaTierList } from '@/components/meta/MetaTierList';
import { useBrawlers } from '@/hooks/useBrawlers';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

export default function MetaPage() {
  const { data: brawlers, isLoading } = useBrawlers();
  const [tierData, setTierData] = useState([]);

  useEffect(() => {
    const loadTierData = async () => {
      try {
        const response = await fetch('/api/meta');
        const data = await response.json();
        setTierData(data);
      } catch (error) {
        console.error('Error loading tier data:', error);
      }
    };

    loadTierData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <NavBar />
        <div className="pt-24 text-center text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Meta Tier List</h1>
          <p className="text-gray-600">Current meta rankings for all Brawl Stars characters</p>
          <p className="text-sm text-gray-500 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        {tierData.length > 0 && brawlers ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <MetaTierList tierData={tierData} brawlers={brawlers} />
          </motion.div>
        ) : (
          <Card className="p-8 text-center text-gray-600">
            <p>No tier data available yet. Check back soon!</p>
          </Card>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center text-sm text-gray-500"
        >
          <p>Tier rankings are based on current game meta and competitive play.</p>
          <p>Individual player skill and team composition can greatly affect brawler performance.</p>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
