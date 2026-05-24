'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/lib/ShopContext';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  RefreshCw, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Truck, 
  X, 
  ChevronDown, 
  Eye, 
  ArrowUpRight 
} from 'lucide-react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import Toast from '@/components/shared/Toast';

export default function AdminOrdersPage() {
  const router = useRouter();
  const { user, sessionLoading } = useShop();

  // Orders and Filtering state
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Search and Filter parameters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentFilter, setPaymentFilter] = useState('ALL');

  // Custom UI notification state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Security authorization check
  useEffect(() => {
    if (!sessionLoading) {
      if (!user) {
        router.push('/admin/login');
      } else if (user.role !== 'ADMIN') {
        router.push('/');
      }
    }
  }, [user, sessionLoading, router]);

  // Load orders
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
      setToast({ message: 'Failed to sync transaction logs.', type: 'error' });
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchOrders();
    }
  }, [user]);

  // Apply filters on search or drop-down changes
  useEffect(() => {
    let result = [...orders];

    // 1. Search Query filter (matches ID, Customer Name, or Customer Email)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order => 
        order.id.toLowerCase().includes(term) ||
        (order.user?.name || '').toLowerCase().includes(term) ||
        (order.user?.email || '').toLowerCase().includes(term)
      );
    }

    // 2. Fulfillment Status filter
    if (statusFilter !== 'ALL') {
      result = result.filter(order => order.status === statusFilter);
    }

    // 3. Payment Status filter
    if (paymentFilter !== 'ALL') {
      result = result.filter(order => order.paymentStatus === paymentFilter || order.payment_status === paymentFilter);
    }

    setFilteredOrders(result);
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    setUpdatingOrderId(orderId);
    try {
      const { orderApi } = await import('@/lib/api');
      const res = await orderApi.adminUpdateOrderStatus(orderId, newStatus);
      if (res.success || res.data) {
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
        setToast({ message: `Order status updated to ${newStatus}.`, type: 'success' });
      } else {
        setToast({ message: res.message || 'Failed to update status.', type: 'error' });
      }
    } catch (e) {
      console.error('Update order error:', e);
      setToast({ message: 'An error occurred while updating status.', type: 'error' });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] text-[#fafafa] flex items-center justify-center font-serif text-lg italic animate-pulse">
        Accessing Order Logs...
      </div>
    );
  }

  if (!user || user.role !== 'ADMIN') return null;

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toISOString().split('T')[0];
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
        <div>
          <span className="text-[10px] tracking-[0.25em] font-semibold text-[#a1a1aa] uppercase">Operations Registry</span>
          <h1 className="font-serif text-3xl text-foreground mt-2">Customer Order Ledger</h1>
          <p className="text-muted mt-2 text-sm tracking-wide">Monitor fulfillment status, check payments, and ship products.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 border border-[#27272a] px-5 py-3 text-[10px] uppercase tracking-widest font-semibold bg-[#09090b] hover:bg-[#18181b] transition-colors rounded-xl shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Sync Registry</span>
        </button>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-card p-5 border border-border rounded-2xl shadow-sm">
        
        {/* Search Input */}
        <div className="relative md:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} strokeWidth={1.5} />
          <input 
            type="text" 
            placeholder="Search by Order ID, Name, or Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-background border border-border text-sm tracking-wide focus:border-foreground rounded-xl transition-colors outline-none"
          />
        </div>

        {/* Fulfillment Status Selector */}
        <div className="relative">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border text-xs font-semibold tracking-wide uppercase focus:border-foreground rounded-xl outline-none appearance-none cursor-pointer"
          >
            <option value="ALL">Fulfillment: All</option>
            <option value="PENDING">Pending</option>
            <option value="PROCESSING">Processing</option>
            <option value="SHIPPED">Shipped</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Payment Status Selector */}
        <div className="relative">
          <select 
            value={paymentFilter} 
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border text-xs font-semibold tracking-wide uppercase focus:border-foreground rounded-xl outline-none appearance-none cursor-pointer"
          >
            <option value="ALL">Payment: All</option>
            <option value="PENDING">Pending</option>
            <option value="PAID">Paid</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Orders Table Panel */}
      <div className="overflow-x-auto border border-border bg-card rounded-2xl shadow-sm">
        <table className="w-full text-left text-sm border-collapse whitespace-nowrap">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Order ID</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Date Placed</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Customer Details</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Delivery Address</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Grand Total</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Payment</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Fulfillment</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground text-right">Actions Desk</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-foreground/90">
            {loadingOrders ? (
              <tr><td colSpan="8" className="px-6 py-12 text-center text-muted font-serif italic">Accessing transaction ledger...</td></tr>
            ) : filteredOrders.length === 0 ? (
              <tr><td colSpan="8" className="px-6 py-12 text-center text-muted font-medium">No order files matched active filter criteria.</td></tr>
            ) : filteredOrders.map((order) => {
              const paymentStatus = order.paymentStatus || order.payment_status || 'PENDING';
              
              const payStatusColor = paymentStatus === 'PAID' ? 'text-green-500 border-green-950/30 bg-green-950/10' :
                paymentStatus === 'FAILED' ? 'text-red-500 border-red-950/30 bg-red-950/10' :
                'text-yellow-500 border-yellow-950/30 bg-yellow-950/10';

              const payDotColor = paymentStatus === 'PAID' ? 'bg-green-500' :
                paymentStatus === 'FAILED' ? 'bg-red-500' :
                'bg-yellow-500';

              const fulfillmentColor = order.status === 'DELIVERED' ? 'text-green-500 border-green-950/30 bg-green-950/10' :
                order.status === 'SHIPPED' ? 'text-sky-500 border-sky-950/30 bg-sky-950/10' :
                order.status === 'CANCELLED' ? 'text-red-500 border-red-950/30 bg-red-950/10' :
                'text-yellow-500 border-yellow-950/30 bg-yellow-950/10';

              const fullDotColor = order.status === 'DELIVERED' ? 'bg-green-500' :
                order.status === 'SHIPPED' ? 'bg-sky-500' :
                order.status === 'CANCELLED' ? 'bg-red-500' :
                'bg-yellow-500';

              return (
                <tr key={order.id} className="hover:bg-secondary/40 transition-colors group">
                  {/* Order ID */}
                  <td className="px-6 py-5 font-mono text-[11px] font-semibold text-foreground">{order.id.slice(0, 18)}...</td>
                  {/* Placed Date */}
                  <td className="px-6 py-5 font-mono text-[10px] text-muted">{formatDate(order.placedAt || order.createdAt)}</td>
                  {/* Customer Details */}
                  <td className="px-6 py-5">
                    <div className="flex flex-col">
                      <span className="font-semibold text-foreground text-xs">{order.user?.name || 'Guest User'}</span>
                      <span className="text-[10px] text-muted tracking-wide truncate max-w-[160px]">{order.user?.email || 'guest@atelier.com'}</span>
                    </div>
                  </td>
                  {/* Delivery Address */}
                  <td className="px-6 py-5">
                    {order.shippingAddress ? (
                      <div className="flex flex-col text-[11px] leading-relaxed max-w-[220px]">
                        <span className="font-semibold text-foreground truncate">{order.shippingAddress.fullName}</span>
                        <span className="text-muted truncate">{order.shippingAddress.addressLine1}{order.shippingAddress.addressLine2 ? ', ' + order.shippingAddress.addressLine2 : ''}</span>
                        <span className="text-muted truncate">{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</span>
                        <span className="text-[10px] text-neutral-500 tracking-wider truncate font-semibold uppercase">{order.shippingAddress.addressType} ({order.shippingAddress.mobileNumber})</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted italic">No shipping details</span>
                    )}
                  </td>
                  {/* Total Amount */}
                  <td className="px-6 py-5 font-serif font-semibold text-foreground">{formatCurrency(order.totalAmount || order.total)}</td>
                  {/* Payment Status */}
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border text-[8px] font-bold uppercase rounded-lg ${payStatusColor}`}>
                      <span className={`w-1 h-1 rounded-full ${payDotColor}`}></span>
                      {paymentStatus}
                    </span>
                  </td>
                  {/* Fulfillment Status */}
                  <td className="px-6 py-5">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 border text-[8px] font-bold uppercase rounded-lg ${fulfillmentColor}`}>
                      <span className={`w-1 h-1 rounded-full ${fullDotColor}`}></span>
                      {order.status}
                    </span>
                  </td>
                  {/* Fulfillment Desk Actions */}
                  <td className="px-6 py-5 text-right">
                    {updatingOrderId === order.id ? (
                      <span className="text-[10px] text-[#a1a1aa] animate-pulse">Updating...</span>
                    ) : (
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'SHIPPED')}
                          disabled={order.status === 'SHIPPED' || order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                          className="px-3 py-1.5 border border-border hover:border-sky-500 hover:text-sky-400 text-[8px] font-bold uppercase tracking-widest rounded-lg bg-background disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted transition-all duration-300"
                        >
                          Ship
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'DELIVERED')}
                          disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                          className="px-3 py-1.5 border border-border hover:border-green-500 hover:text-green-400 text-[8px] font-bold uppercase tracking-widest rounded-lg bg-background disabled:opacity-30 disabled:hover:border-border disabled:hover:text-muted transition-all duration-300"
                        >
                          Deliver
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(order.id, 'CANCELLED')}
                          disabled={order.status === 'DELIVERED' || order.status === 'CANCELLED'}
                          className="px-3 py-1.5 border border-red-950/40 text-red-400 hover:border-red-500 hover:text-red-400 text-[8px] font-bold uppercase tracking-widest rounded-lg bg-background disabled:opacity-30 disabled:hover:border-red-950/40 disabled:hover:text-red-400 transition-all duration-300"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Custom Reusable Toast Notifications */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />
    </div>
  );
}
