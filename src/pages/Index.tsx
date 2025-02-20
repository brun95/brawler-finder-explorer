
import { NavBar } from "@/components/NavBar";
import { HeroSection } from "@/components/HeroSection";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="pt-16">
        <HeroSection />
        
        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Brawlers</h2>
            <p className="text-gray-600">Discover the latest and most popular brawlers</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Featured brawler cards will be added here */}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
