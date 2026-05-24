'use client';
import { useState, useEffect } from 'react';
import { Search, Plus, Filter, MoreHorizontal, Edit, Trash2, X, ChevronDown, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { productApi } from '@/lib/api';
import Toast from '@/components/shared/Toast';
import ConfirmModal from '@/components/shared/ConfirmModal';

export default function ProductsAdminPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [customCatMode, setCustomCatMode] = useState(false);
  const [customCatName, setCustomCatName] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [deletedImageIds, setDeletedImageIds] = useState([]);
  const [editProductId, setEditProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', sku: '', price: '', stock: '', categoryId: ''
  });

  // Reusable custom UI notification and modal states
  const [toast, setToast] = useState({ message: '', type: 'success' });
  const [confirmDelete, setConfirmDelete] = useState({ isOpen: false, productId: null, productName: '' });
  const [saving, setSaving] = useState(false);

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

  const handleConfirmDelete = async () => {
    try {
      await productApi.adminDeleteProduct(confirmDelete.productId);
      setToast({ message: `"${confirmDelete.productName}" has been successfully deleted.`, type: 'success' });
      fetchProductsAndCategories();
    } catch (err) {
      setToast({ message: 'Delete failed: ' + err.message, type: 'error' });
    } finally {
      setConfirmDelete({ isOpen: false, productId: null, productName: '' });
    }
  };

  useEffect(() => {
    fetchProductsAndCategories();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const isEditing = !!editProductId;
    try {
      setSaving(true);
      let categoryId = formData.categoryId;

      // If admin typed a custom category, create it first
      if (customCatMode && customCatName.trim()) {
        const newCat = await productApi.createCategory(customCatName.trim());
        categoryId = newCat.id;
        setCategories(prev => [...prev, newCat]);
      }

      const generatedSlug = formData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const payload = {
        name: formData.name,
        slug: generatedSlug,
        description: `Premium ${formData.name}`,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stock),
        sku: formData.sku,
        categoryId
      };

      let createdProduct = null;

      if (editProductId) {
        await productApi.adminUpdateProduct(editProductId, payload);
        createdProduct = { id: editProductId };
      } else {
        const createdRes = await productApi.adminCreateProduct(payload);
        createdProduct = createdRes?.product || createdRes?.data;
      }

      // Handle Image Uploads into MinIO if files exist
      if (imageFiles && imageFiles.length > 0) {
        if (createdProduct && createdProduct.id) {
          const imgData = new FormData();
          for (let i = 0; i < imageFiles.length; i++) {
            imgData.append('images', imageFiles[i]);
          }
          await productApi.adminUploadProductImages(createdProduct.id, imgData);
        }
      }

      // Execute queued image deletions
      if (deletedImageIds.length > 0) {
        await Promise.allSettled(deletedImageIds.map(id => productApi.adminDeleteProductImage(id)));
      }

      setIsModalOpen(false);
      setCustomCatMode(false);
      setCustomCatName('');
      setImageFiles([]);
      setExistingImages([]);
      setDeletedImageIds([]);
      setEditProductId(null);
      setFormData({ name: '', sku: '', price: '', stock: '', categoryId: categories[0]?.id || '' });
      fetchProductsAndCategories();
      setToast({ message: isEditing ? 'Product details updated successfully.' : 'New product created successfully.', type: 'success' });
      
      // Refresh page after 1.5 seconds so user can see toast message first
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error(error);
      setToast({ message: 'Failed to save product: ' + error.message, type: 'error' });
    } finally {
      setSaving(false);
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
          onClick={() => {
            setEditProductId(null);
            setExistingImages([]);
            setDeletedImageIds([]);
            setFormData({ name: '', sku: '', price: '', stock: '', categoryId: categories[0]?.id || '' });
            setIsModalOpen(true);
          }}
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
              
              // Handle image fetching from prisma schema or mock
              let primaryImg = null;
              if (product.images && product.images.length > 0) {
                primaryImg = typeof product.images[0] === 'string' ? product.images[0] : (product.images[0]?.imageUrl || product.images[0]?.url);
              }

              return (
              <tr key={product.id} className="hover:bg-secondary/40 transition-colors group">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail representation */}
                    <div className="w-12 h-12 bg-secondary rounded-lg border border-border flex items-center justify-center shrink-0 overflow-hidden">
                      {primaryImg ? (
                        <img src={primaryImg} alt={product.name} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="text-muted w-5 h-5 opacity-50" />
                      )}
                    </div>
                    <div>
                      <span className="text-foreground font-medium tracking-wide leading-tight">{product.name}</span>
                      <div className="text-[10px] mt-1 text-muted uppercase tracking-wider">{catName}</div>
                    </div>
                  </div>
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
                  <div className="flex items-center justify-end gap-4">
                    <button 
                      className="text-muted hover:text-foreground transition-colors" 
                      title="Edit"
                      onClick={() => {
                        setEditProductId(product.id);
                        setExistingImages(product.images || []);
                        setFormData({
                          name: product.name || '',
                          sku: product.sku || '',
                          price: product.price || '',
                          stock: stock || 0,
                          categoryId: typeof product.category === 'object' ? product.category?.id : (product.categoryId || product.category || '')
                        });
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit size={16} strokeWidth={1.5} />
                    </button>
                    <button 
                      className="text-muted hover:text-red-500 transition-colors" 
                      title="Delete Product"
                      onClick={() => {
                        setConfirmDelete({
                          isOpen: true,
                          productId: product.id,
                          productName: product.name
                        });
                      }}
                    >
                      <Trash2 size={16} strokeWidth={1.5} />
                    </button>
                    <a 
                      href={`/product/${product.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-muted hover:text-foreground transition-colors inline-flex items-center justify-center pt-1" 
                      title="View on Storefront"
                    >
                      <MoreHorizontal size={16} strokeWidth={1.5} />
                    </a>
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
              <h2 className="font-serif text-2xl text-foreground">{editProductId ? 'Edit Product' : 'Create New Product'}</h2>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setEditProductId(null);
                }} 
                className="text-muted hover:text-foreground transition-colors p-2 rounded-full hover:bg-secondary">
                <X size={20} />
              </button>
            </div>
            <div className="p-8 overflow-y-auto">
              <form id="createProductForm" onSubmit={handleSave} className="space-y-6">
                <fieldset disabled={saving} className="space-y-6 w-full border-none p-0 m-0">
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
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block text-foreground">Price (₹)</label>
                      <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors rounded-xl" placeholder="850.00" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block text-foreground">Initial Stock</label>
                      <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-foreground outline-none transition-colors rounded-xl" placeholder="12" />
                    </div>
                  </div>

                  {/* MinIO Image Upload Boundary */}
                  <div className="pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2 block text-foreground">Product Images</label>
                    
                    {/* Selected & Existing Previews Grid */}
                    {(existingImages.length > 0 || imageFiles.length > 0) && (
                      <div className="flex gap-4 mb-4 flex-wrap">
                        {existingImages.map((img) => (
                          <div key={img.id || img.imageUrl} className="relative w-16 h-16 rounded overflow-hidden border border-border group shrink-0">
                            <img src={img.imageUrl || img} className="w-full h-full object-cover" alt="existing" />
                            <button
                              type="button"
                              onClick={() => {
                                if(img.id) setDeletedImageIds(prev => [...prev, img.id]);
                                setExistingImages(prev => prev.filter(e => e.id !== img.id));
                              }}
                              className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-red-500"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        {imageFiles.map((file, idx) => (
                          <div key={idx} className="relative w-16 h-16 rounded overflow-hidden border border-border group shrink-0">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="new upload" />
                            <button
                              type="button"
                              onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))}
                              className="absolute inset-0 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-foreground"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:bg-secondary/20 transition-colors bg-background">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Plus size={24} className="text-muted mb-2" />
                          <p className="text-xs font-semibold text-muted tracking-wide uppercase">
                            Click to attach more photographs
                          </p>
                        </div>
                        <input 
                          type="file" 
                          className="hidden" 
                          multiple 
                          accept="image/*"
                          onChange={(e) => {
                            const files = Array.from(e.target.files);
                            if(files.length + imageFiles.length + existingImages.length > 5) alert("Maximum 5 images allowed");
                            else setImageFiles(prev => [...prev, ...files]);
                          }} 
                        />
                      </label>
                    </div>
                  </div>
                </fieldset>
              </form>
            </div>
            <div className="p-6 border-t border-border bg-secondary/30 flex justify-end gap-3">
              <button 
                type="button"
                disabled={saving}
                onClick={() => {
                  setIsModalOpen(false);
                  setEditProductId(null);
                  setExistingImages([]);
                  setImageFiles([]);
                  setDeletedImageIds([]);
                }} 
                className="px-6 py-3 border border-border text-[10px] font-semibold uppercase tracking-widest rounded-xl hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                form="createProductForm" 
                type="submit" 
                disabled={saving}
                className="bg-foreground text-background px-6 py-3 text-[10px] font-semibold uppercase tracking-widest hover:bg-foreground/90 transition-colors rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[130px]"
              >
                {saving ? (
                  <>
                    <span className="w-3 h-3 border-2 border-background/25 border-t-background rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>{editProductId ? 'Save Changes' : 'Save Product'}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Toast Notifications */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />

      {/* Reusable Confirm Action Modal */}
      <ConfirmModal 
        isOpen={confirmDelete.isOpen}
        title="Delete Product"
        message={`Are you sure you want to permanently delete "${confirmDelete.productName}"? This cannot be undone.`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete({ isOpen: false, productId: null, productName: '' })}
      />
    </div>
  );
}
