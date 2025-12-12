/**
 * Admin Orders Page - LaRama Frontend
 * Placeholder order timeline ready for fulfillment tracking.
 */

const placeholderOrders = [
  { id: 'ORD-2001', customer: 'Rania Khalil', total: '$85.00', status: 'Pending' },
  { id: 'ORD-2002', customer: 'Omar Itani', total: '$120.00', status: 'Shipped' },
  { id: 'ORD-2003', customer: 'Sara Haddad', total: '$45.00', status: 'Processing' },
];

const AdminOrders = () => {
  return (
    <div>
      <div className="admin-card">
        <h2>Order Management Overview</h2>
        <p>
          Track and fulfill e-commerce orders here. This section will provide
          status transitions, customer communication tools, and invoice exports
          in future iterations of the admin panel.
        </p>
      </div>

      <table className="admin-table" aria-label="Orders">
        <thead>
          <tr>
            <th scope="col">Order ID</th>
            <th scope="col">Customer</th>
            <th scope="col">Total</th>
            <th scope="col">Status</th>
          </tr>
        </thead>
        <tbody>
          {placeholderOrders.map((order) => {
            const statusClass =
              order.status === 'Shipped' ? 'success' : order.status === 'Pending' ? 'pending' : 'danger';

            return (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.total}</td>
                <td>
                  <span className={`admin-status ${statusClass}`}>{order.status}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
