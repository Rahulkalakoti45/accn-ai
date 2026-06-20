import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useToastStore, ToastMessage } from '../store/useToastStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-6 right-6 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onClose: () => void }> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-accentGreen" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-accentGold" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-danger" />;
      case 'info':
        return <Info className="w-5 h-5 text-accentCyan" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-accentGreen/30 shadow-neon-green/10';
      case 'warning':
        return 'border-accentGold/30 shadow-neon-gold/10';
      case 'error':
        return 'border-danger/30 shadow-red-500/10';
      case 'info':
        return 'border-accentCyan/30 shadow-neon-cyan/10';
    }
  };

  const getProgressColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-accentGreen';
      case 'warning':
        return 'bg-accentGold';
      case 'error':
        return 'bg-danger';
      case 'info':
        return 'bg-accentCyan';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 20, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`pointer-events-auto relative overflow-hidden flex items-start gap-3 p-4 rounded-xl border glass-panel-heavy shadow-lg ${getBorderColor()}`}
    >
      <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-grow flex flex-col gap-0.5">
        <h4 className="text-sm font-semibold text-textPrimary leading-none">{toast.title}</h4>
        <p className="text-xs text-textSecondary leading-normal">{toast.body}</p>
      </div>
      <button
        onClick={onClose}
        className="flex-shrink-0 text-textMuted hover:text-textPrimary transition-colors rounded p-0.5 hover:bg-white/5"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress bar timer */}
      <motion.div
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: 4, ease: 'linear' }}
        className={`absolute bottom-0 left-0 h-0.5 ${getProgressColor()}`}
      />
    </motion.div>
  );
};
