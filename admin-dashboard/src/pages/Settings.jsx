import { useState } from 'react';
import { Settings as SettingsIcon, Save, Bell, Shield, Palette, Globe } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');

  const tabs = [
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Admin Settings</h2>
        <button className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2.5 rounded-xl transition-all font-semibold shadow-lg shadow-purple-500/20">
          <Save size={18} />
          Save Changes
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id 
              ? 'bg-purple-500 text-white shadow-md' 
              : 'glass-panel hover:bg-[var(--border)]'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-panel p-8 rounded-2xl space-y-8">
        {activeTab === 'general' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">General Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Site Name</label>
                <input type="text" defaultValue="Travel Tracker" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-purple-500/20" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-[var(--text-secondary)]">Support Email</label>
                <input type="email" defaultValue="support@traveltracker.com" className="w-full bg-[var(--bg)] border border-[var(--border)] rounded-xl px-4 py-2.5 outline-none focus:ring-2 ring-purple-500/20" />
              </div>
            </div>
            
            <div className="p-4 rounded-xl bg-sky-500/5 border border-sky-500/20 flex items-start gap-4">
              <Globe className="text-sky-500 mt-1" size={24} />
              <div>
                <p className="font-semibold text-sky-500">Global Settings</p>
                <p className="text-sm text-[var(--text-secondary)]">Manage how the site appears to users worldwide including timezones and currency defaults.</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                "New booking alerts",
                "Payment success notifications",
                "System maintenance updates",
                "New user registrations"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg)] border border-[var(--border)]">
                  <span className="font-medium">{item}</span>
                  <div className="w-12 h-6 rounded-full bg-purple-500 relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Security & Access</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl glass-panel flex justify-between items-center">
                <div>
                  <p className="font-semibold">Two-Factor Authentication</p>
                  <p className="text-sm text-[var(--text-secondary)]">Add an extra layer of security to your admin account.</p>
                </div>
                <button className="text-purple-500 font-semibold hover:underline">Enable</button>
              </div>
              <div className="p-4 rounded-xl glass-panel flex justify-between items-center">
                <div>
                  <p className="font-semibold">API Access Tokens</p>
                  <p className="text-sm text-[var(--text-secondary)]">Manage tokens for external integrations.</p>
                </div>
                <button className="text-purple-500 font-semibold hover:underline">Manage</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Visual Customization</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl border-2 border-purple-500 bg-white text-slate-900 shadow-sm cursor-pointer">
                <div className="w-full h-24 bg-slate-100 rounded-lg mb-4"></div>
                <p className="font-bold text-center">Light Mode</p>
              </div>
              <div className="p-6 rounded-2xl border border-[var(--border)] bg-slate-900 text-white cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-full h-24 bg-slate-800 rounded-lg mb-4"></div>
                <p className="font-bold text-center text-white">Dark Mode</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
