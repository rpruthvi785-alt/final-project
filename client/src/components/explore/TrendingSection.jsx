import { motion } from 'framer-motion';
import EventCard from '../events/EventCard';

const TrendingSection = ({ events }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  return (
    <section className="py-12">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Trending <span className="gradient-text">Now</span>
          </h2>
          <p className="text-slate-500 font-medium">Most popular activities this week</p>
        </div>
        <button className="text-primary-600 font-bold hover:underline">View all</button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="flex overflow-x-auto hide-scrollbar gap-6 pb-6"
      >
        {events.map((event) => (
          <div key={event._id} className="min-w-[320px] max-w-[320px]">
            <EventCard event={event} />
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default TrendingSection;
