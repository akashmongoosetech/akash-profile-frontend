import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  type?: 'success' | 'info';
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, visible, onClose, type = 'success', duration = 2500 }) => {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [visible, onClose, duration]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className={`flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl border ${
              type === 'success'
                ? 'bg-green-900/90 border-green-500/30 text-green-200'
                : 'bg-blue-900/90 border-blue-500/30 text-blue-200'
            } backdrop-blur-lg`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {type === 'success' ? <Check className="w-5 h-5 text-green-400" /> : null}
            <span className="text-sm font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 transition-opacity">
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;
