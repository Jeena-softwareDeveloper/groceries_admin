import React, { useState, useEffect } from 'react';
import { api } from '../../api';

interface EditProductDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  productItem: any;
  onSuccess: (updatedItem: any) => void;
}

export function EditProductDrawer({ isOpen, onClose, productItem, onSuccess }: EditProductDrawerProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sellingPrice: '',
    mrp: '',
    stock: '',
    category: '',
  });

  useEffect(() => {
    if (isOpen && productItem?.product) {
      setFormData({
        name: productItem.product.name || '',
        sellingPrice: productItem.product.sellingPrice || '',
        mrp: productItem.product.mrp || '',
        stock: productItem.product.inventory?.stock ?? '',
        category: productItem.product.category?.name || '',
      });
    }
  }, [isOpen, productItem]);

  if (!isOpen || !productItem) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        sellingPrice: Number(formData.sellingPrice),
        mrp: Number(formData.mrp),
        stock: Number(formData.stock),
      };
      const res = await api.put(`/admin/product-approvals/products/${productItem.productId}`, payload);
      const updatedProduct = res.data.data;
      
      onSuccess({
        ...productItem,
        product: {
          ...productItem.product,
          ...updatedProduct,
          inventory: { stock: updatedProduct.inventory?.stock ?? payload.stock },
        }
      });
      onClose();
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] transition-opacity duration-300"
        onClick={!loading ? onClose : undefined}
      />

      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-[110] transform transition-transform duration-300 ease-out flex flex-col`}
      >
        <div className="flex-1 overflow-y-auto">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-5 sticky top-0 z-10 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Edit Product</h2>
            <button 
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6 pb-2">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              Product Images
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {productItem.product?.images && productItem.product.images.length > 0 ? (
                productItem.product.images.map((img: any, idx: number) => (
                  <img key={idx} src={img.url} alt={`Product ${idx}`} className="w-24 h-24 object-cover rounded-xl border border-slate-200 shadow-sm shrink-0" />
                ))
              ) : (
                <div className="w-24 h-24 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 text-xs font-medium">No Images</div>
              )}
            </div>
          </div>

          {/* Form */}
          <div className="p-6">
            <form id="edit-product-form" onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  placeholder="e.g. Fresh Bananas"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Selling Price (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.sellingPrice}
                    onChange={e => setFormData({ ...formData, sellingPrice: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">MRP (₹)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.mrp}
                    onChange={e => setFormData({ ...formData, mrp: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stock Quantity</label>
                <input
                  type="number"
                  required
                  value={formData.stock}
                  onChange={e => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
                <input
                  type="text"
                  disabled
                  value={formData.category}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
                />
                <p className="text-xs text-slate-500 mt-1.5">Category cannot be changed from this view.</p>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 border-t border-slate-200 p-6 sticky bottom-0 z-10 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-6 py-2.5 rounded-lg font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            form="edit-product-form"
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-lg font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </>
  );
}
