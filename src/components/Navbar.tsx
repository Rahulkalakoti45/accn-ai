import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, Command, User, Sparkles } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useTheme } from '../utils/theme';
import { NotificationDrawer } from './NotificationDrawer';
import { SearchModal } from './SearchModal';

export const Navbar: React.FC = () => {
  const { user, unreadCount } = useStore();
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Synchronize keypress for Cmd+K / Ctrl+K search trigger
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Landing Hub';
    if (path === '/auth') return 'Authentication';
    if (path === '/dashboard') return 'Global Dashboard';
    if (path === '/analytics') return 'Energy Analytics';
    if (path === '/wallet') return 'Carbon Wallet';
    if (path === '/trust-score') return 'Trust Score Center';
    if (path === '/marketplace') return 'Carbon Marketplace';
    if (path === '/certificates') return 'Certificates Gallery';
    if (path === '/ai-assistant') return 'ARIA AI Assistant';
    if (path === '/esg-reports') return 'ESG Reports Console';
    if (path === '/leaderboard') return 'Leaderboards';
    if (path === '/settings') return 'Account Settings';
    if (path === '/admin') return 'Admin Verification Portal';
    return 'ACCN System';
  };

  const count = unreadCount();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-cardBorder bg-bgMidnight/70 backdrop-blur-md z-40 flex items-center justify-between px-6 select-none">
        {/* Brand / Breadcrumbs */}
        <div className="flex items-center gap-6">
          <div onClick={() => navigate('/')} className="flex items-center gap-2 cursor-pointer group">
            <span className="text-xl font-bold tracking-wider font-heading text-gradient-green-cyan uppercase group-hover:opacity-90">
              ACCN
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-accentGreen animate-pulse mt-1" />
          </div>
          <div className="h-4 w-px bg-cardBorder hidden md:block" />
          <span className="text-xs font-mono font-bold text-textSecondary uppercase tracking-widest hidden md:block mt-0.5">
            {getPageTitle()}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {/* Simulated Search Trigger */}
          <div
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2.5 px-3 py-2 w-48 md:w-64 rounded-xl border border-cardBorder bg-cardSurface/40 hover:bg-cardSurface/60 text-textMuted cursor-pointer transition-all hover:border-white/10 group"
          >
            <Search className="w-4 h-4 text-textSecondary group-hover:text-textPrimary transition-colors" />
            <span className="text-xs text-textSecondary group-hover:text-textPrimary transition-colors flex-grow text-left">
              Quick Search...
            </span>
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-cardBorder text-[9px] font-mono border border-white/5">
              <Command className="w-2.5 h-2.5" />K
            </div>
          </div>

          {/* Glowing Notification Icon */}
          <button
            onClick={() => setIsNotifOpen(true)}
            className="relative p-2 rounded-xl border border-cardBorder bg-cardSurface/40 hover:bg-cardSurface/60 text-textSecondary hover:text-textPrimary transition-all hover:border-white/10 hover:scale-105"
          >
            <Bell className="w-4.5 h-4.5" />
            {count > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-danger text-[9px] font-bold font-mono text-white flex items-center justify-center border border-bgMidnight">
                {count}
              </span>
            )}
          </button>

          {/* User Info Avatar Link */}
          <div
            onClick={() => navigate('/settings')}
            className="flex items-center gap-2.5 pl-2 py-1 pr-1 rounded-xl border border-cardBorder bg-cardSurface/40 hover:bg-cardSurface/60 cursor-pointer transition-all hover:border-white/10"
          >
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-textPrimary leading-none">{user.name}</div>
              <div className="text-[10px] text-textSecondary leading-none mt-1 font-mono flex items-center gap-0.5">
                <Sparkles className="w-2.5 h-2.5 text-accentGold" /> Verified
              </div>
            </div>
            <div className="w-8 h-8 rounded-lg bg-cardBorder border border-white/10 flex items-center justify-center text-textSecondary hover:text-accentGreen hover:border-accentGreen/30 transition-all">
              <User className="w-4.5 h-4.5" />
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Notifications Panel */}
      <NotificationDrawer isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />

      {/* Floating CMD+K Command Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
