import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Plus, Camera, Compass, MapPin } from 'lucide-react';

export default function Community() {
  const posts = [
    {
      user: 'Elena Woods',
      avatar: 'https://i.pravatar.cc/100?img=32',
      location: 'Swiss Alps, Switzerland',
      image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
      likes: '2.4k',
      caption: 'Finally reached the summit! The view from 4,000m is absolutely life-changing. 🏔️✨',
      tags: ['#Alps', '#Adventure', '#Summit']
    },
    {
      user: 'Marco Polo',
      avatar: 'https://i.pravatar.cc/100?img=12',
      location: 'Kyoto, Japan',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      likes: '1.8k',
      caption: 'The morning light in Arashiyama is something else. Pure serenity. 🎋⛩️',
      tags: ['#Japan', '#Kyoto', '#TravelTracker']
    },
    {
      user: 'Sarah Explorer',
      avatar: 'https://i.pravatar.cc/100?img=45',
      location: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
      likes: '4.2k',
      caption: 'Digital nomad life is treating me well. Exploring the hidden waterfalls of Ubud today! 🌊🌴',
      tags: ['#Bali', '#Nomad', '#Wanderlust']
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pt-40 pb-20 px-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center space-x-2 text-accent-sunset font-black uppercase tracking-[0.3em] text-[10px] mb-4">
              <Camera className="w-4 h-4" />
              <span>Global Moments</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-dark-slate">Community <span className="text-accent-sunset italic">Feed.</span></h1>
          </div>
          <button className="btn-travel bg-dark-slate text-white flex items-center space-x-3 group">
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            <span>Share Moment</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Main Feed */}
          <div className="lg:col-span-8 space-y-16">
            {posts.map((post, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/50 border border-slate-100"
              >
                {/* Post Header */}
                <div className="p-8 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={post.avatar} className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-50" alt={post.user} />
                    <div>
                      <h4 className="font-black text-dark-slate">{post.user}</h4>
                      <div className="flex items-center space-x-1 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                        <MapPin className="w-3 h-3 text-primary-ocean" />
                        <span>{post.location}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-dark-slate transition-colors"><MoreHorizontal /></button>
                </div>

                {/* Post Image */}
                <div className="h-[500px] md:h-[650px] overflow-hidden relative group">
                  <img src={post.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt="Post" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/20 backdrop-blur-md p-6 rounded-full">
                      <Heart className="w-10 h-10 text-white fill-current animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Post Actions */}
                <div className="p-10 bg-white">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-8">
                      <button className="hover:text-red-500 transition-all flex items-center space-x-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-red-50">
                          <Heart className="w-6 h-6" />
                        </div>
                        <span className="font-black text-sm text-dark-slate">{post.likes}</span>
                      </button>
                      <button className="hover:text-primary-ocean transition-all flex items-center space-x-3 group">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-50">
                          <MessageCircle className="w-6 h-6" />
                        </div>
                        <span className="font-black text-sm text-dark-slate">42</span>
                      </button>
                      <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-emerald-50 hover:text-emerald-500 transition-all">
                        <Send className="w-6 h-6" />
                      </button>
                    </div>
                    <button className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 hover:text-dark-slate transition-all">
                      <Bookmark className="w-6 h-6" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    <p className="text-slate-600 font-medium leading-relaxed text-lg">
                      <span className="font-black text-dark-slate mr-2">{post.user}</span>
                      {post.caption}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {post.tags.map(tag => (
                        <span key={tag} className="bg-primary-ocean/5 text-primary-ocean px-4 py-1.5 rounded-full text-xs font-black tracking-wide">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar / Recommendations */}
          <div className="lg:col-span-4 space-y-12">
            <div className="glass p-10 rounded-[3.5rem] sticky top-32 border border-white shadow-xl shadow-slate-200/50">
              <h3 className="text-2xl font-black text-dark-slate mb-10">Top Explorers</h3>
              <div className="space-y-10">
                {[1,2,3,4].map(n => (
                  <div key={n} className="flex items-center justify-between group">
                    <div className="flex items-center space-x-5">
                      <div className="relative">
                        <img src={`https://i.pravatar.cc/100?img=${n+20}`} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-white shadow-lg" alt="Explorer" />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full"></div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-dark-slate group-hover:text-primary-ocean transition-colors">Explorer_{n}42</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Nomad</p>
                      </div>
                    </div>
                    <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-ocean transition-all shadow-lg shadow-slate-200">Follow</button>
                  </div>
                ))}
              </div>

              <div className="mt-16 bg-gradient-to-br from-primary-ocean to-primary-sky p-10 rounded-[3rem] text-white">
                <h3 className="text-2xl font-black mb-4">Join the Club</h3>
                <p className="text-white/80 text-sm font-medium leading-relaxed mb-10">
                  Connect with 50,000+ travelers in our real-time community chat.
                </p>
                <Link to="/chat" className="w-full py-5 bg-white text-primary-ocean rounded-2xl text-center flex items-center justify-center space-x-3 font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                  <span>Enter Discussion</span>
                  <Compass className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
