
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface WinRateItem {
  mode?: string;
  brawler?: string;
  winRate: number;
  matches: number;
}

interface WinRateAnalysisProps {
  byMode: WinRateItem[];
  byBrawler: WinRateItem[];
}

export const WinRateAnalysis = ({ byMode, byBrawler }: WinRateAnalysisProps) => {
  if ((!byMode || byMode.length === 0) && (!byBrawler || byBrawler.length === 0)) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Win Rate Analysis</CardTitle>
          <CardDescription>No win rate data available yet</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">
            Win rate data will appear here once we have collected more match data
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort data by win rate, highest first
  const sortedModeData = [...(byMode || [])].sort((a, b) => b.winRate - a.winRate);
  const sortedBrawlerData = [...(byBrawler || [])].sort((a, b) => b.winRate - a.winRate);

  // Only show top 10 brawlers for readability
  const topBrawlers = sortedBrawlerData.slice(0, 10);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Win Rate Analysis</CardTitle>
        <CardDescription>See how you perform with different brawlers and game modes</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="modes">
          <TabsList className="mb-4">
            <TabsTrigger value="modes">By Game Mode</TabsTrigger>
            <TabsTrigger value="brawlers">By Brawler</TabsTrigger>
          </TabsList>
          
          <TabsContent value="modes" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sortedModeData} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="mode" 
                  stroke="#888888" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                />
                <YAxis 
                  stroke="#888888"
                  domain={[0, 100]}
                  label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "#f9fafb" }}
                  itemStyle={{ color: "#f9fafb" }}
                  formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
                />
                <Legend />
                <Bar 
                  dataKey="winRate" 
                  name="Win Rate" 
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="brawlers" className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topBrawlers} margin={{ top: 10, right: 30, left: 20, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="brawler" 
                  stroke="#888888" 
                  angle={-45} 
                  textAnchor="end" 
                  height={60}
                />
                <YAxis 
                  stroke="#888888"
                  domain={[0, 100]}
                  label={{ value: 'Win Rate (%)', angle: -90, position: 'insideLeft' }} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px" }}
                  labelStyle={{ color: "#f9fafb" }}
                  itemStyle={{ color: "#f9fafb" }}
                  formatter={(value, name) => [`${value.toFixed(1)}%`, name]}
                />
                <Legend />
                <Bar 
                  dataKey="winRate" 
                  name="Win Rate" 
                  fill="#82ca9d"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
