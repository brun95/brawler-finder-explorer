'use client'

import { Menu, Star } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
// import { ThemeSwitch } from "./ThemeSwitch";
import { GlobalSearch } from "./GlobalSearch";
import { useFavorites } from "@/hooks/useFavorites";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { favorites } = useFavorites();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">StarBrawl</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-4">
            <GlobalSearch />
            <Link href="/dashboard" className="text-gray-700 hover:text-primary transition-colors flex items-center gap-1">
              <Star className="h-4 w-4" />
              Dashboard
              {favorites.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link href="/brawlers" className="text-gray-700 hover:text-primary transition-colors">
              Brawlers
            </Link>
            <Link href="/maps" className="text-gray-700 hover:text-primary transition-colors">
              Maps
            </Link>
            <Link href="/events" className="text-gray-700 hover:text-primary transition-colors">
              Events
            </Link>
            {/* <ThemeSwitch /> */}
          </div>

          {/* <div className="md:hidden flex items-center space-x-4">
            <ThemeSwitch />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div> */}
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Star className="h-4 w-4" />
              Dashboard
              {favorites.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-primary text-white rounded-full">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              href="/brawlers"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Brawlers
            </Link>
            <Link
              href="/maps"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Maps
            </Link>
            <Link
              href="/events"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Events
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};
