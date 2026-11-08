'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Loader2, X, ExternalLink } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'loading' | 'success' | 'error';
  title: string;
  description?: string;
  txHash?: string;
}

interface NotificationToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function NotificationToast({ toasts, onDismiss }: NotificationToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full px-4 sm:px-0 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-5 ${
            toast.type === 'loading'
              ? 'bg-[#1e1e18]/95 border-accent/40 text-primaryText shadow-gold'
              : toast.type === 'success'
              ? 'bg-[#19241b]/95 border-emerald-500/40 text-emerald-100 shadow-lg'
              : 'bg-[#281a1a]/95 border-rose-500/40 text-rose-100 shadow-lg'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toast.type === 'loading' && (
              <Loader2 className="w-5 h-5 text-accent animate-spin" />
            )}
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium tracking-wide text-[#F5F0E8]">
              {toast.title}
            </h4>
            {toast.description && (
              <p className="mt-0.5 text-xs text-secondaryText leading-relaxed break-words">
                {toast.description}
              </p>
            )}
            {toast.txHash && (
              <a
                href={`https://scan.bohr.life/tx/${toast.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-xs text-accent hover:text-accent-hover transition-colors underline underline-offset-2"
              >
                <span>View on Botchain Explorer</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="shrink-0 p-1 rounded-lg text-secondaryText hover:text-primaryText hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

