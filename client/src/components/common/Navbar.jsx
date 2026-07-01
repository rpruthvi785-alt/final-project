import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] px-6 py-4">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="max-w-7xl mx-auto glass rounded-[2rem] px-8 py-4 flex items-center justify-between"
      >
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-primary-ocean rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-primary-ocean/30 group-hover:rotate-12 transition-transform">
            ✈️
          </div>
          <span className="text-2xl font-black tracking-tighter text-dark-slate">
            Travel<span className="text-primary-ocean">Tracker</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center space-x-10">
          <Link to="/" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-primary-ocean transition-colors">Home</Link>
          <Link to="/explore" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-primary-ocean transition-colors">Expeditions</Link>
          {user && (
            <>
              <Link to="/bookings" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-primary-ocean transition-colors">My Trips</Link>
              <Link to="/community" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-primary-ocean transition-colors">Community</Link>
              <Link to="/reviews" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-primary-ocean transition-colors">Reviews</Link>
              <Link to="/profile" className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-primary-ocean transition-colors">Profile</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="text-sm font-black uppercase tracking-widest text-indigo-500 hover:text-indigo-400 transition-colors">Admin</Link>
              )}
            </>
          )}
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-xs font-black text-dark-slate uppercase">{user.name}</p>
                <p className="text-[10px] font-bold text-primary-ocean uppercase">Master Explorer</p>
              </div>
              <button onClick={logout} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all">
                👋
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-dark-slate transition-colors">Sign In</Link>
              <Link to="/signup" className="bg-primary-ocean text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary-ocean/20 hover:scale-105 transition-transform">Join Club</Link>
            </div>
          )}
          
          <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden w-10 h-10 flex flex-col items-center justify-center space-y-1">
            <span className={`w-6 h-0.5 bg-dark-slate transition-all ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-dark-slate transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-dark-slate transition-all ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden mt-4 glass rounded-[2.5rem] p-8 space-y-6 flex flex-col items-center shadow-2xl"
          >
            <Link onClick={() => setIsOpen(false)} to="/" className="text-xl font-black text-dark-slate">Home</Link>
            <Link onClick={() => setIsOpen(false)} to="/explore" className="text-xl font-black text-dark-slate">Expeditions</Link>
            {user && (
              <>
                <Link onClick={() => setIsOpen(false)} to="/bookings" className="text-xl font-black text-dark-slate">Logbook</Link>
                <Link onClick={() => setIsOpen(false)} to="/profile" className="text-xl font-black text-dark-slate">Passport</Link>
                {user.role === 'admin' && (
                  <Link onClick={() => setIsOpen(false)} to="/admin" className="text-xl font-black text-indigo-500">Admin</Link>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
