
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";

interface TrophyGraphProps {
    trophyHistory: { date: string; trophies: number }[];
}

export const TrophyGraph = ({ trophyHistory }: TrophyGraphProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm p-6 mb-8"
        >
            <h2 className="text-xl font-semibold mb-4">Trophy Progression</h2>
            <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trophyHistory}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                            dataKey="date"
                            tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                        />
                        <YAxis />
                        <Tooltip 
                            labelFormatter={(date) => format(parseISO(date as string), 'MMM dd, yyyy')}
                        />
                        <Line
                            type="monotone"
                            dataKey="trophies"
                            stroke="#FF4E4E"
                            strokeWidth={2}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
