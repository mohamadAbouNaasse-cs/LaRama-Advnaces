-- Add Newsletter subscriptions table to LaRama database
-- Run this after connecting to LaRama_db_advances database

-- Newsletter subscriptions table
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
    subscription_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    unsubscribed_date TIMESTAMP NULL,
    source VARCHAR(50) DEFAULT 'website' -- Track where subscription came from (website, footer, home, etc.)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_status ON newsletter_subscriptions(status);

-- Insert some test data
INSERT INTO newsletter_subscriptions (email, source) VALUES 
('admin@larama.com', 'manual'),
('newsletter@larama.com', 'website')
ON CONFLICT (email) DO NOTHING;

-- Verify the table was created
SELECT 'Newsletter table created successfully!' as message;
SELECT COUNT(*) as subscription_count FROM newsletter_subscriptions;