'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardList, Package, Users, Settings, LogOut, ArrowUpRight, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Orders', href: '/admin/orders', icon: ClipboardList },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleSignOut = async () => {
    try {
      const { authApi } = await import('@/lib/api');
      await authApi.logout();
      if (typeof window !== 'undefined') window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="w-64 border-r border-border hidden md:flex flex-col bg-background/95 sticky top-0 h-screen">
        <div className="p-8 border-b border-border">
          <Link href="/">
            <span className="font-serif text-lg font-bold tracking-[0.25em] text-foreground">
              ATELIER
            </span>
            <span className="block text-[10px] tracking-widest text-muted mt-2 uppercase">
              Admin Portal
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');
            const Icon = item.icon;
            
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 group ${
                  isActive 
                    ? 'text-foreground font-semibold bg-secondary/80 shadow-sm border border-border/50' 
                    : 'text-muted hover:text-foreground hover:bg-secondary/40 border border-transparent hover:border-border/30'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-foreground' : 'group-hover:text-foreground transition-colors'} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-border">
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-foreground hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-300 w-full group border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
          >
            <LogOut size={18} strokeWidth={1.5} className="group-hover:text-red-500 transition-colors" />
            <span className="group-hover:text-red-500 transition-colors font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <aside className="relative flex flex-col w-64 max-w-xs bg-background border-r border-border h-full p-6 animate-in slide-in-from-left duration-300 z-50">
            <div className="flex items-center justify-between pb-6 border-b border-border">
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="font-serif text-lg font-bold tracking-[0.25em] text-foreground">
                  ATELIER
                </span>
                <span className="block text-[9px] tracking-widest text-muted mt-1 uppercase font-semibold">
                  Admin Portal
                </span>
              </Link>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-muted hover:text-foreground p-1 rounded-full hover:bg-secondary"
              >
                <X size={18} />
              </button>
            </div>

            <nav className="flex-1 py-6 space-y-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href || (pathname.startsWith(item.href + '/') && item.href !== '/admin');
                const Icon = item.icon;
                
                return (
                  <Link 
                    key={item.name} 
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-300 group ${
                      isActive 
                        ? 'text-foreground font-semibold bg-secondary/80 shadow-sm border border-border/50' 
                        : 'text-muted hover:text-foreground hover:bg-secondary/40 border border-transparent hover:border-border/30'
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-foreground' : 'group-hover:text-foreground transition-colors'} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            <div className="pt-6 border-t border-border">
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-muted hover:text-foreground hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-all duration-300 w-full group border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
              >
                <LogOut size={18} strokeWidth={1.5} className="group-hover:text-red-500 transition-colors" />
                <span className="group-hover:text-red-500 transition-colors font-medium">Sign Out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-border flex items-center px-8 justify-between md:justify-end bg-background sticky top-0 z-40">
          <div className="flex items-center gap-3 md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-muted hover:text-foreground p-2 rounded-xl border border-border bg-secondary/35 hover:bg-secondary transition-colors"
            >
              <Menu size={18} />
            </button>
            <span className="font-serif text-lg font-bold tracking-[0.25em] text-foreground">
              ATELIER
            </span>
          </div>
          <div className="flex items-center gap-3 text-foreground">
            <Link href="/" className="flex items-center gap-1.5 px-3.5 py-2 rounded-full hover:bg-secondary/60 text-[10px] text-muted hover:text-foreground font-bold tracking-widest uppercase transition-all duration-300 border border-transparent hover:border-border/50 group">
              <span>View Store</span>
              <ArrowUpRight size={14} strokeWidth={2} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
            <button 
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/20 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 shadow-sm shrink-0"
            >
              <LogOut size={13} strokeWidth={2} />
              <span>Sign Out</span>
            </button>
            <div className="h-6 w-px bg-border/50 mx-1" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-foreground to-foreground/80 flex items-center justify-center font-serif font-bold text-sm ring-4 ring-secondary/50 text-background shadow-sm shadow-foreground/10 transition-shadow hover:shadow-md hover:ring-secondary cursor-pointer">
                A
              </div>
              <div className="hidden sm:flex flex-col justify-center">
                <span className="font-semibold text-[11px] tracking-widest uppercase">Administrator</span>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-auto bg-neutral-50/30 dark:bg-neutral-900/10">
          {children}
        </div>
      </main>
    </div>
  );
}
