import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createBrawlerSlug(name: string): string {
  // Convert to lowercase and replace spaces with hyphens
  // Keep existing hyphens and dots, remove other special characters
  return name.toLowerCase()
    .replace(/\./g, '-')  // Convert dots to hyphens (8.BIT -> 8-bit)
    .replace(/\s+/g, '-')  // Convert spaces to hyphens
    .replace(/[^a-z0-9-]/g, '');  // Remove all other special characters
}

export function slugToBrawlerName(slug: string): string {
  // This is more complex because we need to know if it's "8-BIT" or "R-T" vs "EL PRIMO"
  // We'll need to match against actual brawler names in the API route
  return slug.toUpperCase();
}
