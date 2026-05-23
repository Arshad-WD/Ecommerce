'use client';
import { ArrowUpRight, ArrowDownRight, CreditCard, ShoppingBag, Users, DollarSign } from 'lucide-react';

const stats = [
  { name: 'Total Revenue', value: '$84,231.00', icon: DollarSign, change: '+12.5%', isUp: true },
  { name: 'Active Orders', value: '142', icon: ShoppingBag, change: '+5.2%', isUp: true },
  { name: 'Customers', value: '1,240', icon: Users, change: '+2.1%', isUp: true },
  { name: 'Avg. Order', value: '$593.00', icon: CreditCard, change: '-1.4%', isUp: false },
];

const recentOrders = [
  { id: '#ORD-0921', customer: 'Eloise Dubois', date: 'Oct 24, 2026', total: '$1,250.00', status: 'Fulfilled' },
  { id: '#ORD-0920', customer: 'Julian Vance', date: 'Oct 23, 2026', total: '$890.00', status: 'Processing' },
  { id: '#ORD-0919', customer: 'Amelie Laurent', date: 'Oct 22, 2026', total: '$1,450.00', status: 'Fulfilled' },
  { id: '#ORD-0918', customer: 'Nico Rossi', date: 'Oct 21, 2026', total: '$420.00', status: 'Pending' },
];

export default function AnalyticsPage() {
  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/50 pb-6">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-foreground">Analytics Overview</h1>
          <p className="text-muted mt-3 text-sm tracking-wide font-medium">Monitor your store's performance and recent activity.</p>
        </div>
        <div className="mt-4 md:mt-0 px-4 py-2 bg-secondary/50 rounded-full border border-border/50 text-[10px] uppercase font-bold tracking-widest text-foreground">
          Last Updated: Just Now
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="p-6 border border-border/50 bg-gradient-to-br from-background to-secondary/20 rounded-2xl shadow-[0_4px_20px_-8px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] hover:border-foreground/20 transition-all duration-500 group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-foreground/5 rounded-full blur-2xl group-hover:bg-foreground/10 transition-colors duration-500" />
              <div className="flex items-center justify-between text-muted mb-6 relative z-10">
                <span className="font-semibold uppercase tracking-[0.2em] text-[10px] text-foreground/70 group-hover:text-foreground transition-colors">{stat.name}</span>
                <div className="p-2 bg-background border border-border/50 rounded-xl group-hover:scale-110 transition-transform duration-500 shadow-sm">
                  <Icon size={16} strokeWidth={1.5} className="text-foreground" />
                </div>
              </div>
              <div className="text-3xl font-serif text-foreground mb-3 relative z-10 tracking-wide">{stat.value}</div>
              <div className={`text-xs flex items-center gap-1 font-semibold tracking-wide relative z-10 ${stat.isUp ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                <span className={`p-0.5 rounded-full ${stat.isUp ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-rose-100 dark:bg-rose-900/30'}`}>
                  {stat.isUp ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                </span>
                <span>{stat.change} <span className="text-muted/60 text-[9px] uppercase ml-1 font-bold">last 30d</span></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 border border-border/50 bg-background rounded-2xl p-6 md:p-8 flex flex-col shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]">
           <div className="flex justify-between items-center mb-10 w-full border-b border-border/40 pb-4">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-foreground block" />
              Revenue Activity
            </h2>
            <select className="bg-secondary/30 border border-border/50 rounded-lg px-3 py-1.5 text-[10px] text-foreground outline-none uppercase tracking-wider font-bold cursor-pointer hover:bg-secondary/60 transition-colors">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
           </div>
           
           {/* Refined Abstract Bar Chart */}
           <div className="flex-1 min-h-[250px] flex items-end justify-between sm:justify-around px-2 border-b border-border/40 pb-4 pt-10 shrink-0 relative mt-2">
             {/* Background grid lines */}
             <div className="absolute inset-x-0 top-0 bottom-4 flex flex-col justify-between pointer-events-none opacity-10 z-0">
               {[1,2,3,4,5].map(i => <div key={i} className="w-full border-t border-foreground border-dashed" />)}
             </div>
             {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className="w-8 sm:w-12 md:w-16 bg-foreground/10 hover:bg-foreground transition-colors duration-500 relative group rounded-t-xl z-10" style={{ height: `${height}%` }}>
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 shadow-xl pointer-events-none whitespace-nowrap">
                    ${height * 100}
                  </div>
                </div>
             ))}
           </div>
           <div className="flex justify-between sm:justify-around text-[9px] uppercase tracking-[0.2em] text-muted mt-5 font-bold px-0 lg:px-2">
             <span className="w-8 sm:w-12 md:w-16 text-center">Mon</span>
             <span className="w-8 sm:w-12 md:w-16 text-center">Tue</span>
             <span className="w-8 sm:w-12 md:w-16 text-center">Wed</span>
             <span className="w-8 sm:w-12 md:w-16 text-center">Thu</span>
             <span className="w-8 sm:w-12 md:w-16 text-center">Fri</span>
             <span className="w-8 sm:w-12 md:w-16 text-center">Sat</span>
             <span className="w-8 sm:w-12 md:w-16 text-center">Sun</span>
           </div>
        </div>

        <div className="border border-border/50 bg-background rounded-2xl p-6 md:p-8 flex flex-col shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-8 border-b border-border/40 pb-4">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground">Recent Orders</h2>
            <span className="px-2 py-0.5 bg-foreground text-background rounded-full text-[9px] font-bold">New</span>
          </div>
          <div className="flex-1 flex flex-col justify-between">
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/40 transition-colors group">
                  <div>
                    <div className="text-sm font-semibold text-foreground tracking-wide">{order.customer}</div>
                    <div className="text-[10px] text-muted flex gap-2 uppercase tracking-wider mt-1.5 items-center">
                       <span className="font-mono bg-secondary px-1.5 py-0.5 rounded-md text-foreground/70 group-hover:bg-background transition-colors">{order.id}</span>
                       <span className="text-[8px]">•</span>
                       <span className={`font-bold flex items-center gap-1 ${order.status === 'Fulfilled' ? 'text-emerald-600' : 'text-amber-600'}`}>
                         <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Fulfilled' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                         {order.status}
                       </span>
                    </div>
                  </div>
                  <div className="text-sm text-foreground font-serif text-right">{order.total}</div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3.5 bg-secondary/30  rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-colors shadow-sm">
              View All Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
