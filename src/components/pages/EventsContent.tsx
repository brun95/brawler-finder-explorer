
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { NavBar } from "@/components/NavBar";
import { EventCard } from "@/components/events/EventCard";
import { fetchEvents } from "@/api";
import { AdBanner } from "@/components/ads/AdBanner";
import { useLanguage } from "@/hooks/useLanguage";

const Events = () => {
    const { t } = useLanguage();
    const { data: events, isLoading } = useQuery({
        queryKey: ["events"],
        queryFn: fetchEvents
    });

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 dark:bg-gray-900">
                <NavBar />
                <div className="pt-24 text-center dark:text-gray-200">{t.common.loading}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 dark:bg-gray-900">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold text-gray-100 mb-8"
                >
                    {t.events.title}
                </motion.h1>
                
                <AdBanner slot="events-top" />
                
                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-semibold text-gray-100 mb-6">
                            {t.events.activeTitle}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events?.active?.map((event: any) => (
                                <EventCard 
                                    key={`${event.map.gameMode.scId}-${event.startTime}`} 
                                    event={event}
                                    type="active"
                                />
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold text-gray-100 mb-6">
                            {t.events.upcomingTitle}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events?.upcoming?.map((event: any) => (
                                <EventCard 
                                    key={`${event.map.gameMode.scId}-${event.startTime}`} 
                                    event={event}
                                    type="upcoming"
                                />
                            ))}
                        </div>
                    </section>
                </div>
                
                <AdBanner slot="events-bottom" />
            </main>
        </div>
    );
};

export default Events;
