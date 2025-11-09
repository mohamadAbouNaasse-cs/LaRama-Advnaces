const { pool } = require('../config/database');

// Get user's cart with all items
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `
      SELECT 
        ci.id as cart_item_id,
        ci.quantity,
        ci.added_at,
        p.id as product_id,
        p.name as product_name,
        p.description,
        p.price,
        p.image_url,
        p.category,
        p.stock_quantity,
        (ci.quantity * p.price) as item_total
      FROM carts c
      LEFT JOIN cart_items ci ON c.id = ci.cart_id
      LEFT JOIN products p ON ci.product_id = p.id AND p.is_active = true
      WHERE c.user_id = $1
      ORDER BY ci.added_at DESC
    `;

    const result = await pool.query(query, [userId]);

    // Calculate cart totals
    let cartItems = [];
    let cartTotal = 0;

    result.rows.forEach(row => {
      if (row.product_id) { // Only include rows with valid products
        const item = {
          cart_item_id: row.cart_item_id,
          quantity: row.quantity,
          added_at: row.added_at,
          product: {
            id: row.product_id,
            name: row.product_name,
            description: row.description,
            price: parseFloat(row.price),
            image_url: row.image_url,
            category: row.category,
            stock_quantity: row.stock_quantity
          },
          item_total: parseFloat(row.item_total)
        };
        cartItems.push(item);
        cartTotal += parseFloat(row.item_total);
      }
    });

    res.json({
      success: true,
      data: {
        cart: {
          items: cartItems,
          total_items: cartItems.length,
          cart_total: cartTotal.toFixed(2)
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching cart'
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    // Check if product exists and is active
    const productResult = await client.query(
      'SELECT id, name, price, stock_quantity FROM products WHERE id = $1 AND is_active = true',
      [product_id]
    );

    if (productResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'Product not found or inactive'
      });
    }

    const product = productResult.rows[0];

    // Check stock availability
    if (product.stock_quantity < quantity) {
      await client.query('ROLLBACK');
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${product.stock_quantity} items available`
      });
    }

    // Get user's cart
    const cartResult = await client.query(
      'SELECT id FROM carts WHERE user_id = $1',
      [userId]
    );

    if (cartResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(500).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const cartId = cartResult.rows[0].id;

    // Check if item already exists in cart
    const existingItem = await client.query(
      'SELECT id, quantity FROM cart_items WHERE cart_id = $1 AND product_id = $2',
      [cartId, product_id]
    );

    if (existingItem.rows.length > 0) {
      // Update existing item quantity
      const newQuantity = existingItem.rows[0].quantity + quantity;
      
      // Check total quantity against stock
      if (newQuantity > product.stock_quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({
          success: false,
          message: `Cannot add ${quantity} more items. Only ${product.stock_quantity - existingItem.rows[0].quantity} more can be added`
        });
      }

      await client.query(
        'UPDATE cart_items SET quantity = $1 WHERE id = $2',
        [newQuantity, existingItem.rows[0].id]
      );
    } else {
      // Add new item to cart
      await client.query(
        'INSERT INTO cart_items (cart_id, product_id, quantity) VALUES ($1, $2, $3)',
        [cartId, product_id, quantity]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: 'Item added to cart successfully'
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Add to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error adding item to cart'
    });
  } finally {
    client.release();
  }
};

// Update cart item quantity
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_item_id } = req.params;
    const { quantity } = req.body;

    // Verify cart item belongs to user
    const cartItemResult = await pool.query(
      `SELECT ci.id, ci.product_id, p.stock_quantity, p.name
       FROM cart_items ci
       JOIN carts c ON ci.cart_id = c.id
       JOIN products p ON ci.product_id = p.id
       WHERE ci.id = $1 AND c.user_id = $2 AND p.is_active = true`,
      [cart_item_id, userId]
    );

    if (cartItemResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const cartItem = cartItemResult.rows[0];

    // Check stock availability
    if (quantity > cartItem.stock_quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock. Only ${cartItem.stock_quantity} items available`
      });
    }

    // Update cart item
    await pool.query(
      'UPDATE cart_items SET quantity = $1 WHERE id = $2',
      [quantity, cart_item_id]
    );

    res.json({
      success: true,
      message: 'Cart item updated successfully'
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating cart item'
    });
  }
};

// Remove item from cart
const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { cart_item_id } = req.params;

    // Verify cart item belongs to user and delete it
    const result = await pool.query(
      `DELETE FROM cart_items 
       WHERE id = $1 AND cart_id IN (
         SELECT id FROM carts WHERE user_id = $2
       )`,
      [cart_item_id, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    res.json({
      success: true,
      message: 'Item removed from cart successfully'
    });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error removing item from cart'
    });
  }
};

// Clear entire cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;

    await pool.query(
      `DELETE FROM cart_items 
       WHERE cart_id IN (
         SELECT id FROM carts WHERE user_id = $1
       )`,
      [userId]
    );

    res.json({
      success: true,
      message: 'Cart cleared successfully'
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error clearing cart'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};