import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Sparkles, Command, ShieldCheck, Wallet, ArrowRight, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const items = [
    { title: 'Dashboard', category: 'Pages', desc: 'Overview of energy savings & credits', url: '/dashboard', icon: Command },
    { title: 'Energy Analytics', category: 'Pages', desc: 'Smart meter reports & predictions', url: '/analytics', icon: Command },
    { title: 'Carbon Wallet', category: 'Pages', desc: 'Transactions & mint new credits', url: '/wallet', icon: Wallet },
    { title: 'Trust Score Center', category: 'Pages', desc: 'AI verification score factors', url: '/trust-score', icon: ShieldCheck },
    { title: 'Live Marketplace', category: 'Pages', desc: 'Trade verified carbon credits', url: '/marketplace', icon: Sparkles },
    { title: 'Carbon Certificates', category: 'Pages', desc: 'Download regulatory documents', url: '/certificates', icon: Command },
    { title: 'AI Assistant (ARIA)', category: 'Pages', desc: 'Ask compliance & optimization queries', url: '/ai-assistant', icon: Sparkles },
    { title: 'ESG Compliance Reports', category: 'Pages', desc: 'Download compliance PDFs', url: '/esg-reports', icon: Command },
    { title: 'Leaderboard', category: 'Pages', desc: 'Check user ranks & badges', url: '/leaderboard', icon: Command },
    { title: 'Profile Settings', category: 'Pages', desc: 'Smart meters & configurations', url: '/settings', icon: Command },
    { title: 'Admin Verification Portal', category: 'Pages', desc: 'Fraud detection maps', url: '/admin', icon: Command },
  ];

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.desc.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleItemClick = (url: string) => {
    navigate(url);
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
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="w-full max-w-xl rounded-2xl border border-cardBorder bg-bgMidnight/95 backdrop-blur-lg shadow-2xl flex flex-col overflow-hidden max-h-[500px]"
            >
              {/* Search Bar */}
              <div className="flex items-center gap-3 px-4 py-4 border-b border-cardBorder">
                <Search className="w-5 h-5 text-textSecondary" />
                <input
                  type="text"
                  placeholder="Type a command or page name..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-grow bg-transparent text-sm text-textPrimary placeholder:text-textMuted border-none focus:outline-none"
                  autoFocus
                />
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-cardBorder text-[10px] font-mono text-textMuted border border-white/5 select-none">
                  ESC
                </div>
                <button
                  onClick={onClose}
                  className="text-textSecondary hover:text-textPrimary p-0.5 rounded-lg hover:bg-white/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-grow overflow-y-auto p-2">
                {filteredItems.length > 0 ? (
                  <div className="flex flex-col gap-1">
                    {filteredItems.map((item) => (
                      <button
                        key={item.url}
                        onClick={() => handleItemClick(item.url)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-left transition-colors border border-transparent hover:border-white/5 group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-cardBorder flex items-center justify-center text-textSecondary group-hover:text-accentGreen transition-colors">
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-textPrimary leading-none">
                                {item.title}
                              </span>
                              <span className="text-[9px] font-mono text-textMuted px-1.5 py-0.5 rounded bg-white/5 uppercase">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-[11px] text-textSecondary mt-1 block">
                              {item.desc}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-textMuted opacity-0 group-hover:opacity-100 group-hover:text-accentGreen translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Search className="w-8 h-8 text-textMuted mx-auto mb-2 opacity-50" />
                    <p className="text-sm text-textSecondary font-semibold">No results found</p>
                    <p className="text-xs text-textMuted mt-1">Try searching for "Wallet" or "Carbon"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-cardBorder/30 border-t border-cardBorder flex items-center justify-between text-[10px] text-textMuted font-mono select-none">
                <span>Use arrows to navigate, Enter to select</span>
                <span>ACCN COMMAND CENTER</span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
