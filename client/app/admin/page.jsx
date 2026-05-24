'use client';
import { useState, useEffect, useCallback } from 'react';
import { ArrowUpRight, ArrowDownRight, CreditCard, ShoppingBag, Users, DollarSign, RefreshCw, Package } from 'lucide-react';
import { adminApi } from '@/lib/api';

// ── Skeleton loader for stat cards ──────────────────────────────────────────
function StatSkeleton() {
  return (
    <div className="p-6 border border-border/50 bg-gradient-to-br from-background to-secondary/20 rounded-2xl animate-pulse">
      <div className="flex items-center justify-between mb-6">
        <div className="h-2.5 w-24 bg-secondary rounded-full" />
        <div className="p-2 bg-secondary/60 border border-border/50 rounded-xl w-9 h-9" />
      </div>
      <div className="h-8 w-32 bg-secondary rounded-full mb-3" />
      <div className="h-2 w-20 bg-secondary/60 rounded-full" />
    </div>
  );
}

// ── Status badge colours ─────────────────────────────────────────────────────
function statusStyle(status) {
  const s = (status || '').toUpperCase();
  if (s === 'DELIVERED') return { dot: 'bg-emerald-500', text: 'text-emerald-600' };
  if (s === 'SHIPPED')   return { dot: 'bg-blue-500',    text: 'text-blue-600'    };
  if (s === 'PROCESSING')return { dot: 'bg-amber-500',   text: 'text-amber-600'   };
  if (s === 'CANCELLED') return { dot: 'bg-rose-500',    text: 'text-rose-500'    };
  return { dot: 'bg-neutral-400', text: 'text-muted' }; // PENDING
}

