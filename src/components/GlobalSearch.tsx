'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Users, Sword, X } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { useBrawlers } from "@/hooks/useBrawlers";
import { usePreviousSearches } from "@/hooks/usePreviousSearches";
import { usePreviousClubSearches } from "@/hooks/usePreviousClubSearches";
import { createBrawlerSlug } from "@/lib/utils";

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<'all' | 'player' | 'club' | 'brawler'>('all');
  const router = useRouter();
  const { data: brawlers } = useBrawlers();
  const { searches: playerSearches } = usePreviousSearches();
  const { searches: clubSearches = [] } = usePreviousClubSearches();

  // Keyboard shortcut (Ctrl+K or Cmd+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handlePlayerSearch = (tag: string) => {
    const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;
    router.push(`/player/${cleanTag}`);
    setOpen(false);
    setSearchQuery("");
  };

  const handleClubSearch = (tag: string) => {
    const cleanTag = tag.startsWith('#') ? tag.substring(1) : tag;
    router.push(`/club/${cleanTag}`);
    setOpen(false);
    setSearchQuery("");
  };

  const handleBrawlerSelect = (brawlerName: string) => {
    router.push(`/brawlers/${createBrawlerSlug(brawlerName)}`);
    setOpen(false);
    setSearchQuery("");
  };

  // Filter brawlers based on search
  const filteredBrawlers = brawlers?.filter((brawler: any) =>
    brawler.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5) || [];

  // Filter recent searches
  const filteredPlayerSearches = playerSearches.filter(search =>
    search.tag.includes(searchQuery) || search.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const filteredClubSearches = clubSearches.filter(search =>
    search.tag.includes(searchQuery) || search.name.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 3);

  const isPlayerTag = searchQuery.startsWith('#') || (searchQuery.length > 0 && searchQuery.toUpperCase() === searchQuery);
  const showResults = searchQuery.length > 0;

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl p-0">
          <Command className="rounded-lg border-none">
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search players, clubs, or brawlers..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <CommandList className="max-h-[400px] overflow-y-auto">
              {!showResults && (
                <CommandEmpty>
                  <div className="py-6 text-center text-sm">
                    <p className="text-muted-foreground">Start typing to search</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Use # for player/club tags or search by name
                    </p>
                  </div>
                </CommandEmpty>
              )}

              {showResults && (
                <>
                  {/* Player tag search */}
                  {isPlayerTag && searchType !== 'brawler' && searchType !== 'club' && (
                    <CommandGroup heading="Player Search">
                      <CommandItem
                        onSelect={() => handlePlayerSearch(searchQuery)}
                        className="cursor-pointer"
                      >
                        <User className="mr-2 h-4 w-4" />
                        <span>Search for player: {searchQuery}</span>
                      </CommandItem>
                    </CommandGroup>
                  )}

                  {/* Club tag search */}
                  {isPlayerTag && searchType !== 'brawler' && searchType !== 'player' && (
                    <CommandGroup heading="Club Search">
                      <CommandItem
                        onSelect={() => handleClubSearch(searchQuery)}
                        className="cursor-pointer"
                      >
                        <Users className="mr-2 h-4 w-4" />
                        <span>Search for club: {searchQuery}</span>
                      </CommandItem>
                    </CommandGroup>
                  )}

                  {/* Recent player searches */}
                  {filteredPlayerSearches.length > 0 && searchType !== 'club' && searchType !== 'brawler' && (
                    <CommandGroup heading="Recent Players">
                      {filteredPlayerSearches.map((search) => (
                        <CommandItem
                          key={search.tag}
                          onSelect={() => handlePlayerSearch(search.tag)}
                          className="cursor-pointer"
                        >
                          <User className="mr-2 h-4 w-4" />
                          <div className="flex flex-col">
                            <span>{search.name}</span>
                            <span className="text-xs text-muted-foreground">#{search.tag}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Recent club searches */}
                  {filteredClubSearches.length > 0 && searchType !== 'player' && searchType !== 'brawler' && (
                    <CommandGroup heading="Recent Clubs">
                      {filteredClubSearches.map((search) => (
                        <CommandItem
                          key={search.tag}
                          onSelect={() => handleClubSearch(search.tag)}
                          className="cursor-pointer"
                        >
                          <Users className="mr-2 h-4 w-4" />
                          <div className="flex flex-col">
                            <span>{search.name}</span>
                            <span className="text-xs text-muted-foreground">#{search.tag}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {/* Brawlers */}
                  {filteredBrawlers.length > 0 && searchType !== 'player' && searchType !== 'club' && (
                    <CommandGroup heading="Brawlers">
                      {filteredBrawlers.map((brawler: any) => (
                        <CommandItem
                          key={brawler.id}
                          onSelect={() => handleBrawlerSelect(brawler.name)}
                          className="cursor-pointer"
                        >
                          <Sword className="mr-2 h-4 w-4" />
                          <div className="flex items-center gap-2">
                            <span>{brawler.name}</span>
                            <span className="text-xs text-muted-foreground">{brawler.class}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}

                  {showResults && filteredBrawlers.length === 0 && filteredPlayerSearches.length === 0 && filteredClubSearches.length === 0 && !isPlayerTag && (
                    <CommandEmpty>No results found</CommandEmpty>
                  )}
                </>
              )}
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </>
  );
};
