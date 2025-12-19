
'use client'

import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Crown, Award, Activity } from "lucide-react";
import { fetchPlayerData, fetchPlayerBattleLog } from "@/api";
import { StatCard } from "@/components/player/StatCard";
import { PersonalRecords } from "@/components/player/PersonalRecords";
import { BrawlerGrid } from "@/components/player/BrawlerGrid";
import { AdBanner } from "@/components/ads/AdBanner";

// Lazy load heavy chart components
const TrophyHistoryChart = dynamic(() => import("@/components/player/TrophyHistoryChart").then(mod => mod.TrophyHistoryChart), {
  loading: () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-64 flex items-center justify-center">
      <div className="text-gray-400">Loading trophy history...</div>
    </div>
  ),
  ssr: false
});

const BrawlerTrophyBars = dynamic(() => import("@/components/player/BrawlerTrophyBars").then(mod => mod.BrawlerTrophyBars), {
  loading: () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 h-72 flex items-center justify-center">
      <div className="text-gray-400">Loading brawler stats...</div>
    </div>
  ),
  ssr: false
});

const BattleLogSection = dynamic(() => import("@/components/player/BattleLogSection").then(mod => mod.BattleLogSection), {
  loading: () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="text-gray-400">Loading battle log...</div>
    </div>
  ),
  ssr: false
});

const WinRateAnalysis = dynamic(() => import("@/components/player/WinRateAnalysis").then(mod => mod.WinRateAnalysis), {
  loading: () => (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="text-gray-400">Loading win rate analysis...</div>
    </div>
  ),
  ssr: false
});
import { usePlayerTrophyHistory, usePlayerWinRates } from "@/hooks/usePlayerStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { PlayerStatsSkeleton } from "@/components/loading/PlayerStatsSkeleton";
import { ShareButton } from "@/components/ShareButton";
import { TrophyMilestoneBadge } from "@/components/TrophyMilestoneBadge";
import { FavoriteButton } from "@/components/FavoriteButton";
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { useState } from "react";