// ── Revenue bar chart ────────────────────────────────────────────────────────
function RevenueChart({ salesData, labels, loading }) {
  const max = salesData.length ? Math.max(...salesData, 1) : 1;

  const fmtLabel = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  };

  if (loading) {
    return (
      <div className="flex-1 min-h-[250px] flex items-end justify-around px-2 pb-4 pt-10 gap-2 animate-pulse">
        {[60, 80, 45, 90, 55, 75, 100].map((h, i) => (
          <div key={i} className="flex-1 bg-secondary/60 rounded-t-xl" style={{ height: `${h}%` }} />
        ))}
      </div>
    );
  }

  if (!salesData.length) {
    return (
      <div className="flex-1 min-h-[250px] flex items-center justify-center text-muted text-sm">
        No sales data for this period.
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 min-h-[250px] flex items-end justify-between sm:justify-around px-2 border-b border-border/40 pb-4 pt-10 shrink-0 relative mt-2">
        {/* Grid lines */}
        <div className="absolute inset-x-0 top-0 bottom-4 flex flex-col justify-between pointer-events-none opacity-10 z-0">
          {[1,2,3,4,5].map(i => <div key={i} className="w-full border-t border-foreground border-dashed" />)}
        </div>
        {salesData.map((value, i) => {
          const pct = Math.max((value / max) * 100, 2);
          return (
            <div
              key={i}
              className="flex-1 mx-0.5 max-w-[60px] bg-foreground/10 hover:bg-foreground transition-colors duration-500 relative group rounded-t-xl z-10 cursor-pointer"
              style={{ height: `${pct}%` }}
            >
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-foreground text-background text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:-translate-y-1 shadow-xl pointer-events-none whitespace-nowrap">
                ${value.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between sm:justify-around text-[9px] uppercase tracking-[0.2em] text-muted mt-5 font-bold px-0 lg:px-2">
        {labels.map((l, i) => (
          <span key={i} className="flex-1 max-w-[60px] text-center">{fmtLabel(l)}</span>
        ))}
      </div>
    </>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export default function AnalyticsPage() {
  const [overview, setOverview]     = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [salesChart, setSalesChart] = useState({ labels: [], sales: [] });
  const [range, setRange]           = useState('7');
  const [loadingOverview, setLoadingOverview] = useState(true);
  const [loadingOrders, setLoadingOrders]     = useState(true);
  const [loadingChart, setLoadingChart]       = useState(true);
  const [lastUpdated, setLastUpdated]         = useState('');
  const [error, setError]                     = useState(null);

  // ── Fetch overview stats ─────────────────────────────────────────────────
  const fetchOverview = useCallback(async () => {
    setLoadingOverview(true);
    try {
      const res = await adminApi.getAnalyticsOverview();
      setOverview(res?.data || res);
    } catch (e) {
      console.error('Overview fetch error', e);
      setError('Failed to load analytics. Check backend connection.');
    } finally {
      setLoadingOverview(false);
    }
  }, []);

  // ── Fetch recent orders ──────────────────────────────────────────────────
  const fetchRecentOrders = useCallback(async () => {
    setLoadingOrders(true);
    try {
      const res = await adminApi.getAnalyticsRecentOrders();
      setRecentOrders(Array.isArray(res?.data) ? res.data : []);
    } catch (e) {
      console.error('Recent orders fetch error', e);
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  // ── Fetch sales chart ────────────────────────────────────────────────────
  const fetchSalesChart = useCallback(async (r) => {
    setLoadingChart(true);
    try {
      const res = await adminApi.getAnalyticsSales(`${r}d`);
      const data = res?.data || res;
      setSalesChart({ labels: data.labels || [], sales: data.sales || [] });
    } catch (e) {
      console.error('Sales chart fetch error', e);
    } finally {
      setLoadingChart(false);
    }
  }, []);

  // ── Initial load ─────────────────────────────────────────────────────────
  useEffect(() => {
    fetchOverview();
    fetchRecentOrders();
    fetchSalesChart(range);
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  }, []);

  // ── Range change ─────────────────────────────────────────────────────────
  const handleRangeChange = (e) => {
    setRange(e.target.value);
    fetchSalesChart(e.target.value);
  };

  // ── Refresh all ──────────────────────────────────────────────────────────
  const handleRefresh = () => {
    fetchOverview();
    fetchRecentOrders();
    fetchSalesChart(range);
    setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  };

  // ── Build stat cards from live overview ──────────────────────────────────
  const stats = overview ? [
    {
      name: 'Total Revenue',
      value: `$${Number(overview.totalSales || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      sub: 'From paid orders',
      isUp: true,
    },
    {
      name: 'Total Orders',
      value: Number(overview.totalOrders || 0).toLocaleString(),
      icon: ShoppingBag,
      sub: 'All time',
      isUp: true,
    },
    {
      name: 'Customers',
      value: Number(overview.totalUsers || 0).toLocaleString(),
      icon: Users,
      sub: 'Registered users',
      isUp: true,
    },
    {
      name: 'Avg. Order Value',
      value: overview.totalOrders > 0
        ? `$${(overview.totalSales / overview.totalOrders).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '$0.00',
      icon: CreditCard,
      sub: 'Per order',
      isUp: overview.totalOrders > 0,
    },
  ] : [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-border/50 pb-6 gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-light tracking-wide text-foreground">Analytics Overview</h1>
          <p className="text-muted mt-3 text-sm tracking-wide font-medium">Live data from your store database.</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="px-4 py-2 bg-secondary/50 rounded-full border border-border/50 text-[10px] uppercase font-bold tracking-widest text-muted">
              Updated: {lastUpdated}
            </span>
          )}
          <button
            onClick={handleRefresh}
            className="p-2.5 border border-border/50 rounded-full bg-background hover:bg-secondary transition-colors"
            title="Refresh data"
          >
            <RefreshCw size={14} className="text-muted" />
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl text-sm text-rose-600 dark:text-rose-400 font-medium">
          ⚠ {error}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loadingOverview
          ? [1,2,3,4].map(i => <StatSkeleton key={i} />)
          : stats.map((stat) => {
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
                  <div className="text-3xl font-serif text-foreground mb-2 relative z-10 tracking-wide">{stat.value}</div>
                  <div className="text-[10px] text-muted/70 uppercase tracking-wider font-semibold relative z-10">{stat.sub}</div>
                </div>
              );
            })
        }
      </div>

      {/* Charts + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Chart */}
        <div className="lg:col-span-2 border border-border/50 bg-background rounded-2xl p-6 md:p-8 flex flex-col shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-center mb-10 w-full border-b border-border/40 pb-4">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-foreground block" />
              Revenue Activity
            </h2>
            <select
              value={range}
              onChange={handleRangeChange}
              className="bg-secondary/30 border border-border/50 rounded-lg px-3 py-1.5 text-[10px] text-foreground outline-none uppercase tracking-wider font-bold cursor-pointer hover:bg-secondary/60 transition-colors"
            >
              <option value="7">Last 7 Days</option>
              <option value="30">Last 30 Days</option>
              <option value="365">This Year</option>
            </select>
          </div>
          <RevenueChart salesData={salesChart.sales} labels={salesChart.labels} loading={loadingChart} />
        </div>

        {/* Recent Orders */}
        <div className="border border-border/50 bg-background rounded-2xl p-6 md:p-8 flex flex-col shadow-[0_4px_24px_-8px_rgba(0,0,0,0.04)]">
          <div className="flex items-center gap-2 mb-8 border-b border-border/40 pb-4">
            <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold text-foreground">Recent Orders</h2>
            {recentOrders.length > 0 && (
              <span className="px-2 py-0.5 bg-foreground text-background rounded-full text-[9px] font-bold">
                {recentOrders.length}
              </span>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-between">
            {loadingOrders ? (
              <div className="space-y-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl animate-pulse">
                    <div className="space-y-2">
                      <div className="h-3 w-28 bg-secondary rounded-full" />
                      <div className="h-2 w-20 bg-secondary/60 rounded-full" />
                    </div>
                    <div className="h-3 w-16 bg-secondary rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 py-12 text-center">
                <Package size={32} className="text-muted/40" strokeWidth={1} />
                <p className="text-xs text-muted font-medium">No orders yet.</p>
              </div>
            ) : (
              <div className="space-y-1.5">
                {recentOrders.slice(0, 6).map((order) => {
                  const { dot, text } = statusStyle(order.status);
                  const customerName = order.user?.name || order.shippingAddress?.fullName || 'Unknown';
                  const orderId = `#${order.id.slice(0, 8).toUpperCase()}`;
                  const total = `$${Number(order.totalAmount || 0).toFixed(2)}`;
                  return (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary/40 transition-colors group">
                      <div className="min-w-0 mr-3">
                        <div className="text-sm font-semibold text-foreground tracking-wide truncate">{customerName}</div>
                        <div className="text-[10px] text-muted flex gap-2 uppercase tracking-wider mt-1.5 items-center">
                          <span className="font-mono bg-secondary px-1.5 py-0.5 rounded-md text-foreground/70 group-hover:bg-background transition-colors shrink-0">{orderId}</span>
                          <span className="text-[8px]">•</span>
                          <span className={`font-bold flex items-center gap-1 ${text}`}>
                            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot}`} />
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-foreground font-serif text-right shrink-0">{total}</div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
