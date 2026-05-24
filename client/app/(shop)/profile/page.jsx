'use client';

import { useState, useEffect } from 'react';
import { useShop } from '@/lib/ShopContext';
import { orders as mockOrders } from '@/lib/mock-data';
import ProfileSidebar from '@/components/profile/ProfileSidebar';
import OrderCard from '@/components/profile/OrderCard';
import { User, ShoppingBag, Heart, MapPin, Settings, Plus, Trash2, Edit, Home, Briefcase, Map } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency } from '@/lib/utils';

export default function ProfilePage() {
  const { user, wishlist, cart, setUser, loading } = useShop();
  const [activeTab, setActiveTab] = useState('overview');
  const router = useRouter();

  // Address simulation state
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    mobileNumber: '',
    addressLine1: '',
    addressLine2: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    addressType: 'HOME',
    isDefault: false,
  });

  // Settings form state
  const [settingsForm, setSettingsForm] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    if (user) {
      setAddresses(user.addresses || []);
      setSettingsForm({
        name: user.name || '',
        email: user.email || '',
      });
    }
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="font-serif text-sm tracking-widest text-muted uppercase animate-pulse">
          Loading Bespoke Suite...
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Load orders (future API integration point, currently empty for new users)
  const orders = user.orders || [];

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setUser({ ...user, name: settingsForm.name, email: settingsForm.email });
    alert('Account settings updated successfully.');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddress.addressLine1 || !newAddress.city || !newAddress.fullName) return;

    const addressRecord = {
      id: `addr-${Date.now()}`,
      ...newAddress,
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, addressRecord];
    setAddresses(updated);
    setUser({ ...user, addresses: updated });
    
    setNewAddress({ fullName: '', mobileNumber: '', addressLine1: '', addressLine2: '', landmark: '', city: '', state: '', postalCode: '', country: '', addressType: 'HOME', isDefault: false });
    setShowAddressForm(false);
  };

  const handleDeleteAddress = (id) => {
    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);
    setUser({ ...user, addresses: updated });
  };

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
                <span className="font-serif text-2xl font-bold block mt-1">{orders.length}</span>
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

              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.slice(0, 2).map((order) => (
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

              {(addresses.find((addr) => addr.isDefault) || addresses[0]) ? (() => {
                const primary = addresses.find((addr) => addr.isDefault) || addresses[0];
                return (
                  <div className="border border-border p-5 rounded-xl bg-secondary/10 text-xs md:text-sm text-muted leading-relaxed font-medium">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-foreground uppercase tracking-widest text-[10px]">
                        {primary.addressType || 'ADDRESS'}
                      </span>
                      {primary.isDefault && (
                        <span className="px-2 py-0.5 border border-border text-foreground text-[8px] tracking-widest uppercase font-bold rounded-lg bg-background">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="font-bold text-foreground">{primary.fullName}</p>
                    <p>{primary.addressLine1}</p>
                    {primary.addressLine2 && <p>{primary.addressLine2}</p>}
                    <p>
                      {primary.city}, {primary.state} {primary.postalCode}
                    </p>
                    <p>{primary.country}</p>
                  </div>
                );
              })() : (
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
            {orders.length > 0 ? (
              <div className="space-y-6">
                {orders.map((order) => (
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

            {/* Dynamic address addition form simulator */}
            {showAddressForm && (
              <form onSubmit={handleAddAddress} className="border border-border p-6 rounded-xl bg-secondary/15 space-y-4">
                <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-muted block mb-2">
                  New Shipping Address
                </span>
                
                <div className="grid grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="FULL NAME..."
                      value={newAddress.fullName}
                      onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  {/* Mobile Number */}
                  <div>
                    <input
                      type="tel"
                      required
                      placeholder="MOBILE NUMBER..."
                      value={newAddress.mobileNumber}
                      onChange={(e) => setNewAddress({ ...newAddress, mobileNumber: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  {/* Address Type */}
                  <div className="col-span-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block">Address Type</label>
                    <div className="flex gap-3">
                      {[
                        { id: 'HOME', label: 'Home', icon: Home },
                        { id: 'WORK', label: 'Work', icon: Briefcase },
                        { id: 'OTHER', label: 'Other', icon: Map }
                      ].map((type) => {
                        const Icon = type.icon;
                        const isSelected = newAddress.addressType === type.id;
                        return (
                          <button
                            key={type.id}
                            type="button"
                            onClick={() => setNewAddress({ ...newAddress, addressType: type.id })}
                            className={`flex flex-1 items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold tracking-widest uppercase transition-all ${
                              isSelected
                                ? 'bg-foreground text-background border-foreground'
                                : 'bg-background border-border text-muted hover:border-foreground/50 hover:text-foreground'
                            }`}
                          >
                            <Icon size={14} strokeWidth={isSelected ? 2.5 : 2} />
                            {type.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  {/* Address Line 1 */}
                  <div className="col-span-2">
                    <input
                      type="text"
                      required
                      placeholder="ADDRESS LINE 1 (STREET, BUILDING)..."
                      value={newAddress.addressLine1}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine1: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  {/* Address Line 2 */}
                  <div className="col-span-2">
                    <input
                      type="text"
                      placeholder="ADDRESS LINE 2 (OPTIONAL)..."
                      value={newAddress.addressLine2}
                      onChange={(e) => setNewAddress({ ...newAddress, addressLine2: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  {/* City */}
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
                  {/* State */}
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
                  {/* Postal Code */}
                  <div>
                    <input
                      type="text"
                      required
                      placeholder="POSTAL CODE..."
                      value={newAddress.postalCode}
                      onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase"
                    />
                  </div>
                  {/* Country */}
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

            {/* List addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => {
                const TypeIcon = addr.addressType === 'HOME' ? Home : addr.addressType === 'WORK' ? Briefcase : Map;
                return (
                <div
                  key={addr.id}
                  className="border border-border p-5 rounded-xl bg-background hover:border-foreground/30 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="font-bold text-foreground uppercase tracking-widest text-[10px] flex items-center gap-1.5">
                        <TypeIcon size={12} strokeWidth={2.5} />
                        {addr.addressType || 'ADDRESS'}
                      </span>
                      {addr.isDefault && (
                        <span className="px-2 py-0.5 border border-border text-foreground text-[8px] tracking-widest uppercase font-bold rounded-lg bg-secondary">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted leading-relaxed font-sans font-medium space-y-0.5">
                      <p className="font-bold text-foreground mb-1">{addr.fullName} <span className="text-muted font-normal text-[10px] ml-1">{addr.mobileNumber}</span></p>
                      <p>{addr.addressLine1}</p>
                      {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                      <p>
                        {addr.city}, {addr.state} {addr.postalCode}
                      </p>
                      <p>{addr.country}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-border/40 text-[9px] uppercase tracking-widest font-bold text-muted">
                    <button
                      onClick={() => alert('Editing addresses disabled in prototype.')}
                      className="hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <Edit className="w-3 h-3 stroke-[1.5]" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="hover:text-red-600 flex items-center gap-1 transition-colors"
                    >
                      <Trash2 className="w-3 h-3 stroke-[1.5]" /> Delete
                    </button>
                  </div>
                </div>
                );
              })}
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
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase transition-colors"
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
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase transition-colors"
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
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-xs font-semibold tracking-wider placeholder-neutral-400 focus:border-foreground uppercase transition-colors"
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
