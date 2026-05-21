import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents, getCategories } from '../api/endpoints';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, MapPin, Star, Calendar, Users, Globe, Shield, Compass, Wallet, Clock, Bus, Home as HomeIcon, Utensils, Mountain } from 'lucide-react';
import toast from 'react-hot-toast';

const DIFFICULTY_COLORS = {
  Easy: 'bg-emerald-500/20 text-emerald-400',
  Moderate: 'bg-amber-500/20 text-amber-400',
  Hard: 'bg-orange-500/20 text-orange-400',
  Extreme: 'bg-red-500/20 text-red-400',
};

export default function Home() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getEvents(), getCategories()])
      .then(([eventRes, catRes]) => {
        const evData = eventRes.data?.data || [];
        setEvents(evData);
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data?.data || []);
      })
      .catch((err) => {
        console.error('Home sync failed:', err);
        setError(true);
        toast.error('Sync failed. Reconnecting to satellite...');
      })
      .finally(() => setLoading(false));
  }, []);

  const featuredEvents = events?.slice(0, 18) || [];

  const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80';

  const formatBudget = (val) => {
    if (!val) return '0';
    if (val >= 1000) return `${(val / 1000).toFixed(val % 1000 === 0 ? 0 : 1)}k`;
    return val.toString();
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0 bg-dark-slate">
          <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=2000&q=80" 
            className="w-full h-full object-cover opacity-60" alt="Hero"
            onError={(e) => { e.target.src = FALLBACK_IMAGE }} />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-slate/60 via-dark-slate/40 to-white"></div>
        </motion.div>
        <motion.div style={{ opacity }} className="relative z-10 max-w-7xl mx-auto px-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center space-x-2 text-primary-ocean font-black uppercase tracking-[0.5em] text-[10px] mb-8">
            <Globe className="w-4 h-4" /><span>Redefining Modern Travel</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-7xl md:text-9xl font-black text-dark-slate tracking-tighter mb-10 leading-none">
            Explore the <br /> <span className="text-primary-ocean italic">Unexplored.</span>
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6">
            <Link to="/explore" className="btn-travel bg-dark-slate text-white px-12 py-6 text-sm">Start Your Expedition</Link>
            <Link to="/community" className="btn-travel bg-white text-dark-slate border border-slate-100 px-12 py-6 text-sm hover:bg-slate-50">Expedition Community</Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Categories */}
      <section className="py-40 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <div>
              <h2 className="text-5xl font-black text-dark-slate tracking-tight">Curated <span className="text-primary-ocean italic">Categories.</span></h2>
              <p className="mt-4 text-slate-500 font-medium">Choose your preferred style of exploration.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((cat, i) => (
              <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group relative h-[450px] rounded-[3rem] overflow-hidden cursor-pointer">
                <img src={cat.categoryBannerImage || FALLBACK_IMAGE} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={cat.categoryName}
                  onError={(e) => { e.target.src = FALLBACK_IMAGE }} />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-slate/90 via-dark-slate/20 to-transparent"></div>
                <div className="absolute bottom-10 left-10 right-10">
                  <h3 className="text-2xl font-black text-white mb-2">{cat.categoryName}</h3>
                  <Link to={`/explore?category=${cat._id}`} className="text-[10px] font-black uppercase tracking-widest text-primary-sky opacity-0 group-hover:opacity-100 transition-opacity">Explore Category →</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Expeditions */}
      <section className="py-40 bg-slate-50 px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-20">
            <h2 className="text-5xl font-black text-dark-slate tracking-tight">Upcoming <span className="text-primary-ocean italic">Expeditions.</span></h2>
            <Link to="/explore" className="flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-primary-ocean group">
              <span>View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {loading ? (
              [1,2,3].map(n => <div key={n} className="h-[600px] rounded-[3.5rem] bg-slate-100 animate-pulse" />)
            ) : featuredEvents.map((e, i) => (
              <motion.div key={e._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group bg-white rounded-[3.5rem] overflow-hidden hover:shadow-2xl transition-all duration-500 border border-slate-100">
                <div className="h-[400px] relative overflow-hidden m-4 rounded-[2.5rem]">
                  {/* Main Event Image */}
                  <img 
                    src={e.eventBanner || FALLBACK_IMAGE} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={e.eventTitle}
                    onError={(ev) => { ev.target.src = FALLBACK_IMAGE }} 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-slate/80 to-transparent"></div>
                  
                  {/* Top badges */}
                  <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
                    <span className="glass px-4 py-2 rounded-xl text-[10px] font-black text-white uppercase tracking-widest border-white/20">
                      {e.category?.categoryName || 'Adventure'}
                    </span>
                    {e.difficulty && (
                      <span className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${DIFFICULTY_COLORS[e.difficulty]}`}>
                        {e.difficulty}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-8 left-8 right-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-primary-sky">
                        <MapPin className="w-3 h-3" /><span>{e.city}, {e.country}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest text-emerald-400">
                        <Wallet className="w-3 h-3" /><span>₹{formatBudget(e.estimatedTravelBudget)}</span>
                      </div>
                    </div>
                    <h3 className="text-3xl font-black mb-2 line-clamp-1 group-hover:text-primary-sky transition-colors">{e.eventTitle}</h3>
                    {e.duration && (
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/70 mt-2">
                        <Clock className="w-3 h-3" /><span>{e.duration}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="p-10 pt-4 flex flex-col h-full">
                  <p className="text-slate-500 font-medium line-clamp-2 mb-6 leading-relaxed">{e.eventDescription}</p>
                  
                  {/* Expenditure mini chips */}
                  {e.expenditure && (
                    <div className="flex flex-wrap gap-2 mb-6">
                      {e.expenditure.transport > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-bold">
                          <Bus className="w-2.5 h-2.5" /> ₹{formatBudget(e.expenditure.transport)}
                        </span>
                      )}
                      {e.expenditure.accommodation > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-[9px] font-bold">
                          <HomeIcon className="w-2.5 h-2.5" /> ₹{formatBudget(e.expenditure.accommodation)}
                        </span>
                      )}
                      {e.expenditure.food > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-600 rounded-lg text-[9px] font-bold">
                          <Utensils className="w-2.5 h-2.5" /> ₹{formatBudget(e.expenditure.food)}
                        </span>
                      )}
                    </div>
                  )}

                  <Link to={`/events/${e._id}`}
                    className="w-full py-5 bg-slate-50 rounded-2xl flex items-center justify-center space-x-3 text-[10px] font-black uppercase tracking-widest text-dark-slate hover:bg-dark-slate hover:text-white transition-all group/btn">
                    <span>View Plan</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global Features */}
      <section className="py-40 bg-dark-slate text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { icon: <Shield className="w-10 h-10 text-primary-sky" />, title: 'Safe Expeditions', desc: 'Every trip is vetted by our safety experts and local guides.' },
              { icon: <Users className="w-10 h-10 text-primary-sky" />, title: 'Community Driven', desc: 'Join a global network of explorers and share your expedition logs.' },
              { icon: <Star className="w-10 h-10 text-primary-sky" />, title: 'Premium Curation', desc: 'Only the most immersive and unique travel experiences make the list.' }
            ].map((f, i) => (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-8">{f.icon}</div>
                <h4 className="text-xl font-black mb-4">{f.title}</h4>
                <p className="text-slate-400 font-medium text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
