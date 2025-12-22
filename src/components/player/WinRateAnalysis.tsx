
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface WinRateItemProps {
  mode?: string;
  brawler?: string;
  winRate: number;
  matches: number;
}

interface WinRateAnalysisProps {
  byModeData: WinRateItemProps[];
  byBrawlerData: WinRateItemProps[];
}

export const WinRateAnalysis = ({ byModeData, byBrawlerData }: WinRateAnalysisProps) => {
  // Sort data by win rate (descending)
  const sortedModeData = [...byModeData].sort((a, b) => b.winRate - a.winRate);
  const sortedBrawlerData = [...byBrawlerData].sort((a, b) => b.winRate - a.winRate);

  const getBarColor = (winRate: number) => {
    if (winRate >= 60) return "#10b981"; // green
    if (winRate >= 50) return "#22c55e"; // light green
    if (winRate >= 40) return "#f59e0b"; // yellow
    return "#ef4444"; // red
  };

  const formatXAxis = (value: string) => {
    // Truncate if longer than 10 characters
    return value?.length > 10 ? `${value.substring(0, 10)}...` : value;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow text-sm">
          <p className="label font-semibold mb-1">{label}</p>
          <p className="value">
            Win Rate: <span className="font-medium">{payload[0].value.toFixed(1)}%</span>
          </p>
          <p className="matches text-gray-500 text-xs mt-1">
            Matches: {payload[0].payload.matches}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Game Mode Win Rates */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Win Rate by Game Mode
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedModeData}
                margin={{ top: 10, right: 10, left: 0, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis 
                  dataKey="mode" 
                  tick={{ fill: '#9ca3af' }} 
                  tickFormatter={formatXAxis} 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                />
                <YAxis 
                  tick={{ fill: '#9ca3af' }} 
                  domain={[0, 100]} 
                  ticks={[0, 25, 50, 75, 100]} 
                  unit="%" 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
                <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                  {sortedModeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.winRate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Brawler Win Rates */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Win Rate by Brawler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sortedBrawlerData}
                margin={{ top: 10, right: 10, left: 0, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis 
                  dataKey="brawler" 
                  tick={{ fill: '#9ca3af' }} 
                  tickFormatter={formatXAxis} 
                  angle={-45} 
                  textAnchor="end" 
                  height={70} 
                />
                <YAxis 
                  tick={{ fill: '#9ca3af' }} 
                  domain={[0, 100]} 
                  ticks={[0, 25, 50, 75, 100]} 
                  unit="%" 
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
                <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                  {sortedBrawlerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={getBarColor(entry.winRate)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
