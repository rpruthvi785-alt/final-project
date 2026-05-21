import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const { data } = await api.get('/events');
        // Filter events where I am the creator (Event schema uses createdBy)
        const uid = user?._id?.toString();
        const filtered = data.data.filter(event =>
          event.createdBy?._id?.toString() === uid ||
          event.createdBy?.toString() === uid
        );
        setMyEvents(filtered);
      } catch (error) {
        toast.error('Failed to load your events');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchMyEvents();
  }, [user]);

  if (loading) return <div className="p-8 text-center font-bold">Loading Dashboard...</div>;

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">Organizer Hub</h1>
          <p className="text-slate-500">Manage your events and connect with your audience.</p>
        </div>
        <Link to="/create-event" className="btn-primary px-6 py-3 shadow-lg shadow-primary-500/30 flex items-center gap-2">
          <span className="text-xl">+</span> Create New Event
        </Link>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-primary-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
          <p className="text-primary-100 font-bold text-xs uppercase mb-1">Total Hosted</p>
          <p className="text-4xl font-black">{myEvents.length}</p>
          <div className="mt-4 flex items-center gap-2 text-xs font-bold bg-white/20 w-fit px-2 py-1 rounded-full">
            <span>📈 +12% this month</span>
          </div>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border">
          <p className="text-slate-500 font-bold text-xs uppercase mb-1">Total Attendees</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white">
            {myEvents.reduce((acc, curr) => acc + (curr.likes?.length || 0), 0)}
          </p>
        </div>
        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border">
          <p className="text-slate-500 font-bold text-xs uppercase mb-1">Avg. Rating</p>
          <p className="text-4xl font-black text-slate-900 dark:text-white">4.8</p>
          <p className="text-xs text-yellow-500 font-bold mt-2">⭐⭐⭐⭐⭐ (24 reviews)</p>
        </div>
      </div>

      {/* Events List */}
      <div className="bg-white dark:bg-dark-card rounded-3xl shadow-sm border border-slate-100 dark:border-dark-border overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-dark-border">
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">My Managed Events</h2>
        </div>
        
        <div className="grid grid-cols-1 divide-y divide-slate-50 dark:divide-slate-800">
          {myEvents.map((event) => (
            <div key={event._id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
              <div className="flex items-center gap-6 flex-1">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                  <img src={event.eventBanner || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=400&q=80"} className="w-full h-full object-cover" alt="" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                      event.visibilityStatus === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {event.visibilityStatus?.replace('_', ' ') || 'Pending'}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-primary-100 text-primary-700">
                      {event.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{event.eventTitle || event.title}</h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1">
                    <span>📅</span> {event.eventDate ? format(new Date(event.eventDate), 'MMMM dd, yyyy') : 'Date TBD'} • {event.startTime || ''}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="text-center">
                  <p className="text-xs font-bold text-slate-400 uppercase">Attendees</p>
                  <p className="text-xl font-black text-slate-900 dark:text-white">{event.likes?.length || 0}</p>
                </div>
                <div className="flex gap-2">
                  <Link to={`/events/${event._id}`} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all" title="View Event">
                    👁️
                  </Link>
                  <button className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 transition-all" title="Edit Event">
                    ✏️
                  </button>
                  <button className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-all" title="Delete Event">
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
          {myEvents.length === 0 && (
            <div className="p-20 text-center">
              <div className="text-6xl mb-4">✨</div>
              <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-300">Start your journey!</h3>
              <p className="text-slate-500 mt-2">You haven't created any events yet. Click the button above to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
