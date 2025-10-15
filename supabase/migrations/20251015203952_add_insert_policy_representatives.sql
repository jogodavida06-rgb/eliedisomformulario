/*
  # Add Insert Policy for Representatives

  1. Changes
    - Add policy to allow public insert on representatives table
    - This enables the API to add new representatives without authentication
  
  2. Security Note
    - In production, you should restrict this to authenticated admin users
    - For now, allowing public insert for ease of use
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'representatives' 
    AND policyname = 'Allow public insert on representatives'
  ) THEN
    CREATE POLICY "Allow public insert on representatives"
      ON representatives
      FOR INSERT
      WITH CHECK (true);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'representatives' 
    AND policyname = 'Allow public update on representatives'
  ) THEN
    CREATE POLICY "Allow public update on representatives"
      ON representatives
      FOR UPDATE
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
