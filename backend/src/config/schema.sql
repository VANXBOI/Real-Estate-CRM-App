-- =============================================================
-- Real Estate CRM – Database Schema
-- Run this file in your PostgreSQL database to set up all tables
-- Command: psql -U postgres -d real_estate_crm -f schema.sql
-- =============================================================

-- ─── Users (agents, admins, managers) ────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)  NOT NULL,
  email       VARCHAR(150)  UNIQUE NOT NULL,
  password    VARCHAR(255)  NOT NULL,
  role        VARCHAR(20)   NOT NULL DEFAULT 'agent'
                            CHECK (role IN ('admin', 'manager', 'agent')),
  created_at  TIMESTAMP     DEFAULT NOW(),
  updated_at  TIMESTAMP     DEFAULT NOW()
);

-- ─── Leads ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leads (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  phone        VARCHAR(20),
  email        VARCHAR(150),
  budget       NUMERIC(12, 2),
  source       VARCHAR(50)   CHECK (source IN ('website', 'ads', 'referral', 'call', 'walk-in', 'other')),
  preferences  TEXT,                  -- e.g. "3BHK, South Delhi, near metro"
  status       VARCHAR(20)   NOT NULL DEFAULT 'New'
                             CHECK (status IN ('New', 'Contacted', 'Qualified', 'Closed', 'Lost')),
  assigned_to  INT           REFERENCES users(id) ON DELETE SET NULL,
  follow_up_at TIMESTAMP,
  notes        TEXT,
  created_at   TIMESTAMP     DEFAULT NOW(),
  updated_at   TIMESTAMP     DEFAULT NOW()
);

-- ─── Properties ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS properties (
  id           SERIAL PRIMARY KEY,
  title        VARCHAR(200)  NOT NULL,
  type         VARCHAR(30)   CHECK (type IN ('residential', 'commercial', 'plot', 'villa')),
  location     VARCHAR(200),
  price        NUMERIC(14, 2),
  size_sqft    NUMERIC(10, 2),
  bedrooms     INT,
  bathrooms    INT,
  amenities    TEXT,               -- comma-separated or JSON string
  status       VARCHAR(20)   DEFAULT 'Available'
                             CHECK (status IN ('Available', 'Sold', 'Rented', 'Under Negotiation')),
  listed_by    INT           REFERENCES users(id) ON DELETE SET NULL,
  images       TEXT[],             -- array of image URLs
  created_at   TIMESTAMP     DEFAULT NOW(),
  updated_at   TIMESTAMP     DEFAULT NOW()
);

-- ─── Clients ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  phone        VARCHAR(20),
  email        VARCHAR(150),
  type         VARCHAR(10)   CHECK (type IN ('buyer', 'seller', 'both')),
  lead_id      INT           REFERENCES leads(id) ON DELETE SET NULL,
  notes        TEXT,
  created_at   TIMESTAMP     DEFAULT NOW(),
  updated_at   TIMESTAMP     DEFAULT NOW()
);

-- ─── Deals ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS deals (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(200),
  client_id       INT           REFERENCES clients(id) ON DELETE SET NULL,
  property_id     INT           REFERENCES properties(id) ON DELETE SET NULL,
  agent_id        INT           REFERENCES users(id) ON DELETE SET NULL,
  stage           VARCHAR(30)   NOT NULL DEFAULT 'Negotiation'
                                CHECK (stage IN ('Negotiation', 'Agreement', 'Closed', 'Cancelled')),
  deal_value      NUMERIC(14, 2),
  commission_pct  NUMERIC(5, 2) DEFAULT 2.00,   -- e.g. 2.00 means 2%
  commission_amt  NUMERIC(12, 2) GENERATED ALWAYS AS
                  (deal_value * commission_pct / 100) STORED,
  closed_at       TIMESTAMP,
  notes           TEXT,
  created_at      TIMESTAMP     DEFAULT NOW(),
  updated_at      TIMESTAMP     DEFAULT NOW()
);

-- ─── Interactions / Activity log ─────────────────────────────
CREATE TABLE IF NOT EXISTS interactions (
  id           SERIAL PRIMARY KEY,
  lead_id      INT           REFERENCES leads(id) ON DELETE CASCADE,
  client_id    INT           REFERENCES clients(id) ON DELETE CASCADE,
  agent_id     INT           REFERENCES users(id) ON DELETE SET NULL,
  type         VARCHAR(20)   CHECK (type IN ('call', 'email', 'sms', 'meeting', 'note')),
  notes        TEXT,
  created_at   TIMESTAMP     DEFAULT NOW()
);

-- ─── Property visits (client viewed a property) ───────────────
CREATE TABLE IF NOT EXISTS property_visits (
  id           SERIAL PRIMARY KEY,
  client_id    INT           REFERENCES clients(id) ON DELETE CASCADE,
  property_id  INT           REFERENCES properties(id) ON DELETE CASCADE,
  visited_at   TIMESTAMP     DEFAULT NOW(),
  feedback     TEXT
);

-- ─── Sample data (for testing) ────────────────────────────────
-- Admin user: password is "admin123"
INSERT INTO users (name, email, password, role)
VALUES ('Admin User', 'admin@crm.com',
        '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin')
ON CONFLICT DO NOTHING;
