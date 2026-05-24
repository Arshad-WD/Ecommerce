'use client';
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const bgStyles = type === 'success' 
    ? 'bg-neutral-900/90 border-emerald-500/30 text-neutral-100 dark:bg-neutral-950/95' 
    : 'bg-neutral-900/90 border-red-500/30 text-neutral-100 dark:bg-neutral-950/95';

  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const iconColor = type === 'success' ? 'text-emerald-400' : 'text-red-400';

  return (
    <div className="fixed bottom-6 right-6 z-[9999] animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className={`flex items-center gap-3 px-5 py-4 border rounded-2xl shadow-xl backdrop-blur-md min-w-[280px] max-w-sm ${bgStyles}`}>
        <Icon className={`w-5 h-5 shrink-0 ${iconColor}`} />
        <p className="text-xs font-medium tracking-wide flex-1 pr-2 leading-relaxed">
          {message}
        </p>
        <button 
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-200 p-1 rounded-full hover:bg-neutral-800 transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
