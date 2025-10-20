'use client'

import { Star } from "lucide-react";
import { Button } from "./ui/button";
import { useFavorites, type Favorite } from "@/hooks/useFavorites";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  item: Omit<Favorite, 'addedAt'>;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
  showLabel?: boolean;
  className?: string;
}

export const FavoriteButton = ({
  item,
  variant = "ghost",
  size = "sm",
  showLabel = false,
  className
}: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { toast } = useToast();
  const favorited = isFavorite(item.id, item.type);

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const added = toggleFavorite(item);

    if (added) {
      toast({
        title: "Added to favorites",
        description: `${item.name} has been added to your favorites.`,
      });
    } else {
      toast({
        title: "Removed from favorites",
        description: `${item.name} has been removed from your favorites.`,
      });
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      className={cn("gap-2", className)}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className={cn(
          "h-4 w-4 transition-colors",
          favorited && "fill-yellow-400 text-yellow-400"
        )}
      />
      {showLabel && (
        <span>{favorited ? "Favorited" : "Add to Favorites"}</span>
      )}
    </Button>
  );
};
