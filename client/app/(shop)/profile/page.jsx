'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useShop } from '@/lib/ShopContext';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import OrderCard from '@/components/profile/OrderCard';
import { Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const router = useRouter();
  const { user, sessionLoading, wishlist, cart, setUser } = useShop();
  const [activeTab, setActiveTab] = useState('overview');
  const [ordersList, setOrdersList] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Address simulation state
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    email: '',
  });

  // Protect route
  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push('/login');
    }
  }, [user, sessionLoading, router]);

  // Sync user values once loaded
  useEffect(() => {
    if (user) {
      setAddresses(user.addresses || []);
      setSettingsForm({
        name: user.name || '',
        email: user.email || '',
      });

      // Fetch live order histories from backend
      setLoadingOrders(true);
      import('@/lib/api').then(({ orderApi }) => {
        orderApi.ordersHistory().then((res) => {
          if (res.success && res.data) {
            setOrdersList(res.data);
          }
        }).catch(err => console.error(err))
        .finally(() => setLoadingOrders(false));
      });
    }
  }, [user]);

  if (sessionLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-32 text-center font-serif text-lg italic text-muted animate-pulse">
        Loading Atelier Account...
      </div>
    );
  }

  if (!user) return null;

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      const { userApi } = await import('@/lib/api');
      const res = await userApi.updateUser(user.id, {
        name: settingsForm.name,
        email: settingsForm.email,
      });
      if (res.success && res.user) {
        setUser(res.user);
        alert('Account settings updated successfully.');
      } else {
        alert(res.message || 'Failed to update settings.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating settings.');
    }
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;

    const addressRecord = {
      id: `addr-${Date.now()}`,
      ...newAddress,
      default: addresses.length === 0, // Default if first
    };

    const updated = [...addresses, addressRecord];
    setAddresses(updated);
    setUser({ ...user, addresses: updated });
    
    setNewAddress({ label: '', street: '', city: '', state: '', zip: '', country: '' });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    setUser({ ...user, addresses: updated });
  };

  // Map backend order to OrderCard properties
  const mappedOrders = ordersList.map(o => ({
    id: o.id,
    date: new Date(o.placedAt || o.createdAt).toISOString().split('T')[0],
    status: o.status,
    total: Number(o.totalAmount),
    paymentMethod: o.payments && o.payments.length > 0 ? o.payments[0].provider : 'Apple Pay',
    items: o.items ? o.items.map(item => ({
      id: item.id,
      name: item.productName,
      size: 'M',
      color: 'Black',
      quantity: item.quantity,
      price: Number(item.productPrice),
      image: item.product?.images && item.product.images.length > 0 
        ? item.product.images[0].imageUrl 
        : 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=300'
    })) : [],
    shippingAddress: o.shippingAddress ? {
      street: o.shippingAddress.addressLine1 + (o.shippingAddress.addressLine2 ? ', ' + o.shippingAddress.addressLine2 : ''),
      city: o.shippingAddress.city,
      state: o.shippingAddress.state,
      zip: o.shippingAddress.postalCode,
      country: o.shippingAddress.country
    } : {
      street: '144 Crosby Street, Suite 4B',
      city: 'New York',
      state: 'NY',
      zip: '10012',
      country: 'United States'
    }
  }));

  // Render content based on selected tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8 animate-fade-in">
            {/* Brief Stats Cards Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-border p-4 rounded-xl bg-secondary/10">
                <span className="text-[9px] uppercase tracking-wider text-muted font-semibold block">Total Orders</span>
                <span className="font-serif text-2xl font-bold block mt-1">{mappedOrders.length}</span>
              </div>
              <div className="border border-border p-4 rounded-xl bg-secondary/10">
                <span className="text-[9px] uppercase tracking-wider text-muted font-semibold block">Wishlisted Items</span>
                <span className="font-serif text-2xl font-bold block mt-1">{wishlist.length}</span>
              </div>
              <div className="border border-border p-4 rounded-xl bg-secondary/10">
                <span className="text-[9px] uppercase tracking-wider text-muted font-semibold block">Cart Items</span>
                <span className="font-serif text-2xl font-bold block mt-1">{cartCount}</span>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h4 className="font-serif text-lg font-semibold uppercase text-foreground">Recent Order History</h4>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground font-bold hover:underline"
                >
                  View All Orders
                </button>
              </div>

              {loadingOrders ? (
                <div className="py-6 text-xs text-muted">Retrieving order logs...</div>
              ) : mappedOrders.length > 0 ? (
                <div className="space-y-4">
                  {mappedOrders.slice(0, 1).map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted py-6">You have not completed any order histories yet.</p>
              )}
            </div>

            {/* Primary Shipping address */}
            <div className="space-y-4 pt-4">
              <div className="flex justify-between items-center border-b border-border pb-3">
                <h4 className="font-serif text-lg font-semibold uppercase text-foreground">Primary Delivery Address</h4>
                <button
                  onClick={() => setActiveTab('addresses')}
                  className="text-[10px] uppercase tracking-widest text-muted hover:text-foreground font-bold hover:underline"
                >
                  Manage Address Book
                </button>
              </div>

              {addresses.find((addr) => addr.default) ? (
                <div className="border border-border p-5 rounded-xl bg-secondary/10 text-xs md:text-sm text-muted leading-relaxed font-medium">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-foreground uppercase tracking-widest text-[10px]">
                      {addresses.find((addr) => addr.default).label}
                    </span>
                    <span className="px-2 py-0.5 border border-border text-foreground text-[8px] tracking-widest uppercase font-bold rounded-lg bg-background">
                      Default
                    </span>
                  </div>
                  <p>{addresses.find((addr) => addr.default).street}</p>
                  <p>
                    {addresses.find((addr) => addr.default).city}, {addresses.find((addr) => addr.default).state} {addresses.find((addr) => addr.default).zip}
                  </p>
                  <p>{addresses.find((addr) => addr.default).country}</p>
                </div>
              ) : (
                <p className="text-xs text-muted py-6">No shipping address records found.</p>
              )}
            </div>
          </div>
        );

      case 'orders':
        return (
          <div className="space-y-6 animate-fade-in">
            <h4 className="font-serif text-lg font-semibold uppercase text-foreground border-b border-border pb-3 mb-6">
              Complete Order Log
            </h4>
            {loadingOrders ? (
              <div className="py-12 text-center text-xs text-muted font-serif italic">Retrieving order logs...</div>
            ) : mappedOrders.length > 0 ? (
              <div className="space-y-6">
                {mappedOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <p className="font-serif text-base italic text-muted text-center py-12 border border-dashed border-border rounded-xl">
                No orders logged yet.
              </p>
            )}
          </div>
        );

      case 'addresses':
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center border-b border-border pb-3 mb-6">
              <h4 className="font-serif text-lg font-semibold uppercase text-foreground">
                Registered Addresses
              </h4>
              {!showAddressForm && (
                <button
                  onClick={() => setShowAddressForm(true)}
                  className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold text-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-secondary bg-background"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Address
                </button>
              )}
            </div>

            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="border border-border p-6 rounded-xl bg-secondary/15 space-y-4">
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-muted block mb-2">
                  New Shipping Address
                </span>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="ADDRESS DESCRIPTION (E.G. HOME, WORK)..."
                      value={newAddress.label}
                      onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="STREET RESIDENCE..."
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="CITY..."
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="STATE..."
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="ZIP..."
                      value={newAddress.zip}
                      onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="COUNTRY..."
                      value={newAddress.country}
                      onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 border border-border text-foreground text-xs uppercase tracking-widest font-bold rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 text-xs uppercase tracking-widest font-bold rounded-xl"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-border p-5 rounded-xl bg-background hover:border-foreground/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-foreground uppercase tracking-widest text-[10px]">
                        {addr.label}
                      </span>
                      {addr.default && (
                        <span className="px-2 py-0.5 border border-border text-foreground text-[8px] tracking-widest uppercase font-bold rounded-lg bg-secondary">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted leading-relaxed font-sans font-medium space-y-0.5">
                      <p>{addr.street}</p>
                      <p>
                        {addr.city}, {addr.state} {addr.zip}
                      </p>
                      <p>{addr.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-border/40 text-[9px] uppercase tracking-widest font-bold text-muted">
                    <button
                      onClick={() => alert('Editing addresses disabled in prototype.')}
                      className="hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5 stroke-[1.5]" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.5]" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6 animate-fade-in">
            <h4 className="font-serif text-lg font-semibold uppercase text-foreground border-b border-border pb-3 mb-6">
              Account Credentials
            </h4>
            <form onSubmit={handleSaveSettings} className="space-y-5 max-w-md">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted block">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={settingsForm.name}
                  onChange={(e) => setSettingsForm({ ...settingsForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                  id="profile-name-input"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted block">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                  id="profile-email-input"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-muted block">
                  New Password (Optional)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-secondary/35 border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 bg-foreground text-background dark:bg-white dark:text-neutral-950 text-xs uppercase tracking-widest font-bold rounded-xl hover:opacity-90 transition-opacity"
                id="profile-save-settings"
              >
                Save Settings
              </button>
            </form>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      
      {/* Page Header */}
      <div className="border-b border-border pb-6 mb-10">
        <span className="text-[10px] tracking-[0.2em] font-semibold text-muted uppercase">
          Atelier Client Office
        </span>
        <h1 className="font-serif text-3xl md:text-5xl font-light uppercase tracking-wide text-foreground mt-2">
          Your Account
        </h1>
      </div>

      {/* Main layout: Sidebar navigations + workspace tabs content */}
      <div className="flex flex-col md:flex-row gap-10 md:gap-16">
        
        {/* Profile Tabs Navigation sidebar */}
        <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Dynamic workspaces tab contents */}
        <div className="flex-1 min-w-0">{renderTabContent()}</div>

      </div>
    </div>
  );
}
