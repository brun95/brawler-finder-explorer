import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

interface Event {
    map: {
        gameMode: {
            scId: unknown;
            name: string;
            hash: string;
        };
        name: string;
    };
    startTime: string;
    endTime: string;
}

interface EventCardProps {
    event: Event;
}

const getModeColor = (mode: string): string => {
    const modeColors: Record<string, string> = {
        'Solo Showdown' : '#81D61F',
        'Duo Showdown'  : '#81D61F',
        'Trio Showdown' : '#81D61F',
        'Brawl Ball'    : '#8D9FE0',
        'Brawl Ball 5v5': '#8D9FE0',
        'Gem Grab'      : '#9A3DF4',
        'Gem Grab 5v5'  : '#9A3DF4',
        'Heist'         : '#D55CD3',
        'Bounty'        : '#00CFFF',
        'Brawl Hockey'  : '#8D9FE0',
        'Treasure Hunt' : '#9A3DF4',
        'Knockout'      : '#F7831A',
        'Hot Zone'      : '#F7831A',
        'Duels'         : '#F7831A',
    };
    return modeColors[mode] || '#9A3DF4'; // Default color
};

export const EventCard = ({ event }: EventCardProps) => {
    const { t }     = useLanguage();
    const modeName  = event?.map?.gameMode?.name || 'Unknown Mode';
    const modeColor = getModeColor(modeName);
    const modeIcon  = event?.map?.gameMode?.scId;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors"
        >
            <div 
                className="h-2"
                style={{ backgroundColor: modeColor }}
            />
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${modeColor}20` }}
                    >
                        <img 
                            src={`https://cdn.brawlify.com/game-modes/regular/${modeIcon}.png`}
                            alt={modeName}
                            className="w-8 h-8 object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold capitalize text-gray-900 dark:text-gray-100">
                            {modeName}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{event?.map?.name}</p>
                    </div>
                </div>
                
                <div className="mt-4 space-y-1 text-sm">
                    <p className="text-gray-600 dark:text-gray-400">
                        {t.events.startTime}: {format(parseISO(event.startTime), 'MMM dd, HH:mm')}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t.events.endTime}: {format(parseISO(event.endTime), 'MMM dd, HH:mm')}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};