import { Outlet, Link, useLocation } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, FiActivity, FiMap, FiMessageSquare, 
  FiBell, FiSettings, FiGrid, FiUsers, FiFlag
} from 'react-icons/fi';

const DashboardLayout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const getNavItems = () => {
    const baseItems = [
      { name: 'Profile', path: '/dashboard', icon: FiUser },
      { name: 'My Activities', path: '/dashboard/activities', icon: FiActivity },
      { name: 'Travel Map', path: '/tracker', icon: FiMap },
      { name: 'Messages', path: '/chat', icon: FiMessageSquare },
      { name: 'Notifications', path: '/dashboard/notifications', icon: FiBell },
      { name: 'Settings', path: '/dashboard/settings', icon: FiSettings },
    ];

    if (user?.role === 'organizer') {
      return [
        { name: 'Overview', path: '/organizer', icon: FiGrid },
        { name: 'Manage Events', path: '/organizer/events', icon: FiActivity },
        { name: 'Participants', path: '/organizer/participants', icon: FiUsers },
        ...baseItems
      ];
    }

    if (user?.role === 'admin') {
      return [
        { name: 'Analytics', path: '/admin', icon: FiGrid },
        { name: 'Users', path: '/admin/users', icon: FiUsers },
        { name: 'Reports', path: '/admin/reports', icon: FiFlag },
        { name: 'All Activities', path: '/admin/activities', icon: FiActivity },
        ...baseItems
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-dark-bg">
      <Navbar />
      
      <div className="flex-grow flex max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block flex-shrink-0 pr-8">
          <div className="sticky top-24 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-slate-200 dark:border-dark-border overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-dark-border flex flex-col items-center">
              {user?.profileImage ? (
                <img src={user.profileImage} alt="Profile" className="w-20 h-20 rounded-full object-cover border-4 border-white dark:border-dark-card shadow-sm" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-2xl font-bold shadow-sm">
                  {user?.name.charAt(0)}
                </div>
              )}
              <h2 className="mt-4 font-semibold text-slate-900 dark:text-white text-lg">{user?.name}</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm capitalize">{user?.role}</p>
            </div>
            
            <nav className="p-4 space-y-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400 font-medium' 
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-dark-bg hover:text-primary-600'
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-slate-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-grow min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
