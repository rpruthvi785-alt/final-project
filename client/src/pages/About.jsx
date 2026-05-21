import { motion } from 'framer-motion';
import { FiTarget, FiHeart, FiGlobe } from 'react-icons/fi';

const About = () => {
  return (
    <div className="bg-white dark:bg-dark-bg min-h-screen pt-20 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6"
          >
            Our Mission is to <span className="text-primary-600">Connect the World</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            Travel Trackers was built with a simple goal: to reduce loneliness by bringing people together through shared experiences, activities, and travel.
          </motion.p>
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1528605248644-14dd04022da1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Community hiking together" 
              className="w-full h-[400px] object-cover"
            />
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">The Story Behind Travel Trackers</h2>
            <p className="text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
              In an increasingly digital world, genuine human connection has become rarer. We noticed that while we are more "connected" than ever online, many people feel isolated in their day-to-day lives.
            </p>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
              We created Travel Trackers to bridge the gap between online networking and real-world interaction. Whether it's a local photography walk, a weekend trekking trip, or a casual food meetup, we believe that shared activities are the best way to build meaningful friendships.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center text-primary-600 font-bold text-xl">
                TT
              </div>
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">The Founding Team</p>
                <p className="text-sm text-slate-500">Built with passion for community</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Core Values */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Our Core Values</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <motion.div 
            whileHover={{ y: -10 }}
            className="card p-8 text-center"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiTarget className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Purpose Driven</h3>
            <p className="text-slate-600 dark:text-slate-400">Everything we build is focused on our core mission: facilitating real-world connections.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="card p-8 text-center"
          >
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiHeart className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Inclusivity</h3>
            <p className="text-slate-600 dark:text-slate-400">We welcome everyone. Our community thrives on diversity of backgrounds, ages, and interests.</p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -10 }}
            className="card p-8 text-center"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiGlobe className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Exploration</h3>
            <p className="text-slate-600 dark:text-slate-400">We believe that stepping out of your comfort zone and exploring new places leads to personal growth.</p>
          </motion.div>
        </div>

      </div>
    </div>
  );
};

export default About;
