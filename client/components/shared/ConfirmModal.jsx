'use client';
import React from 'react';
import { AlertCircle, X } from 'lucide-react';

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl overflow-hidden border border-border flex flex-col p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-950/20 border border-red-900/30 flex items-center justify-center text-red-500 shrink-0">
              <AlertCircle size={20} />
            </div>
            <h3 className="font-serif text-lg text-foreground">{title || 'Confirm Action'}</h3>
          </div>
          <button 
            onClick={onCancel}
            className="text-muted hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-secondary"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-muted leading-relaxed font-medium">
          {message || 'Are you sure you want to perform this action? This cannot be undone.'}
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            type="button"
            onClick={onCancel} 
            className="px-4 py-2.5 border border-border text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-secondary transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button"
            onClick={onConfirm} 
            className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 text-[10px] font-semibold uppercase tracking-widest transition-colors rounded-xl"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
