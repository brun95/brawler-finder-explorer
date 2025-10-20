'use client'

import { Trophy, Crown, Star, Award } from "lucide-react";
import { Badge } from "./ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface TrophyMilestoneBadgeProps {
  trophies: number;
  size?: 'sm' | 'md' | 'lg';
}

const getMilestones = (trophies: number) => {
  const milestones: any[] = [];

  if (trophies >= 50000) {
    milestones.push({ icon: Crown, label: '50K Legend', color: 'bg-gradient-to-r from-yellow-400 to-orange-500', glow: 'shadow-lg shadow-yellow-500/50' });
  } else if (trophies >= 40000) {
    milestones.push({ icon: Crown, label: '40K Master', color: 'bg-gradient-to-r from-purple-500 to-pink-500', glow: 'shadow-lg shadow-purple-500/50' });
  } else if (trophies >= 30000) {
    milestones.push({ icon: Trophy, label: '30K Champion', color: 'bg-gradient-to-r from-blue-500 to-cyan-500', glow: 'shadow-md shadow-blue-500/50' });
  } else if (trophies >= 20000) {
    milestones.push({ icon: Trophy, label: '20K Expert', color: 'bg-gradient-to-r from-green-500 to-emerald-500', glow: 'shadow-md shadow-green-500/50' });
  } else if (trophies >= 10000) {
    milestones.push({ icon: Star, label: '10K Pro', color: 'bg-gradient-to-r from-indigo-500 to-blue-500', glow: 'shadow-sm shadow-indigo-500/50' });
  } else if (trophies >= 5000) {
    milestones.push({ icon: Award, label: '5K Rising Star', color: 'bg-gradient-to-r from-gray-500 to-gray-600' });
  }

  return milestones;
};

export const TrophyMilestoneBadge = ({ trophies, size = 'md' }: TrophyMilestoneBadgeProps) => {
  const milestones = getMilestones(trophies);

  if (milestones.length === 0) return null;

  const sizeClasses = {
    sm: 'h-6 px-2 text-xs',
    md: 'h-8 px-3 text-sm',
    lg: 'h-10 px-4 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <TooltipProvider>
      {milestones.map((milestone, index) => {
        const Icon = milestone.icon;
        return (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Badge
                className={`${milestone.color} ${milestone.glow || ''} ${sizeClasses[size]} border-0 text-white font-semibold flex items-center gap-1.5 cursor-help transition-all hover:scale-105`}
              >
                <Icon className={iconSizes[size]} />
                <span>{milestone.label}</span>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Achieved {trophies.toLocaleString()} trophies!</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
    </TooltipProvider>
  );
};
