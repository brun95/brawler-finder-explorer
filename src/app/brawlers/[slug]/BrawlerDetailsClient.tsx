'use client'

import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { AdBanner } from "@/components/ads/AdBanner";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";

interface BrawlerDetailsClientProps {
  brawler: any;
}

// Official Brawl Stars rarity colors
const RARITY_COLORS: Record<string, string> = {
  'Common': '#94D7F4',
  'Rare': '#2DDD1D',
  'Super Rare': '#0087FA',
  'Epic': '#B115ED',
  'Mythic': '#D6001A',
  'Legendary': '#FFF11F',
  'Ultra Legendary': '#ffffff',
  'Chromatic': '#F88F58',
  'Trophy Road': '#94D7F4',
  'Starting': '#94D7F4',
};

const getRarityColor = (rarityName: string | undefined): string => {
  if (!rarityName) return '#94D7F4';
  return RARITY_COLORS[rarityName] || '#94D7F4';
};

export default function BrawlerDetailsClient({ brawler }: BrawlerDetailsClientProps) {
  console.log('Brawler detail:', brawler);
  console.log('Rarity:', brawler?.rarity);
  console.log('Rarity name:', brawler?.rarity?.name);

  const rarityColor = getRarityColor(brawler?.rarity?.name);
  console.log('Rarity color:', rarityColor);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <PageBreadcrumb
          customSegments={[{ label: 'Brawlers', href: '/brawlers' }]}
          currentPageLabel={brawler?.name || ''}
        />

        <AdBanner slot="brawler-top" />

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card rounded-lg overflow-hidden shadow-sm p-6"
          >
            <div className="flex justify-center mb-6">
              <div
                className="rounded-lg overflow-hidden inline-block"
                style={{ backgroundColor: rarityColor }}
              >
                <img
                  src={`/brawlers/${brawler.id}.webp`}
                  alt={brawler.name}
                  className="h-64 object-contain"
                  onError={(e) => {
                    e.currentTarget.src = `https://cdn.brawlify.com/brawlers/borderless/${brawler.id}.png`;
                  }}
                />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground text-center">{brawler.name}</h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Star Powers</h2>
              <div className="space-y-4">
                {brawler.starPowers.map((starPower: any) => (
                  <div
                    key={starPower.id}
                    className="flex items-center bg-white/50 p-3 rounded-lg"
                  >
                    <img
                      src={`/star-powers/${starPower.id}.webp`}
                      alt={starPower.name}
                      className="w-8 h-8 mr-3"
                      onError={(e) => {
                        if (starPower.imageUrl) {
                          e.currentTarget.src = starPower.imageUrl;
                        } else {
                          e.currentTarget.src = `https://cdn.brawlify.com/star-powers/borderless/${starPower.id}.png`;
                        }
                      }}
                    />
                    <span className="text-foreground">{starPower.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Gadgets</h2>
              <div className="space-y-4">
                {brawler.gadgets.map((gadget: any) => (
                  <div
                    key={gadget.id}
                    className="flex items-center bg-white/50 p-3 rounded-lg"
                  >
                    <img
                      src={`/gadgets/${gadget.id}.webp`}
                      alt={gadget.name}
                      className="w-8 h-8 mr-3"
                      onError={(e) => {
                        if (gadget.imageUrl) {
                          e.currentTarget.src = gadget.imageUrl;
                        } else {
                          e.currentTarget.src = `https://cdn.brawlify.com/gadgets/borderless/${gadget.id}.png`;
                        }
                      }}
                    />
                    <span className="text-foreground">{gadget.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        <AdBanner slot="brawler-bottom" />
      </main>
    </div>
  );
}
