-- LaRama Product Data Seeder Script
-- This script populates the database with beautiful handcrafted products

-- First, let's clear existing sample products (keep structure)
DELETE FROM cart_items;
DELETE FROM products WHERE name LIKE '%Handcrafted Beaded Necklace%';

-- Insert your beautiful LaRama products with proper categories and images

-- PURSES COLLECTION 🛍️
INSERT INTO products (name, description, price, image_url, category, stock_quantity) VALUES
('Şık 🖤', 'Şık embodies effortless style. Its sleek lines and refined details whisper confidence, turning every glance into admiration. More than an accessory—it''s elegance you can carry. ✨🖤', 50.00, '/images/purses/black.jpg', 'Purses', 15),

('Noiré', 'Noiré is the essence of timeless elegance. Its black beads mirror midnight skies, while golden details whisper luxury. A bag for women who carry mystery with confidence. 🖤🌙✨', 45.00, '/images/purses/black-hq.jpg', 'Purses', 12),

('Şık #2 🖤', 'Şık embodies effortless style. Its sleek lines and refined details whisper confidence, turning every glance into admiration. More than an accessory—it''s elegance you can carry. ✨🖤', 50.00, '/images/purses/black-s.jpg', 'Purses', 10),

('Aurora 🌸', 'Aurora is a bag born from dawn''s first light, where pastel pearls capture the glow of a new beginning. It carries elegance with every touch, like a secret whispered by the morning sky. 🌸✨', 30.00, '/images/purses/fa5ame.jpg', 'Purses', 18),

('Prisma', 'Prisma bursts with the joy of every hue, a playful dance of crystal beads that catch the light from every angle. It''s the bag that turns any outing into a celebration of color and sparkle.🎨🌟', 25.00, '/images/purses/kid.jpg', 'Purses', 22),

('CoffeeGrace 🤎✨', 'Coffee Grace is elegance stirred with warmth. Its beaded texture and pearl accents reflect refined taste, perfect for moments where charm meets confidence.', 30.00, '/images/purses/rama1.jpg', 'Purses', 14),

('Lumière ♥', 'Lumière ignites every look with fearless glamour. Its crimson crystals catch the light like tiny flames, made for nights when confidence steals the spotlight. 🔥', 60.00, '/images/purses/red.jpg', 'Purses', 8),

('Pearleva', 'Pearleva embodies pure sophistication. Layers of luminous pearls reflect quiet luxury, making every occasion feel timeless and effortlessly elegant. 🕊💫', 45.00, '/images/purses/white-snow.jpg', 'Purses', 16),

('Terra L🌿', 'Terra is crafted from nature''s essence, where every wooden bead tells a story of earth and warmth. A bag made for free spirits who carry sunshine and simplicity with them. 🌞🌿', 60.00, '/images/purses/wood-s.jpg', 'Purses', 6),

('Terra S🌿', 'Terra is crafted from nature''s essence, where every wooden bead tells a story of earth and warmth. A bag made for free spirits who carry sunshine and simplicity with them. 🌞🌿', 50.00, '/images/purses/wood-b.jpg', 'Purses', 9),

('Terra Bundle🌿', 'Terra is crafted from nature''s essence, where every wooden bead tells a story of earth and warmth. A bag made for free spirits who carry sunshine and simplicity with them. 🌞🌿', 99.99, '/images/purses/wood2.jpg', 'Purses', 3),

-- DECORATIVE LETTERS COLLECTION 🔤
('D Letter Decoration', 'Elegant beaded letter D, perfect for home decor or gifts. Handcrafted with precision and artistic flair.', 10.00, '/images/decorations/D-letter.jpg', 'Decorations', 25),

('RDO Letters Set', 'Complete set of R, D, and O letters for custom displays. Perfect for personalizing your space with handmade elegance.', 25.00, '/images/decorations/RDO-letters.jpg', 'Decorations', 12),

('R Letter Art', 'Standalone R letter crafted with precision and style. A beautiful addition to any room or perfect as a personalized gift.', 10.00, '/images/decorations/R-letter.jpg', 'Decorations', 30),

('RO Letters Pair', 'Beautiful R and O letter set for various decorative purposes. Handcrafted beadwork that adds personality to any space.', 20.00, '/images/decorations/RO-letters.jpg', 'Decorations', 18),

-- NECKTIES COLLECTION 👔
('Handmade Beaded Necktie', 'Unique beaded necktie that adds elegance to any outfit. Perfect for special occasions and making a sophisticated statement.', 15.00, '/images/nektie/necktie.jpg', 'Neckties', 20),

-- PRAYER BEADS COLLECTION 🙏
('Traditional Prayer Beads', 'Beautifully crafted prayer beads for meditation and spiritual practice. Made with care and respect for tradition.', 8.00, '/images/prayer/prayer.jpg', 'Prayer Beads', 40),

('Midnight Serenity Beads', 'Immerse in quiet reflection with Midnight Serenity, a hand-crafted black prayer bead strand symbolizing protection and calm energy.', 8.00, '/images/prayer/black-prayerBead.jpg', 'Prayer Beads', 35),

('Emerald Tranquility Beads', 'Find peace with Emerald Tranquility, a hand-crafted green prayer bead strand that embodies balance and healing energy.', 8.00, '/images/prayer/green-prayerBead.jpg', 'Prayer Beads', 38),

-- PHONE CASES COLLECTION 📱
('Pearleva Phone Case', 'Pearleva embodies pure sophistication. Layers of luminous pearls reflect quiet luxury, making every occasion feel timeless and effortlessly elegant. 🕊💫', 30.00, '/images/phone-case/phone-case.jpg', 'Phone Cases', 15);

-- Update the original sample products to be inactive (keep them for reference but don't show in store)
UPDATE products SET is_active = false WHERE name IN (
    'Handcrafted Beaded Necklace - Blue Ocean',
    'Vintage Style Beaded Bracelet', 
    'Colorful Beaded Earrings Set',
    'Bohemian Beaded Anklet',
    'Luxury Pearl & Bead Necklace'
);

-- Verify the data
SELECT 
    category,
    COUNT(*) as product_count,
    MIN(price) as min_price,
    MAX(price) as max_price,
    AVG(price) as avg_price
FROM products 
WHERE is_active = true 
GROUP BY category 
ORDER BY category;