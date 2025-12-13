import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import store from '../../store/store';
import { loadProducts, addProduct, editProduct, deleteProduct } from '../../store/products/productsSlice';

const ProductsTable = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.products.items);
  const loading = useSelector((state) => state.products.loading);

  useEffect(() => {
    if (loading === 'idle') dispatch(loadProducts());
  }, [dispatch, loading]);

  const handleAdd = async () => {
    const name = window.prompt('Product name:');
    if (!name) return;
    const priceStr = window.prompt('Price:');
    const price = parseFloat(priceStr || '0');
    await dispatch(addProduct({ name, price }));
    dispatch(loadProducts());
  };

  const handleEdit = async (product) => {
    const name = window.prompt('Product name:', product.name) || product.name;
    const priceStr = window.prompt('Price:', String(product.price));
    const price = parseFloat(priceStr || String(product.price));
    await dispatch(editProduct({ id: product.id, name, price }));
    dispatch(loadProducts());
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
        <p>
          This table is connected to the GraphQL products module via Redux + Apollo.
        </p>
        <div style={{ marginTop: 12 }}>
          <button onClick={handleAdd} className="btn-primary">Add Product</button>
        </div>
      </div>

      <table className="admin-table" aria-label="Product Inventory">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
            <th scope="col">Description</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length ? (
            items.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.price}</td>
                <td>{product.description || '-'}</td>
                <td>
                  <button onClick={() => handleEdit(product)} className="btn-link">Edit</button>
                  <button onClick={() => handleDelete(product.id)} className="btn-link danger">Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No products found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const AdminProducts = () => (
  <Provider store={store}>
    <ProductsTable />
  </Provider>
);

export default AdminProducts;
