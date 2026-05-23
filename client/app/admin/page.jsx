'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/lib/ShopContext';
import { 
  ShoppingBag, 
  Users, 
  DollarSign, 
  TrendingUp, 
  LogOut, 
  Package, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Truck,
  Eye,
  Edit,
  Activity,
  UserCheck
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, sessionLoading, logout } = useShop();

  // Active sub-dashboard section tab
  const [activeTab, setActiveTab] = useState('analytics');

  // API State
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);
  const [salesData, setSalesData] = useState(null);
  const [loadingSales, setLoadingSales] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Stock edit state
  const [editingProductId, setEditingProductId] = useState(null);
  const [editStockVal, setEditStockVal] = useState('');
  const [updatingStock, setUpdatingStock] = useState(false);

  // Order status update state
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Security authorization check
  useEffect(() => {
    if (!sessionLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'ADMIN') {
        alert('Access Denied: Unrecognized Administrative Privileges.');
        router.push('/');
      }
    }
  }, [user, sessionLoading, router]);

  // Load Admin Data on mount/role success
  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchAnalytics();
      fetchInventory();
      fetchOrders();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    setLoadingSales(true);
    try {
      const { adminApi } = await import('@/lib/api');
      const overview = await adminApi.getAnalyticsOverview();
      if (overview.success && overview.data) {
        setAnalytics(overview.data);
      }
      
      const sales = await adminApi.getAnalyticsSales('7d');
      if (sales.success && sales.data) {
        setSalesData(sales.data);
      }
    } catch (e) {
      console.error('Analytics load error:', e);
    } finally {
      setLoadingAnalytics(false);
      setLoadingSales(false);
    }
  };

  const fetchInventory = async () => {
    setLoadingInventory(true);
    try {
      const { inventoryApi } = await import('@/lib/api');
      const data = await inventoryApi.getInventoryStock();
      // If live returns array directly or inside res.data
      if (Array.isArray(data)) {
        setInventory(data);
      } else if (data.success && Array.isArray(data.data)) {
        setInventory(data.data);
      }
    } catch (e) {
      console.error('Inventory load error:', e);
    } finally {
      setLoadingInventory(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const { orderApi } = await import('@/lib/api');
      const data = await orderApi.adminListOrders();
      if (Array.isArray(data)) {
        setOrders(data);
      } else if (data.success && Array.isArray(data.data)) {
        setOrders(data.data);
      }
    } catch (e) {
      console.error('Orders load error:', e);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleUpdateStock = async (productId) => {
    const parsedStock = parseInt(editStockVal);
    if (isNaN(parsedStock) || parsedStock < 0) {
      alert('Please enter a valid stock quantity.');
      return;
    }

    setUpdatingStock(true);
    try {
      const { inventoryApi } = await import('@/lib/api');
      const res = await inventoryApi.updateInventoryStock(productId, parsedStock);
      if (res.success) {
        setInventory(prev => prev.map(item => 
          item.productId === productId ? { ...item, stock: parsedStock, status: parsedStock === 0 ? 'Out of Stock' : parsedStock < 10 ? 'Low Stock' : 'In Stock' } : item
        ));
        setEditingProductId(null);
      } else {
        alert(res.message || 'Failed to update stock.');
      }
    } catch (e) {
      console.error('Update stock error:', e);
      alert('An error occurred while updating stock quantity.');
    } finally {
      setUpdatingStock(false);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const { orderApi } = await import('@/lib/api');
      const res = await orderApi.adminUpdateOrderStatus(orderId, newStatus);
      if (res.success || res.data) {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
      } else {
        alert(res.message || 'Failed to update status.');
      }
    } catch (e) {
      console.error('Update order error:', e);
      alert('An error occurred while updating order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleAdminLogout = async () => {
    await logout();
    router.push('/admin/login');
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex items-center justify-center font-serif text-lg italic animate-pulse">
        Initializing Atelier Command Panel...
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  // Formatting Helper for Dates
  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-[#fafafa] font-sans antialiased flex">
      {/* 1. Left Sidebar: Obsidian Design */}
      <aside className="w-64 border-r border-[#27272a] bg-[#09090b] p-6 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="space-y-8">
          {/* Logo Brand */}
          <div>
            <span className="text-[8px] uppercase tracking-[0.3em] text-[#a1a1aa] font-bold block">Command Terminal</span>
            <Link href="/admin" className="font-serif text-xl font-bold tracking-[0.2em] text-[#fafafa] block mt-1">
              ATELIER
            </Link>
          </div>

          {/* User Identifier */}
          <div className="bg-[#18181b] border border-[#27272a] p-4 rounded-xl flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#fafafa] text-[#09090b] flex items-center justify-center font-bold text-sm tracking-wide">
              {user.avatar || 'AD'}
            </div>
            <div className="min-w-0">
              <span className="text-[8px] uppercase tracking-[0.2em] text-[#a1a1aa] font-bold block">Console User</span>
              <h4 className="font-serif text-xs font-semibold truncate text-[#fafafa]">
                {user.name}
              </h4>
            </div>
          </div>

          {/* Menu Sections */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-wider font-bold rounded-xl transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#fafafa] text-[#09090b]'
                  : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
              }`}
            >
              <Activity className="w-4 h-4 stroke-[1.5]" />
              Analytics
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-wider font-bold rounded-xl transition-all ${
                activeTab === 'inventory'
                  ? 'bg-[#fafafa] text-[#09090b]'
                  : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
              }`}
            >
              <Package className="w-4 h-4 stroke-[1.5]" />
              Inventory Control
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] uppercase tracking-wider font-bold rounded-xl transition-all ${
                activeTab === 'orders'
                  ? 'bg-[#fafafa] text-[#09090b]'
                  : 'text-[#a1a1aa] hover:bg-[#18181b] hover:text-[#fafafa]'
              }`}
            >
              <ShoppingBag className="w-4 h-4 stroke-[1.5]" />
              Order Management
            </button>
          </nav>
        </div>

        {/* Console Action Buttons */}
        <div className="space-y-2">
          <Link
            href="/"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[#27272a] text-[#fafafa] hover:bg-[#18181b] text-[10px] uppercase tracking-wider font-bold rounded-xl transition-all"
          >
            Visit Storefront
          </Link>
          <button
            onClick={handleAdminLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-950/20 border border-red-900/30 text-red-400 hover:bg-red-900/20 text-[10px] uppercase tracking-wider font-bold rounded-xl transition-all"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout Terminal
          </button>
        </div>
      </aside>

      {/* 2. Main Terminal Pane */}
      <main className="flex-grow min-w-0 bg-[#09090b] flex flex-col p-6 sm:p-10 gap-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between border-b border-[#27272a] pb-4 mb-4">
          <Link href="/admin" className="font-serif text-lg font-bold tracking-[0.2em] text-[#fafafa]">
            ATELIER
          </Link>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab(activeTab === 'analytics' ? 'inventory' : activeTab === 'inventory' ? 'orders' : 'analytics')}
              className="px-3 py-1.5 border border-[#27272a] text-[9px] uppercase tracking-wider font-bold rounded-lg"
            >
              Menu
            </button>
            <button onClick={handleAdminLogout} className="p-2 bg-red-900/20 text-red-400 rounded-lg">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content Header Banner */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#27272a] pb-6 gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] font-semibold text-[#a1a1aa] uppercase">Administrative Control Panel</span>
            <h1 className="font-serif text-3xl sm:text-4xl font-light uppercase tracking-wide text-[#fafafa] mt-2">
              {activeTab === 'analytics' && 'Operational Analytics'}
              {activeTab === 'inventory' && 'Garment Inventory'}
              {activeTab === 'orders' && 'Order Registry'}
            </h1>
          </div>
          
          {/* Refresh Actions */}
          <button
            onClick={() => {
              if (activeTab === 'analytics') fetchAnalytics();
              if (activeTab === 'inventory') fetchInventory();
              if (activeTab === 'orders') fetchOrders();
            }}
            className="flex items-center gap-2 border border-[#27272a] px-4 py-2 text-[9px] uppercase tracking-widest font-bold rounded-xl bg-[#09090b] hover:bg-[#18181b] transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Sync Logs
          </button>
        </div>

        {/* DYNAMIC PANE RENDERING */}
        
        {/* A. ANALYTICS Tab Pane */}
        {activeTab === 'analytics' && (
          <div className="space-y-8 animate-fade-in">
            {/* Overview Stats Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Sales Metric */}
              <div className="border border-[#27272a] p-6 rounded-2xl bg-[#09090b] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-foreground/5 rounded-full blur-3xl group-hover:bg-foreground/10 transition-all" />
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase tracking-wider text-[#a1a1aa] font-bold">Total Sales volume</span>
                  <DollarSign className="w-4 h-4 text-[#a1a1aa] stroke-[1.5]" />
                </div>
                <div className="mt-4">
                  {loadingAnalytics ? (
                    <span className="text-sm text-[#a1a1aa] animate-pulse">Calculating...</span>
                  ) : (
                    <h3 className="font-serif text-3xl font-bold tracking-wide text-[#fafafa]">
                      {analytics ? formatCurrency(analytics.totalSales) : '$0.00'}
                    </h3>
                  )}
                  <span className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold mt-2">
                    <TrendingUp className="w-3 h-3" /> +12.5% vs Last Period
                  </span>
                </div>
              </div>

              {/* Orders Metric */}
              <div className="border border-[#27272a] p-6 rounded-2xl bg-[#09090b] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-foreground/5 rounded-full blur-3xl group-hover:bg-foreground/10 transition-all" />
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase tracking-wider text-[#a1a1aa] font-bold">Total Order Count</span>
                  <ShoppingBag className="w-4 h-4 text-[#a1a1aa] stroke-[1.5]" />
                </div>
                <div className="mt-4">
                  {loadingAnalytics ? (
                    <span className="text-sm text-[#a1a1aa] animate-pulse">Calculating...</span>
                  ) : (
                    <h3 className="font-serif text-3xl font-bold tracking-wide text-[#fafafa]">
                      {analytics ? analytics.totalOrders : '0'}
                    </h3>
                  )}
                  <span className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold mt-2">
                    <TrendingUp className="w-3 h-3" /> +8.2% vs Last Period
                  </span>
                </div>
              </div>

              {/* Users Metric */}
              <div className="border border-[#27272a] p-6 rounded-2xl bg-[#09090b] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-foreground/5 rounded-full blur-3xl group-hover:bg-foreground/10 transition-all" />
                <div className="flex justify-between items-start">
                  <span className="text-[9px] uppercase tracking-wider text-[#a1a1aa] font-bold">Registered Members</span>
                  <Users className="w-4 h-4 text-[#a1a1aa] stroke-[1.5]" />
                </div>
                <div className="mt-4">
                  {loadingAnalytics ? (
                    <span className="text-sm text-[#a1a1aa] animate-pulse">Calculating...</span>
                  ) : (
                    <h3 className="font-serif text-3xl font-bold tracking-wide text-[#fafafa]">
                      {analytics ? analytics.totalUsers : '0'}
                    </h3>
                  )}
                  <span className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold mt-2">
                    <TrendingUp className="w-3 h-3" /> +15.4% vs Last Period
                  </span>
                </div>
              </div>
            </div>

            {/* Sales Chart Simulator / Table Logs */}
            <div className="border border-[#27272a] p-6 rounded-2xl bg-[#09090b] space-y-4">
              <div className="flex justify-between items-center border-b border-[#27272a] pb-4">
                <h3 className="font-serif text-lg font-semibold uppercase text-[#fafafa]">Performance Trends (7 Days)</h3>
                <span className="text-[9px] tracking-widest text-[#a1a1aa] font-bold uppercase">Real-Time Data Feed</span>
              </div>
              
              {loadingSales ? (
                <div className="py-12 text-center text-xs text-[#a1a1aa] font-serif italic">Loading trends...</div>
              ) : salesData && salesData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#27272a] text-[#a1a1aa] font-bold uppercase tracking-wider">
                        <th className="pb-3">Placement Date</th>
                        <th className="pb-3">Daily Sales Total</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a] text-[#fafafa]/80 font-medium">
                      {salesData.map((day, idx) => (
                        <tr key={idx} className="hover:bg-[#18181b]/35 transition-colors">
                          <td className="py-3.5 font-mono">{formatDate(day.placedAt)}</td>
                          <td className="py-3.5 font-semibold text-[#fafafa]">{formatCurrency(day.totalAmount)}</td>
                          <td className="py-3.5">
                            <span className="px-2 py-0.5 border border-emerald-950 text-emerald-400 text-[8px] font-bold uppercase rounded-lg bg-emerald-950/20">
                              Reconciled
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-xs text-[#a1a1aa] font-medium leading-relaxed">
                  No sales analytics logged in the database yet. Place some orders to populate live trends!
                </div>
              )}
            </div>
          </div>
        )}

        {/* B. INVENTORY Tab Pane */}
        {activeTab === 'inventory' && (
          <div className="space-y-6 animate-fade-in">
            {/* Control Header info */}
            <div className="bg-[#18181b]/50 border border-[#27272a] p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-[#a1a1aa] stroke-[1.5] mt-0.5 shrink-0" />
              <div className="text-[10px] text-[#a1a1aa] leading-relaxed font-sans font-medium">
                <span className="font-bold text-[#fafafa] uppercase block mb-1">Direct Stock Synchronization</span>
                Change product stock values directly below to alter availability and trigger real-time low-stock flags in the store database.
              </div>
            </div>

            {/* Inventory table */}
            <div className="border border-[#27272a] rounded-2xl bg-[#09090b] overflow-hidden">
              {loadingInventory ? (
                <div className="py-20 text-center text-xs text-[#a1a1aa] font-serif italic">Accessing database stock files...</div>
              ) : inventory.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#27272a] text-[#a1a1aa] font-bold uppercase tracking-wider bg-[#09090b] p-4">
                        <th className="p-4 pl-6">Garment Information</th>
                        <th className="p-4">SKU Code</th>
                        <th className="p-4">Unit Cost</th>
                        <th className="p-4 text-center">In Stock</th>
                        <th className="p-4">Alert Level</th>
                        <th className="p-4 pr-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a] text-[#fafafa]/80 font-medium">
                      {inventory.map((prod) => (
                        <tr key={prod.productId} className="hover:bg-[#18181b]/35 transition-colors">
                          {/* Image & name */}
                          <td className="p-4 pl-6 flex items-center gap-3">
                            <div className="w-10 h-12 bg-[#18181b] rounded-lg overflow-hidden shrink-0 border border-[#27272a]/30">
                              <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                            </div>
                            <span className="font-serif font-semibold text-[#fafafa] line-clamp-1 max-w-[200px]">{prod.name}</span>
                          </td>
                          {/* SKU */}
                          <td className="p-4 font-mono text-[10px]">{prod.sku}</td>
                          {/* Price */}
                          <td className="p-4">{formatCurrency(prod.price)}</td>
                          {/* Stock inline editor */}
                          <td className="p-4 text-center">
                            {editingProductId === prod.productId ? (
                              <div className="flex items-center justify-center gap-2">
                                <input
                                  type="number"
                                  value={editStockVal}
                                  onChange={(e) => setEditStockVal(e.target.value)}
                                  className="w-16 px-2 py-1 bg-[#18181b] border border-[#27272a] rounded-lg text-center font-bold text-xs"
                                />
                                <button
                                  onClick={() => handleUpdateStock(prod.productId)}
                                  disabled={updatingStock}
                                  className="px-2 py-1 bg-[#fafafa] text-[#09090b] font-bold rounded-lg text-[9px] uppercase tracking-wider"
                                >
                                  Save
                                </button>
                              </div>
                            ) : (
                              <span className="font-bold text-sm">{prod.stock}</span>
                            )}
                          </td>
                          {/* Alert level badges */}
                          <td className="p-4">
                            {prod.stock === 0 ? (
                              <span className="px-2 py-0.5 border border-red-950 text-red-500 text-[8px] font-bold uppercase rounded-lg bg-red-950/20">Out of Stock</span>
                            ) : prod.stock < 10 ? (
                              <span className="px-2 py-0.5 border border-amber-950 text-amber-500 text-[8px] font-bold uppercase rounded-lg bg-amber-950/20">Low Stock</span>
                            ) : (
                              <span className="px-2 py-0.5 border border-emerald-950 text-emerald-400 text-[8px] font-bold uppercase rounded-lg bg-emerald-950/20">Secured</span>
                            )}
                          </td>
                          {/* Actions */}
                          <td className="p-4 pr-6 text-right">
                            {editingProductId !== prod.productId && (
                              <button
                                onClick={() => {
                                  setEditingProductId(prod.productId);
                                  setEditStockVal(prod.stock.toString());
                                }}
                                className="text-[#a1a1aa] hover:text-[#fafafa] flex items-center gap-1 ml-auto transition-colors font-bold uppercase text-[9px] tracking-wider"
                              >
                                <Edit className="w-3.5 h-3.5" /> Adjust
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-[#a1a1aa] font-medium">No inventory data logs found.</div>
              )}
            </div>
          </div>
        )}

        {/* C. ORDERS Tab Pane */}
        {activeTab === 'orders' && (
          <div className="space-y-6 animate-fade-in">
            {/* Orders registry list */}
            <div className="border border-[#27272a] rounded-2xl bg-[#09090b] overflow-hidden">
              {loadingOrders ? (
                <div className="py-20 text-center text-xs text-[#a1a1aa] font-serif italic">Accessing transaction logs...</div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#27272a] text-[#a1a1aa] font-bold uppercase tracking-wider bg-[#09090b] p-4">
                        <th className="p-4 pl-6">Order ID</th>
                        <th className="p-4">Placement Date</th>
                        <th className="p-4">Customer Details</th>
                        <th className="p-4">Total Price</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 pr-6 text-right">Fulfillment Desk</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#27272a] text-[#fafafa]/80 font-medium">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-[#18181b]/35 transition-colors">
                          {/* Order ID */}
                          <td className="p-4 pl-6 font-mono font-bold text-[#fafafa]">{order.id}</td>
                          {/* Placed Date */}
                          <td className="p-4 font-mono text-[10px]">{formatDate(order.placedAt || order.createdAt)}</td>
                          {/* User info */}
                          <td className="p-4">
                            <div className="min-w-0">
                              <span className="font-semibold block text-[#fafafa]">{order.user?.name || 'Guest Sterling'}</span>
                              <span className="text-[10px] text-[#a1a1aa] block truncate max-w-[150px]">{order.user?.email}</span>
                            </div>
                          </td>
                          {/* Total amount */}
                          <td className="p-4 font-semibold text-[#fafafa]">{formatCurrency(order.totalAmount || order.total)}</td>
                          {/* Status badge */}
                          <td className="p-4">
                            {order.status === 'DELIVERED' || order.status === 'Delivered' ? (
                              <span className="px-2 py-0.5 border border-emerald-950 text-emerald-400 text-[8px] font-bold uppercase rounded-lg bg-emerald-950/20">Delivered</span>
                            ) : order.status === 'SHIPPED' || order.status === 'Shipped' ? (
                              <span className="px-2 py-0.5 border border-sky-950 text-sky-400 text-[8px] font-bold uppercase rounded-lg bg-sky-950/20">Shipped</span>
                            ) : order.status === 'CANCELLED' || order.status === 'Cancelled' ? (
                              <span className="px-2 py-0.5 border border-red-950 text-red-500 text-[8px] font-bold uppercase rounded-lg bg-red-950/20">Cancelled</span>
                            ) : (
                              <span className="px-2 py-0.5 border border-amber-950 text-amber-500 text-[8px] font-bold uppercase rounded-lg bg-amber-950/20">Processing</span>
                            )}
                          </td>
                          {/* Fulfillment actions */}
                          <td className="p-4 pr-6 text-right">
                            {updatingOrderId === order.id ? (
                              <span className="text-[10px] text-[#a1a1aa] animate-pulse">Updating...</span>
                            ) : (
                              <div className="flex gap-2 justify-end">
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                                  disabled={order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                                  className="px-2 py-1 border border-[#27272a] hover:border-sky-500 hover:text-sky-400 text-[8px] font-bold uppercase rounded-lg bg-[#09090b] disabled:opacity-30 disabled:hover:border-[#27272a] disabled:hover:text-[#a1a1aa] transition-colors"
                                >
                                  Ship
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                                  disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                                  className="px-2 py-1 border border-[#27272a] hover:border-emerald-500 hover:text-emerald-400 text-[8px] font-bold uppercase rounded-lg bg-[#09090b] disabled:opacity-30 disabled:hover:border-[#27272a] disabled:hover:text-[#a1a1aa] transition-colors"
                                >
                                  Deliver
                                </button>
                                <button
                                  onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                                  disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                                  className="px-2 py-1 border border-red-950 hover:border-red-600 hover:text-red-500 text-[8px] font-bold uppercase rounded-lg bg-[#09090b] text-red-400/80 disabled:opacity-30 disabled:hover:border-red-950 disabled:hover:text-red-400/80 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-20 text-center text-xs text-[#a1a1aa] font-medium">No customer orders logged in the database registry.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
