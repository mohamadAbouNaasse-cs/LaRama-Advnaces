/**
 * Backfill script to set image URLs, categories, and stock defaults for existing products.
 *
 * Usage:
 *   node scripts/update_product_metadata.js
 *
 * Requires database environment variables used by the Express app (DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD).
 */
const { pool } = require('../config/database');

const PRODUCT_MAPPINGS = [
  { name: 'Sik Black Elegance', imageUrl: '/images/purses/black.jpg', category: 'Purses', stockQuantity: 15 },
  { name: 'Noire', imageUrl: '/images/purses/black-hq.jpg', category: 'Purses', stockQuantity: 12 },
  { name: 'Sik Black Collection 2', imageUrl: '/images/purses/black-s.jpg', category: 'Purses', stockQuantity: 10 },
  { name: 'Aurora Pink', imageUrl: '/images/purses/fa5ame.jpg', category: 'Purses', stockQuantity: 18 },
  { name: 'Prisma Colorful', imageUrl: '/images/purses/kid.jpg', category: 'Purses', stockQuantity: 22 },
  { name: 'Coffee Grace Brown', imageUrl: '/images/purses/rama1.jpg', category: 'Purses', stockQuantity: 14 },
  { name: 'Lumiere Red', imageUrl: '/images/purses/red.jpg', category: 'Purses', stockQuantity: 8 },
  { name: 'Pearleva White', imageUrl: '/images/purses/white-snow.jpg', category: 'Purses', stockQuantity: 16 },
  { name: 'Terra Large Wood', imageUrl: '/images/purses/wood-s.jpg', category: 'Purses', stockQuantity: 6 },
  { name: 'Terra Small Wood', imageUrl: '/images/purses/wood-b.jpg', category: 'Purses', stockQuantity: 9 },
  { name: 'Terra Bundle', imageUrl: '/images/purses/wood2.jpg', category: 'Purses', stockQuantity: 3 },
  { name: 'D Letter Decoration', imageUrl: '/images/decorations/D-letter.jpg', category: 'Decorations', stockQuantity: 25 },
  { name: 'RDO Letters Set', imageUrl: '/images/decorations/RDO-letters.jpg', category: 'Decorations', stockQuantity: 12 },
  { name: 'R Letter Art', imageUrl: '/images/decorations/R-letter.jpg', category: 'Decorations', stockQuantity: 30 },
  { name: 'RO Letters Pair', imageUrl: '/images/decorations/RO-letters.jpg', category: 'Decorations', stockQuantity: 18 },
  { name: 'Handmade Beaded Necktie', imageUrl: '/images/nektie/necktie.jpg', category: 'Neckties', stockQuantity: 20 },
  { name: 'Traditional Prayer Beads', imageUrl: '/images/prayer/prayer.jpg', category: 'Prayer Beads', stockQuantity: 40 },
  { name: 'Midnight Serenity Beads', imageUrl: '/images/prayer/black-prayerBead.jpg', category: 'Prayer Beads', stockQuantity: 35 },
  { name: 'Emerald Tranquility Beads', imageUrl: '/images/prayer/green-prayerBead.jpg', category: 'Prayer Beads', stockQuantity: 38 },
  { name: 'Pearleva Phone Case', imageUrl: '/images/phone-case/phone-case.jpg', category: 'Phone Cases', stockQuantity: 15 },
];

async function run() {
  console.log('Starting product metadata backfill...');
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const product of PRODUCT_MAPPINGS) {
      const { name, imageUrl, category, stockQuantity } = product;
      const result = await client.query(
        `UPDATE products
         SET image_url = $1,
             category = $2,
             stock_quantity = COALESCE(stock_quantity, $3),
             is_active = COALESCE(is_active, true),
             updated_at = NOW()
         WHERE name = $4
         RETURNING id, name, image_url, category, stock_quantity, is_active`,
        [imageUrl, category, stockQuantity, name]
      );

      if (result.rowCount === 0) {
        console.warn(`⚠️  No product found with name: ${name}`);
      } else {
        const updated = result.rows[0];
        console.log(`✅ Updated ${updated.name} -> ${updated.image_url} (${updated.category}), stock: ${updated.stock_quantity}`);
      }
    }

    await client.query('COMMIT');
    console.log('Product metadata backfill completed successfully.');
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error updating products:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

run();
