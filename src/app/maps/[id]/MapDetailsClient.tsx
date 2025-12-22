'use client'

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Star, Award } from "lucide-react";
import { NavBar } from "@/components/NavBar";
import { useLanguage } from "@/hooks/useLanguage";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import Image from "next/image";

interface MapDetailsClientProps {
  map: any;
}

export default function MapDetailsClient({ map }: MapDetailsClientProps) {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <PageBreadcrumb
          customSegments={[{ label: 'Maps', href: '/maps' }]}
          currentPageLabel={map?.name || ''}
        />

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg overflow-hidden shadow-sm"
          >
            <div
              className="h-2"
              style={{ backgroundColor: map.gameMode.bgColor }}
            />
            <div className="relative w-full aspect-[3/4]">
              <Image
                src={`https://cdn.brawlify.com/maps/regular/${map.id}.png`}
                alt={map.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{map.name}</h1>
              <div className="flex items-center mt-2">
                <div
                  className="w-4 h-4 rounded-full mr-2"
                  style={{ backgroundColor: map.gameMode.bgColor }}
                />
                <p className="text-gray-600">{map.gameMode.name}</p>
              </div>
              {map.credit && (
                <p className="text-gray-500 text-sm mt-2">
                  {t.maps.createdBy}: {map.credit}
                </p>
              )}
            </div>

            {map.stats && map.stats.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t.maps.topBrawlers}
                </h2>
                <div className="space-y-2">
                  {map.stats
                    .sort((a: any, b: any) => b.winRate - a.winRate)
                    .slice(0, 5)
                    .map((stat: any) => (
                      <div
                        key={stat.brawler}
                        className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-primary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10">
                            <Image
                              src={`https://cdn.brawlify.com/brawler/${stat.brawler}.png`}
                              alt={`Brawler ${stat.brawler}`}
                              fill
                              className="rounded-full object-cover"
                              sizes="40px"
                            />
                          </div>
                          <span className="font-medium">Brawler #{stat.brawler}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center text-green-600">
                              <Trophy className="w-4 h-4 mr-1" />
                              <span className="font-semibold">{stat.winRate.toFixed(1)}%</span>
                            </div>
                            <span className="text-xs text-gray-500">Win Rate</span>
                          </div>
                          <div className="flex flex-col items-end">
                            <div className="flex items-center text-blue-600">
                              <Star className="w-4 h-4 mr-1" />
                              <span className="font-semibold">{stat.useRate.toFixed(1)}%</span>
                            </div>
                            <span className="text-xs text-gray-500">Use Rate</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {map.teamStats && map.teamStats.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t.maps.topTeams}
                </h2>
                <div className="space-y-2">
                  {map.teamStats
                    .sort((a: any, b: any) => b.data.winRate - a.data.winRate)
                    .slice(0, 3)
                    .map((team: any) => (
                      <div
                        key={team.hash}
                        className="bg-white p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{team.name}</span>
                          <div className="flex items-center text-green-600">
                            <Award className="w-4 h-4 mr-1" />
                            {team.data.winRate.toFixed(1)}%
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <div className="relative w-8 h-8">
                            <Image
                              src={`https://cdn.brawlify.com/brawler/${team.brawler1}.png`}
                              alt={`Brawler ${team.brawler1}`}
                              fill
                              className="rounded-full object-cover"
                              sizes="32px"
                            />
                          </div>
                          <div className="relative w-8 h-8">
                            <Image
                              src={`https://cdn.brawlify.com/brawler/${team.brawler2}.png`}
                              alt={`Brawler ${team.brawler2}`}
                              fill
                              className="rounded-full object-cover"
                              sizes="32px"
                            />
                          </div>
                          <div className="relative w-8 h-8">
                            <Image
                              src={`https://cdn.brawlify.com/brawler/${team.brawler3}.png`}
                              alt={`Brawler ${team.brawler3}`}
                              fill
                              className="rounded-full object-cover"
                              sizes="32px"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
