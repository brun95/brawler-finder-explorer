
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';

interface Event {
    startTime: string;
    endTime: string;
    event: {
        mode: string;
        map: string;
        modifiers?: string[];
    };
}

interface EventCardProps {
    event: Event;
}

const getModeColor = (mode: string): string => {
    const modeColors: Record<string, string> = {
        'solo showdown': '#81D61F',
        'brawl ball': '#8D9FE0',
        'gem grab': '#9A3DF4',
        'heist': '#D55CD3',
        'bounty': '#00CFFF',
        'brawl hockey': '#8D9FE0',
        'treasure hunt': '#9A3DF4',
        'knockout': '#F7831A'
    };
    return modeColors[mode.toLowerCase()] || '#9A3DF4';
};

// Get mode icon name based on the mode string
const getModeIcon = (mode: string): string => {
    const normalizedMode = mode.toLowerCase().replace(/\s+/g, '-');
    return normalizedMode;
};

export const EventCard = ({ event }: EventCardProps) => {
    const { t } = useLanguage();
    const modeColor = getModeColor(event.event.mode);
    const modeIcon = getModeIcon(event.event.mode);

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
                            alt={event.event.mode}
                            className="w-8 h-8 object-contain"
                        />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold capitalize text-gray-900 dark:text-gray-100">
                            {event.event.mode}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400">{event.event.map}</p>
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
                
                {event.event.modifiers && event.event.modifiers.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                        {event.event.modifiers.map(modifier => (
                            <span
                                key={modifier}
                                className="inline-block text-xs rounded-full px-2 py-1"
                                style={{ 
                                    backgroundColor: `${modeColor}20`,
                                    color: modeColor
                                }}
                            >
                                {modifier}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};
