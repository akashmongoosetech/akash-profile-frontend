import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  title: string;
  itemName?: string;
  itemDescription?: string;
  isDeleting?: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  onDelete,
  title,
  itemName,
  itemDescription,
  isDeleting = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-red-900/90 to-rose-900/90 backdrop-blur-xl rounded-3xl p-8 border border-red-500/30 shadow-2xl max-w-md mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Warning Animation */}
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", duration: 0.6 }}
                className="relative mx-auto w-20 h-20 mb-6"
              >
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-red-400 to-rose-500 rounded-full w-20 h-20 flex items-center justify-center">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white mb-3"
              >
                {title}
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-6"
              >
                <p className="text-red-100 text-lg mb-3">
                  Are you sure you want to delete this item?
                </p>
                {itemName && (
                  <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                    <h4 className="font-semibold text-white text-sm mb-1">
                      "{itemName}"
                    </h4>
                    {itemDescription && (
                      <p className="text-gray-300 text-xs">
                        {itemDescription}
                      </p>
                    )}
                  </div>
                )}
                <p className="text-red-200 text-sm mt-3">
                  ⚠️ This action cannot be undone!
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex gap-3 justify-center"
              >
                <button
                  onClick={onClose}
                  disabled={isDeleting}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileHover={{ scale: isDeleting ? 1 : 1.05 }}
                  whileTap={{ scale: isDeleting ? 1 : 0.95 }}
                  onClick={onDelete}
                  disabled={isDeleting}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center gap-2"
                >
                  {isDeleting ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete Forever'
                  )}
                </motion.button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DeleteModal;
