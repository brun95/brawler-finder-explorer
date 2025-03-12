import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar } from 'recharts';

interface WinRateData {
  byMode: {
    mode: string;
    winRate: number;
    matches: number;
  }[];
  byBrawler: {
    brawler: string;
    winRate: number;
    matches: number;
  }[];
}

interface WinRateAnalysisProps {
  data: WinRateData;
}

export const WinRateAnalysis = ({ data }: WinRateAnalysisProps) => {
  

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Win Rate Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="modes">
          <TabsList>
            <TabsTrigger value="modes">By Game Mode</TabsTrigger>
            <TabsTrigger value="brawlers">By Brawler</TabsTrigger>
          </TabsList>
          <TabsContent value="modes">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byMode}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mode" />
                <YAxis 
                  tickFormatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Win Rate']}
                />
                <Legend />
                <Bar dataKey="winRate" fill="#8884d8" name="Win Rate" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          <TabsContent value="brawlers">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.byBrawler}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="brawler" />
                <YAxis 
                  tickFormatter={(value: number) => `${value.toFixed(1)}%`}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(1)}%`, 'Win Rate']}
                />
                <Legend />
                <Bar dataKey="winRate" fill="#82ca9d" name="Win Rate" />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default WinRateAnalysis;
