/*
  # Create Representatives Authorization Table

  1. New Tables
    - `representatives`
      - `id` (integer, primary key) - The representative's ID from the company system
      - `whatsapp` (text) - The representative's WhatsApp number (format: 5511999999999)
      - `is_active` (boolean) - Whether the representative is currently authorized
      - `created_at` (timestamptz) - When the representative was added
      - `updated_at` (timestamptz) - Last update timestamp
  
  2. Security
    - Enable RLS on `representatives` table
    - Add policy for public read access (needed for form validation)
    - Only authenticated admins can modify the table (for future admin panel)
  
  3. Initial Data
    - Insert sample representatives for testing
*/

CREATE TABLE IF NOT EXISTS representatives (
  id integer PRIMARY KEY,
  whatsapp text NOT NULL,
  is_active boolean DEFAULT true NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE representatives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active representatives"
  ON representatives
  FOR SELECT
  USING (is_active = true);

CREATE INDEX IF NOT EXISTS idx_representatives_id_active 
  ON representatives(id) 
  WHERE is_active = true;

INSERT INTO representatives (id, whatsapp, is_active) 
VALUES 
  (110956, '5511999999999', true),
  (134684, '5511988888888', true),
  (128591, '5511977777777', true),
  (149027, '5511966666666', true),
  (120033, '5511955555555', true)
ON CONFLICT (id) DO NOTHING;