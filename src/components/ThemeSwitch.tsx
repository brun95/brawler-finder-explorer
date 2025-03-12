
import { Moon, Sun, Globe } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "@/hooks/useLanguage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const ThemeSwitch = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-primary/10' : ''}>
            English
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('fr')} className={language === 'fr' ? 'bg-primary/10' : ''}>
            Français
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setLanguage('pt')} className={language === 'pt' ? 'bg-primary/10' : ''}>
            Português
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Toggle theme"
      >
        {theme === "light" ? (
          <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        ) : (
          <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        )}
      </button>
    </div>
  );
};
