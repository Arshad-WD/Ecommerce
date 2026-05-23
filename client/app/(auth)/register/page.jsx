'use client';

import { useState } from 'react';
import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/lib/ShopContext';

export default function RegisterPage() {
  const router = useRouter();
  const { signup } = useShop();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await signup(name, email, password);
      if (res.success) {
        router.push('/profile');
      } else {
        setError(res.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during registration. Please try again.');
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

        {/* Premium Error Alert */}
        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold tracking-wide uppercase">
            {error}
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleRegisterSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="register-confirm-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity mt-2 flex items-center justify-center gap-2"
            id="register-submit-button"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
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
