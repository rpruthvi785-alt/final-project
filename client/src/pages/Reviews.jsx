import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, Plus, ThumbsUp, MapPin, Globe, Filter, Send, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getEvents, addReview, createPost, getPosts } from '../api/endpoints';
import toast from 'react-hot-toast';

export default function Reviews() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('All Expeditions');
  const [showAddReview, setShowAddReview] = useState(false);
  const [completedEvents, setCompletedEvents] = useState([]);
  const [realReviews, setRealReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ eventId: '', rating: 5, review: '' });

  const categories = ['All Expeditions', 'Mountain Treks', 'Beach Hops', 'Wildlife Safaris'];
  
  const preTextedOptions = [
    "Absolutely breathtaking views! 🏔️",
    "Perfectly organized itinerary. Highly recommend!",
    "The local food experiences were the highlight. 🍲",
    "Challenging but rewarding. A must-do!",
    "Great community vibe and friendly guides.",
    "The most cinematic travel experience of my life! 🎥"
  ];

  const fetchEvents = () => {
    setLoading(true);
    getEvents()
      .then(res => {
        const allEvents = res.data.data || [];
        
        // 1. Allow reviewing any event for testing purposes
        const completed = allEvents;
        setCompletedEvents(completed);

        // 2. Extract and flatten all reviews from all events
        const allReviews = [];
        allEvents.forEach(event => {
          if (event.reviews && event.reviews.length > 0) {
            event.reviews.forEach(rev => {
              allReviews.push({
                ...rev,
                expeditionName: event.eventTitle,
                eventId: event._id
              });
            });
          }
        });
        
        setRealReviews(allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      })
      .catch(err => {
        console.error('Failed to load reviews:', err);
        toast.error('Failed to load reviews');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmitReview = async () => {
    if (!newReview.eventId) return toast.error('Please select the expedition you completed');
    if (!newReview.review) return toast.error('Please enter your review');

    try {
      await addReview(newReview.eventId, { 
        rating: newReview.rating, 
        review: newReview.review 
      });
      toast.success('Expedition review posted!');
      setShowAddReview(false);
      setNewReview({ eventId: '', rating: 5, review: '' });
      fetchEvents();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post review');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-40 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-primary-ocean font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Star className="w-4 h-4 fill-current" />
              <span>Explorer Testimonials</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-dark-slate">Expedition <span className="text-primary-ocean italic">Reviews.</span></h1>
            <p className="mt-6 text-xl text-slate-500 font-medium leading-relaxed">
              Real stories from real explorers. Discover the magic of our curated journeys through the eyes of the community.
            </p>
          </div>
          <button 
            onClick={() => setShowAddReview(true)}
            className="btn-travel bg-dark-slate text-white flex items-center space-x-3 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Post a Review</span>
          </button>
        </header>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-16 overflow-x-auto pb-4 hide-scrollbar">
          <div className="bg-white p-2 rounded-2xl border border-slate-100 flex items-center shadow-sm">
            <div className="p-3 bg-slate-50 rounded-xl mr-2"><Filter className="w-4 h-4 text-slate-400" /></div>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedCategory === cat ? 'bg-primary-ocean text-white shadow-lg' : 'text-slate-400 hover:text-dark-slate'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Reviews List */}
          <div className="lg:col-span-8 space-y-10">
            {loading ? (
               <div className="text-center py-20"><p className="text-slate-400 font-medium">Loading reviews...</p></div>
            ) : realReviews.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-300">
                <p className="text-slate-400 font-medium">No reviews yet. Be the first to share your experience!</p>
              </div>
            ) : (
              realReviews.map((rev) => (
                <motion.div 
                  key={rev._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all group"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center space-x-5">
                      <img src={rev.user?.profileImage || 'https://i.pravatar.cc/100?u=' + rev.user?._id} className="w-16 h-16 rounded-2xl object-cover ring-4 ring-slate-50" alt={rev.user?.name} />
                      <div>
                        <h4 className="text-xl font-black text-dark-slate">{rev.user?.name}</h4>
                        <p className="text-[10px] font-black text-primary-ocean uppercase tracking-[0.2em]">{rev.expeditionName}</p>
                      </div>
                    </div>
                    <div className="flex items-center bg-slate-50 px-4 py-2 rounded-xl">
                      <Star className="w-4 h-4 text-accent-sunset fill-current mr-2" />
                      <span className="font-black text-dark-slate">{rev.rating}.0</span>
                    </div>
                  </div>

                  <p className="text-xl text-slate-600 font-medium leading-relaxed mb-10 italic">
                    "{rev.comment}"
                  </p>

                  <div className="flex items-center justify-between pt-8 border-t border-slate-50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(rev.createdAt).toLocaleDateString()}</span>
                    <button className="flex items-center space-x-2 text-slate-400 hover:text-primary-ocean transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="font-black text-xs uppercase tracking-widest">{rev.likes?.length || 0} Helpful</span>
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Sidebar / Stats */}
          <div className="lg:col-span-4 space-y-12">
            <div className="bg-dark-slate rounded-[3.5rem] p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-ocean/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-2xl font-black mb-10">Global Rating</h3>
              <div className="flex items-end space-x-4 mb-8">
                <span className="text-7xl font-black leading-none">4.9</span>
                <div className="mb-2">
                  <div className="flex space-x-1 mb-2">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-primary-sky text-primary-sky" />)}
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Based on 12,402 reviews</p>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'Organization', val: '98%' },
                  { label: 'Local Guides', val: '95%' },
                  { label: 'Safety', val: '100%' },
                  { label: 'Value', val: '92%' }
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2">
                      <span className="text-slate-400">{stat.label}</span>
                      <span>{stat.val}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-sky" style={{ width: stat.val }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass p-12 rounded-[3.5rem] border border-white">
              <h3 className="text-xl font-black text-dark-slate mb-6">Want to contribute?</h3>
              <p className="text-sm text-slate-500 font-medium mb-10 leading-relaxed">
                Your feedback helps us curate better expeditions and supports the explorer community.
              </p>
              <button onClick={() => setShowAddReview(true)} className="w-full py-5 bg-primary-ocean text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl shadow-primary-ocean/20">
                Write a Review
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add Review Modal */}
      <AnimatePresence>
        {showAddReview && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-dark-slate/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-2xl rounded-[4rem] p-12 shadow-2xl relative overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setShowAddReview(false)}
                className="absolute top-8 right-8 text-slate-300 hover:text-dark-slate"
              >
                <X className="w-8 h-8" />
              </button>

              <h2 className="text-4xl font-black text-dark-slate mb-4">Post a <span className="text-primary-ocean">Review.</span></h2>
              <p className="text-slate-400 font-medium mb-10 text-sm">Select an expedition and share your thoughts.</p>

              <div className="space-y-10">
                {/* Select Expedition */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Select Expedition</label>
                  <select 
                    value={newReview.eventId}
                    onChange={(e) => setNewReview({...newReview, eventId: e.target.value})}
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 ring-primary-ocean/10 font-black text-xs uppercase tracking-widest text-dark-slate"
                  >
                    <option value="">Choose an expedition...</option>
                    {completedEvents.length === 0 ? (
                      <option disabled>No completed expeditions found to review</option>
                    ) : (
                      completedEvents.map(e => (
                        <option key={e._id} value={e._id}>{e.eventTitle} ({e.city})</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-6">Quick Feedback (Pre-texted)</label>
                  <div className="flex flex-wrap gap-3">
                    {preTextedOptions.map(opt => (
                      <button 
                        key={opt}
                        onClick={() => setNewReview({...newReview, review: opt})}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-wide border transition-all ${newReview.review === opt ? 'bg-primary-ocean text-white border-primary-ocean shadow-lg' : 'bg-slate-50 text-slate-500 border-slate-100 hover:border-primary-ocean'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Custom Review</label>
                  <textarea 
                    value={newReview.review}
                    onChange={(e) => setNewReview({...newReview, review: e.target.value})}
                    placeholder="Describe your expedition experience..."
                    className="w-full h-32 bg-slate-50 border border-slate-100 rounded-3xl p-6 focus:ring-4 ring-primary-ocean/10 outline-none text-dark-slate font-medium resize-none transition-all"
                  />
                </div>

                <button 
                  onClick={handleSubmitReview}
                  className="w-full py-6 bg-primary-ocean text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center space-x-3 hover:bg-primary-sky transition-all shadow-2xl shadow-primary-ocean/30 active:scale-95"
                >
                  <span>Submit to Community</span>
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
