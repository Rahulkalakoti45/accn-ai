import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Bell, Award, ShieldAlert, Sparkles, TrendingUp, Settings } from 'lucide-react';
import { useStore, NotificationItem } from '../store/useStore';
import { useNavigate } from 'react-router-dom';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markAllNotificationsRead } = useStore();
  const [activeTab, setActiveTab] = useState<'all' | 'credits' | 'trust' | 'marketplace' | 'system'>('all');
  const navigate = useNavigate();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'credits':
        return <TrendingUp className="w-4 h-4 text-accentGreen" />;
      case 'trust':
        return <Award className="w-4 h-4 text-accentCyan" />;
      case 'marketplace':
        return <Sparkles className="w-4 h-4 text-accentGold" />;
      case 'system':
      default:
        return <ShieldAlert className="w-4 h-4 text-accentPurple" />;
    }
  };

  const filteredNotifications = notifications.filter((n) => {
    if (activeTab === 'all') return true;
    return n.category === activeTab;
  });

  const handleNotificationClick = (link?: string) => {
    if (link) {
      navigate(link);
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed top-0 right-0 z-50 h-full w-full max-w-md border-l border-cardBorder bg-bgMidnight/95 backdrop-blur-md shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-cardBorder flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-accentGreen" />
                <h2 className="text-lg font-bold tracking-wide font-heading">Notifications</h2>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={markAllNotificationsRead}
                  className="flex items-center gap-1 text-xs text-accentGreen hover:text-accentGreen/80 transition-colors font-semibold"
                >
                  <Check className="w-3.5 h-3.5" />
                  Mark all read
                </button>
                <button
                  onClick={() => { navigate('/settings'); onClose(); }}
                  className="text-textSecondary hover:text-textPrimary transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1 rounded-md hover:bg-white/5 text-textSecondary hover:text-textPrimary transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b border-cardBorder flex gap-1 overflow-x-auto select-none">
              {(['all', 'credits', 'trust', 'marketplace', 'system'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs capitalize font-medium transition-all ${
                    activeTab === tab
                      ? 'bg-accentGreen/15 text-accentGreen border border-accentGreen/30'
                      : 'text-textSecondary hover:text-textPrimary border border-transparent'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Notification List */}
            <div className="flex-grow overflow-y-auto p-4 flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((n) => (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                      className={`relative p-4 rounded-xl border glass-panel transition-all hover:bg-white/5 ${
                        !n.read
                          ? 'border-l-4 border-l-accentCyan border-cardBorder'
                          : 'border-cardBorder'
                      }`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 mt-0.5">
                          {getCategoryIcon(n.category)}
                        </div>
                        <div className="flex-grow flex flex-col gap-1">
                          <div className="flex justify-between items-start gap-2">
                            <h4 className="text-sm font-semibold text-textPrimary leading-snug">{n.title}</h4>
                            <span className="text-[10px] font-mono text-textMuted flex-shrink-0 mt-0.5">{n.timestamp}</span>
                          </div>
                          <p className="text-xs text-textSecondary leading-relaxed">{n.body}</p>
                          {n.link && (
                            <button
                              onClick={() => handleNotificationClick(n.link)}
                              className="self-start text-[11px] font-semibold text-accentGreen hover:text-accentGreen/80 transition-colors mt-2"
                            >
                              Action Required &rarr;
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-center">
                    <Bell className="w-10 h-10 text-textMuted mb-2 opacity-50" />
                    <p className="text-sm text-textSecondary">No notifications found</p>
                    <p className="text-xs text-textMuted">You are all caught up!</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
