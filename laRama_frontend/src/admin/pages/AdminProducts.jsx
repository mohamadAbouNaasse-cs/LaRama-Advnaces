import React, { useEffect } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import createAdminStore from '../store';
import { fetchProducts } from '../store/productsSlice';

const store = createAdminStore();

const ProductsTable = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);

  useEffect(() => {
    if (status === 'idle') dispatch(fetchProducts());
  }, [dispatch, status]);

  return (
    <div>
      <div className="admin-card">
        <h2>Product Catalog Overview</h2>
        <p>
          This table is connected to the GraphQL products module via a
          lightweight Redux setup. Install required packages if not present.
        </p>
      </div>

      <table className="admin-table" aria-label="Product Inventory">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Product</th>
            <th scope="col">Price</th>
            <th scope="col">Description</th>
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
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No products found.</td>
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
