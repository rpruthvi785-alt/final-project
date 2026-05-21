import { useState, useEffect } from 'react';
import api from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const BookingAnalytics = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/admin/bookings/monthly');
      if (res.data.success) {
        // Map _id (month number) to month name
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedData = res.data.data.map(item => ({
          name: months[item._id - 1],
          bookings: item.totalBookings,
          revenue: item.totalRevenue
        }));
        setMonthlyData(formattedData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading analytics...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Booking Analytics</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-6 rounded-2xl h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Monthly Booking Trends</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <RechartsTooltip 
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
                itemStyle={{ color: 'var(--text-primary)' }}
              />
              <Line type="monotone" dataKey="bookings" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4, fill: '#0ea5e9' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-6 rounded-2xl h-[400px]">
          <h3 className="text-lg font-semibold mb-6">Monthly Revenue Correlation</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--text-secondary)" />
              <YAxis stroke="var(--text-secondary)" />
              <RechartsTooltip 
                cursor={{fill: 'var(--border)', opacity: 0.4}}
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '8px' }}
              />
              <Bar dataKey="revenue" fill="#aa3bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default BookingAnalytics;
