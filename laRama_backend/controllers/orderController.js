const { pool } = require('../config/database');

// Create order from cart
const createOrder = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.id;
    const { shipping_address } = req.body;

    // Get cart items with product details
    const cartQuery = `
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        p.id as product_id,
        p.name as product_name,
        p.price,
        p.stock_quantity,
        (ci.quantity * p.price) as item_total
      FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      JOIN products p ON ci.product_id = p.id AND p.is_active = true
      WHERE c.user_id = $1
    `;

    const cartResult = await client.query(cartQuery, [userId]);

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Check stock availability for all items
    const stockIssues = [];
    for (const item of cartResult.rows) {
      if (item.quantity > item.stock_quantity) {
        stockIssues.push(`${item.product_name}: requested ${item.quantity}, available ${item.stock_quantity}`);
      }
    }

    if (stockIssues.length > 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: 'Insufficient stock for some items',
        stock_issues: stockIssues
      });
    }

    // Calculate total amount
    const totalAmount = cartResult.rows.reduce((sum, item) => sum + parseFloat(item.item_total), 0);

    // Create order
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, status) 
       VALUES ($1, $2, $3, 'pending') 
       RETURNING id, total_amount, status, created_at`,
      [userId, totalAmount, shipping_address]
    );

    const order = orderResult.rows[0];

    // Create order items and update stock
    for (const item of cartResult.rows) {
      // Add item to order
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.product_id, item.quantity, item.price]
      );

      // Update product stock
      await client.query(
        'UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
        [item.quantity, item.product_id]
      );
    }

    // Clear user's cart
    await client.query(
      `DELETE FROM cart_items 
       WHERE cart_id IN (
         SELECT id FROM carts WHERE user_id = $1
       )`,
      [userId]
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: {
          id: order.id,
          total_amount: parseFloat(order.total_amount),
          status: order.status,
          created_at: order.created_at
        }
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating order'
    });
  } finally {
    client.release();
  }
};

// Get all user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const ordersQuery = `
      SELECT id, total_amount, status, shipping_address, created_at, updated_at
      FROM orders 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const ordersResult = await pool.query(ordersQuery, [userId, parseInt(limit), offset]);

    // Get total count for pagination
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM orders WHERE user_id = $1',
      [userId]
    );

    const totalOrders = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalOrders / limit);

    res.json({
      success: true,
      data: {
        orders: ordersResult.rows.map(order => ({
          ...order,
          total_amount: parseFloat(order.total_amount)
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalOrders,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching orders'
    });
  }
};

// Get specific order details
const getOrderById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { order_id } = req.params;

    // Get order details
    const orderResult = await pool.query(
      `SELECT id, total_amount, status, shipping_address, created_at, updated_at
       FROM orders 
       WHERE id = $1 AND user_id = $2`,
      [order_id, userId]
    );

    if (orderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    const order = orderResult.rows[0];

    // Get order items
    const itemsQuery = `
      SELECT 
        oi.quantity,
        oi.price,
        oi.created_at,
        p.id as product_id,
        p.name as product_name,
        p.description,
        p.image_url,
        p.category,
        (oi.quantity * oi.price) as item_total
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE oi.order_id = $1
      ORDER BY oi.created_at
    `;

    const itemsResult = await pool.query(itemsQuery, [order_id]);

    const orderData = {
      ...order,
      total_amount: parseFloat(order.total_amount),
      items: itemsResult.rows.map(item => ({
        quantity: item.quantity,
        price: parseFloat(item.price),
        item_total: parseFloat(item.item_total),
        product: item.product_id ? {
          id: item.product_id,
          name: item.product_name,
          description: item.description,
          image_url: item.image_url,
          category: item.category
        } : null // Handle case where product might be deleted
      }))
    };

    res.json({
      success: true,
      data: {
        order: orderData
      }
    });
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order details'
    });
  }
};

// Get order statistics for user
const getOrderStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const statsQuery = `
      SELECT 
        COUNT(*) as total_orders,
        COALESCE(SUM(total_amount), 0) as total_spent,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_orders,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing_orders,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped_orders,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_orders
      FROM orders 
      WHERE user_id = $1
    `;

    const result = await pool.query(statsQuery, [userId]);
    const stats = result.rows[0];

    res.json({
      success: true,
      data: {
        stats: {
          total_orders: parseInt(stats.total_orders),
          total_spent: parseFloat(stats.total_spent),
          pending_orders: parseInt(stats.pending_orders),
          processing_orders: parseInt(stats.processing_orders),
          shipped_orders: parseInt(stats.shipped_orders),
          delivered_orders: parseInt(stats.delivered_orders),
          cancelled_orders: parseInt(stats.cancelled_orders)
        }
      }
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching order statistics'
    });
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  getOrderStats
};