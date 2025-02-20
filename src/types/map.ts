
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

export interface Map {
  id: number;
  name: string;
  type: MapType;
  image: string;
  brawlerWinRates: {
    brawlerId: number;
    brawlerName: string;
    winRate: number;
  }[];
}
