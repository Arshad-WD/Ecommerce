'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, X, ChevronDown } from 'lucide-react';
import { productApi } from '@/lib/api';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customCatMode, setCustomCatMode] = useState(false);
  const [customCatName, setCustomCatName] = useState('');
  const [formData, setFormData] = useState({
    name: '', sku: '', price: '', stock: '', categoryId: ''
  });

  const fetchProductsAndCategories = async () => {
    try {
      setLoading(true);
      const [productsRes, categoriesRes] = await Promise.all([
        productApi.listProducts(),
        productApi.listCategories()
      ]);
      const pData = productsRes?.data?.products || productsRes?.products || [];
      const cData = categoriesRes?.data || categoriesRes || [];
      setProducts(Array.isArray(pData) ? pData : []);
      setCategories(Array.isArray(cData) ? cData : []);
      if (Array.isArray(cData) && cData.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: cData[0].id }));
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      let categoryId = formData.categoryId;

      // If admin typed a custom category, create it first
      if (customCatMode && customCatName.trim()) {
        const newCat = await productApi.createCategory(customCatName.trim());
        categoryId = newCat.id;
        setCategories(prev => [...prev, newCat]);
      }

      const generatedSlug = formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      await productApi.adminCreateProduct({
        name: formData.name,
        slug: generatedSlug,
        description: `Premium ${formData.name}`,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stock),
        categoryId
      });
      setIsModalOpen(false);
      setCustomCatMode(false);
      setCustomCatName('');
      setFormData({ name: '', sku: '', price: '', stock: '', categoryId: categories[0]?.id || '' });
      fetchProductsAndCategories();
    } catch (error) {
      console.error(error);
      alert('Failed to create product: ' + error.message);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
        <div>
          <h1 className="font-serif text-3xl text-foreground">Products Portfolio</h1>
          <p className="text-muted mt-2 text-sm tracking-wide">Manage your atelier's inventory and seasonal collections.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-foreground text-background px-6 py-3.5 text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-foreground/90 transition-colors flex items-center justify-center gap-2 shrink-0 shadow-sm border border-transparent"
        >
          <Plus size={14} strokeWidth={2} />
          <span>New Product</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card p-4 border border-border">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} strokeWidth={1.5} />
          <input 
            type="text" 
            placeholder="Search catalog by name or SKU..." 
            className="w-full pl-10 pr-4 py-2 bg-background border border-border text-sm tracking-wide focus:border-foreground transition-colors outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-6 py-2 border border-border text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground hover:bg-secondary transition-colors w-full md:w-auto justify-center">
          <Filter size={14} strokeWidth={2} />
          <span>Filter</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-border bg-card">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-background border-b border-border">
            <tr>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Product</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground hidden sm:table-cell">Category</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground hidden md:table-cell">SKU</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Price</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Stock</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground">Status</th>
              <th className="px-6 py-5 font-semibold text-[10px] uppercase tracking-[0.2em] text-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr><td colSpan="7" className="px-6 py-8 text-center text-muted">Loading portfolio...</td></tr>
            ) : products.length === 0 ? (
              <tr><td colSpan="7" className="px-6 py-8 text-center text-muted">No products found.</td></tr>
            ) : products.map((product) => {
              const stock = product.stockQuantity ?? product.stock ?? 0;
              const displayStatus = stock === 0 ? 'Out of Stock' : (stock < 10 ? 'Low Stock' : 'Active');
              const statusColor = displayStatus === 'Active' ? 'text-green-600 dark:text-green-500' :
                displayStatus === 'Low Stock' ? 'text-yellow-600 dark:text-yellow-500' :
                'text-red-500 dark:text-red-400';
              const dotColor = displayStatus === 'Active' ? 'bg-green-600 dark:bg-green-500' :
                displayStatus === 'Low Stock' ? 'bg-yellow-600 dark:bg-yellow-500' :
                'bg-red-500 dark:bg-red-400';
              const catName = typeof product.category === 'object' && product.category ? product.category.name : (product.category || 'Uncategorized');

              return (
              <tr key={product.id} className="hover:bg-secondary/40 transition-colors group">
                <td className="px-6 py-5">
                  <span className="text-foreground font-medium tracking-wide">{product.name}</span>
                  <div className="sm:hidden text-[10px] mt-1 text-muted uppercase tracking-wider">{catName}</div>
                </td>
                <td className="px-6 py-5 text-muted tracking-wide hidden sm:table-cell">{catName}</td>
                <td className="px-6 py-5 text-muted font-mono text-[11px] hidden md:table-cell">{product.sku}</td>
                <td className="px-6 py-5 text-foreground font-serif tracking-wide">
                  {typeof product.price === 'number' ? `$${product.price.toFixed(2)}` : product.price}
                </td>
                <td className="px-6 py-5 text-muted">{stock} <span className="text-[10px] uppercase tracking-wider ml-1">pcs</span></td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.1em] font-semibold ${statusColor}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`}></span>
                    {displayStatus}
                  </span>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-muted hover:text-foreground transition-colors" title="Edit">
                      <Edit size={16} strokeWidth={1.5} />
                    </button>
                    <button className="text-muted hover:text-red-500 transition-colors" title="Delete">
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                    <button className="text-muted hover:text-foreground transition-colors">
                      <MoreHorizontal size={16} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card w-full max-w-lg shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-3xl overflow-hidden border border-border flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between">
              <h2 className="font-serif text-2xl text-foreground">Create New Product</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-muted hover:text-foreground transition-colors p-2 rounded-full hover:bg-secondary">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <form id="createProductForm" onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block text-foreground">Product Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors rounded-xl" placeholder="E.g. Structured Wool Coat" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block text-foreground">SKU Code</label>
                    <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors rounded-xl" placeholder="OUT-001" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest mb-2 flex items-center justify-between text-foreground">
                      <span>Category</span>
                      <button type="button" onClick={() => { setCustomCatMode(!customCatMode); setCustomCatName(''); }} className="text-[9px] text-muted hover:text-foreground underline underline-offset-2 transition-colors normal-case tracking-normal font-normal">
                        {customCatMode ? '← Pick existing' : '+ Add custom'}
                      </button>
                    </label>
                    {customCatMode ? (
                      <input
                        required
                        type="text"
                        value={customCatName}
                        onChange={e => setCustomCatName(e.target.value)}
                        placeholder="E.g. Resort Wear"
                        className="w-full bg-background border border-foreground/40 px-4 py-3 text-sm focus:border-foreground outline-none transition-colors rounded-xl"
                      />
                    ) : (
                      <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors rounded-xl appearance-none">
                        {categories.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block text-foreground">Price ($)</label>
                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors rounded-xl" placeholder="850.00" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block text-foreground">Initial Stock</label>
                    <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors rounded-xl" placeholder="12" />
                  </div>
                </div>
              </form>
            </div>
            <div className="p-6 border-t border-border bg-secondary/30 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-border text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-secondary transition-colors">
                Cancel
              </button>
              <button form="createProductForm" type="submit" className="px-6 py-3 bg-foreground text-background text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-foreground/90 transition-colors">
                Publish Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
