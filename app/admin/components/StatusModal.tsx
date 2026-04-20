'use client';

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'success' | 'error' | 'warning';
  title: string;
  message: string;
  autoClose?: number;
}

export default function StatusModal({ isOpen, onClose, type, title, message, autoClose }: StatusModalProps) {
  // Configurações do tema baseado no tipo
  const themes = {
    success: {
      icon: <CheckCircle2 className="w-12 h-12 text-emerald-500" />,
      color: 'bg-emerald-500',
      textColor: 'text-emerald-700',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-100'
    },
    error: {
      icon: <AlertCircle className="w-12 h-12 text-rose-500" />,
      color: 'bg-rose-500',
      textColor: 'text-rose-700',
      bgColor: 'bg-rose-50',
      borderColor: 'border-rose-100'
    },
    warning: {
      icon: <AlertCircle className="w-12 h-12 text-amber-500" />,
      color: 'bg-amber-500',
      textColor: 'text-amber-700',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-100'
    }
  };

  const theme = themes[type];

  // Auto-close logic
  if (isOpen && autoClose) {
    setTimeout(onClose, autoClose * 1000);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[#1A3A5C]/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-[32px] shadow-2xl w-full max-w-sm relative z-10 overflow-hidden text-center"
          >
            {/* Barra superior de status */}
            <div className={`h-2 ${theme.color}`} />
            
            <div className="p-8">
              <div className="flex justify-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                  className={`w-20 h-20 rounded-full ${theme.bgColor} flex items-center justify-center`}
                >
                  {theme.icon}
                </motion.div>
              </div>

              <h3 className="text-xl font-bold text-[#1A3A5C] mb-2">{title}</h3>
              <p className="text-[#1A3A5C]/60 text-sm leading-relaxed mb-8">{message}</p>

              <button 
                onClick={onClose}
                className={`w-full py-4 px-6 rounded-2xl text-white font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg ${theme.color} hover:brightness-110`}
              >
                Entendi
              </button>
            </div>

            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-[#1A3A5C]/20 hover:text-[#1A3A5C] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
