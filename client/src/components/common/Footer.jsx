import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Globe, Mail, Compass } from 'lucide-react';
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark-slate pt-32 pb-16 text-white overflow-hidden relative">
      {/* Decorative Background Element */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary-ocean/5 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-20 mb-20 relative z-10">
        <div className="col-span-1 md:col-span-2">
          <Link to="/" className="flex items-center space-x-3 mb-10 group">
            <div className="w-14 h-14 bg-primary-ocean rounded-2xl flex items-center justify-center text-3xl group-hover:rotate-12 transition-transform shadow-xl shadow-primary-ocean/20">✈️</div>
            <span className="text-4xl font-black tracking-tighter">Travel<span className="text-primary-sky">Tracker</span></span>
          </Link>
          <p className="text-xl text-slate-400 font-medium max-w-sm mb-12 leading-relaxed">
            Building the world's most immersive travel community, one adventure at a time. Join thousands of explorers today.
          </p>
          <div className="flex space-x-4">
            {[FaFacebook, FaInstagram, FaTwitter, FaYoutube].map((Icon, i) => (
              <a key={i} href="#" className="w-12 h-12 glass rounded-xl flex items-center justify-center hover:bg-primary-ocean hover:text-white text-slate-400 transition-all border border-white/5">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-primary-sky">Expedition Hub</h4>
          <ul className="space-y-6 text-slate-400 font-black uppercase tracking-widest text-[10px]">
            <li><Link to="/explore" className="hover:text-white transition-colors">Expeditions</Link></li>
            <li><Link to="/community" className="hover:text-white transition-colors">Community Feed</Link></li>
            <li><Link to="/chat" className="hover:text-white transition-colors">Discussions</Link></li>
            <li><Link to="/profile" className="hover:text-white transition-colors">Your Passport</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-10 text-primary-sky">Adventure Newsletter</h4>
          <p className="text-sm text-slate-400 mb-8 font-medium">Get weekly inspiration and exclusive trip invites directly to your inbox.</p>
          <div className="flex gap-2">
            <input 
              placeholder="Explorer Email" 
              className="bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-sm flex-grow focus:outline-none focus:border-primary-sky transition-all placeholder:text-slate-600" 
            />
            <button className="bg-primary-ocean px-5 py-4 rounded-xl hover:bg-primary-sky transition-colors">
              <Mail className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500 text-[10px] font-black uppercase tracking-widest relative z-10">
        <p>© 2024 Travel Trackers Community. All Rights Reserved.</p>
        <div className="flex space-x-10">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
