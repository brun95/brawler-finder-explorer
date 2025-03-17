import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

import Home from './pages/Home';
import PlayerStats from './pages/PlayerStats';
import ClubStats from './pages/ClubStats';
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookiesConsent } from "@/components/CookiesConsent";
import Brawlers from './pages/Brawlers';
import BrawlerDetails from './pages/BrawlerDetails';
import Maps from './pages/Maps';
import MapDetails from './pages/MapDetails';
import Events from './pages/Events';
import NotFound from './pages/NotFound';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const { toast } = useToast()

  useEffect(() => {
    // Optional: Example of how to use the toast
    // toast({
    //   title: "Uh oh! Something went wrong.",
    //   description: "There was a problem with your last operation.",
    // })
  }, [toast]);

  return (
    <div className="app">
      <Toaster />
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />

              <Route path="/brawlers" element={<Brawlers />} />
              <Route path="/brawlers/:id" element={<BrawlerDetails />} />
              <Route path="/maps" element={<Maps />} />
              <Route path="/maps/:id" element={<MapDetails />} />
              <Route path="/player/:tag" element={<PlayerStats />} />
              <Route path="/club/:tag" element={<ClubStats />} />
              <Route path="/events" element={<Events />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
      <CookiesConsent />
    </div>
  );
}

export default App;
