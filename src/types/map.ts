
export type MapType =
  | "Gem Grab"
  | "Heist"
  | "Bounty"
  | "Brawl Ball"
  | "Solo Showdown"
  | "Duo Showdown"
  | "Hot Zone"
  | "Knockout"
  | "Duels"
  | "Wipeout"
  | "Wipeout 5v5"
  | "Brawl Ball 5v5";

export interface Environment {
  id: number;
  name: string;
  hash: string;
  path: string;
  version: number;
  imageUrl: string;
}

export interface GameMode {
  id: number;
  scId?: number;
  name: string;
  hash: string;
  version: number;
  color: string;
  bgColor: string;
  link: string;
  imageUrl: string;
}

export interface BrawlerStat {
  brawler: number;
  winRate: number;
  useRate: number;
  starRate: number;
}

export interface TeamStat {
  name: string;
  hash: string;
  brawler1: number;
  brawler2: number;
  brawler3: number;
  data: {
    winRate: number;
    useRate: number;
    wins: number;
    losses: number;
    draws: number;
    total: number;
  };
}

export interface Map {
  id: number;
  new: boolean;
  disabled: boolean;
  name: string;
  hash: string;
  version: number;
  link: string;
  imageUrl: string;
  credit: string | null;
  environment: Environment;
  gameMode: GameMode;
  lastActive: number | null;
  dataUpdated: number;
  stats?: BrawlerStat[];
  teamStats?: TeamStat[];
}

export interface MapsResponse {
  list: Map[];
}

export interface GameModesResponse {
  list: GameMode[];
}
