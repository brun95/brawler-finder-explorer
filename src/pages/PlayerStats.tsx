
import { useParams } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Crown } from "lucide-react";
import { fetchPlayerData, fetchPlayerBattleLog } from "@/api";
import { StatCard } from "@/components/player/StatCard";
import { PersonalRecords } from "@/components/player/PersonalRecords";
import { BattleLogSection } from "@/components/player/BattleLogSection";
import { TrophyProgressionGraph } from "@/components/player/TrophyProgressionGraph";
import { BrawlerGrid } from "@/components/player/BrawlerGrid";
import { AdBanner } from "@/components/ads/AdBanner";

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

  if (isLoadingPlayer || isLoadingBattles) {
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

  const wins = battles?.filter(b => b.battle.result === "victory").length || 0;
  const losses = battles?.filter(b => b.battle.result === "defeat").length || 0;
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
              <p className="font-medium text-gray-300">{player.club.name}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard icon={Trophy} label="Trophies" value={player.trophies} />
          <StatCard icon={Crown} label="Highest Trophies" value={player.highestTrophies} />
          <StatCard icon={Star} label="Level" value={player.expLevel} />
          <StatCard icon={Trophy} label="Experience" value={player.expPoints} />
        </div>

        <TrophyProgressionGraph currentTrophies={player.trophies} />

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <PersonalRecords
            stats={{
              brawlersCount: player.brawlers.length,
              victories3v3: player["3vs3Victories"],
              soloVictories: player.soloVictories,
              duoVictories: player.duoVictories,
              bestRoboRumbleTime: player.bestRoboRumbleTime,
            }}
          />
          <BattleLogSection
            battles={battles || []}
            stats={{ wins, losses, draws }}
          />
        </div>

        <BrawlerGrid brawlers={player.brawlers} />
        
        <AdBanner slot="player-bottom" />
      </main>
      <Footer />
    </div>
  );
};

export default PlayerStats;
