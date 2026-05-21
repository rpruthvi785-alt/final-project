import { useEffect, useState } from 'react';
import { getUserBookings, cancelBooking } from '../api/endpoints';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Ticket, Calendar, MapPin, XCircle, ChevronRight, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getUserBookings()
      .then(res => setBookings(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this expedition?')) {
      try {
        await cancelBooking(id);
        toast.success('Expedition cancelled');
        load();
      } catch (err) { toast.error('Cancellation failed'); }
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="text-5xl">✈️</motion.div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen pt-40 pb-40 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20">
          <div className="flex items-center space-x-2 text-primary-ocean font-black uppercase tracking-[0.3em] text-[10px] mb-4">
            <Ticket className="w-4 h-4" />
            <span>Personal Logbook</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">Your <span className="text-primary-ocean italic">Passports.</span></h1>
          <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
            Every booking is a new story. View your upcoming expeditions, managed tickets, 
            and past journeys here.
          </p>
        </header>
        
        {bookings.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {bookings.map((booking, i) => (
              <motion.div 
                key={booking._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group bg-slate-900 rounded-[3.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
              >
                {/* Ticket Body */}
                <div className="p-10 flex-grow border-b md:border-b-0 md:border-r border-dashed border-white/10 relative">
                  {/* Notch Effects */}
                  <div className="hidden md:block absolute top-1/2 right-0 w-8 h-8 bg-white rounded-full translate-x-1/2 -translate-y-1/2"></div>
                  
                  <div className="flex items-center justify-between mb-8">
                    <span className="px-4 py-2 bg-primary-ocean/20 text-primary-sky rounded-xl text-[10px] font-black uppercase tracking-widest border border-primary-sky/20">
                      {booking.event?.category?.categoryName || 'Expedition'}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${booking.status === 'confirmed' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {booking.status}
                    </span>
                  </div>

                  <h3 className="text-3xl font-black text-white mb-4 line-clamp-1">{booking.event?.eventTitle}</h3>
                  
                  <div className="flex flex-col space-y-4 mb-8">
                    <div className="flex items-center space-x-3 text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-bold">{new Date(booking.event?.eventDate).toLocaleDateString('en-US', { dateStyle: 'full' })}</span>
                    </div>
                    <div className="flex items-center space-x-3 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs font-bold">{booking.event?.city}, {booking.event?.country}</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Passes</p>
                      <p className="text-2xl font-black text-white">{booking.tickets}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Fee (Cash)</p>
                      <p className="text-2xl font-black text-white">₹{booking.totalPrice}</p>
                    </div>
                  </div>
                </div>

                {/* QR Section */}
                <div className="p-10 bg-white flex flex-col items-center justify-center min-w-[220px]">
                  <div className="p-4 bg-slate-50 rounded-3xl border border-slate-100 mb-6">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=BOOKING-${booking._id}`} 
                      alt="QR Ticket"
                      className="w-28 h-28 mix-blend-multiply"
                    />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6">Ticket ID: {booking._id.slice(-8).toUpperCase()}</p>
                  
                  <div className="flex flex-col w-full gap-3">
                    <Link 
                      to={`/events/${booking.event?._id}`}
                      className="w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase text-center hover:bg-primary-ocean transition-all"
                    >
                      Trip Info
                    </Link>
                    {booking.status === 'confirmed' && (
                      <button 
                        onClick={() => handleCancel(booking._id)}
                        className="w-full py-3 border border-slate-100 text-red-500 rounded-xl text-[10px] font-black uppercase hover:bg-red-50 transition-all"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-slate-50 rounded-[4rem] border-2 border-dashed border-slate-200">
            <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Compass className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-4xl font-black text-dark-slate mb-6">Your logbook is empty</h3>
            <p className="text-slate-400 font-medium mb-10 max-w-sm mx-auto leading-relaxed">
              It looks like you haven't booked any expeditions yet. Start your journey today!
            </p>
            <Link to="/explore" className="btn-travel bg-primary-ocean text-white inline-flex items-center space-x-3">
              <span>Start Exploring</span>
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
