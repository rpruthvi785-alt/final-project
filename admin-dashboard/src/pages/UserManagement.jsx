import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, UserX, Shield, Mail } from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/admin/users'); 
        if (res.data.success) {
          setUsers(res.data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading users...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">User Management</h2>
        <div className="flex gap-2">
          <div className="px-4 py-2 rounded-xl glass-panel text-sm font-medium">
            Total Registered Explorers: {users.length}
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--border)] bg-opacity-30 border-b border-[var(--border)]">
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">User Details</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">User ID</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Password (Hash)</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Booked Trips</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider">Role</th>
                <th className="p-4 font-semibold text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--border)] hover:bg-opacity-10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-sky-500 text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-purple-500/20">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-[var(--text-primary)]">{user.name}</div>
                        <div className="text-xs text-[var(--text-secondary)]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-[10px] text-[var(--text-secondary)]">
                    {user._id}
                  </td>
                  <td className="p-4">
                    <div className="max-w-[120px] truncate font-mono text-[10px] bg-[var(--bg)] p-1 rounded border border-[var(--border)]" title={user.password}>
                      {user.password}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {user.bookedTrips && user.bookedTrips.length > 0 ? (
                        user.bookedTrips.map((trip, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 text-[10px] font-bold">
                            {trip}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-[var(--text-secondary)] italic">No trips yet</span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-500 border border-purple-500/20' : 'bg-sky-500/10 text-sky-500 border border-sky-500/20'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-red-500/10 text-red-500 rounded-xl transition-all" title="Block User">
                        <UserX size={18} />
                      </button>
                      <button className="p-2 hover:bg-purple-500/10 text-purple-500 rounded-xl transition-all" title="Permissions">
                        <Shield size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
