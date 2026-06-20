import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  Wallet, 
  ShieldCheck, 
  ShoppingBag, 
  FileText, 
  MessageSquare, 
  ClipboardList, 
  Trophy, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Lock,
  LogOut
} from 'lucide-react';
import { useTheme } from '../utils/theme';
import { motion } from 'framer-motion';
import { supabase } from '../utils/supabase';
import { useStore } from '../store/useStore';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate('/auth');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Energy Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Carbon Wallet', path: '/wallet', icon: Wallet },
    { name: 'Trust Score', path: '/trust-score', icon: ShieldCheck },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'Certificates', path: '/certificates', icon: FileText },
    { name: 'AI Assistant', path: '/ai-assistant', icon: MessageSquare },
    { name: 'ESG Reports', path: '/esg-reports', icon: ClipboardList },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 260 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="fixed left-0 top-0 h-full border-r border-cardBorder bg-bgMidnight/80 backdrop-blur-md z-30 flex flex-col pt-16 select-none overflow-x-hidden"
    >
      {/* Navigation Items */}
      <nav className="flex-grow py-6 flex flex-col gap-1 px-3">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-3 py-3.5 rounded-xl text-sm font-medium transition-all group ${
                isActive
                  ? `bg-white/5 border border-white/10 ${theme.text}`
                  : 'text-textSecondary hover:text-textPrimary hover:bg-white/5 border border-transparent'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
                {/* Active left border line */}
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute left-0 w-1 h-8 rounded-r-full"
                    style={{ backgroundColor: theme.primary }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Separator */}
        <div className="h-px bg-cardBorder my-3 mx-2" />

        {/* Admin Portal (Restricted Lock Access) */}
        <NavLink
          to="/admin"
          className={({ isActive }) =>
            `flex items-center justify-between px-3 py-3.5 rounded-xl text-sm font-medium transition-all group ${
              isActive
                ? 'bg-danger/10 border border-danger/30 text-danger'
                : 'text-textSecondary hover:text-danger hover:bg-danger/5 border border-transparent'
            }`
          }
        >
          <div className="flex items-center gap-3.5">
            <Lock className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                Admin Portal
              </motion.span>
            )}
          </div>
          {!isCollapsed && (
            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-danger/10 border border-danger/20 text-danger uppercase tracking-wider">
              Secure
            </span>
          )}
        </NavLink>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3.5 px-3 py-3.5 rounded-xl text-sm font-medium text-textSecondary hover:text-danger hover:bg-danger/5 border border-transparent w-full text-left cursor-pointer group mt-2"
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:text-danger transition-colors" />
          {!isCollapsed && (
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              Logout
            </motion.span>
          )}
        </button>
      </nav>

      {/* Collapse / Expand Toggle Button */}
      <div className="p-4 border-t border-cardBorder flex justify-end">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg border border-cardBorder bg-cardSurface/60 text-textSecondary hover:text-textPrimary hover:bg-cardSurface transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </motion.aside>
  );
};
