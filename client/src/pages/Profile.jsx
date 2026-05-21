import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../api/endpoints';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Globe, Award, Compass, Heart, Settings, Camera, Grid, List, Shield, Zap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('achievements');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    interests: user?.interests?.join(', ') || ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { 
        ...formData, 
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i) 
      };
      const res = await updateProfile(data);
      setUser(res.data);
      toast.success('Expedition Log Updated!');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white min-h-screen pt-40 pb-40 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Profile Hero Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Sidebar / Photo */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-dark-slate rounded-[4rem] p-10 text-white shadow-2xl relative overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary-ocean/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-48 h-48 mx-auto rounded-[3.5rem] bg-white p-2 shadow-2xl mb-8 group cursor-pointer relative">
                  <img 
                    src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.name}&background=random&size=200`} 
                    className="w-full h-full rounded-[3rem] object-cover" 
                    alt="Profile"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-[3rem] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h1 className="text-4xl font-black mb-2">{user?.name}</h1>
                <div className="flex items-center justify-center space-x-2 text-primary-sky font-black uppercase tracking-widest text-[10px] mb-8">
                  <Shield className="w-4 h-4" />
                  <span>Legendary Explorer</span>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                    <p className="text-xl font-black">12</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Countries</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                    <p className="text-xl font-black">45</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Trips</p>
                  </div>
                  <div className="bg-white/5 p-4 rounded-3xl border border-white/10">
                    <p className="text-xl font-black">8.2k</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">XP</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <button className="w-full py-4 bg-primary-ocean rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-3 group">
                    <span>View Map</span>
                    <Globe className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                  </button>
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs">
                    Public Portfolio
                  </button>
                  {user?.role === 'admin' && (
                    <button onClick={() => window.location.href = '/admin'} className="w-full py-4 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-indigo-500 hover:text-white transition-all">
                      Control Center
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main Profile Info */}
          <div className="lg:col-span-8">
            <div className="flex space-x-8 border-b border-slate-100 mb-12">
              {[
                { id: 'achievements', label: 'Achievements', icon: Award },
                { id: 'settings', label: 'Expedition Log', icon: List },
                { id: 'moments', label: 'My Moments', icon: Grid }
              ].map(tab => (
                <button 
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-6 flex items-center space-x-3 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-primary-ocean' : 'text-slate-400'}`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {activeTab === tab.id && <motion.div layoutId="profileTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-ocean rounded-full" />}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'settings' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-12"
                >
                  <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-4">Full Explorer Name</label>
                        <input 
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-5 font-black text-dark-slate focus:ring-4 ring-primary-ocean/10 transition-all"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-4">Current Base (Location)</label>
                        <input 
                          placeholder="e.g. Himalayas, India"
                          value={formData.location}
                          onChange={e => setFormData({...formData, location: e.target.value})}
                          className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-5 font-black text-dark-slate focus:ring-4 ring-primary-ocean/10 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-4">Travel Philosophy & Bio</label>
                      <textarea 
                        rows="5"
                        placeholder="Share your travel philosophy with the world..."
                        value={formData.bio}
                        onChange={e => setFormData({...formData, bio: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-[2.5rem] px-8 py-6 font-medium text-slate-600 focus:ring-4 ring-primary-ocean/10 transition-all leading-relaxed"
                      />
                    </div>

                    <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block ml-4">Travel Archetypes (Interests)</label>
                      <input 
                        placeholder="Backpacker, Luxury, Solo, Photography..."
                        value={formData.interests}
                        onChange={e => setFormData({...formData, interests: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-[2rem] px-8 py-5 font-black text-dark-slate focus:ring-4 ring-primary-ocean/10 transition-all"
                      />
                    </div>

                    <button 
                      disabled={loading}
                      className="btn-travel bg-dark-slate text-white hover:bg-primary-ocean flex items-center space-x-4"
                    >
                      <span>Update Logbook</span>
                      {loading ? <Zap className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    </button>
                  </form>
                </motion.div>
              ) : activeTab === 'achievements' ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {[
                    { title: 'Mountain Goat', icon: '🏔️', color: 'bg-blue-50 text-blue-600' },
                    { title: 'Coast Rider', icon: '🌊', color: 'bg-cyan-50 text-cyan-600' },
                    { title: 'City Slicker', icon: '🏙️', color: 'bg-slate-50 text-slate-600' },
                    { title: 'Community Hero', icon: '🤝', color: 'bg-orange-50 text-orange-600' },
                    { title: 'Wild Heart', icon: '🐅', color: 'bg-emerald-50 text-emerald-600' },
                    { title: 'Star Gazer', icon: '✨', color: 'bg-indigo-50 text-indigo-600' }
                  ].map((badge, i) => (
                    <div key={i} className="p-8 rounded-[3rem] border border-slate-100 flex flex-col items-center text-center group hover:border-primary-ocean transition-colors cursor-default">
                      <span className="text-5xl mb-4 group-hover:scale-125 transition-transform">{badge.icon}</span>
                      <h4 className="text-sm font-black text-dark-slate mb-1">{badge.title}</h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Achieved 2024</p>
                    </div>
                  ))}
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {[1,2,3,4].map(n => (
                    <div key={n} className="h-64 rounded-[3rem] overflow-hidden group relative">
                      <img src={`https://images.unsplash.com/photo-${1500530855697 + n}-b586d89ba3ee`} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="Moment" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Heart className="w-8 h-8 text-white fill-current" />
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
