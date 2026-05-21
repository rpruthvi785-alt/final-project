import { createContext, useState, useEffect, useContext } from 'react';
import { getProfile } from '../api/endpoints';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getProfile()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser, logout }}>
      {loading ? (
        <div className="flex flex-col items-center justify-center h-screen bg-dark-slate">
          <div className="w-20 h-20 bg-primary-ocean rounded-3xl animate-float flex items-center justify-center text-3xl shadow-2xl shadow-primary-ocean/40 mb-8">
            ✈️
          </div>
          <p className="text-white font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Initializing Expedition...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
