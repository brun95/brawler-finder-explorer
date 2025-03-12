
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TrophyHistoryChartProps {
  data: {
    trophies: number;
    highest_trophies: number;
    recorded_at: string;
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
          <p className="text-gray-500 dark:text-gray-400">
            Trophy history will appear here once we have collected more data for this player
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map(entry => ({
    date: format(new Date(entry.recorded_at), 'MM/dd'),
    trophies: entry.trophies,
    highestTrophies: entry.highest_trophies
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Trophy Progression</CardTitle>
        <CardDescription>Track your trophy progression over time</CardDescription>
      </CardHeader>
      <CardContent className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="trophyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="highestTrophyGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" stroke="#888888" />
            <YAxis stroke="#888888" />
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
              labelStyle={{ color: "#f9fafb" }}
              itemStyle={{ color: "#f9fafb" }}
            />
            <Area 
              type="monotone" 
              dataKey="trophies" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#trophyGradient)" 
              name="Current Trophies"
            />
            <Area 
              type="monotone" 
              dataKey="highestTrophies" 
              stroke="#82ca9d" 
              fillOpacity={1} 
              fill="url(#highestTrophyGradient)" 
              name="Highest Trophies"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
