'use client';

import { useState } from 'react';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import Toast from '@/components/shared/Toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.user) {
        if (res.user.role === 'ADMIN') {
          setToast({ message: 'Administrative Access Granted. Initializing Command Panel.', type: 'success' });
          setTimeout(() => router.push('/admin'), 1500);
        } else {
          setError('Access Denied: Unrecognized administrative credentials.');
        }
      } else {
        setError(res.message || 'Invalid administrator passkey.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during secure command initialization.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1200"
      title="Atelier Terminal"
      quote='"Security is not the decoration of boundaries, but the clean definition of entry clearance."'
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[9px] tracking-[0.2em] font-semibold text-red-500 uppercase block font-sans">
            [ Restricted Access Only ]
          </span>
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide text-foreground">
            Admin Office
          </h2>
          <p className="text-xs text-muted font-medium">
            Please enter your administrative passkey to clear console access.
          </p>
        </div>

        {/* Premium Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold tracking-wide uppercase">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
              Admin Identifier
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@atelier.com"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="admin-email-input"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
                Security Passkey
              </label>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="admin-password-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity mt-2"
            id="admin-submit-button"
          >
            {loading ? 'Clearing Terminal...' : 'Clear Terminal'}
          </button>
        </form>

        {/* Security manifesto */}
        <div className="pt-6 border-t border-border/50 text-[10px] text-muted leading-relaxed font-sans font-medium">
          <span className="uppercase tracking-[0.15em] text-foreground font-bold block mb-1">
            Authentication Standard
          </span>
          <p>
            All connection protocols are simulated and tracked locally. Unregistered attempts will trigger local console log alerts.
          </p>
        </div>
      </div>

      {/* Reusable Toast Notifications */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />
    </AuthSplitLayout>
  );
}
