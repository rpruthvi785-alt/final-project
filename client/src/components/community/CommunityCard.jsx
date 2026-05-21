import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const CommunityCard = ({ community }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group cursor-pointer flex flex-col h-full"
    >
      <div className="relative h-40 w-full overflow-hidden">
        {community.bannerImage ? (
          <img 
            src={community.bannerImage} 
            alt={community.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full gradient-bg flex items-center justify-center">
            <span className="text-4xl">🚀</span>
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 dark:text-primary-400">
          {community.category}
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
          {community.name}
        </h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2 flex-grow">
          {community.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex -space-x-2">
            {/* Mock avatars for members */}
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800" />
            ))}
            <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium text-slate-500">
              +{community.members?.length || 0}
            </div>
          </div>
          
          <Link 
            to={`/communities/${community._id}`}
            className="px-4 py-2 bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors"
          >
            Explore
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityCard;
