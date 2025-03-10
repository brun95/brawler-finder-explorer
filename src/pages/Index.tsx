import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { EventCard } from "@/components/events/EventCard";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { fetchEvents } from "@/api";
import { AdBanner } from "@/components/ads/AdBanner";
import { useLanguage } from "@/hooks/useLanguage";

const Index = () => {
    const { data: events } = useQuery({
        queryKey: ["events"],
        queryFn: fetchEvents
    });
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <NavBar />
            <main className="pt-16">
                <HeroSection />
                
                <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <AdBanner slot="home-top" />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {t.events.title}
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            {t.events.subtitle}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events?.map((event) => (
                            <EventCard key={event.slotId} event={event} />
                        ))}
                    </div>
                    
                    <AdBanner slot="home-bottom" />
                </section>
            </main>
        </div>
    );
};

export default Index;

