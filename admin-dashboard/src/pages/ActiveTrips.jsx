import { useState, useEffect } from 'react';
import api from '../services/api';
import { CheckCircle, Clock } from 'lucide-react';

const ActiveTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveTrips();
  }, []);

  const fetchActiveTrips = async () => {
    try {
      const res = await api.get('/admin/active-trips');
      if (res.data.success) {
        setTrips(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteTrip = async (id) => {
    if (window.confirm("Are you sure you want to mark this trip as completed? This will update statistics and move it to trip history.")) {
      try {
        const res = await api.put(`/admin/trips/complete/${id}`);
        if (res.data.success) {
          alert("Trip successfully completed!");
          fetchActiveTrips(); // Refresh the list
        }
      } catch (err) {
        console.error("Error completing trip", err);
        alert("Error completing trip");
      }
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Active Trips</h2>
        <span className="px-4 py-2 rounded-full bg-[var(--color-primary-light)] bg-opacity-20 text-[var(--color-primary)] font-semibold">
          {trips.length} Ongoing
        </span>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--border)] bg-opacity-30 border-b border-[var(--border)]">
              <th className="p-4 font-semibold text-sm">Trip Name</th>
              <th className="p-4 font-semibold text-sm">Status</th>
              <th className="p-4 font-semibold text-sm">Date</th>
              <th className="p-4 font-semibold text-sm">Organizer</th>
              <th className="p-4 font-semibold text-sm text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {trips.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-8 text-center text-[var(--text-secondary)]">No active trips found.</td>
              </tr>
            ) : (
              trips.map((trip) => (
                <tr key={trip._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)] hover:bg-opacity-10 transition-colors">
                  <td className="p-4 font-medium flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-200 overflow-hidden">
                      {trip.eventThumbnail ? (
                        <img src={trip.eventThumbnail} alt={trip.eventTitle} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-sky-400 to-purple-500"></div>
                      )}
                    </div>
                    <span>{trip.eventTitle}</span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <Clock size={12} />
                      <span>{trip.eventStatus}</span>
                    </span>
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {new Date(trip.eventDate).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-sm text-[var(--text-secondary)]">
                    {trip.createdBy?.name || trip.organizerName || 'Unknown'}
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleCompleteTrip(trip._id)}
                      className="inline-flex items-center space-x-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-light)] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-purple-500/30"
                    >
                      <CheckCircle size={16} />
                      <span>Complete Trip</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActiveTrips;
