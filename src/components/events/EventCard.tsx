
import { format, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

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

export const EventCard = ({ event }: EventCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-sm p-4 border border-gray-200"
        >
            <h3 className="text-lg font-semibold capitalize mb-2">{event.event.mode}</h3>
            <p className="text-gray-600 mb-2">{event.event.map}</p>
            <div className="text-sm text-gray-500">
                <p>Starts: {format(parseISO(event.startTime), 'MMM dd, HH:mm')}</p>
                <p>Ends: {format(parseISO(event.endTime), 'MMM dd, HH:mm')}</p>
            </div>
            {event.event.modifiers && event.event.modifiers.length > 0 && (
                <div className="mt-2">
                    {event.event.modifiers.map(modifier => (
                        <span
                            key={modifier}
                            className="inline-block bg-primary/10 text-primary text-xs rounded-full px-2 py-1 mr-1"
                        >
                            {modifier}
                        </span>
                    ))}
                </div>
            )}
        </motion.div>
    );
};
