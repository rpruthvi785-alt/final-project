import { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SearchAnalytics = () => {
  const [searches, setSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearches = async () => {
      try {
        const res = await api.get('/admin/most-searched');
        if (res.data.success) {
          setSearches(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearches();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading search data...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Search Analytics</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl h-[400px]">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <TrendingUp size={20} className="text-purple-500" />
            Top Searched Destinations
          </h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={searches} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" stroke="var(--text-secondary)" />
              <YAxis dataKey="keyword" type="category" stroke="var(--text-secondary)" width={100} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
              />
              <Bar dataKey="frequency" fill="#aa3bff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-6 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Search size={20} className="text-sky-500" />
            Recent Search Keywords
          </h3>
          <div className="space-y-4">
            {searches.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                <span className="font-medium capitalize">{item.keyword}</span>
                <span className="text-xs text-[var(--text-secondary)]">{item.frequency} searches</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchAnalytics;
