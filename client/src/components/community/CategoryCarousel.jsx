import { useRef } from 'react';
import { motion } from 'framer-motion';

const categories = [
  { name: 'Bike Rides', icon: '🏍️' },
  { name: 'Music Jams', icon: '🎸' },
  { name: 'Live Band Meetups', icon: '🎤' },
  { name: 'Singing Sessions', icon: '🎶' },
  { name: 'Guitar Circles', icon: '🪕' },
  { name: 'DJ Nights', icon: '🎧' },
  { name: 'Painting Workshops', icon: '🎨' },
  { name: 'Sketching Clubs', icon: '✏️' },
  { name: 'Photography Walks', icon: '📸' },
  { name: 'Trekking Groups', icon: '🥾' },
  { name: 'Weekend Trips', icon: '🚗' },
  { name: 'Cafe Meetups', icon: '☕' },
  { name: 'Food Exploration', icon: '🍕' },
  { name: 'Gaming Communities', icon: '🎮' },
  { name: 'Football Matches', icon: '⚽' },
  { name: 'Cricket Groups', icon: '🏏' },
  { name: 'Gym Buddies', icon: '🏋️' },
  { name: 'Yoga Sessions', icon: '🧘' },
  { name: 'Dance Workshops', icon: '💃' },
  { name: 'Movie Nights', icon: '🍿' },
  { name: 'Coding Communities', icon: '💻' },
  { name: 'Startup Networking', icon: '🚀' },
  { name: 'Study Groups', icon: '📚' },
  { name: 'Book Reading Clubs', icon: '📖' },
  { name: 'Language Exchange', icon: '🗣️' },
  { name: 'Volunteering Events', icon: '🤝' },
  { name: 'Animal Rescue Communities', icon: '🐾' },
  { name: 'Meditation Groups', icon: '🕉️' },
  { name: 'Travel Buddies', icon: '✈️' },
  { name: 'Adventure Sports', icon: '🧗' },
];

const CategoryCarousel = ({ onSelectCategory }) => {
  const carouselRef = useRef(null);

  const scrollLeft = () => {
    carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  const scrollRight = () => {
    carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
  };

  return (
    <div className="relative group w-full py-4">
      <button 
        onClick={scrollLeft}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-full shadow-md text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        &#8592;
      </button>

      <div 
        ref={carouselRef}
        className="flex overflow-x-auto hide-scrollbar gap-4 px-4 scroll-smooth"
      >
        {categories.map((category) => (
          <motion.div
            key={category.name}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory && onSelectCategory(category.name)}
            className="flex-shrink-0 flex flex-col items-center justify-center p-4 bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-slate-100 dark:border-dark-border cursor-pointer min-w-[120px] hover:border-primary-500 hover:shadow-md transition-all group/item"
          >
            <span className="text-3xl mb-2 group-hover/item:scale-110 transition-transform">{category.icon}</span>
            <span className="text-xs font-semibold text-center text-slate-700 dark:text-slate-300">{category.name}</span>
          </motion.div>
        ))}
      </div>

      <button 
        onClick={scrollRight}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-2 rounded-full shadow-md text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        &#8594;
      </button>
    </div>
  );
};

export default CategoryCarousel;
