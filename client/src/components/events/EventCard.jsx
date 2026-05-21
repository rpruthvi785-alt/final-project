import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const EventCard = ({ event }) => {
  const {
    _id,
    // Support both Event model field names (eventTitle) and legacy preview names (title)
    eventTitle,
    title,
    category,
    eventDescription,
    description,
    eventBanner,
    bannerImage,
    eventDate,
    likes = [],
    availableSeats = 0,
    city,
    eventStatus,
  } = event;

  const displayTitle       = eventTitle || title || 'Untitled Event';
  const displayImage       = eventBanner || bannerImage || '';
  const displayDescription = eventDescription || description || '';

  const cardVariants = {
    rest: { scale: 1, y: 0 },
    hover: { scale: 1.02, y: -5, transition: { duration: 0.3 } }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      className="relative group h-[400px] w-full rounded-3xl overflow-hidden shadow-xl"
    >
      {/* Background Image */}
      <img
        src={displayImage || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80"}
        alt={displayTitle}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />

      {/* Glass Card Overlay */}
      <div className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 text-white">

        {/* Category Badge */}
        {(category || city) && (
          <div className="absolute -top-3 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
            {city || (typeof category === 'object' ? category?.categoryName : category)}
          </div>
        )}

        {/* Status Badge */}
        {eventStatus && eventStatus !== 'Upcoming' && (
          <div className={`absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg
            ${eventStatus === 'Ongoing' ? 'bg-green-500 text-white' :
              eventStatus === 'Completed' ? 'bg-slate-500 text-white' :
              eventStatus === 'Cancelled' ? 'bg-red-500 text-white' : ''}`}>
            {eventStatus}
          </div>
        )}

        {/* Event Info */}
        <h3 className="text-xl font-bold mb-1 line-clamp-1">{displayTitle}</h3>
        <p className="text-slate-200 text-xs mb-4 line-clamp-2">{displayDescription}</p>

        {/* Meta Info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-xs font-medium text-slate-200">
            <span className="mr-2">📅</span>
            {(() => {
              try {
                return eventDate ? format(new Date(eventDate), 'MMM dd, h:mm a') : 'Date TBD';
              } catch (e) {
                return 'Date TBD';
              }
            })()}
          </div>
          <div className="flex items-center text-xs font-medium text-slate-200">
            <span className="mr-2">❤️</span>
            {likes.length} {availableSeats > 0 ? `/ ${availableSeats} seats` : 'likes'}
          </div>
        </div>

        {/* Like Avatars */}
        {likes.length > 0 && (
          <div className="flex items-center mb-5">
            <div className="flex -space-x-2 overflow-hidden">
              {likes.slice(0, 5).map((user, i) => (
                <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white/20 bg-slate-300 overflow-hidden">
                  <img src={(user && user.profileImage) || `https://i.pravatar.cc/100?img=${i+10}`} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
              {likes.length > 5 && (
                <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white/20 bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                  +{likes.length - 5}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-300 ml-3 uppercase font-bold tracking-widest">Interested</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link
            to={`/events/${_id}`}
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-xl text-xs font-bold text-center transition-colors shadow-lg shadow-primary-600/20"
          >
            View Event
          </Link>
          <button className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors">
            ❤️
          </button>
          <button className="bg-white/10 hover:bg-white/20 p-2 rounded-xl transition-colors">
            🔖
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default EventCard;
