'use client';

import { useState } from 'react';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/lib/ShopContext';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useShop();

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      const { authApi } = await import('@/lib/api');
      const response = await authApi.signup({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response && response.success) {
        const userData = response.user || response.data?.user;
        if (userData) {
          setUser(userData);
          localStorage.setItem('atelier_token', response.token || response.data?.accessToken || '');
          localStorage.setItem('atelier_user', JSON.stringify(userData));
          router.push('/profile');
        }
      } else {
        setError(response.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthSplitLayout
      image="https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&q=80&w=1200"
      title="Restrained Form"
      quote='"We seek silhouettes that are built, not decorated. Restraint is the core form of elegance."'
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <span className="text-[9px] tracking-[0.2em] font-semibold text-muted uppercase block">
            Atelier Registration
          </span>
          <h2 className="font-serif text-2xl md:text-3xl uppercase tracking-wide text-foreground">
            Register
          </h2>
          <p className="text-xs text-muted font-medium">
            Create your account to save selections and track orders.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-500 text-[10px] font-bold tracking-widest uppercase text-center">
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Alexander Vane"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="register-name-input"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="vane@atelier.com"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="register-email-input"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
              Password
            </label>
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="register-password-input"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="register-confirm-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2 disabled:opacity-70"
            id="register-submit-button"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : 'Create Account'}
          </button>
        </form>

        {/* separator */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-[9px] uppercase font-bold text-muted tracking-widest">
            <span className="bg-background px-3">Or Register With</span>
          </div>
        </div>

        {/* Social auth inputs */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => {
              alert('Registering via Google auth...');
              router.push('/profile');
            }}
            className="py-3 border border-border rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-secondary transition-colors"
          >
            Google
          </button>
          <button
            onClick={() => {
              alert('Registering via Apple Pay ID...');
              router.push('/profile');
            }}
            className="py-3 border border-border rounded-xl text-[10px] font-bold tracking-widest uppercase hover:bg-secondary transition-colors"
          >
            Apple Pay
          </button>
        </div>

        {/* Account redirect */}
        <p className="text-center text-xs text-muted font-medium pt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-foreground font-bold hover:underline">
            Sign In Here
          </Link>
        </p>
      </div>
    </AuthSplitLayout>
  );
}
