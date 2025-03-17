
import { useParams, useNavigate } from "react-router-dom";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import { useQuery } from "@tanstack/react-query";
import { fetchClubData } from "@/api";
import { UserIcon, Trophy, Star, Crown, Users } from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { usePreviousClubSearches } from "@/hooks/usePreviousClubSearches";

const getRoleColor = (role: string) => {
  switch (role) {
    case 'president':
      return 'bg-red-500';
    case 'vicePresident':
      return 'bg-blue-500';
    case 'senior':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

const getRoleName = (role: string) => {
  switch (role) {
    case 'president':
      return 'President';
    case 'vicePresident':
      return 'Vice President';
    case 'senior':
      return 'Senior';
    default:
      return 'Member';
  }
};

const ClubStats = () => {
  const { tag } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addSearch } = usePreviousClubSearches();

  const { data: club, isLoading } = useQuery({
    queryKey: ["club", tag],
    queryFn: () => fetchClubData(tag!),
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch club data. Please check the tag and try again.",
          variant: "destructive",
        });
      }
    }
  });

  // Save club to previous searches when data is loaded
  if (club && tag) {
    addSearch(tag, club.name);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <div className="pt-24 text-center text-gray-300">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-900">
        <NavBar />
        <div className="pt-24 text-center text-gray-300">Club not found</div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <AdBanner slot="club-top" />

        <div className="flex flex-col md:flex-row items-start gap-6 mb-8">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <Avatar className="h-16 w-16 rounded-lg border border-gray-700">
                <AvatarImage src={`https://cdn.brawlify.com/club-badges/regular/${club.badgeId}.png`} alt={club.name} />
                <AvatarFallback className="bg-gray-700 text-gray-200">
                  {club.name.substring(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-gray-200">{club.name}</h1>
                <p className="text-gray-400">{club.tag}</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 flex flex-col items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mb-1" />
                <p className="text-gray-300 text-sm">Trophies</p>
                <p className="text-gray-100 font-semibold">{club.trophies.toLocaleString()}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 flex flex-col items-center">
                <Users className="h-5 w-5 text-blue-500 mb-1" />
                <p className="text-gray-300 text-sm">Members</p>
                <p className="text-gray-100 font-semibold">{club.members.length}/30</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-4 flex flex-col items-center">
                <Trophy className="h-5 w-5 text-red-500 mb-1" />
                <p className="text-gray-300 text-sm">Required</p>
                <p className="text-gray-100 font-semibold">{club.requiredTrophies}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {club.description && (
          <Card className="bg-gray-800 border-gray-700 mb-8">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 whitespace-pre-line">{club.description}</p>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="members" className="mb-8">
          <TabsList className="mb-4 bg-gray-800 border-gray-700">
            <TabsTrigger value="members" className="data-[state=active]:bg-gray-700">Members</TabsTrigger>
          </TabsList>
          
          <TabsContent value="members">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Members ({club.members.length}/30)</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-700">
                        <TableHead className="text-gray-300">Player</TableHead>
                        <TableHead className="text-gray-300">Role</TableHead>
                        <TableHead className="text-gray-300">Trophies</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {club.members.map((member) => (
                        <TableRow 
                          key={member.tag} 
                          className="border-gray-700 hover:bg-gray-700/50 cursor-pointer"
                          onClick={() => navigate(`/player/${member.tag.replace('#', '')}`)}
                        >
                          <TableCell className="font-medium text-gray-200">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarImage 
                                  src={`https://cdn.brawlify.com/profile-icons/regular/${member.icon.id}.png`} 
                                  alt={member.name} 
                                />
                                <AvatarFallback className="bg-gray-700 text-sm">
                                  {member.name.substring(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="text-sm">{member.name}</p>
                                <p className="text-xs text-gray-400">{member.tag}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getRoleColor(member.role)} hover:${getRoleColor(member.role)}`}>
                              {getRoleName(member.role)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-300">{member.trophies.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <AdBanner slot="club-bottom" />
      </main>
      <Footer />
    </div>
  );
};

export default ClubStats;
