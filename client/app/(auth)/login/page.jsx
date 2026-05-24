'use client';

import { useState } from 'react';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/lib/ShopContext';
import Toast from '@/components/shared/Toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useShop();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push('/profile');
      } else {
        setError(res.message || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during authentication. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      image="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1200"
      title="The Minimal Uniform"
      quote='"Clarity and luxury reside in the absolute restraint of structural layers."'
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[9px] tracking-[0.2em] font-semibold text-muted uppercase block">
            Atelier Authentication
          </span>
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide text-foreground">
            Sign In
          </h2>
          <p className="text-xs text-muted font-medium">
            Enter your credentials to access your bespoke dashboard.
          </p>
        </div>

        {/* Premium Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold tracking-wide uppercase">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          {error && <div className="text-xs text-red-500 font-bold uppercase tracking-wide p-2 bg-red-500/10 rounded-xl">{error}</div>}
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sterling@atelier.com"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="login-email-input"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
                Password
              </label>
              <button
                type="button"
                onClick={() => setToast({ message: 'Demo Mode: Password resets are disabled.', type: 'error' })}
                className="text-[9px] uppercase tracking-widest text-muted hover:text-foreground font-bold underline"
              >
                Forgot?
              </button>
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="login-password-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2"
            id="login-submit-button"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Separator */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[9px] uppercase font-bold text-muted tracking-widest">
            <span className="bg-background px-3">Or Authenticate With</span>
          </div>
        </div>

        {/* Social auth triggers */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              setToast({ message: 'Redirecting to Google authenticator...', type: 'success' });
              setTimeout(() => router.push('/profile'), 1500);
            }}
            className="py-3 border border-border rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-secondary transition-colors"
          >
            Google
          </button>
          <button
            onClick={() => {
              setToast({ message: 'Redirecting to Apple ID authenticator...', type: 'success' });
              setTimeout(() => router.push('/profile'), 1500);
            }}
            className="py-3 border border-border rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-secondary transition-colors"
          >
            Apple Pay
          </button>
        </div>

        {/* Account redirect */}
        <p className="text-center text-xs text-muted font-medium pt-4">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-foreground font-bold hover:underline">
            Register Here
          </Link>
        </p>
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
