'use client'

import { Home, Star, Sword, Map, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useFavorites } from "@/hooks/useFavorites";

export const BottomNav = () => {
  const pathname = usePathname();
  const { favorites } = useFavorites();

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/dashboard', icon: Star, label: 'Favorites', badge: favorites.length },
    { href: '/brawlers', icon: Sword, label: 'Brawlers' },
    { href: '/maps', icon: Map, label: 'Maps' },
    { href: '/events', icon: Calendar, label: 'Events' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full gap-1 relative transition-colors",
                active
                  ? "text-primary"
                  : "text-gray-600 hover:text-gray-900"
              )}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 px-1.5 py-0.5 text-[10px] bg-primary text-white rounded-full min-w-[18px] text-center">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