const PlayerStats = () => {
  const { tag } = useParams() as { tag: string };
  const [activeTab, setActiveTab] = useState("overview");

  // Swipe gesture handling
  const handleSwipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 50;

    if (Math.abs(info.offset.x) > swipeThreshold) {
      if (info.offset.x > 0 && activeTab === "brawlers") {
        // Swipe right: go to overview
        setActiveTab("overview");
      } else if (info.offset.x < 0 && activeTab === "overview") {
        // Swipe left: go to brawlers
        setActiveTab("brawlers");
      }
    }
  };

  const { data: player, isLoading: isLoadingPlayer } = useQuery({
    queryKey: ["player", tag],
    queryFn: () => fetchPlayerData(tag!),
  });

  const { data: battles, isLoading: isLoadingBattles } = useQuery({
    queryKey: ["battles", tag],
    queryFn: () => fetchPlayerBattleLog(tag!),
    enabled: !!player,
  });

  const { data: trophyHistory, isLoading: isLoadingTrophyHistory } = usePlayerTrophyHistory(tag);
  const { data: winRates, isLoading: isLoadingWinRates } = usePlayerWinRates(tag);

  // Progressive loading - show critical data first
  const isInitialLoading = isLoadingPlayer;
  const isLoading = isLoadingPlayer || isLoadingBattles || isLoadingTrophyHistory || isLoadingWinRates;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          <PlayerStatsSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <div className="pt-24 text-center text-gray-300">Player not found</div>
        <Footer />
      </div>
    );
  }

  // Calculate battle stats considering showdown ranks
  const getShowdownResult = (battle: any) => {
    if (!battle.battle.mode) return null;
    
    // Check if this is a showdown battle
    if (battle.battle.mode.toLowerCase() === 'showdown' || battle.battle.mode.toLowerCase() === 'soloshowdown') {
      // Find the player in the players array
      const playerEntry = battle.battle.players?.find((p: any) => 
        p.tag === (tag?.startsWith('#') ? tag : `#${tag}`)
      );
      
      if (playerEntry && playerEntry.rank) {
        // Ranks 1-5 in solo are victories
        return playerEntry.rank <= 5 ? 'victory' : 'defeat';
      }
    } else if (battle.battle.mode.toLowerCase() === 'duoshowdown') {
      // Find the player in the players array
      const playerEntry = battle.battle.players?.find((p: any) => 
        p.tag === (tag?.startsWith('#') ? tag : `#${tag}`)
      );
      
      if (playerEntry && playerEntry.rank) {
        // Ranks 1-3 in duo are victories
        return playerEntry.rank <= 3 ? 'victory' : 'defeat';
      }
    }
    
    return null;
  };

  const wins = battles?.filter(b => {
    // Check if it's a showdown battle
    const showdownResult = getShowdownResult(b);
    if (showdownResult) return showdownResult === 'victory';
    
    // For regular modes use the result field
    return b.battle.result === "victory";
  }).length || 0;
  
  const losses = battles?.filter(b => {
    // Check if it's a showdown battle
    const showdownResult = getShowdownResult(b);
    if (showdownResult) return showdownResult === 'defeat';
    
    // For regular modes use the result field
    return b.battle.result === "defeat";
  }).length || 0;
  
  const draws = battles?.filter(b => b.battle.result === "draw").length || 0;

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <PageBreadcrumb
          customSegments={[{ label: 'Players', href: '/' }]}
          currentPageLabel={player?.name || tag}
        />

        <AdBanner slot="player-top" />

        <div className="flex items-center gap-4 mb-6">
          <Avatar shape="square" className="h-12 w-12 border border-gray-700">
            <AvatarImage
              src={`https://cdn.brawlify.com/profile-icons/regular/${player.icon?.id || 28000000}.png`}
              alt={player.name}
            />
            <AvatarFallback className="bg-gray-700 text-gray-200 uppercase">
              {player.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold text-gray-200">{player.name}</h1>
              <TrophyMilestoneBadge trophies={player.trophies} size="md" />
            </div>
            <p className="text-gray-400">{player.tag}</p>
          </div>
          <div className="flex items-center gap-3">
            {player.club && (
              <div className="text-right">
                <p className="text-sm text-gray-400">Club</p>
                <Link href={`/club/${player.club.tag.replace('#', '')}`}>
                  <Button variant="link" className="font-medium text-gray-300 p-0 h-auto">
                    {player.club.name}
                  </Button>
                </Link>
              </div>
            )}
            <FavoriteButton
              item={{
                id: tag,
                type: 'player',
                name: player.name,
                tag: player.tag,
                metadata: {
                  trophies: player.trophies,
                  icon: player.icon?.id,
                },
              }}
            />
            <ShareButton
              title={`${player.name}'s Brawl Stars Stats`}
              text={`Check out ${player.name}'s stats: ${player.trophies} trophies!`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Trophy} label="Trophies" value={player.trophies} />
          <StatCard icon={Crown} label="Highest Trophies" value={player.highestTrophies} />
          <StatCard icon={Star} label="Level" value={player.expLevel} />
          <StatCard icon={Trophy} label="Experience" value={player.expPoints} />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="brawlers" className="data-[state=active]:bg-gray-700">Brawlers</TabsTrigger>
          </TabsList>

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <TabsContent value="overview" asChild forceMount>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleSwipe}
                  className="space-y-8 md:pointer-events-auto pointer-events-auto touch-pan-y"
                >
                  <BrawlerTrophyBars brawlers={player.brawlers} />

            {isLoadingBattles ? (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="text-gray-400">Loading battle log...</div>
              </div>
            ) : (
              <BattleLogSection
                battles={battles || []}
                stats={{ wins, losses, draws }}
                playerTag={tag}
              />
            )}
            
            <PersonalRecords
              stats={{
                brawlersCount: player.brawlers.length,
                victories3v3: player["3vs3Victories"],
                soloVictories: player.soloVictories,
                duoVictories: player.duoVictories,
                bestRoboRumbleTime: player.bestRoboRumbleTime,
              }}
            />
                </motion.div>
              </TabsContent>
            )}

            {activeTab === "brawlers" && (
              <TabsContent value="brawlers" asChild forceMount>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onDragEnd={handleSwipe}
                  className="md:pointer-events-auto pointer-events-auto touch-pan-y"
                >
            <BrawlerGrid brawlers={player.brawlers} />
                </motion.div>
              </TabsContent>
            )}
          </AnimatePresence>
        </Tabs>
        
        <AdBanner slot="player-bottom" />
      </main>
      <Footer />
    </div>
  );
};

export default PlayerStats;
