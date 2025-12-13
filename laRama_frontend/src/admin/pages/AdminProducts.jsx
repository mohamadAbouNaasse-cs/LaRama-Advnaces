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

const ProductsTable = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (loading === 'idle') dispatch(loadProducts());
  }, [dispatch, loading]);

  const openCreateModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
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
      alert('Name and price are required.');
      return;
    }

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
    <div>
      <div className="admin-card">
        <h2>Product Catalog Overview</h2>
        <p>This table is connected to the GraphQL products module via Redux + Apollo.</p>
        <div style={{ marginTop: 12 }}>
          <button onClick={openCreateModal} className="btn-primary">Add Product</button>
        </div>
      </div>

      <table className="admin-table" aria-label="Product Inventory">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Product</th>
            <th scope="col">Category</th>
            <th scope="col">Price</th>
            <th scope="col">Stock</th>
            <th scope="col">Active</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length ? (
            items.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>
                  <div className="font-semibold">{product.name}</div>
                  <div className="text-sm text-gray-600 truncate" title={product.description || ''}>
                    {product.description || '—'}
                  </div>
                  <div className="text-xs text-gray-500 break-all">{product.imageUrl || 'No image URL'}</div>
                </td>
                <td>{product.category || '—'}</td>
                <td>{product.price}</td>
                <td>{product.stockQuantity}</td>
                <td>{product.isActive ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => openEditModal(product)} className="btn-link">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="btn-link danger">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3 className="mb-3">{editingId ? 'Edit Product' : 'Add Product'}</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <label className="block">
                <span className="form-label">Name</span>
                <input name="name" value={formData.name} onChange={handleChange} required className="form-input" />
              </label>

              <label className="block">
                <span className="form-label">Price</span>
                <input name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className="form-input" />
              </label>

              <label className="block">
                <span className="form-label">Description</span>
                <textarea name="description" value={formData.description} onChange={handleChange} className="form-input" rows="3" />
              </label>

              <label className="block">
                <span className="form-label">Category</span>
                <select name="category" value={formData.category} onChange={handleChange} className="form-input">
                  <option value="">Select category</option>
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              <label className="block">
                <span className="form-label">Image URL</span>
                <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="/images/..." className="form-input" />
              </label>

              <label className="block">
                <span className="form-label">Stock Quantity</span>
                <input name="stockQuantity" type="number" min="0" value={formData.stockQuantity} onChange={handleChange} className="form-input" />
                <small className="text-gray-500">Leave blank to use default of 1 for new products.</small>
              </label>

              <label className="inline-flex items-center gap-2">
                <input type="checkbox" name="isActive" checked={!!formData.isActive} onChange={handleChange} />
                <span>Active</span>
              </label>

              <div className="flex gap-2 justify-end pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">{editingId ? 'Save Changes' : 'Create Product'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminProducts = () => (
  <Provider store={store}>
    <ProductsTable />
  </Provider>
);

export default AdminProducts;
