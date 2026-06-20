import React, { useState } from 'react';
import { 
  User as UserIcon, 
  Cpu, 
  Palette, 
  Lock, 
  Bell, 
  ShieldAlert, 
  Trash2, 
  Plus, 
  Link, 
  Check, 
  ChevronRight,
  Database,
  Grid
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { useToastStore } from '../store/useToastStore';
import { useTheme } from '../utils/theme';
import { motion, AnimatePresence } from 'framer-motion';

export const Settings: React.FC = () => {
  const theme = useTheme();
  const { addToast } = useToastStore();
  const { 
    user, 
    updateUser, 
    connectedDevices, 
    connectDevice, 
    disconnectDevice, 
    themeColor, 
    setThemeColor 
  } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'devices' | 'theme' | 'security' | 'notifs' | 'privacy'>('profile');
  
  // Connect Device modal state
  const [isPairOpen, setIsPairOpen] = useState(false);
  const [deviceId, setDeviceId] = useState('');
  const [deviceType, setDeviceType] = useState('Smart Meter');

  // Profile Edit fields
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState('+91 98765 43210');
  const [loc, setLoc] = useState(user.location);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, location: loc });
    addToast('success', 'Profile Saved', 'Personal information registry updated.');
  };

  const handlePairDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deviceId) return;
    connectDevice({ id: deviceId, type: deviceType });
    setIsPairOpen(false);
    setDeviceId('');
    addToast('success', 'Hardware Paired', `${deviceType} paired and syncing.`);
  };

  const handleDisconnect = (id: string) => {
    disconnectDevice(id);
    addToast('warning', 'Device Terminated', `Device ${id} disconnected from telemetry feeds.`);
  };

  return (
    <div className="flex flex-col gap-6 w-full pb-12 select-none">
      {/* Top Header */}
      <div className="flex justify-between items-center border-b border-cardBorder pb-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-heading text-white">System Settings</h1>
          <p className="text-xs text-textSecondary mt-0.5">
            Manage your hardware devices, profile details, and visual themes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Side Tab Navigation */}
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-1.5 p-1 rounded-xl bg-cardSurface/20 border border-cardBorder/50 w-full lg:max-w-xs">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold whitespace-nowrap lg:whitespace-normal transition-all w-full text-left ${
              activeTab === 'profile' ? 'bg-white/5 border border-white/10 text-white' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <UserIcon className="w-4 h-4" />
            Personal Info
          </button>

          <button
            onClick={() => setActiveTab('devices')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold whitespace-nowrap lg:whitespace-normal transition-all w-full text-left ${
              activeTab === 'devices' ? 'bg-white/5 border border-white/10 text-white' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Cpu className="w-4 h-4" />
            Connected Devices
          </button>

          <button
            onClick={() => setActiveTab('theme')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold whitespace-nowrap lg:whitespace-normal transition-all w-full text-left ${
              activeTab === 'theme' ? 'bg-white/5 border border-white/10 text-white' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Palette className="w-4 h-4" />
            Theme Options
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold whitespace-nowrap lg:whitespace-normal transition-all w-full text-left ${
              activeTab === 'security' ? 'bg-white/5 border border-white/10 text-white' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Lock className="w-4 h-4" />
            Security & Keys
          </button>

          <button
            onClick={() => setActiveTab('notifs')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold whitespace-nowrap lg:whitespace-normal transition-all w-full text-left ${
              activeTab === 'notifs' ? 'bg-white/5 border border-white/10 text-white' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Bell className="w-4 h-4" />
            Notifications
          </button>

          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-semibold whitespace-nowrap lg:whitespace-normal transition-all w-full text-left ${
              activeTab === 'privacy' ? 'bg-white/5 border border-white/10 text-white' : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            <Database className="w-4 h-4" />
            Data & Privacy
          </button>
        </div>

        {/* Right Side Panels Block */}
        <div className="lg:col-span-3">
          
          {/* TAB 1: Profile */}
          {activeTab === 'profile' && (
            <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-6 glass-panel">
              <h3 className="text-base font-bold text-white font-heading border-b border-cardBorder pb-3">
                Personal Information
              </h3>

              <form onSubmit={handleProfileSave} className="flex flex-col gap-4">
                {/* Avatar upload representation */}
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-cardBorder border border-white/10 flex items-center justify-center text-textSecondary text-xl select-none">
                    RK
                  </div>
                  <button
                    type="button"
                    onClick={() => addToast('info', 'Avatar Upload', 'Photo select window triggered.')}
                    className="px-4 py-2 rounded-xl border border-cardBorder bg-cardSurface/60 text-xs font-bold text-white hover:bg-cardSurface transition-all"
                  >
                    Change Photo
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="px-4 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">Email (Locked)</label>
                    <div className="relative">
                      <input
                        type="email"
                        disabled
                        value={user.email}
                        className="px-4 py-2.5 rounded-xl bg-cardBorder/30 border border-cardBorder text-xs text-textMuted w-full cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-2.5 text-[9px] font-bold text-accentGreen font-mono uppercase bg-accentGreen/10 px-1.5 py-0.5 rounded border border-accentGreen/20">
                        Verified &bull; ✓
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="px-4 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      value={loc}
                      onChange={(e) => setLoc(e.target.value)}
                      className="px-4 py-2.5 rounded-xl glass-input text-xs"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center border-t border-cardBorder/40 pt-4 mt-2">
                  <span className="text-[10px] font-mono text-accentGreen font-bold flex items-center gap-1.5 bg-accentGreen/10 border border-accentGreen/20 px-2.5 py-1 rounded-full uppercase">
                    <Check className="w-3.5 h-3.5" /> KYC status: verified
                  </span>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-accentGreen text-bgSpace text-xs font-bold hover:scale-102 transition-transform shadow-neon-green"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Devices */}
          {activeTab === 'devices' && (
            <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-4 glass-panel">
              <div className="flex justify-between items-center border-b border-cardBorder pb-3">
                <h3 className="text-base font-bold text-white font-heading">
                  Connected Telemetry Hardware
                </h3>
                <button
                  onClick={() => setIsPairOpen(true)}
                  className="px-3.5 py-1.5 rounded-xl bg-accentGreen text-bgSpace text-xs font-bold hover:scale-102 transition-transform flex items-center gap-1 shadow-neon-green"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Pair Device
                </button>
              </div>

              {/* Devices grid */}
              <div className="flex flex-col gap-3">
                {connectedDevices.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-xl border border-cardBorder bg-cardSurface/20 hover:bg-cardSurface/50 transition-colors flex justify-between items-center"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cardBorder flex items-center justify-center text-textSecondary text-lg">
                        {d.type.includes('Meter') ? '🔌' : '☀️'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white">{d.type}</span>
                          <span className="text-[9px] font-mono text-accentGreen uppercase bg-accentGreen/10 border border-accentGreen/20 px-1.5 py-0.5 rounded">
                            ● Active (syncing)
                          </span>
                        </div>
                        <span className="text-[10px] text-textSecondary font-mono mt-1 block">
                          ID: {d.id} &bull; Last sync: {d.lastSync}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => addToast('info', 'Hardware Telemetry', `Opening database records for device ${d.id}...`)}
                        className="px-3 py-1.5 rounded-lg border border-cardBorder bg-cardSurface/30 text-[10px] font-bold text-white hover:bg-cardSurface transition-all"
                      >
                        View Data
                      </button>
                      <button
                        onClick={() => handleDisconnect(d.id)}
                        className="p-2 rounded-lg border border-cardBorder bg-cardSurface/30 text-textSecondary hover:text-danger hover:border-danger/30 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Theme */}
          {activeTab === 'theme' && (
            <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-6 glass-panel">
              <h3 className="text-base font-bold text-white font-heading border-b border-cardBorder pb-3">
                Interface Customization
              </h3>

              {/* Mode Select */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">Theme Mode</span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-4 rounded-xl border border-accentGreen bg-accentGreen/5 flex flex-col items-center gap-1.5 cursor-pointer text-center select-none">
                    <span className="text-xl">🌑</span>
                    <span className="text-xs font-semibold text-white">Dark Mode</span>
                    <span className="text-[9px] font-mono text-accentGreen">Active</span>
                  </div>

                  <div 
                    onClick={() => addToast('info', 'Theme engine', 'Light mode is currently locked for premium aesthetic compliance.')}
                    className="p-4 rounded-xl border border-cardBorder bg-cardSurface/20 opacity-50 flex flex-col items-center gap-1.5 cursor-pointer text-center select-none"
                  >
                    <span className="text-xl">☀️</span>
                    <span className="text-xs font-semibold text-textSecondary">Light Mode</span>
                    <span className="text-[9px] font-mono text-textMuted">Locked</span>
                  </div>

                  <div
                    onClick={() => addToast('info', 'Theme engine', 'System sync locks to Dark mode configurations.')}
                    className="p-4 rounded-xl border border-cardBorder bg-cardSurface/20 opacity-50 flex flex-col items-center gap-1.5 cursor-pointer text-center select-none"
                  >
                    <span className="text-xl">🌓</span>
                    <span className="text-xs font-semibold text-textSecondary">System default</span>
                    <span className="text-[9px] font-mono text-textMuted">Sync</span>
                  </div>
                </div>
              </div>

              {/* Accent Color picker */}
              <div className="flex flex-col gap-3">
                <span className="text-xs font-mono text-textSecondary uppercase tracking-wider">Accent Theme Accent</span>
                <div className="flex gap-4 select-none">
                  {/* Green */}
                  <div
                    onClick={() => { setThemeColor('green'); addToast('success', 'Theme Modified', 'Accent green theme synced.'); }}
                    className={`w-10 h-10 rounded-xl bg-bgSpace border flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                      themeColor === 'green' ? 'border-accentGreen shadow-neon-green/30' : 'border-cardBorder'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-accentGreen" />
                  </div>

                  {/* Cyan */}
                  <div
                    onClick={() => { setThemeColor('cyan'); addToast('success', 'Theme Modified', 'Accent cyan theme synced.'); }}
                    className={`w-10 h-10 rounded-xl bg-bgSpace border flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                      themeColor === 'cyan' ? 'border-accentCyan shadow-neon-cyan/30' : 'border-cardBorder'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-accentCyan" />
                  </div>

                  {/* Purple */}
                  <div
                    onClick={() => { setThemeColor('purple'); addToast('success', 'Theme Modified', 'Accent purple theme synced.'); }}
                    className={`w-10 h-10 rounded-xl bg-bgSpace border flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                      themeColor === 'purple' ? 'border-accentPurple shadow-neon-purple/30' : 'border-cardBorder'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-accentPurple" />
                  </div>

                  {/* Gold */}
                  <div
                    onClick={() => { setThemeColor('gold'); addToast('success', 'Theme Modified', 'Accent gold theme synced.'); }}
                    className={`w-10 h-10 rounded-xl bg-bgSpace border flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${
                      themeColor === 'gold' ? 'border-accentGold shadow-neon-gold/30' : 'border-cardBorder'
                    }`}
                  >
                    <div className="w-4 h-4 rounded-full bg-accentGold" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Security */}
          {activeTab === 'security' && (
            <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-6 glass-panel">
              <h3 className="text-base font-bold text-white font-heading border-b border-cardBorder pb-3">
                Security & Keys
              </h3>
              
              <div className="flex flex-col gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-cardSurface/20 border border-cardBorder flex justify-between items-center">
                  <div>
                    <span className="text-white block font-bold">API Access Key</span>
                    <span className="text-textMuted text-[10px] block mt-1">For developer telemetry syncing integration</span>
                  </div>
                  <button 
                    onClick={() => addToast('success', 'API Key Regenerated', 'New authentication signature key active.')}
                    className="px-3.5 py-1.5 rounded-lg border border-cardBorder bg-cardSurface hover:bg-cardSurface/60 font-sans font-bold text-[10px]"
                  >
                    Regenerate
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-cardSurface/20 border border-cardBorder flex justify-between items-center">
                  <div>
                    <span className="text-white block font-bold">Multisig Wallet Sync</span>
                    <span className="text-textMuted text-[10px] block mt-1">Requires 2/3 validation signatures for credit transfers</span>
                  </div>
                  <span className="text-[10px] font-sans font-bold text-accentGreen uppercase bg-accentGreen/10 border border-accentGreen/20 px-1.5 py-0.5 rounded">
                    Active
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Notifications */}
          {activeTab === 'notifs' && (
            <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-6 glass-panel">
              <h3 className="text-base font-bold text-white font-heading border-b border-cardBorder pb-3">
                Notification Subscriptions
              </h3>
              
              <div className="flex flex-col gap-3 font-mono text-xs">
                <label className="flex items-center gap-3 text-textSecondary hover:text-textPrimary cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-cardBorder text-accentGreen bg-bgSpace w-4.5 h-4.5" />
                  [✓] Smart meter telemetry sync disconnect alerts
                </label>
                <label className="flex items-center gap-3 text-textSecondary hover:text-textPrimary cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-cardBorder text-accentGreen bg-bgSpace w-4.5 h-4.5" />
                  [✓] Carbon credit minting events notifications
                </label>
                <label className="flex items-center gap-3 text-textSecondary hover:text-textPrimary cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-cardBorder text-accentGreen bg-bgSpace w-4.5 h-4.5" />
                  [✓] Market sale matching confirmations
                </label>
                <label className="flex items-center gap-3 text-textSecondary hover:text-textPrimary cursor-pointer">
                  <input type="checkbox" className="rounded border-cardBorder text-accentGreen bg-bgSpace w-4.5 h-4.5" />
                  [ ] Daily efficiency suggestions summaries
                </label>
              </div>
            </div>
          )}

          {/* TAB 6: Privacy */}
          {activeTab === 'privacy' && (
            <div className="p-6 rounded-2xl border border-cardBorder bg-cardSurface/40 flex flex-col gap-6 glass-panel">
              <h3 className="text-base font-bold text-white font-heading border-b border-cardBorder pb-3">
                Data Policy
              </h3>
              
              <p className="text-xs text-textSecondary leading-relaxed">
                All data collected via Paired Smart Grid telemetry is encrypted using end-to-end signatures. Under zero conditions is raw utility consumption detail exposed or traded without explicit cryptographic signature authorization.
              </p>
              
              <div className="flex justify-end pt-4 border-t border-cardBorder/40">
                <button
                  onClick={() => addToast('warning', 'Data Erase Requested', 'Privacy requests pending compliance check.')}
                  className="px-4 py-2 rounded-xl border border-danger/30 bg-danger/10 hover:bg-danger text-xs font-bold text-danger hover:text-bgSpace transition-all"
                >
                  Purge Telemetry Logs
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* PAIR DEVICE POPUP MODAL */}
      <AnimatePresence>
        {isPairOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPairOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl border border-cardBorder bg-bgMidnight p-6 relative overflow-hidden z-10 glass-panel"
            >
              <h3 className="text-sm font-bold text-white font-heading uppercase tracking-wider mb-4 border-b border-cardBorder pb-2">
                Connect New Telemetry Hardware
              </h3>

              <form onSubmit={handlePairDevice} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">Device ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SM-HYD-8821"
                    value={deviceId}
                    onChange={(e) => setDeviceId(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl glass-input text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-mono text-textSecondary uppercase tracking-wider">Hardware Type</label>
                  <select
                    value={deviceType}
                    onChange={(e) => setDeviceType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-bgSpace border border-cardBorder text-xs text-textPrimary focus:outline-none"
                  >
                    <option value="Smart Meter">Smart Meter</option>
                    <option value="Solar Panel Monitor">Solar Panel Monitor</option>
                    <option value="Wind Turbine Sync">Wind Turbine Sync</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsPairOpen(false)}
                    className="flex-grow py-3.5 rounded-xl border border-cardBorder bg-cardSurface/30 text-textSecondary hover:text-textPrimary hover:bg-cardSurface/60 text-xs font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-grow py-3.5 rounded-xl bg-accentGreen text-bgSpace text-xs font-bold hover:scale-102 transition-all shadow-neon-green"
                  >
                    Pair Hardware &rarr;
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
