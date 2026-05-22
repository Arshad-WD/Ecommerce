'use client';

import { User, ShoppingBag, Heart, MapPin, Settings, LogOut } from 'lucide-react';
import { useShop } from '@/lib/ShopContext';

export default function ProfileSidebar({ activeTab, setActiveTab }) {
  const { user } = useShop();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'orders', label: 'My Orders', icon: ShoppingBag },
    { id: 'addresses', label: 'Addresses', icon: MapPin },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6">
      {/* 1. Atelier Dashboard Welcome Header */}
      <div className="bg-secondary/40 border border-border p-6 rounded-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm tracking-wide dark:bg-white dark:text-neutral-900">
          {user.avatar}
        </div>
        <div>
          <span className="text-[9px] uppercase tracking-[0.2em] text-muted font-bold block">
            Welcome back,
          </span>
          <h3 className="font-serif text-lg font-semibold text-foreground">
            {user.name}
          </h3>
        </div>
      </div>

      {/* 2. Responsive Tabs Panel */}
      <nav className="flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible border-b md:border-b-0 md:border-none border-border pb-2 md:pb-0 gap-1.5 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold rounded-xl shrink-0 transition-all ${
                isActive
                  ? 'bg-foreground text-background dark:bg-white dark:text-neutral-900 shadow-sm'
                  : 'text-foreground/75 hover:bg-secondary hover:text-foreground'
              }`}
            >
              <Icon className="w-4 h-4 stroke-[1.5]" />
              {tab.label}
            </button>
          );
        })}
        
        {/* Simple visual Logout option */}
        <button
          onClick={() => alert('Atelier Session Terminated (Demo)')}
          className="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-wider font-bold text-neutral-400 hover:text-neutral-950 dark:hover:text-white rounded-xl shrink-0 mt-auto transition-colors"
        >
          <LogOut className="w-4 h-4 stroke-[1.5]" />
          Logout
        </button>
      </nav>
    </aside>
  );
}
