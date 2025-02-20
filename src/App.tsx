
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import Brawlers from "./pages/Brawlers";
import BrawlerDetails from "./pages/BrawlerDetails";
import Maps from "./pages/Maps";
import MapDetails from "./pages/MapDetails";
import PlayerStats from "./pages/PlayerStats";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/brawlers" element={<Brawlers />} />
          <Route path="/brawlers/:id" element={<BrawlerDetails />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/maps/:id" element={<MapDetails />} />
          <Route path="/player/:tag" element={<PlayerStats />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
