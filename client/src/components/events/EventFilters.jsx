import { motion } from 'framer-motion';

const categories = [
  { id: 'all', name: 'All', icon: '🌟' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'bike', name: 'Bike', icon: '🏍️' },
  { id: 'painting', name: 'Painting', icon: '🎨' },
  { id: 'photography', name: 'Photo', icon: '📸' },
  { id: 'food', name: 'Food', icon: '🍕' },
  { id: 'sports', name: 'Sports', icon: '⚽' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'wellness', name: 'Wellness', icon: '🧘' },
];

const EventFilters = ({ selectedCategory, onSelectCategory }) => {
  return (
    <div className="flex overflow-x-auto hide-scrollbar gap-4 py-6 px-2">
      {categories.map((cat) => (
        <motion.button
          key={cat.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectCategory(cat.id === 'all' ? null : cat.id)}
          className={`flex flex-col items-center justify-center min-w-[80px] p-4 rounded-2xl transition-all ${
            (selectedCategory === cat.id || (cat.id === 'all' && !selectedCategory))
              ? 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 border-primary-600'
              : 'bg-white dark:bg-dark-card text-slate-600 dark:text-slate-400 border border-slate-100 dark:border-dark-border hover:border-primary-400'
          }`}
        >
          <span className="text-2xl mb-2">{cat.icon}</span>
          <span className="text-xs font-bold uppercase tracking-widest">{cat.name}</span>
        </motion.button>
      ))}
    </div>
  );
};

export default EventFilters;
