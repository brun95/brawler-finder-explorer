import { useState } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { format, parseISO, subDays } from "date-fns";

interface TrophyProgressionGraphProps {
  currentTrophies: number;
}

export const TrophyProgressionGraph = ({ currentTrophies }: TrophyProgressionGraphProps) => {
  const [days, setDays] = useState(7); // Default: last 7 days

  // Generate sample data for the selected time range
  const data = Array.from({ length: days }).map((_, index) => {
    const date = subDays(new Date(), days - 1 - index);
    const variation = Math.floor(Math.random() * 200) - 100;
    return {
      date: format(date, "yyyy-MM-dd"),
      trophies: Math.max(0, currentTrophies + variation),
    };
  });

  // Find min/max trophies in data for Y-axis zoom
  const minTrophies = Math.min(...data.map((d) => d.trophies));
  const maxTrophies = Math.max(...data.map((d) => d.trophies));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8 "
    >
      {/* Header with Title & Settings */}
      <div className="flex justify-between items-center mb-4 text-gray-100">
        <h2 className="text-xl font-semibold">Trophy Progression ({days} Days)</h2>
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              days === 7 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setDays(7)}
          >
            Last 7 Days
          </button>
          <button
            className={`px-3 py-1 rounded-md text-sm ${
              days === 30 ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setDays(30)}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Graph Container */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), "MMM dd")}
            />
            <YAxis domain={[minTrophies - 100, maxTrophies + 100]} tickCount={6} />
            <Tooltip
              labelFormatter={(date) => format(parseISO(date as string), "MMM dd, yyyy")}
              formatter={(value) => [`${value} trophies`, "Trophies"]}
            />
            <Line
              type="monotone"
              dataKey="trophies"
              stroke="#FF4E4E"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
