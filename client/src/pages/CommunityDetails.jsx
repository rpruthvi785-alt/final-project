import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const CommunityDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommunity = async () => {
      try {
        const { data } = await api.get(`/communities/${id}`);
        setCommunity(data.data);
      } catch (error) {
        toast.error('Failed to load community details');
      } finally {
        setLoading(false);
      }
    };
    fetchCommunity();
  }, [id]);

  const handleJoin = async () => {
    if (!user) return toast.error('Please login to join this community');
    try {
      const { data } = await api.post(`/communities/${id}/join`);
      setCommunity(data.data);
      toast.success(data.message);
    } catch (error) {
      toast.error('Failed to update membership');
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!community) return <div className="text-center py-20">Community not found</div>;

  const isMember = user && community.members?.some(m => m._id === user._id || m === user._id);

  return (
    <div className="bg-slate-50 dark:bg-dark-bg min-h-screen">
      {/* Banner */}
      <div className="h-64 w-full relative">
        {community.bannerImage ? (
          <img src={community.bannerImage} alt={community.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full gradient-bg"></div>
        )}
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto flex items-end justify-between">
          <div>
            <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 inline-block">
              {community.category}
            </span>
            <h1 className="text-4xl font-extrabold text-white">{community.name}</h1>
          </div>
          <button 
            onClick={handleJoin}
            className={`px-6 py-3 rounded-lg font-bold shadow-lg transition-colors ${
              isMember ? 'bg-white text-slate-800 hover:bg-slate-100' : 'bg-primary-600 text-white hover:bg-primary-700'
            }`}
          >
            {isMember ? 'Leave Community' : 'Join Community'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">About Us</h2>
            <p className="text-slate-600 dark:text-slate-300 whitespace-pre-wrap">{community.description}</p>
          </div>
          
          <div className="card p-6">
            <h2 className="text-2xl font-bold mb-4">Discussion Board</h2>
            {isMember ? (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-slate-500">Discussion features coming soon!</p>
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-slate-500 mb-4">Join the community to participate in discussions.</p>
                <button onClick={handleJoin} className="btn-primary">Join Now</button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-8">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Organizer</h3>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                {community.organizer?.name?.charAt(0) || '?'}
              </div>
              <div>
                <p className="font-bold">{community.organizer?.name || 'Unknown'}</p>
                <p className="text-sm text-slate-500">Community Creator</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Members ({community.members?.length || 0})</h3>
            <div className="flex flex-wrap gap-2">
              {community.members?.slice(0, 10).map((member, idx) => (
                <div key={idx} className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white dark:border-slate-800 flex items-center justify-center font-bold text-slate-500 text-xs" title={member.name}>
                  {member.name?.charAt(0) || '?'}
                </div>
              ))}
              {community.members?.length > 10 && (
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium text-slate-500">
                  +{community.members.length - 10}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityDetails;
