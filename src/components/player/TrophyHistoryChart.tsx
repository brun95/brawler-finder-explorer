import { Line, LineChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
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
            Trophy history will appear here once we have collected more data for this player.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Convert data for the chart
  const chartData = data.map(entry => ({
    date: format(new Date(entry.recorded_at), 'MM/dd'),
    trophies: entry.trophies,
    highestTrophies: entry.highest_trophies
  }));

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
              <span className="text-gray-600 dark:text-gray-300">Current Trophies</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-4 h-1 bg-green-500 rounded"></span>
              <span className="text-gray-600 dark:text-gray-300">Highest Trophies</span>
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
            <Tooltip 
              contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
              labelStyle={{ color: "#f9fafb" }}
              itemStyle={{ color: "#f9fafb" }}
            />
            <Line 
              type="monotone" 
              dataKey="trophies" 
              stroke="#8884d8" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
              name="Current Trophies"
            />
            <Line 
              type="monotone" 
              dataKey="highestTrophies" 
              stroke="#82ca9d" 
              strokeWidth={2} 
              dot={{ r: 3 }} 
              name="Highest Trophies"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
