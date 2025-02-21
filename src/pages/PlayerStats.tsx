
import { useParams, Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Trophy,
  Star,
  Crown,
  Users,
  Swords,
  Timer,
} from "lucide-react";
import { fetchPlayerData, fetchPlayerBattleLog } from "@/api";

const PlayerStats = () => {
  const { tag } = useParams();

  const { data: player, isLoading: isLoadingPlayer } = useQuery({
    queryKey: ["player", tag],
    queryFn: () => fetchPlayerData(tag!),
  });

  const { data: battles, isLoading: isLoadingBattles } = useQuery({
    queryKey: ["battles", tag],
    queryFn: () => fetchPlayerBattleLog(tag!),
    enabled: !!player, // Only fetch battles if we have player data
  });

  if (isLoadingPlayer || isLoadingBattles) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-24 text-center">Loading...</div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="pt-24 text-center">Player not found</div>
      </div>
    );
  }

  const wins = battles?.filter(b => b.battle.result === "victory").length || 0;
  const losses = battles?.filter(b => b.battle.result === "defeat").length || 0;
  const draws = battles?.filter(b => b.battle.result === "draw").length || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{player.name}</h1>
              <p className="text-gray-600">{player.tag}</p>
            </div>
            {player.club && (
              <div className="text-right">
                <p className="text-sm text-gray-600">Club</p>
                <p className="font-medium">{player.club.name}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Trophy} label="Trophies" value={player.trophies} />
            <StatCard
              icon={Crown}
              label="Highest Trophies"
              value={player.highestTrophies}
            />
            <StatCard icon={Star} label="Level" value={player.expLevel} />
            <StatCard
              icon={Trophy}
              label="Experience"
              value={player.expPoints}
            />
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4">Personal Records</h2>
            <div className="space-y-4">
              <StatRow
                icon={Users}
                label="Unlocked Brawlers"
                value={`${player.brawlers.length}`}
              />
              <StatRow
                icon={Swords}
                label="3 vs 3 Victories"
                value={player["3vs3Victories"]}
              />
              <StatRow
                icon={Trophy}
                label="Solo Victories"
                value={player.soloVictories}
              />
              <StatRow
                icon={Users}
                label="Duo Victories"
                value={player.duoVictories}
              />
              <StatRow
                icon={Timer}
                label="Best Robo Rumble Time"
                value={`Level ${player.bestRoboRumbleTime}`}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              Recent Battles ({wins}W • {losses}L • {draws}D)
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {battles?.map((battle, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    battle.battle.result === "victory"
                      ? "bg-green-50"
                      : battle.battle.result === "defeat"
                      ? "bg-red-50"
                      : "bg-gray-50"
                  }`}
                >
                  {battle.battle.teams?.[1].map(player => (
                    player.brawler && (
                      <img
                        key={player.tag}
                        src={`/brawlers/${player.brawler.id}.png`}
                        alt={player.brawler.name}
                        className="w-8 h-8 rounded-full"
                      />
                    )
                  ))}
                  <span className="flex-1">{battle.event.mode}</span>
                  <span
                    className={`text-sm font-medium ${
                      battle.battle.result === "victory"
                        ? "text-green-600"
                        : battle.battle.result === "defeat"
                        ? "text-red-600"
                        : "text-gray-600"
                    }`}
                  >
                    {battle.battle.result}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-8 bg-white rounded-lg shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-4">Brawlers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
            {player.brawlers.map((brawler) => (
              <div
                key={brawler.id}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50"
              >
                <img
                  src={`/brawlers/${brawler.id}.png`}
                  alt={brawler.name}
                  className="w-12 h-12 rounded-full mb-2"
                />
                <span className="text-sm font-medium">{brawler.name}</span>
                <span className="text-xs text-gray-600">
                  Power {brawler.power}
                </span>
                <span className="text-xs text-gray-600">
                  Rank {brawler.rank}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const StatCard = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: number | string;
}) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-5 h-5 text-primary" />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
    <p className="text-xl font-semibold">{value}</p>
  </div>
);

const StatRow = ({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Trophy;
  label: string;
  value: number | string;
}) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div className="flex items-center gap-2">
      <Icon className="w-5 h-5 text-primary" />
      <span>{label}</span>
    </div>
    <span className="font-medium">{value}</span>
  </div>
);

export default PlayerStats;
