
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { format, parseISO, subDays } from "date-fns";

interface TrophyProgressionGraphProps {
  currentTrophies: number;
}

export const TrophyProgressionGraph = ({ currentTrophies }: TrophyProgressionGraphProps) => {
  // Generate sample data for the last 30 days
  // In a real application, this would come from the API
  const data = Array.from({ length: 30 }).map((_, index) => {
    const date = subDays(new Date(), 29 - index);
    // Generate some random variations around the current trophy count
    const variation = Math.floor(Math.random() * 200) - 100;
    return {
      date: format(date, "yyyy-MM-dd"),
      trophies: Math.max(0, currentTrophies + variation),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-sm p-6 mb-8"
    >
      <h2 className="text-xl font-semibold mb-4">Trophy Progression (Last 30 Days)</h2>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(date) => format(parseISO(date as string), 'MMM dd, yyyy')}
              formatter={(value) => [`${value} trophies`, 'Trophies']}
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
