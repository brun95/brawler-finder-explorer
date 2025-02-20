
export type BrawlerClass = "Damage Dealer" | "Hybrid" | "Support" | "Tank" | "Assassin";

export interface Brawler {
  id: number;
  name: string;
  class: BrawlerClass;
  image: string;
  rarity: string;
  stats: {
    health: number;
    damage: number;
    speed: number;
  };
  bestMaps: string[];
}

export const getBrawlerClassColor = (brawlerClass: BrawlerClass): string => {
  switch (brawlerClass) {
    case "Damage Dealer":
      return "border-red-500";
    case "Hybrid":
      return "border-purple-500";
    case "Support":
      return "border-green-500";
    case "Tank":
      return "border-blue-500";
    case "Assassin":
      return "border-yellow-500";
    default:
      return "border-gray-500";
  }
};
