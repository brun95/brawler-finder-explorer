'use client'

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useFavorites } from "@/hooks/useFavorites";
import { useLanguage } from "@/hooks/useLanguage";
import { Star, Users, Sword, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { motion } from "framer-motion";
import { useMemo } from "react";
import { createBrawlerSlug } from "@/lib/utils";

const Favorites = () => {
  const { favorites, removeFavorite, getFavoritesByType } = useFavorites();
  const { t } = useLanguage();

  const playerFavorites = getFavoritesByType('player');
  const clubFavorites = getFavoritesByType('club');

  // Calculate statistics
  const stats = useMemo(() => {
    const recentlyAdded = [...favorites]
      .sort((a, b) => b.addedAt - a.addedAt)
      .slice(0, 5);

    const totalTrophies = playerFavorites.reduce((sum, fav) =>
      sum + (fav.metadata?.trophies || 0), 0
    );

    return {
      recentlyAdded,
      totalTrophies,
      avgTrophies: playerFavorites.length > 0
        ? Math.round(totalTrophies / playerFavorites.length)
        : 0
    };
  }, [favorites, playerFavorites]);

  const handleRemove = (id: string, type: 'player' | 'club' | 'brawler') => {
    removeFavorite(id, type);
  };

  const EmptyState = ({ type }: { type: string }) => (
    <div className="text-center py-12">
      <Star className="h-12 w-12 text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 mb-2">
        {type === 'items' && t.favorites.emptyState.noFavorites}
        {type === 'players' && t.favorites.emptyState.noPlayers}
        {type === 'clubs' && t.favorites.emptyState.noClubs}
        {type === 'brawlers' && t.favorites.emptyState.noBrawlers}
      </h3>
      <p className="text-gray-500">{t.favorites.emptyState.startExploring}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <PageBreadcrumb
          customSegments={[]}
          currentPageLabel="Favorites"
        />

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Favorites
          </h1>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4 bg-gray-200 border-gray-300">
            <TabsTrigger value="all" className="data-[state=active]:bg-white">
              {t.favorites.tabs.all} ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-white">
              {t.favorites.tabs.players} ({playerFavorites.length})
            </TabsTrigger>
            <TabsTrigger value="clubs" className="data-[state=active]:bg-white">
              {t.favorites.tabs.clubs} ({clubFavorites.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {favorites.length === 0 ? (
              <EmptyState type="items" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {favorites.map((favorite, index) => (
                  <motion.div
                    key={`${favorite.type}-${favorite.id}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white border-gray-200 hover:border-primary transition-all group relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          {favorite.type === 'player' && (
                            <Avatar className="h-10 w-10 border border-gray-300">
                              <AvatarImage
                                src={`https://cdn.brawlify.com/profile-icons/regular/${favorite.metadata?.icon || 28000000}.png`}
                                alt={favorite.name}
                              />
                              <AvatarFallback className="bg-gray-200">
                                {favorite.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {favorite.type === 'club' && (
                            <Avatar shape="square" className="h-10 w-10 border border-gray-300">
                              <AvatarImage
                                src={`https://cdn.brawlify.com/club-badges/regular/8000000.png`}
                                alt={favorite.name}
                              />
                              <AvatarFallback className="bg-gray-200">
                                {favorite.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {favorite.type === 'brawler' && (
                            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <Sword className="h-5 w-5 text-purple-500" />
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-800">{favorite.name}</CardTitle>
                            <CardDescription className="text-gray-600 text-sm">
                              {favorite.tag && `#${favorite.tag.replace('#', '')}`}
                              {favorite.type === 'player' && favorite.metadata?.trophies && (
                                <span className="ml-2">• {favorite.metadata.trophies.toLocaleString()} 🏆</span>
                              )}
                              {favorite.type === 'club' && favorite.metadata?.members && (
                                <span className="ml-2">• {favorite.metadata.members} members</span>
                              )}
                              {favorite.type === 'brawler' && favorite.metadata?.class && (
                                <span className="ml-2">• {favorite.metadata.class}</span>
                              )}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(favorite.id, favorite.type)}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link
                          href={
                            favorite.type === 'player'
                              ? `/player/${favorite.tag?.replace('#', '')}`
                              : favorite.type === 'club'
                              ? `/club/${favorite.tag?.replace('#', '')}`
                              : `/brawlers/${createBrawlerSlug(favorite.name)}`
                          }
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            {t.favorites.actions.viewDetails}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="players">
            {playerFavorites.length === 0 ? (
              <EmptyState type="players" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {playerFavorites.map((favorite, index) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white border-gray-200 hover:border-primary transition-all group relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-300">
                            <AvatarImage
                              src={`https://cdn.brawlify.com/profile-icons/regular/${favorite.metadata?.icon || 28000000}.png`}
                              alt={favorite.name}
                            />
                            <AvatarFallback className="bg-gray-200">
                              {favorite.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-800">{favorite.name}</CardTitle>
                            <CardDescription className="text-gray-600 text-sm">
                              #{favorite.tag?.replace('#', '')}
                              {favorite.metadata?.trophies && (
                                <span className="ml-2">• {favorite.metadata.trophies.toLocaleString()} 🏆</span>
                              )}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(favorite.id, 'player')}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/player/${favorite.tag?.replace('#', '')}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            {t.favorites.actions.viewProfile}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="clubs">
            {clubFavorites.length === 0 ? (
              <EmptyState type="clubs" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {clubFavorites.map((favorite, index) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white border-gray-200 hover:border-primary transition-all group relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <Avatar shape="square" className="h-10 w-10 border border-gray-300">
                            <AvatarImage
                              src={`https://cdn.brawlify.com/club-badges/regular/8000000.png`}
                              alt={favorite.name}
                            />
                            <AvatarFallback className="bg-gray-200">
                              {favorite.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-800">{favorite.name}</CardTitle>
                            <CardDescription className="text-gray-600 text-sm">
                              #{favorite.tag?.replace('#', '')}
                              {favorite.metadata?.members && (
                                <span className="ml-2">• {favorite.metadata.members} members</span>
                              )}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(favorite.id, 'club')}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/club/${favorite.tag?.replace('#', '')}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            {t.favorites.actions.viewClub}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Recent Activity */}
        {stats.recentlyAdded.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              {t.favorites.recentActivity}
            </h2>
            <Card className="bg-white border-gray-200">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {stats.recentlyAdded.map((fav, index) => (
                    <div
                      key={`${fav.type}-${fav.id}`}
                      className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
                    >
                      {fav.type === 'player' && (
                        <Avatar className="h-10 w-10 border border-gray-300">
                          <AvatarImage
                            src={`https://cdn.brawlify.com/profile-icons/regular/${fav.metadata?.icon || 28000000}.png`}
                            alt={fav.name}
                          />
                          <AvatarFallback className="bg-gray-200">
                            {fav.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {fav.type === 'club' && (
                        <Avatar shape="square" className="h-10 w-10 border border-gray-300">
                          <AvatarImage
                            src={`https://cdn.brawlify.com/club-badges/regular/8000000.png`}
                            alt={fav.name}
                          />
                          <AvatarFallback className="bg-gray-200">
                            {fav.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {fav.type === 'brawler' && (
                        <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Sword className="h-5 w-5 text-purple-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{fav.name}</p>
                        <p className="text-sm text-gray-600">
                          {fav.tag && `#${fav.tag.replace('#', '')}`}
                          {fav.type === 'player' && fav.metadata?.trophies && (
                            <span className="ml-2">• {fav.metadata.trophies.toLocaleString()} 🏆</span>
                          )}
                        </p>
                      </div>
                      <Link
                        href={
                          fav.type === 'player'
                            ? `/player/${fav.tag?.replace('#', '')}`
                            : fav.type === 'club'
                            ? `/club/${fav.tag?.replace('#', '')}`
                            : `/brawlers/${createBrawlerSlug(fav.name)}`
                        }
                      >
                        <Button variant="ghost" size="sm">
                          {t.favorites.actions.viewDetails}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
