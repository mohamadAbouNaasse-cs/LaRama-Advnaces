import React, { useEffect, useState } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '../../store/store';
import { loadProducts, addProduct, editProduct, deleteProduct } from '../../store/products/productsSlice';

const CATEGORY_OPTIONS = ['Purses', 'Prayer Beads', 'Neckties', 'Decorations', 'Phone Cases'];

const emptyForm = {
  name: '',
  price: '',
  description: '',
  category: '',
  imageUrl: '',
  stockQuantity: '',
  isActive: true,
};

const IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><rect width="120" height="120" rx="12" fill="%23f4f4f5"/><path fill="%239ca3af" d="M30 37a11 11 0 1 1 22 0 11 11 0 0 1-22 0Zm55 4a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z"/><path fill="%23d1d5db" d="M23 88c0-8 7-17 15-17h45c8 0 14 6 14 14v7H23Z"/></svg>';

const ProductsTable = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (loading === 'idle') dispatch(loadProducts());
  }, [dispatch, loading]);

  const openCreateModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setValidationError('');
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setFormData({
      name: product.name || '',
      price: product.price ?? '',
      description: product.description || '',
      category: product.category || '',
      imageUrl: product.imageUrl || '',
      stockQuantity: product.stockQuantity ?? '',
      isActive: typeof product.isActive === 'boolean' ? product.isActive : true,
    });
    setEditingId(product.id);
    setValidationError('');
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      setValidationError('Name and price are required.');
      return;
    }

    setValidationError('');

    const payload = {
      name: formData.name,
      price: parseFloat(formData.price),
      description: formData.description || null,
      category: formData.category || null,
      imageUrl: formData.imageUrl || null,
      isActive: !!formData.isActive,
    };

    if (formData.stockQuantity !== '' && formData.stockQuantity !== null && formData.stockQuantity !== undefined) {
      payload.stockQuantity = parseInt(formData.stockQuantity, 10);
    }

    if (editingId) {
      await dispatch(editProduct({ id: editingId, ...payload }));
    } else {
      await dispatch(addProduct(payload));
    }

    await dispatch(loadProducts());
    setShowModal(false);
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    await dispatch(deleteProduct(id));
    dispatch(loadProducts());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Product Catalog Overview</h2>
              <p className="text-sm text-gray-500">Connected to the GraphQL products module via Redux + Apollo.</p>
            </div>
            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors"
            >
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full text-left text-sm text-gray-700" aria-label="Product Inventory">
              <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">Image</th>
                  <th scope="col" className="px-3 py-2 font-medium">Name</th>
                  <th scope="col" className="px-3 py-2 font-medium">Category</th>
                  <th scope="col" className="px-3 py-2 font-medium">Price</th>
                  <th scope="col" className="px-3 py-2 font-medium">Stock</th>
                  <th scope="col" className="px-3 py-2 font-medium">Active</th>
                  <th scope="col" className="px-3 py-2 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items && items.length ? (
                  items.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3">
                        <div className="h-12 w-12 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                          <img
                            src={product.imageUrl || IMAGE_PLACEHOLDER}
                            alt={product.name}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = IMAGE_PLACEHOLDER;
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-3 py-3 max-w-xs">
                        <div className="text-sm font-semibold text-gray-900 truncate" title={product.name}>
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500 line-clamp-2" title={product.description || ''}>
                          {product.description || '—'}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1 truncate" title={product.imageUrl || 'No image URL'}>
                          {product.imageUrl || 'No image URL'}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-sm text-gray-700">{product.category || '—'}</td>
                      <td className="px-3 py-3 text-sm text-gray-900">{product.price}</td>
                      <td className="px-3 py-3 text-sm text-gray-700">{product.stockQuantity ?? '—'}</td>
                      <td className="px-3 py-3 text-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
                            product.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}
                        >
                          {product.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="inline-flex items-center rounded-md border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="inline-flex items-center rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-3 py-6 text-center text-sm text-gray-500">No products found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-3xl rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
                <h3 className="text-lg font-semibold text-gray-800">{editingId ? 'Edit Product' : 'Add Product'}</h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1 text-sm text-gray-700">
                    <span className="font-medium">Name</span>
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Beaded purse"
                      required
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-gray-700">
                    <span className="font-medium">Category</span>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="">Select category</option>
                      {CATEGORY_OPTIONS.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-gray-700">
                    <span className="font-medium">Price</span>
                    <input
                      name="price"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="49.99"
                      required
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-gray-700">
                    <span className="font-medium">Stock</span>
                    <input
                      name="stockQuantity"
                      type="number"
                      min="0"
                      value={formData.stockQuantity}
                      onChange={handleChange}
                      placeholder="10"
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <small className="text-xs text-gray-500">Leave blank to keep the default of 1 for new products.</small>
                  </label>

                  <label className="flex flex-col gap-1 text-sm text-gray-700">
                    <span className="font-medium">Image URL</span>
                    <input
                      name="imageUrl"
                      value={formData.imageUrl}
                      onChange={handleChange}
                      placeholder="/images/purses/black.jpg"
                      className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </label>

                  <label className="flex items-center gap-2 text-sm text-gray-700 pt-6 md:pt-0">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={!!formData.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="font-medium">Active</span>
                  </label>
                </div>

                <label className="mt-4 flex flex-col gap-1 text-sm text-gray-700">
                  <span className="font-medium">Description</span>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Short overview of the product..."
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </label>

                {validationError && (
                  <p className="mt-3 text-sm text-red-600">{validationError}</p>
                )}

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                  >
                    {editingId ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminProducts = () => (
  <Provider store={store}>
    <ProductsTable />
  </Provider>
);

export default AdminProducts;
