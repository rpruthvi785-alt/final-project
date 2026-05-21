import { useEffect, useState } from 'react';
import { getCategories, getEvents, createCategory, deleteCategory, createEvent, deleteEvent, getUsers, deleteUser, blockUser } from '../api/endpoints';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('events');
  const [showForm, setShowForm] = useState(false);
  
  // Category Form State
  const [newCat, setNewCat] = useState({ name: '', desc: '' });
  const [catFiles, setCatFiles] = useState({ banner: null, thumbnail: null });

  // Event Form State
  const [newEvent, setNewEvent] = useState({
    title: '', subtitle: '', desc: '', type: 'In-Person', category: '',
    date: '', startTime: '', endTime: '', venue: '', address: '', city: '', country: '',
    mapLink: '', orgName: '', orgContact: '', orgEmail: '', orgWeb: '',
    price: 0, vipPrice: 0, seats: 0, isFree: false, tags: '',
    duration: '', difficulty: '',
    expTransport: 0, expAccommodation: 0, expFood: 0, expActivities: 0, expPermits: 0, expMisc: 0,
    highlights: '', inclusions: '', exclusions: ''
  });
  const [eventFiles, setEventFiles] = useState({ banner: null, poster: null, thumb: null, gallery: [], orgLogo: null });
  const [speakers, setSpeakers] = useState([{ name: '', designation: '', image: '', twitter: '', linkedin: '' }]);

  const load = () => {
    getCategories().then(res => setCategories(Array.isArray(res.data) ? res.data : res.data?.data || [])).catch(err => console.error(err));
    getEvents().then(res => setEvents(res.data?.data || [])).catch(err => console.error(err));
    getUsers().then(res => setUsers(res.data?.users || [])).catch(err => console.error(err));
  };
  useEffect(load, []);

  const handleAddSpeaker = () => setSpeakers([...speakers, { name: '', designation: '', image: '', twitter: '', linkedin: '' }]);
  
  const handleAddCategory = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('categoryName', newCat.name);
    fd.append('categoryDescription', newCat.desc);
    if (catFiles.banner) fd.append('banner', catFiles.banner);
    if (catFiles.thumbnail) fd.append('thumbnail', catFiles.thumbnail);
    try {
      await createCategory(fd);
      toast.success('Category created!');
      load();
      setShowForm(false);
    } catch (err) { toast.error('Creation failed'); }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    // Basic Info
    fd.append('eventTitle', newEvent.title);
    fd.append('eventSubtitle', newEvent.subtitle);
    fd.append('eventDescription', newEvent.desc);
    fd.append('eventType', newEvent.type);
    fd.append('category', newEvent.category);
    fd.append('eventDate', newEvent.date);
    fd.append('startTime', newEvent.startTime);
    fd.append('endTime', newEvent.endTime);
    fd.append('venue', newEvent.venue);
    fd.append('city', newEvent.city);
    fd.append('country', newEvent.country);
    fd.append('googleMapLink', newEvent.mapLink);
    fd.append('suggestedDonation', newEvent.donation || 0);
    fd.append('estimatedTravelBudget', newEvent.budget || 0);
    fd.append('availableSeats', newEvent.seats);
    fd.append('isFree', newEvent.isFree);
    fd.append('eventTags', newEvent.tags);
    fd.append('duration', newEvent.duration);
    fd.append('difficulty', newEvent.difficulty);
    fd.append('expenditure', JSON.stringify({
      transport: Number(newEvent.expTransport) || 0,
      accommodation: Number(newEvent.expAccommodation) || 0,
      food: Number(newEvent.expFood) || 0,
      activities: Number(newEvent.expActivities) || 0,
      permits: Number(newEvent.expPermits) || 0,
      miscellaneous: Number(newEvent.expMisc) || 0
    }));
    fd.append('highlights', JSON.stringify(newEvent.highlights.split(',').map(s => s.trim()).filter(Boolean)));
    fd.append('inclusions', JSON.stringify(newEvent.inclusions.split(',').map(s => s.trim()).filter(Boolean)));
    fd.append('exclusions', JSON.stringify(newEvent.exclusions.split(',').map(s => s.trim()).filter(Boolean)));
    
    // Complex Data
    fd.append('speakers', JSON.stringify(speakers));
    
    // Files
    if (eventFiles.banner) fd.append('banner', eventFiles.banner);
    if (eventFiles.poster) fd.append('poster', eventFiles.poster);
    if (eventFiles.thumb) fd.append('thumbnail', eventFiles.thumb);
    if (eventFiles.orgLogo) fd.append('organizerLogo', eventFiles.orgLogo);
    eventFiles.gallery.forEach(file => fd.append('gallery', file));

    try {
      await createEvent(fd);
      toast.success('Premium Event Published!');
      load();
      setShowForm(false);
    } catch (err) { toast.error('Failed to publish event'); }
  };

  return (
    <div className="bg-slate-950 min-h-screen text-white p-8 md:p-16 selection:bg-primary-sky/30">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row justify-between items-center mb-24 gap-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4">Expedition <span className="text-primary-ocean italic">Studio</span></h1>
            <div className="flex items-center space-x-3 text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Control Center • Global Grid Active</span>
            </div>
          </motion.div>
          
          <div className="flex items-center gap-6">
            <div className="flex bg-slate-900/50 p-2 rounded-3xl border border-white/5 backdrop-blur-xl">
              <button 
                onClick={() => setActiveTab('events')} 
                className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'events' ? 'bg-primary-ocean text-white shadow-2xl shadow-primary-ocean/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Trips
              </button>
              <button 
                onClick={() => setActiveTab('categories')} 
                className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'categories' ? 'bg-primary-ocean text-white shadow-2xl shadow-primary-ocean/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Atlas
              </button>
              <button 
                onClick={() => setActiveTab('users')} 
                className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-indigo-500 text-white shadow-2xl shadow-indigo-500/20' : 'text-slate-500 hover:text-slate-300'}`}
              >
                Users
              </button>
            </div>
            
            <button 
              onClick={() => setShowForm(true)}
              className="bg-white text-slate-950 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary-sky transition-all shadow-2xl active:scale-95"
            >
              + Launch Trip
            </button>
          </div>
        </header>

        {/* Analytics Mockup */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-24">
          {[
            { label: 'Active Expeditions', val: events.length, icon: '🚀', color: 'text-primary-sky' },
            { label: 'Travel Categories', val: categories.length, icon: '🗺️', color: 'text-accent-sunset' },
            { label: 'Community Impact', val: '₹12.5L', icon: '📈', color: 'text-emerald-500' },
            { label: 'Global Explorers', val: '8.4k', icon: '👥', color: 'text-indigo-400' },
          ].map((stat, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/40 border border-white/5 p-10 rounded-[3.5rem] hover:border-primary-ocean/30 transition-all group"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-4xl grayscale group-hover:grayscale-0 transition-all">{stat.icon}</span>
                <div className={`w-2 h-2 rounded-full ${stat.color} shadow-[0_0_10px_currentcolor]`}></div>
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-2">{stat.label}</p>
              <h4 className="text-5xl font-black tracking-tighter">{stat.val}</h4>
            </motion.div>
          ))}
        </div>

        {/* Content List */}
        <div className="bg-slate-800/30 border border-white/5 rounded-[4rem] overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-800">
              <tr>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Resource</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Details</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</th>
                <th className="p-8 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {activeTab === 'events' ? events.map(e => (
                <tr key={e._id} className="group hover:bg-white/5 transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <img src={e.eventBanner || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80'} 
                        className="w-16 h-12 rounded-xl object-cover shadow-lg" 
                        onError={(ev) => { ev.target.src = 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80' }} />
                      <div>
                        <p className="font-black text-lg">{e.eventTitle}</p>
                        <p className="text-slate-500 text-xs font-bold uppercase">{e.category?.categoryName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-slate-400 font-medium">
                    {new Date(e.eventDate).toLocaleDateString()} • {e.venue}
                  </td>
                  <td className="p-8">
                    <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase">{e.eventStatus}</span>
                  </td>
                  <td className="p-8 text-right">
                    <button onClick={() => deleteEvent(e._id).then(load)} className="text-slate-500 hover:text-red-500 font-black">Delete</button>
                  </td>
                </tr>
              )) : activeTab === 'categories' ? categories.map(c => (
                <tr key={c._id} className="group hover:bg-white/5 transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 bg-primary-600/20 rounded-xl flex items-center justify-center text-2xl">✨</div>
                      <p className="font-black text-lg">{c.categoryName}</p>
                    </div>
                  </td>
                  <td className="p-8 text-slate-400 font-medium line-clamp-1 max-w-xs">{c.categoryDescription}</td>
                  <td className="p-8">
                    <span className="px-3 py-1 bg-primary-500/10 text-primary-500 rounded-lg text-[10px] font-black uppercase">{c.eventCount} Events</span>
                  </td>
                  <td className="p-8 text-right">
                    <button onClick={() => deleteCategory(c._id).then(load)} className="text-slate-500 hover:text-red-500 font-black">Delete</button>
                  </td>
                </tr>
              )) : users.map(u => (
                <tr key={u._id} className="group hover:bg-white/5 transition-colors">
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <img src={u.profileImage || `https://ui-avatars.com/api/?name=${u.name}&background=random`} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                      <div>
                        <p className="font-black text-lg">{u.name}</p>
                        <p className="text-slate-500 text-xs font-bold uppercase">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-8 text-slate-400 font-medium">
                    Role: <span className="text-white capitalize">{u.role}</span>
                  </td>
                  <td className="p-8">
                    {u.isBlocked ? (
                      <span className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-[10px] font-black uppercase">Blocked</span>
                    ) : (
                      <span className="px-3 py-1 bg-green-500/10 text-green-500 rounded-lg text-[10px] font-black uppercase">Active</span>
                    )}
                  </td>
                  <td className="p-8 text-right space-x-4">
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => blockUser(u._id).then(() => { toast.success('Status updated'); load(); })} 
                        className="text-slate-500 hover:text-orange-500 font-black text-xs uppercase tracking-widest"
                      >
                        {u.isBlocked ? 'Unblock' : 'Block'}
                      </button>
                    )}
                    {u.role !== 'admin' && (
                      <button 
                        onClick={() => deleteUser(u._id).then(() => { toast.success('User deleted'); load(); })} 
                        className="text-slate-500 hover:text-red-500 font-black text-xs uppercase tracking-widest"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto"
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-slate-900 border border-white/10 w-full max-w-5xl rounded-[4rem] p-12 relative"
              >
                <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 text-3xl hover:text-primary-500">&times;</button>
                <h2 className="text-4xl font-black mb-12">New <span className="text-primary-600">{activeTab.slice(0, -1)}</span></h2>
                
                {activeTab === 'events' ? (
                  <form onSubmit={handleAddEvent} className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
                    {/* Basic Info */}
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Core Identity</h4>
                      <input placeholder="Event Title" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4" required />
                      <div className="grid grid-cols-2 gap-4">
                        <input 
                          type="number" 
                          placeholder="Booking Fee (Cash) (₹)"
                          value={newEvent.donation} 
                          onChange={e => setNewEvent({ ...newEvent, donation: Number(e.target.value) })} 
                          className="bg-slate-800 border-none rounded-2xl px-4 py-4" 
                        />
                        <input 
                          type="number" 
                          placeholder="Est. Trip Budget (₹)"
                          value={newEvent.budget} 
                          onChange={e => setNewEvent({ ...newEvent, budget: Number(e.target.value) })} 
                          className="bg-slate-800 border-none rounded-2xl px-4 py-4" 
                        />
                      </div>
                      <input 
                        type="number" 
                        placeholder="Available Seats / Slots"
                        value={newEvent.seats} 
                        onChange={e => setNewEvent({ ...newEvent, seats: Number(e.target.value) })} 
                        className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4" 
                        required
                      />
                      <input placeholder="Subtitle (Short Hook)" value={newEvent.subtitle} onChange={e => setNewEvent({...newEvent, subtitle: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4" />
                      <select value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4" required>
                        <option value="">Select Category</option>
                        {categories.map(c => <option key={c._id} value={c._id}>{c.categoryName}</option>)}
                      </select>
                      <textarea placeholder="Full Description" value={newEvent.desc} onChange={e => setNewEvent({...newEvent, desc: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 h-32" />
                      <input placeholder="Duration (e.g. 4 Days / 3 Nights)" value={newEvent.duration} onChange={e => setNewEvent({...newEvent, duration: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4" />
                      <select value={newEvent.difficulty} onChange={e => setNewEvent({...newEvent, difficulty: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4">
                        <option value="">Select Difficulty</option>
                        <option value="Easy">Easy</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Hard">Hard</option>
                        <option value="Extreme">Extreme</option>
                      </select>
                    </div>

                    {/* Expenditure Breakdown */}
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Expenditure Breakdown (₹)</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="number" placeholder="Transport" value={newEvent.expTransport} onChange={e => setNewEvent({...newEvent, expTransport: e.target.value})} className="bg-slate-800 border-none rounded-2xl px-4 py-4" />
                        <input type="number" placeholder="Accommodation" value={newEvent.expAccommodation} onChange={e => setNewEvent({...newEvent, expAccommodation: e.target.value})} className="bg-slate-800 border-none rounded-2xl px-4 py-4" />
                        <input type="number" placeholder="Food" value={newEvent.expFood} onChange={e => setNewEvent({...newEvent, expFood: e.target.value})} className="bg-slate-800 border-none rounded-2xl px-4 py-4" />
                        <input type="number" placeholder="Activities" value={newEvent.expActivities} onChange={e => setNewEvent({...newEvent, expActivities: e.target.value})} className="bg-slate-800 border-none rounded-2xl px-4 py-4" />
                        <input type="number" placeholder="Permits" value={newEvent.expPermits} onChange={e => setNewEvent({...newEvent, expPermits: e.target.value})} className="bg-slate-800 border-none rounded-2xl px-4 py-4" />
                        <input type="number" placeholder="Miscellaneous" value={newEvent.expMisc} onChange={e => setNewEvent({...newEvent, expMisc: e.target.value})} className="bg-slate-800 border-none rounded-2xl px-4 py-4" />
                      </div>
                      <textarea placeholder="Highlights (comma separated)" value={newEvent.highlights} onChange={e => setNewEvent({...newEvent, highlights: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 h-20" />
                      <textarea placeholder="Inclusions (comma separated)" value={newEvent.inclusions} onChange={e => setNewEvent({...newEvent, inclusions: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 h-20" />
                      <textarea placeholder="Exclusions (comma separated)" value={newEvent.exclusions} onChange={e => setNewEvent({...newEvent, exclusions: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 h-20" />
                    </div>

                    {/* Logistics */}
                    <div className="space-y-6">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Logistics & Venue</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <input type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} className="bg-slate-800 border-none rounded-2xl px-4 py-4" required />
                        <input type="time" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} className="bg-slate-800 border-none rounded-2xl px-4 py-4" />
                      </div>
                      <input placeholder="Venue Name" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4" required />
                      <input placeholder="Google Maps Embed Link" value={newEvent.mapLink} onChange={e => setNewEvent({...newEvent, mapLink: e.target.value})} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4" />
                    </div>

                    {/* Speakers */}
                    <div className="md:col-span-2 space-y-6">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Speaker Lineup</h4>
                        <button type="button" onClick={handleAddSpeaker} className="text-primary-500 font-bold">+ Add Speaker</button>
                      </div>
                      {speakers.map((s, i) => (
                        <div key={i} className="grid grid-cols-3 gap-4 bg-slate-800 p-4 rounded-2xl">
                          <input placeholder="Name" value={s.name} onChange={e => {
                            const ns = [...speakers]; ns[i].name = e.target.value; setSpeakers(ns);
                          }} className="bg-slate-900 border-none rounded-xl px-4 py-2" />
                          <input placeholder="Designation" value={s.designation} onChange={e => {
                            const ns = [...speakers]; ns[i].designation = e.target.value; setSpeakers(ns);
                          }} className="bg-slate-900 border-none rounded-xl px-4 py-2" />
                          <input placeholder="Image URL" value={s.image} onChange={e => {
                            const ns = [...speakers]; ns[i].image = e.target.value; setSpeakers(ns);
                          }} className="bg-slate-900 border-none rounded-xl px-4 py-2" />
                        </div>
                      ))}
                    </div>

                    {/* Media */}
                    <div className="md:col-span-2 space-y-6 pt-10">
                      <h4 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500">Rich Media (Banner, Poster, Gallery)</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-800 p-6 rounded-2xl text-center">
                          <input type="file" onChange={e => setEventFiles({...eventFiles, banner: e.target.files[0]})} className="hidden" id="b-up" />
                          <label htmlFor="b-up" className="cursor-pointer font-bold text-xs">{eventFiles.banner ? 'Banner Added' : 'Upload Banner'}</label>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl text-center">
                          <input type="file" onChange={e => setEventFiles({...eventFiles, poster: e.target.files[0]})} className="hidden" id="p-up" />
                          <label htmlFor="p-up" className="cursor-pointer font-bold text-xs">{eventFiles.poster ? 'Poster Added' : 'Upload Poster'}</label>
                        </div>
                        <div className="bg-slate-800 p-6 rounded-2xl text-center">
                          <input type="file" multiple onChange={e => setEventFiles({...eventFiles, gallery: Array.from(e.target.files)})} className="hidden" id="g-up" />
                          <label htmlFor="g-up" className="cursor-pointer font-bold text-xs">{eventFiles.gallery.length > 0 ? `${eventFiles.gallery.length} Images` : 'Gallery'}</label>
                        </div>
                      </div>
                    </div>

                    <button type="submit" className="md:col-span-2 bg-primary-600 py-6 rounded-[2rem] font-black text-2xl shadow-2xl">Publish Premium Event</button>
                  </form>
                ) : (
                  <form onSubmit={handleAddCategory} className="space-y-8">
                    <input placeholder="Category Name" value={newCat.name} onChange={e => setNewCat({ ...newCat, name: e.target.value })} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4" required />
                    <textarea placeholder="Description" value={newCat.desc} onChange={e => setNewCat({ ...newCat, desc: e.target.value })} className="w-full bg-slate-800 border-none rounded-2xl px-6 py-4 h-32" />
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800 p-10 rounded-[2rem] text-center border-2 border-dashed border-white/10">
                        <input type="file" onChange={e => setCatFiles({...catFiles, banner: e.target.files[0]})} className="hidden" id="c-b" />
                        <label htmlFor="c-b" className="cursor-pointer font-black text-xs uppercase tracking-widest">{catFiles.banner ? 'Banner Ready' : 'Category Banner'}</label>
                      </div>
                      <div className="bg-slate-800 p-10 rounded-[2rem] text-center border-2 border-dashed border-white/10">
                        <input type="file" onChange={e => setCatFiles({...catFiles, thumbnail: e.target.files[0]})} className="hidden" id="c-t" />
                        <label htmlFor="c-t" className="cursor-pointer font-black text-xs uppercase tracking-widest">{catFiles.thumbnail ? 'Thumbnail Ready' : 'Category Thumbnail'}</label>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-primary-600 py-6 rounded-[2rem] font-black text-2xl">Create Premium Category</button>
                  </form>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
