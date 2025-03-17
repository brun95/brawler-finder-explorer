
import { useParams, Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Crown, Award, Activity } from "lucide-react";
import { fetchPlayerData, fetchPlayerBattleLog } from "@/api";
import { StatCard } from "@/components/player/StatCard";
import { PersonalRecords } from "@/components/player/PersonalRecords";
import { BattleLogSection } from "@/components/player/BattleLogSection";
// import { TrophyProgressionGraph } from "@/components/player/TrophyProgressionGraph";
import { BrawlerGrid } from "@/components/player/BrawlerGrid";
import { AdBanner } from "@/components/ads/AdBanner";
import { TrophyHistoryChart } from "@/components/player/TrophyHistoryChart";
import { WinRateAnalysis } from "@/components/player/WinRateAnalysis";
import { usePlayerTrophyHistory, usePlayerWinRates } from "@/hooks/usePlayerStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const PlayerStats = () => {
  const { tag } = useParams();

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

  const isLoading = isLoadingPlayer || isLoadingBattles || isLoadingTrophyHistory || isLoadingWinRates;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <div className="pt-24 text-center text-gray-300">Loading...</div>
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
        <AdBanner slot="player-top" />

        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-200">{player.name}</h1>
            <p className="text-gray-400">{player.tag}</p>
          </div>
          {player.club && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Club</p>
              <Link to={`/club/${player.club.tag.replace('#', '')}`}>
                <Button variant="link" className="font-medium text-gray-300 p-0 h-auto">
                  {player.club.name}
                </Button>
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Trophy} label="Trophies" value={player.trophies} />
          <StatCard icon={Crown} label="Highest Trophies" value={player.highestTrophies} />
          <StatCard icon={Star} label="Level" value={player.expLevel} />
          <StatCard icon={Trophy} label="Experience" value={player.expPoints} />
        </div>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList className="mb-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700">Overview</TabsTrigger>
            <TabsTrigger value="brawlers" className="data-[state=active]:bg-gray-700">Brawlers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8">
            <div className="grid md:grid-cols-1 gap-8">
              <TrophyHistoryChart data={trophyHistory || []} />
            </div>

            <BattleLogSection
              battles={battles || []}
              stats={{ wins, losses, draws }}
              playerTag={tag}
            />
            
            <PersonalRecords
              stats={{
                brawlersCount: player.brawlers.length,
                victories3v3: player["3vs3Victories"],
                soloVictories: player.soloVictories,
                duoVictories: player.duoVictories,
                bestRoboRumbleTime: player.bestRoboRumbleTime,
              }}
            />
          </TabsContent>
          
          <TabsContent value="brawlers">
            <div className="grid md:grid-cols-1 gap-8 space-y-8">
              {winRates && (
                <WinRateAnalysis 
                  byModeData={winRates.byMode || []} 
                  byBrawlerData={winRates.byBrawler || []} 
                />
              )}
            </div>

            <BrawlerGrid brawlers={player.brawlers} />
          </TabsContent>
        </Tabs>
        
        <AdBanner slot="player-bottom" />
      </main>
      <Footer />
    </div>
  );
};

export default PlayerStats;
