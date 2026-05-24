'use client';
import { useState, useEffect, useCallback } from 'react';
import { Search, Users, ShoppingBag, CheckCircle, XCircle, Shield, UserIcon } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

function getToken() {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('atelier_token') || '';
}

async function fetchUsers(search = '') {
  const qs = search ? `?search=${encodeURIComponent(search)}` : '';
  const res = await fetch(`${API_BASE}/users${qs}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
    credentials: 'include',
  });
  if (!res.ok) throw new Error('Failed to load customers');
  return res.json();
}

function RowSkeleton() {
  return (
    <tr className="border-b border-border animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <td key={i} className="px-6 py-4">
          <div className="h-3 bg-secondary rounded-full w-3/4" />
        </td>
      ))}
    </tr>
  );
}

export default function CustomersPage() {
  const [users, setUsers]       = useState([]);
  const [total, setTotal]       = useState(0);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [search, setSearch]     = useState('');
  const [query, setQuery]       = useState('');

  const load = useCallback(async (q = '') => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchUsers(q);
      const data = res?.data;
      setUsers(Array.isArray(data?.users) ? data.users : []);
      setTotal(data?.total ?? 0);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(''); }, [load]);

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(search);
    load(search);
  };

  const roleStyle = (role) =>
    role === 'ADMIN'
      ? 'bg-foreground text-background'
      : 'bg-secondary text-foreground/70';

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Customer Ledger</h1>
          <p className="text-muted mt-2 text-sm tracking-wide">
            {loading ? 'Loading...' : `${total.toLocaleString()} registered account${total !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs font-medium tracking-wide focus:border-foreground outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-foreground text-background text-[10px] font-bold uppercase tracking-widest rounded-xl hover:opacity-90 transition-opacity"
          >
            Search
          </button>
        </form>
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-xl text-sm text-rose-600 font-medium">
          ⚠ {error}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border border-border rounded-2xl bg-background">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/20">
            <tr>
              <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground/70">Customer</th>
              <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground/70 hidden md:table-cell">Email</th>
              <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground/70 hidden sm:table-cell">Orders</th>
              <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground/70">Verified</th>
              <th className="px-6 py-4 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground/70">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading
              ? [1,2,3,4,5].map(i => <RowSkeleton key={i} />)
              : users.length === 0
              ? (
                <tr>
                  <td colSpan="5" className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted">
                      <Users size={36} strokeWidth={1} className="opacity-30" />
                      <p className="text-sm">No customers found{query ? ` for "${query}"` : ''}.</p>
                    </div>
                  </td>
                </tr>
              )
              : users.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/30 transition-colors group">
                  {/* Name + Avatar */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-foreground/10 flex items-center justify-center font-bold text-xs text-foreground shrink-0 uppercase">
                        {u.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground tracking-wide text-sm">{u.name}</div>
                        <div className="text-[10px] text-muted mt-0.5 md:hidden">{u.email}</div>
                        <div className="text-[10px] text-muted/70 mt-0.5">
                          Joined {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                  </td>
                  {/* Email */}
                  <td className="px-6 py-4 text-muted text-xs tracking-wide hidden md:table-cell">{u.email}</td>
                  {/* Orders count */}
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                      <ShoppingBag size={13} strokeWidth={1.5} className="text-muted" />
                      {u._count?.orders ?? 0}
                    </div>
                  </td>
                  {/* Email verified */}
                  <td className="px-6 py-4">
                    {u.emailVerified
                      ? <CheckCircle size={16} strokeWidth={1.5} className="text-emerald-500" />
                      : <XCircle   size={16} strokeWidth={1.5} className="text-rose-400" />
                    }
                  </td>
                  {/* Role */}
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest ${roleStyle(u.role)}`}>
                      {u.role === 'ADMIN' ? <Shield size={9} /> : <UserIcon size={9} />}
                      {u.role}
                    </span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {!loading && users.length > 0 && (
        <p className="text-[11px] text-muted text-right tracking-wider font-medium">
          Showing {users.length} of {total} customers
        </p>
      )}
    </div>
  );
}
