/*
  # Create Representatives Authorization Table

  ## Purpose
  This migration creates a secure authorization system for sales representatives.
  Each representative gets a unique ID and WhatsApp number that will be used
  to control access to the registration form and redirect users after registration.

  ## New Tables
  - `representatives_auth`
    - `rep_id` (integer, primary key) - The representative's unique identifier
    - `whatsapp` (text) - Representative's WhatsApp number in format 5584981321396
    - `name` (text, optional) - Representative's name for reference
    - `active` (boolean) - Whether this representative is currently authorized
    - `created_at` (timestamp) - When the representative was added

  ## Security
  - Enable RLS on `representatives_auth` table
  - Add policy for public read access (needed for form validation)
  - Only authorized access can insert/update/delete

  ## Important Notes
  1. This table controls WHO can use the registration form
  2. When someone accesses the form with /rep_id, the system checks if that rep_id exists and is active
  3. If authorized, the form loads and uses that rep's WhatsApp for redirect
  4. If not authorized, the form shows an error message
  5. This does NOT interfere with the company API - the father field still sends the rep_id normally
*/

CREATE TABLE IF NOT EXISTS representatives_auth (
  rep_id integer PRIMARY KEY,
  whatsapp text NOT NULL,
  name text DEFAULT '',
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE representatives_auth ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active representatives"
  ON representatives_auth
  FOR SELECT
  USING (active = true);

CREATE POLICY "No public insert"
  ON representatives_auth
  FOR INSERT
  WITH CHECK (false);

CREATE POLICY "No public update"
  ON representatives_auth
  FOR UPDATE
  USING (false);

CREATE POLICY "No public delete"
  ON representatives_auth
  FOR DELETE
  USING (false);