/**
 * Admin Products Page - LaRama Frontend
 * Placeholder inventory table ready for future CRUD integration.
 */

const placeholderProducts = [
  { id: 'P-1001', name: 'Handcrafted Necklace', stock: 12, status: 'Active' },
  { id: 'P-1002', name: 'Personalized Phone Case', stock: 8, status: 'Active' },
  { id: 'P-1003', name: 'Custom Prayer Beads', stock: 0, status: 'Out of Stock' },
];

const AdminProducts = () => {
  return (
    <div>
      <div className="admin-card">
        <h2>Product Catalog Overview</h2>
        <p>
          This table will be connected to the real product inventory. Add, edit,
          and archive handcrafted products from here in future releases.
        </p>
      </div>

      <table className="admin-table" aria-label="Product Inventory">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Product</th>
            <th scope="col">Stock</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {placeholderProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.stock}</td>
              <td>
                <span
                  className={`admin-status ${product.status === 'Active' ? 'success' : 'danger'}`}
                >
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProducts;
