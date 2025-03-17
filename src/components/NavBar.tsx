import { Search, Menu } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ThemeSwitch } from "./ThemeSwitch";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">StarBrawl</span>
            </Link>
          </div>
          
          <div className="hidden md:flex md:items-center md:space-x-8">
            <Link to="/brawlers" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Brawlers
            </Link>
            <Link to="/maps" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Maps
            </Link>
            <Link to="/events" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
              Events
            </Link>
            <ThemeSwitch />
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <ThemeSwitch />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Menu className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden animate-fade-in">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white/95">
            <Link
              to="/brawlers"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Brawlers
            </Link>
            <Link
              to="/maps"
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
            >
              Maps
            </Link>
            <Link
              to="/events"
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
