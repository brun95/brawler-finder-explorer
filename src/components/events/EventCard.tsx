
import { motion } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { getRelativeTime } from '@/utils/time';

interface Event {
    startTime: string;
    endTime: string;
    map: {
        gameMode: {
            scId: number;
            name: string;
            bgColor: string;
            imageUrl: string;
        };
        name: string;
        imageUrl: string;
    };
}

interface EventCardProps {
    event: Event;
    type: 'active' | 'upcoming';
}

export const EventCard = ({ event, type }: EventCardProps) => {
    const { t }     = useLanguage();
    const modeName  = event?.map?.gameMode?.name || 'Unknown Mode';
    const modeColor = event?.map?.gameMode?.bgColor || '#9A3DF4';
    const modeIcon  = event?.map?.gameMode?.imageUrl;
    const mapImage  = event?.map?.imageUrl;
    const timeText  = type === 'active'
        ? `${t.events.endsIn} ${getRelativeTime(event.endTime)}`
        : `${t.events.startsIn} ${getRelativeTime(event.startTime)}`;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-sm transition-colors relative"
        >
            <div 
                className="h-2"
                style={{ backgroundColor: modeColor }}
            />
            <div className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium text-white">
                {timeText}
            </div>
            <div className="p-4">
                <div className="flex items-start gap-3">
                    <div 
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${modeColor}20` }}
                    >
                        <img 
                            src={modeIcon}
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
                
                <div className="mt-4 aspect-video rounded-lg overflow-hidden">
                    <img 
                        src={mapImage}
                        alt={`${event?.map?.name} map`}
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </motion.div>
    );
};
