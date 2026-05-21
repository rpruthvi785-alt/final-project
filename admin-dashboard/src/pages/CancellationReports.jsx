import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { AlertTriangle, RotateCcw, TrendingDown } from 'lucide-react';

const CancellationReports = () => {
  const data = [
    { name: 'Schedule Conflict', value: 45 },
    { name: 'Financial Reasons', value: 25 },
    { name: 'Health Issues', value: 20 },
    { name: 'Other', value: 10 },
  ];

  const COLORS = ['#aa3bff', '#0ea5e9', '#f59e0b', '#ef4444'];

  const stats = [
    { title: 'Total Cancellations', value: '124', icon: AlertTriangle, color: 'text-red-500', bg: 'bg-red-500/10' },
    { title: 'Cancellation Rate', value: '8.4%', icon: TrendingDown, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Refunded Amount', value: '₹1.2L', icon: RotateCcw, color: 'text-sky-500', bg: 'bg-sky-500/10' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Cancellation Analytics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel p-6 rounded-2xl flex items-center justify-between">
            <div>
              <p className="text-sm text-[var(--text-secondary)] font-medium mb-1">{stat.title}</p>
              <h3 className="text-3xl font-bold text-[var(--text-primary)]">{stat.value}</h3>
            </div>
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-panel p-8 rounded-2xl h-[450px]">
          <h3 className="text-lg font-semibold mb-6">Reasons for Cancellation</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)', borderRadius: '12px' }}
              />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel p-8 rounded-2xl">
          <h3 className="text-lg font-semibold mb-6">Recent Cancellation Logs</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex justify-between items-center p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                <div>
                  <p className="font-semibold">User #{1020 + item}</p>
                  <p className="text-xs text-[var(--text-secondary)]">Bali Luxury Tour</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-red-500">Refund Pending</p>
                  <p className="text-[10px] text-[var(--text-secondary)]">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CancellationReports;
