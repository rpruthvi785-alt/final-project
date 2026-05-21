import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">User Dashboard</h1>
      <div className="card p-6">
        <p>Welcome back, {user?.name}!</p>
      </div>
    </div>
  );
};

export default Dashboard;
