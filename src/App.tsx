import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/hooks/useLanguage";
import Index from "./pages/Index";
import Brawlers from "./pages/Brawlers";
import BrawlerDetails from "./pages/BrawlerDetails";
import Maps from "./pages/Maps";
import MapDetails from "./pages/MapDetails";
import PlayerStats from "./pages/PlayerStats";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
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
              <Route path="/events" element={<Events />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
