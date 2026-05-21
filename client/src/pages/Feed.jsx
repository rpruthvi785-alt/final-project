import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Heart, 
  Share2, 
  Image as ImageIcon, 
  Send, 
  UserPlus, 
  UserCheck,
  Star,
  PlusCircle,
  TrendingUp,
  MapPin,
  Clock,
  MoreHorizontal,
  Compass
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  getPosts, 
  createPost, 
  getUsers, 
  toggleFollow, 
  toggleLikePost, 
  addCommentPost,
  getEvents
} from '../api/endpoints';
import toast from 'react-hot-toast';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [suggestedUsers, setSuggestedUsers] = useState([]);
  const [completedExpeditions, setCompletedExpeditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [activeTab, setActiveTab] = useState('All Posts');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [postsRes, usersRes, eventsRes] = await Promise.allSettled([
        getPosts(),
        getUsers(),
        getEvents()
      ]);
      
      if (postsRes.status === 'fulfilled') {
        setPosts(postsRes.value.data.posts || []);
      } else {
        console.error('Error fetching posts:', postsRes.reason);
      }

      if (usersRes.status === 'fulfilled') {
        const suggestions = (usersRes.value.data.users || []).filter(u => u._id !== user?._id).slice(0, 5);
        setSuggestedUsers(suggestions);
      } else {
        console.error('Error fetching users:', usersRes.reason);
      }

      if (eventsRes.status === 'fulfilled') {
        const allEvents = eventsRes.value.data.data || [];
        const completed = allEvents.filter(e => 
          e.eventStatus?.toLowerCase() === 'completed' || 
          e.status?.toLowerCase() === 'completed'
        );
        setCompletedExpeditions(completed);
      } else {
        console.error('Error fetching events:', eventsRes.reason);
      }

    } catch (error) {
      console.error('Error fetching feed data:', error);
      toast.error('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!postContent.trim() && selectedImages.length === 0) return;

    const formData = new FormData();
    formData.append('content', postContent);
    selectedImages.forEach(image => {
      formData.append('images', image);
    });

    try {
      await createPost(formData);
      toast.success('Post shared with the community!');
      setPostContent('');
      setSelectedImages([]);
      setImagePreviews([]);
      fetchData();
    } catch (error) {
      toast.error('Failed to create post');
    }
  };

  const handleFollow = async (userId) => {
    try {
      const res = await toggleFollow(userId);
      toast.success(res.data.message);
      fetchData(); // Refresh to update follow status
    } catch (error) {
      toast.error('Action failed');
    }
  };

  const handleLike = async (postId) => {
    try {
      await toggleLikePost(postId);
      fetchData();
    } catch (error) {
      toast.error('Could not like post');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-28 pb-20 px-4 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Sidebar - Expedition Portfolio */}
        <div className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-4">
                <img 
                  src={user?.profileImage || 'https://i.pravatar.cc/150?u=' + user?._id} 
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-slate-50 shadow-lg"
                  alt="Profile"
                />
                <div className="absolute -bottom-2 -right-2 bg-primary-ocean text-white p-2 rounded-xl shadow-lg">
                  <Compass className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-xl font-black text-dark-slate">{user?.name}</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Master Explorer</p>
              
              <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-8 border-t border-slate-50">
                <div>
                  <p className="text-lg font-black text-dark-slate">{user?.followers?.length || 0}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Co-Explorers</p>
                </div>
                <div>
                  <p className="text-lg font-black text-dark-slate">{user?.following?.length || 0}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Following</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-dark-slate rounded-[2.5rem] p-8 text-white shadow-xl">
            <h4 className="text-sm font-black uppercase tracking-[0.2em] mb-6 flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-primary-sky" />
              Popular Routes
            </h4>
            <div className="space-y-4">
              {['Zanskar Trek', 'Spiti Valley', 'Kerala Backwaters'].map(dest => (
                <div key={dest} className="group cursor-pointer">
                  <p className="text-sm font-bold text-slate-300 group-hover:text-primary-sky transition-colors">#{dest.replace(/\s+/g, '')}</p>
                  <p className="text-[10px] text-slate-500 font-medium">1.2k logs shared</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle - Expedition Logs */}
        <div className="lg:col-span-6 space-y-8">
          {/* Create Log */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40">
            <div className="flex space-x-4 mb-6">
              <img 
                src={user?.profileImage || 'https://i.pravatar.cc/150?u=' + user?._id} 
                className="w-12 h-12 rounded-2xl object-cover"
                alt="Avatar"
              />
              <textarea 
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="Share your expedition story or travel highlight..."
                className="flex-1 bg-slate-50 rounded-2xl p-4 outline-none focus:ring-2 ring-primary-ocean/10 resize-none font-medium text-slate-600 h-24 transition-all"
              />
            </div>
            
            {imagePreviews.length > 0 && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {imagePreviews.map((url, i) => (
                  <div key={i} className="relative flex-shrink-0">
                    <img src={url} className="w-20 h-20 rounded-xl object-cover" />
                    <button 
                      onClick={() => {
                        setImagePreviews(prev => prev.filter((_, idx) => idx !== i));
                        setSelectedImages(prev => prev.filter((_, idx) => idx !== i));
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1"
                    >
                      <PlusCircle className="w-3 h-3 rotate-45" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-slate-400 hover:text-primary-ocean cursor-pointer transition-colors">
                  <ImageIcon className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Add Photos</span>
                  <input type="file" multiple hidden onChange={handleImageChange} accept="image/*" />
                </label>
                <button className="flex items-center space-x-2 text-slate-400 hover:text-accent-sunset cursor-pointer transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Basecamp</span>
                </button>
              </div>
              <button 
                onClick={handleCreatePost}
                disabled={!postContent.trim() && selectedImages.length === 0}
                className="bg-primary-ocean text-white px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary-sky disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary-ocean/20 flex items-center space-x-2"
              >
                <span>Share Log</span>
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Expedition Feed Tabs */}
          <div className="flex items-center space-x-8 border-b border-slate-200 pb-1">
            {['Expedition Logs', 'Following'].map(tab => (
              <button 
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-[10px] font-black uppercase tracking-[0.2em] relative transition-colors ${activeTab === tab ? 'text-dark-slate' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-ocean rounded-full" />
                )}
              </button>
            ))}
          </div>

          {/* Posts List */}
          <div className="space-y-8">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="bg-white h-64 rounded-[2.5rem] animate-pulse border border-slate-100" />
              ))
            ) : posts.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-[2.5rem] border border-dashed border-slate-300">
                <p className="text-slate-400 font-medium">No logs shared yet. Be the first to share your journey!</p>
              </div>
            ) : (
              posts
                .filter(post => {
                  if (activeTab === 'Expedition Logs') return true; // Show all for now, but focus is travel
                  if (activeTab === 'Following') return user?.following?.includes(post.user?._id);
                  return true;
                })
                .map(post => (
                <motion.div 
                  key={post._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/40 transition-all group"
                >
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center space-x-4">
                        <img 
                          src={post.user?.profileImage || 'https://i.pravatar.cc/150?u=' + post.user?._id} 
                          className="w-12 h-12 rounded-2xl object-cover"
                          alt="Author"
                        />
                        <div>
                          <h4 className="text-base font-black text-dark-slate flex items-center">
                            {post.user?.name}
                            {post.category === 'travel' && (
                              <span className="ml-2 px-2 py-0.5 bg-primary-ocean/10 text-primary-ocean text-[8px] rounded-full uppercase tracking-tighter">Verified Reviewer</span>
                            )}
                          </h4>
                          <div className="flex items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                            <Clock className="w-3 h-3 mr-1" />
                            {new Date(post.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button className="text-slate-300 hover:text-dark-slate transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>

                    <p className="text-slate-600 font-medium leading-relaxed mb-6">
                      {post.content}
                    </p>

                    {post.images && post.images.length > 0 && (
                      <div className={`grid gap-2 mb-6 ${post.images.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                        {post.images.map((img, idx) => (
                          <img 
                            key={idx} 
                            src={img} 
                            className="w-full h-72 object-cover rounded-[2rem] bg-slate-100" 
                            alt="Post content"
                          />
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                      <div className="flex space-x-6">
                        <button 
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center space-x-2 group/btn ${post.likes?.includes(user?._id) ? 'text-accent-sunset' : 'text-slate-400 hover:text-accent-sunset'}`}
                        >
                          <div className="p-2 rounded-xl group-hover/btn:bg-accent-sunset/10 transition-colors">
                            <Heart className={`w-5 h-5 ${post.likes?.includes(user?._id) ? 'fill-current' : ''}`} />
                          </div>
                          <span className="font-black text-xs">{post.likes?.length || 0}</span>
                        </button>
                        <button className="flex items-center space-x-2 group/btn text-slate-400 hover:text-primary-ocean transition-colors">
                          <div className="p-2 rounded-xl group-hover/btn:bg-primary-ocean/10 transition-colors">
                            <MessageSquare className="w-5 h-5" />
                          </div>
                          <span className="font-black text-xs">{post.comments?.length || 0}</span>
                        </button>
                      </div>
                      <button className="text-slate-300 hover:text-primary-sky transition-colors p-2">
                        <Share2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Right Sidebar - Suggestions & Reviews */}
        <div className="hidden lg:block lg:col-span-3 space-y-8">
          
          {/* Who to follow */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-dark-slate mb-8 flex items-center justify-between">
              Who to follow
              <span className="text-[10px] text-primary-ocean normal-case font-bold cursor-pointer hover:underline">See all</span>
            </h4>
            <div className="space-y-6">
              {suggestedUsers.map(sUser => (
                <div key={sUser._id} className="flex items-center justify-between group">
                  <div className="flex items-center space-x-3">
                    <img src={sUser.profileImage || 'https://i.pravatar.cc/100?u=' + sUser._id} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <h5 className="text-sm font-black text-dark-slate truncate w-24">{sUser.name}</h5>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{sUser.location || 'Explorer'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFollow(sUser._id)}
                    className={`p-2.5 rounded-xl transition-all ${user?.following?.includes(sUser._id) ? 'bg-slate-100 text-slate-400' : 'bg-primary-ocean/10 text-primary-ocean hover:bg-primary-ocean hover:text-white'}`}
                  >
                    {user?.following?.includes(sUser._id) ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Review Card */}
          <div className="bg-primary-ocean rounded-[2.5rem] p-8 text-white shadow-xl shadow-primary-ocean/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="relative z-10">
              <Star className="w-10 h-10 text-primary-sky fill-primary-sky mb-4" />
              <h4 className="text-xl font-black mb-2 leading-tight">Review Your Recent Trip</h4>
              <p className="text-sm text-white/70 font-medium mb-6">Your feedback helps fellow explorers choose their next adventure.</p>
              
              {completedExpeditions.length > 0 ? (
                <div className="space-y-3 mb-6">
                  {completedExpeditions.slice(0, 2).map(exp => (
                    <div key={exp._id} className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm">
                      <p className="text-[10px] font-black uppercase tracking-widest">{exp.eventTitle}</p>
                      <div className="flex space-x-1 mt-1">
                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-white/30" />)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/10 p-4 rounded-2xl mb-6 text-center italic text-xs">
                  No completed trips found yet
                </div>
              )}

              <Link to="/reviews">
                <button className="w-full py-4 bg-white text-primary-ocean rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-transform">
                  Go to Reviews
                </button>
              </Link>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center space-x-4 mb-6">
              <div className="p-3 bg-accent-sunset/10 rounded-2xl text-accent-sunset">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Community</p>
                <p className="text-lg font-black text-dark-slate">1,240 <span className="text-xs font-bold text-slate-400">online</span></p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Feed;
