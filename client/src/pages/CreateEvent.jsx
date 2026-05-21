import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import EventCard from '../components/events/EventCard';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'music',
    subCategory: '',
    description: '',
    bannerImage: '',
    eventDate: '',
    time: '',
    location: {
      address: '',
      city: '',
      coordinates: { lat: 0, lng: 0 }
    },
    maxParticipants: 50,
    tags: '',
    fee: 0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Map form fields to Event schema field names
      const payload = {
        eventTitle: formData.title,
        eventDescription: formData.description,
        eventBanner: formData.bannerImage,
        eventDate: new Date(`${formData.eventDate}T${formData.time || '00:00'}`),
        startTime: formData.time || '',
        city: formData.location?.city || '',
        venue: formData.location?.address || '',
        availableSeats: Number(formData.maxParticipants) || 0,
        eventTags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        suggestedDonation: Number(formData.fee) || 0,
        isFree: !formData.fee || Number(formData.fee) === 0,
        eventType: 'In-Person',
      };
      await api.post('/events/create', payload);
      toast.success('Event created and sent for approval!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  // Preview uses EventCard which supports both eventTitle/title and eventBanner/bannerImage
  const previewEvent = {
    ...formData,
    likes: [],
    eventDate: formData.eventDate ? new Date(formData.eventDate) : new Date()
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* Form Section */}
        <div className="flex-1">
          <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8">
            Create an <span className="gradient-text">Experience</span>
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Event Title</label>
                <input 
                  type="text" name="title" required className="input-field" 
                  placeholder="e.g. Weekend Jazz Night"
                  value={formData.title} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Category</label>
                <select 
                  name="category" className="input-field" 
                  value={formData.category} onChange={handleChange}
                >
                  <option value="music">Music</option>
                  <option value="bike">Bike Ride</option>
                  <option value="painting">Painting</option>
                  <option value="photography">Photography</option>
                  <option value="food">Food</option>
                  <option value="sports">Sports</option>
                  <option value="gaming">Gaming</option>
                  <option value="wellness">Wellness</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Description</label>
              <textarea 
                name="description" required className="input-field min-h-[120px]" 
                placeholder="What makes this event special?"
                value={formData.description} onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Date</label>
                <input 
                  type="date" name="eventDate" required className="input-field" 
                  value={formData.eventDate} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Time</label>
                <input 
                  type="time" name="time" className="input-field" 
                  value={formData.time} onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Location Address</label>
              <input 
                type="text" name="location.address" required className="input-field" 
                placeholder="Full address or meeting point"
                value={formData.location.address} onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Banner Image URL</label>
                <input 
                  type="text" name="bannerImage" className="input-field" 
                  placeholder="Paste an Unsplash link"
                  value={formData.bannerImage} onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Max Participants</label>
                <input 
                  type="number" name="maxParticipants" className="input-field" 
                  value={formData.maxParticipants} onChange={handleChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Tags (comma separated)</label>
              <input 
                type="text" name="tags" className="input-field" 
                placeholder="jazz, music, evening, bangalore"
                value={formData.tags} onChange={handleChange}
              />
            </div>

            <button 
              type="submit" disabled={loading}
              className="btn-primary w-full py-4 text-xl shadow-2xl shadow-primary-600/40"
            >
              {loading ? 'Publishing...' : 'Publish Experience'}
            </button>
          </form>
        </div>

        {/* Preview Section */}
        <div className="lg:w-1/3">
          <div className="sticky top-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <span>👀</span> Live Preview
            </h2>
            <div className="scale-100 origin-top">
              <EventCard event={previewEvent} />
            </div>
            <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl">
              <h4 className="font-bold text-amber-800 dark:text-amber-400 mb-2">Quality Check</h4>
              <ul className="text-sm text-amber-700 dark:text-amber-500 space-y-1">
                <li>• Use high-quality cover images</li>
                <li>• Provide clear meeting instructions</li>
                <li>• Keep description engaging and concise</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CreateEvent;
