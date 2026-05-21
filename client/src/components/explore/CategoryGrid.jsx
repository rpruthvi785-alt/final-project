import { motion } from 'framer-motion';

const categories = [
  { id: 'music', name: 'Music', img: 'https://images.unsplash.com/photo-1514525253361-bee0483307a0', color: 'from-purple-600/80' },
  { id: 'bike', name: 'Bike Ride', img: 'https://images.unsplash.com/photo-1444491741275-3747c53c99b4', color: 'from-blue-600/80' },
  { id: 'painting', name: 'Art', img: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b', color: 'from-pink-600/80' },
  { id: 'photography', name: 'Photo', img: 'https://images.unsplash.com/photo-1452784444945-3f422708fe5e', color: 'from-orange-600/80' },
  { id: 'food', name: 'Food', img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836', color: 'from-red-600/80' },
  { id: 'sports', name: 'Sports', img: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211', color: 'from-green-600/80' },
  { id: 'gaming', name: 'Gaming', img: 'https://images.unsplash.com/photo-1542751371-adc38448a05e', color: 'from-indigo-600/80' },
  { id: 'wellness', name: 'Wellness', img: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773', color: 'from-cyan-600/80' },
];

const CategoryGrid = ({ onSelect }) => {
  return (
    <section className="py-12">
      <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-8">
        Browse by <span className="gradient-text">Category</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <motion.div
            key={cat.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(cat.id)}
            className="relative h-48 rounded-3xl overflow-hidden cursor-pointer group shadow-lg"
          >
            <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-transparent opacity-80 group-hover:opacity-90 transition-opacity`} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-xl font-black uppercase tracking-widest">{cat.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
