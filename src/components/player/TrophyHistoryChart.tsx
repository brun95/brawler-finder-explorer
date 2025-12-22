import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, TrendingUp, TrendingDown } from "lucide-react";

interface TrophyHistoryChartProps {
  data: {
    trophies: number;
    highest_trophies: number;
    recorded_at: string | null;
  }[];
}

export const TrophyHistoryChart = ({ data }: TrophyHistoryChartProps) => {
  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Trophy Progression</CardTitle>
          <CardDescription>No historical data available yet</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-gray-500">
            Trophy history will appear here once we have collected more data for this player.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Convert data for the chart
  const chartData = data.map((entry, index) => {
    const prevEntry = index > 0 ? data[index - 1] : null;
    const trophyChange = prevEntry ? entry.trophies - prevEntry.trophies : 0;

    return {
      date: format(new Date(entry.recorded_at || new Date()), 'MM/dd'),
      fullDate: format(new Date(entry.recorded_at || new Date()), 'MMM dd, yyyy'),
      trophies: entry.trophies,
      highestTrophies: entry.highest_trophies,
      change: trophyChange,
    };
  });

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;

      return (
        <div className="bg-gray-200 border border-gray-300 rounded-lg p-3 shadow-lg">
          <p className="text-gray-800 font-semibold mb-2">{data.fullDate}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-indigo-400" />
              <span className="text-gray-700 text-sm">Current:</span>
              <span className="text-gray-900 font-semibold">{data.trophies.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-green-400" />
              <span className="text-gray-700 text-sm">Highest:</span>
              <span className="text-gray-900 font-semibold">{data.highestTrophies.toLocaleString()}</span>
            </div>
            {data.change !== 0 && (
              <div className="flex items-center gap-2 pt-1 border-t border-gray-300">
                {data.change > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-400" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-400" />
                )}
                <span className={`text-sm font-semibold ${data.change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {data.change > 0 ? '+' : ''}{data.change.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  // Get min and max trophies
  const minTrophies = Math.min(...data.map(d => d.trophies));
  const maxTrophies = Math.max(...data.map(d => d.trophies));

  // Calculate the Y-axis range (30% below min, 30% above max)
  const padding = (maxTrophies - minTrophies) * 0.3;
  const yMin = Math.max(0, Math.floor(minTrophies - padding));
  const yMax = Math.ceil(maxTrophies + padding);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <CardTitle>Trophy Progression</CardTitle>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="w-4 h-1 bg-indigo-500 rounded"></span>
              <span className="text-gray-600">Current Trophies</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-1 bg-green-500 rounded"></span>
              <span className="text-gray-600">Highest Trophies</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#888888" />
            <YAxis stroke="#888888" domain={[yMin, yMax]} allowDecimals={false} />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1 }} />
            <Line
              type="monotone"
              dataKey="trophies"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#1f2937' }}
              activeDot={{ r: 6, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }}
              name="Current Trophies"
            />
            <Line
              type="monotone"
              dataKey="highestTrophies"
              stroke="#10b981"
              strokeWidth={3}
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#1f2937' }}
              activeDot={{ r: 6, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              name="Highest Trophies"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
