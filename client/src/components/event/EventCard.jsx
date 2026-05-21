import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-slate-100 dark:border-slate-700 flex flex-col h-full"
    >
      <div className="relative h-48 w-full overflow-hidden">
        {event.eventBanner ? (
          <img 
            src={event.eventBanner} 
            alt={event.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
            <span className="text-4xl">📅</span>
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-md shadow-sm text-center">
          <p className="text-xs font-bold text-red-500 uppercase">
            {(() => {
              try { return format(new Date(event.eventDate || event.date), 'MMM'); }
              catch(e) { return '---'; }
            })()}
          </p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white leading-none">
            {(() => {
              try { return format(new Date(event.eventDate || event.date), 'dd'); }
              catch(e) { return '--'; }
            })()}
          </p>
        </div>
      </div>
      
      <div className="p-5 flex-grow flex flex-col">
        <p className="text-xs font-semibold text-primary-500 uppercase tracking-wider mb-1">{event.category}</p>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-slate-500 text-sm mb-4 line-clamp-1 flex items-center">
          <span className="mr-2">📍</span>
          {event.eventType === 'online' ? 'Online Event' : event.location?.city || event.location?.address}
        </p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {event.attendees?.length || 0} attending
          </div>
          <Link 
            to={`/events/${event._id}`}
            className="text-primary-600 dark:text-primary-400 text-sm font-bold hover:underline"
          >
            RSVP Now &rarr;
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
