
import { useParams, Link } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
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
  Coins,
  Users,
  Award,
  Swords,
  Timer,
  Gamepad2,
} from "lucide-react";

// Mock data - replace with actual API call
const fetchPlayerData = async (tag: string) => {
  // Simulated API response
  return {
    name: "Player Name",
    tag: "#2G0VQ0YLC",
    trophies: 62596,
    highestTrophies: 62602,
    level: 189,
    club: "PtWarPt",
    seasonReset: 62294,
    starPoints: 2140,
    xpProgress: 64,
    powerPoints: 119830,
    coinsToMax: 237150,
    unlockedBrawlers: 88,
    totalBrawlers: 89,
    wins3v3: 8358,
    soloVictories: 1688,
    duoVictories: 844,
    roboRumble: "Insane II",
    trophyProgress: Array.from({ length: 30 }, (_, i) => ({
      date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), "MMM dd"),
      trophies: Math.floor(62000 + Math.random() * 1000),
    })).reverse(),
    recentBattles: Array.from({ length: 100 }, (_, i) => ({
      id: i,
      mode: "Knockout",
      brawler: "Colt",
      result: Math.random() > 0.5 ? "victory" : "defeat",
      brawlerIcon: "https://cdn.brawlify.com/brawler/Colt.png",
    })),
    brawlers: Array.from({ length: 88 }, (_, i) => ({
      name: `Brawler ${i + 1}`,
      power: Math.floor(Math.random() * 11) + 1,
      icon: "https://cdn.brawlify.com/brawler/Colt.png",
    })),
  };
};

const PlayerStats = () => {
  const { tag } = useParams();
  const { data: player, isLoading } = useQuery({
    queryKey: ["player", tag],
    queryFn: () => fetchPlayerData(tag!),
  });

  if (isLoading) {
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

  const wins = player.recentBattles.filter((b) => b.result === "victory").length;
  const losses = player.recentBattles.filter((b) => b.result === "defeat").length;

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
                <p className="font-medium">{player.club}</p>
              </div>
            )}
          </div>

          <div className="h-[300px] mb-8">
            <h2 className="text-xl font-semibold mb-4">Trophy Progression</h2>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={player.trophyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="trophies"
                  stroke="#9b87f5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Trophy} label="Trophies" value={player.trophies} />
            <StatCard
              icon={Crown}
              label="Highest Trophies"
              value={player.highestTrophies}
            />
            <StatCard icon={Star} label="Level" value={player.level} />
            <StatCard
              icon={Trophy}
              label="Season Reset"
              value={player.seasonReset}
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
                value={`${player.unlockedBrawlers} / ${player.totalBrawlers}`}
              />
              <StatRow
                icon={Swords}
                label="3 vs 3 Victories"
                value={player.wins3v3}
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
                label="Robo Rumble"
                value={player.roboRumble}
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
              Recent Battles ({wins}W • {losses}L)
            </h2>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {player.recentBattles.map((battle) => (
                <div
                  key={battle.id}
                  className={`flex items-center gap-3 p-3 rounded-lg ${
                    battle.result === "victory"
                      ? "bg-green-50"
                      : "bg-red-50"
                  }`}
                >
                  <img
                    src={battle.brawlerIcon}
                    alt={battle.brawler}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="flex-1">{battle.mode}</span>
                  <span
                    className={`text-sm font-medium ${
                      battle.result === "victory"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {battle.result}
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
            {player.brawlers.map((brawler, index) => (
              <div
                key={index}
                className="flex flex-col items-center p-3 rounded-lg bg-gray-50"
              >
                <img
                  src={brawler.icon}
                  alt={brawler.name}
                  className="w-12 h-12 rounded-full mb-2"
                />
                <span className="text-sm font-medium">{brawler.name}</span>
                <span className="text-xs text-gray-600">
                  Power {brawler.power}
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
