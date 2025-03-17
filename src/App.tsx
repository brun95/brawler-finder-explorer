import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

import Home from './pages/Home';
import PlayerStats from './pages/PlayerStats';
import ClubStats from './pages/ClubStats';
import BrawlerStats from './pages/BrawlerStats';
import { ThemeProvider } from "@/components/theme-provider"
import { CookiesConsent } from "@/components/CookiesConsent";

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
              <Route path="/player/:tag" element={<PlayerStats />} />
              <Route path="/club/:tag" element={<ClubStats />} />
              <Route path="/brawler/:id" element={<BrawlerStats />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
      <CookiesConsent />
    </div>
  );
}

export default App;
