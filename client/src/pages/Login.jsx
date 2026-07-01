import { useState } from 'react';
import { login } from '../api/endpoints';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Compass, Mail, Lock, ArrowRight } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data.user);
      toast.success('Welcome back, Explorer!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Identity verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-dark-slate">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1469474968028-56623f02e42e" 
          className="w-full h-full object-cover opacity-40 scale-110" 
          alt="Login Background"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-dark-slate via-dark-slate/80 to-transparent"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-xl px-4"
      >
        <div className="glass-dark p-12 md:p-16 rounded-[4rem] border border-white/10 shadow-2xl backdrop-blur-3xl">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-primary-ocean rounded-2xl flex items-center justify-center text-white mx-auto mb-8 shadow-xl shadow-primary-ocean/30">
              <Compass className="w-8 h-8" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">Welcome <span className="text-primary-sky italic">Back.</span></h2>
            <p className="text-slate-400 font-medium">Log in to resume your global expedition.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-500 group-focus-within:text-primary-sky transition-colors" />
                </div>
                <input 
                  type="email" 
                  placeholder="Explorer Email"
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 py-5 text-white focus:ring-4 ring-primary-ocean/20 transition-all outline-none"
                  required
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-500 group-focus-within:text-primary-sky transition-colors" />
                </div>
                <input 
                  type="password" 
                  placeholder="Secret Key (Password)"
                  value={password} 
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl pl-16 pr-8 py-5 text-white focus:ring-4 ring-primary-ocean/20 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary-ocean text-white py-6 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary-sky transition-all shadow-2xl shadow-primary-ocean/20 flex items-center justify-center space-x-3 group active:scale-95 disabled:opacity-50"
            >
              <span>{loading ? 'Verifying...' : 'Unlock Passport'}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </form>
          
          <div className="mt-12 text-center">
            <p className="text-slate-500 font-medium text-sm">
              New to the community? <Link to="/signup" className="text-primary-sky font-black uppercase tracking-widest hover:underline ml-2">Join for Free</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
