/*
  # Add travel_mode column to trips table

  ## Changes
  - Add `travel_mode` column to trips table to store user's preferred mode of transport
  - Values can be: 'Car', 'Train 3A', 'Train 2A', 'Flight'
  
  ## Note
  - Uses DO block to check if column exists before adding
  - Safe to run multiple times
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'trips' AND column_name = 'travel_mode'
  ) THEN
    ALTER TABLE trips ADD COLUMN travel_mode text;
  END IF;
END $$;
