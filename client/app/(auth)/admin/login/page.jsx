'use client';

import AuthSplitLayout from '@/components/auth/AuthSplitLayout';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    alert('Administrative Access Granted. Initializing Command Panel (Simulation).');
    router.push('/');
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

        {/* Input Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[9px] uppercase tracking-widest font-bold text-muted block">
              Admin Identifier
            </label>
            <input
              type="email"
              required
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
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
              id="admin-password-input"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity mt-2"
            id="admin-submit-button"
          >
            Clear Terminal
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
    </AuthSplitLayout>
  );
}
