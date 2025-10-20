'use client'

import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useFavorites } from "@/hooks/useFavorites";
import { useLanguage } from "@/hooks/useLanguage";
import { Star, User, Users, Sword, Trash2, TrendingUp, Search, Map, Calendar, Trophy } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageBreadcrumb } from "@/components/PageBreadcrumb";
import { motion } from "framer-motion";
import { useMemo } from "react";

const Dashboard = () => {
  const { favorites, removeFavorite, clearAllFavorites, getFavoritesByType } = useFavorites();
  const { t } = useLanguage();

  const playerFavorites = getFavoritesByType('player');
  const clubFavorites = getFavoritesByType('club');
  const brawlerFavorites = getFavoritesByType('brawler');

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
      <Star className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
        {type === 'items' && t.dashboard.emptyState.noFavorites}
        {type === 'players' && t.dashboard.emptyState.noPlayers}
        {type === 'clubs' && t.dashboard.emptyState.noClubs}
        {type === 'brawlers' && t.dashboard.emptyState.noBrawlers}
      </h3>
      <p className="text-gray-500 dark:text-gray-500">{t.dashboard.emptyState.startExploring}</p>
    </div>
  );

  const QuickActionCard = ({
    icon: Icon,
    title,
    href,
    color
  }: {
    icon: any;
    title: string;
    href: string;
    color: string;
  }) => (
    <Link href={href}>
      <Card className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all cursor-pointer group h-full">
        <CardContent className="pt-6 pb-6 flex flex-col items-center justify-center text-center gap-3">
          <div className={`h-12 w-12 rounded-full ${color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          <p className="font-medium text-gray-700 dark:text-gray-200">{title}</p>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <PageBreadcrumb
          customSegments={[]}
          currentPageLabel={t.dashboard.title}
        />

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">
              {t.dashboard.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t.dashboard.subtitle}
            </p>
          </div>
          {favorites.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Are you sure you want to clear all favorites?')) {
                  clearAllFavorites();
                }
              }}
              className="gap-2 hover:text-red-500 hover:border-red-500 self-start sm:self-auto"
            >
              <Trash2 className="h-4 w-4" />
              {t.dashboard.clearAll}
            </Button>
          )}
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t.dashboard.totalFavorites}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {favorites.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t.dashboard.tabs.players}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {playerFavorites.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t.dashboard.tabs.clubs}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {clubFavorites.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {t.dashboard.tabs.brawlers}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                    <Sword className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                    {brawlerFavorites.length}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {t.dashboard.quickActions}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            <QuickActionCard
              icon={Search}
              title={t.dashboard.searchPlayer}
              href="/"
              color="bg-blue-500"
            />
            <QuickActionCard
              icon={Users}
              title={t.dashboard.searchClub}
              href="/"
              color="bg-green-500"
            />
            <QuickActionCard
              icon={Sword}
              title={t.dashboard.browseBrawlers}
              href="/brawlers"
              color="bg-purple-500"
            />
            <QuickActionCard
              icon={Map}
              title={t.dashboard.viewMaps}
              href="/maps"
              color="bg-orange-500"
            />
            <QuickActionCard
              icon={Calendar}
              title={t.dashboard.viewEvents}
              href="/events"
              color="bg-pink-500"
            />
          </div>
        </motion.div>

        {/* Recent Activity */}
        {stats.recentlyAdded.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              {t.dashboard.recentActivity}
            </h2>
            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {stats.recentlyAdded.map((fav, index) => (
                    <div
                      key={`${fav.type}-${fav.id}`}
                      className="flex items-center gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0 last:pb-0"
                    >
                      {fav.type === 'player' && (
                        <Avatar className="h-10 w-10 border border-gray-300 dark:border-gray-700">
                          <AvatarImage
                            src={`https://cdn.brawlify.com/profile-icons/regular/${fav.metadata?.icon || 28000000}.png`}
                            alt={fav.name}
                          />
                          <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                            {fav.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      {fav.type === 'club' && (
                        <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-green-500" />
                        </div>
                      )}
                      {fav.type === 'brawler' && (
                        <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Sword className="h-5 w-5 text-purple-500" />
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-medium text-gray-800 dark:text-gray-200">{fav.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
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
                            : `/brawlers/${fav.id}`
                        }
                      >
                        <Button variant="ghost" size="sm">
                          {t.dashboard.actions.viewDetails}
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Favorites Tabs Section */}
        <div className="mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            {t.dashboard.favorites}
          </h2>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="mb-4 bg-gray-200 dark:bg-gray-800 border-gray-300 dark:border-gray-700">
            <TabsTrigger value="all" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              {t.dashboard.tabs.all} ({favorites.length})
            </TabsTrigger>
            <TabsTrigger value="players" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              {t.dashboard.tabs.players} ({playerFavorites.length})
            </TabsTrigger>
            <TabsTrigger value="clubs" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              {t.dashboard.tabs.clubs} ({clubFavorites.length})
            </TabsTrigger>
            <TabsTrigger value="brawlers" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
              {t.dashboard.tabs.brawlers} ({brawlerFavorites.length})
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
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all group relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          {favorite.type === 'player' && (
                            <Avatar className="h-10 w-10 border border-gray-300 dark:border-gray-700">
                              <AvatarImage
                                src={`https://cdn.brawlify.com/profile-icons/regular/${favorite.metadata?.icon || 28000000}.png`}
                                alt={favorite.name}
                              />
                              <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                                {favorite.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          {favorite.type === 'club' && (
                            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                              <Users className="h-5 w-5 text-green-500" />
                            </div>
                          )}
                          {favorite.type === 'brawler' && (
                            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                              <Sword className="h-5 w-5 text-purple-500" />
                            </div>
                          )}
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{favorite.name}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
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
                              : `/brawlers/${favorite.id}`
                          }
                        >
                          <Button variant="outline" size="sm" className="w-full">
                            {t.dashboard.actions.viewDetails}
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
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all group relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-300 dark:border-gray-700">
                            <AvatarImage
                              src={`https://cdn.brawlify.com/profile-icons/regular/${favorite.metadata?.icon || 28000000}.png`}
                              alt={favorite.name}
                            />
                            <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                              {favorite.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{favorite.name}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
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
                            {t.dashboard.actions.viewProfile}
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
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all group relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{favorite.name}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
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
                            {t.dashboard.actions.viewClub}
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="brawlers">
            {brawlerFavorites.length === 0 ? (
              <EmptyState type="brawlers" />
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {brawlerFavorites.map((favorite, index) => (
                  <motion.div
                    key={favorite.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all group relative">
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                            <Sword className="h-5 w-5 text-purple-500" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-gray-800 dark:text-gray-200">{favorite.name}</CardTitle>
                            <CardDescription className="text-gray-600 dark:text-gray-400 text-sm">
                              {favorite.metadata?.class}
                            </CardDescription>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemove(favorite.id, 'brawler')}
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/brawlers/${favorite.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            {t.dashboard.actions.viewBrawler}
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
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
