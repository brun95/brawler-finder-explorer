
'use client'

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from "./components/ui/toaster"
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CookiesConsent } from "@/components/CookiesConsent";

interface AppProps {
  children: React.ReactNode;
}

function App({ children }: AppProps) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <div className="app">
      <HelmetProvider>
        <Toaster />
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        </ThemeProvider>
        <CookiesConsent />
      </HelmetProvider>
    </div>
  );
}

export default App;
