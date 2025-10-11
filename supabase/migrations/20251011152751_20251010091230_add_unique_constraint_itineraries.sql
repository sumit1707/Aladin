/*
  # Add Unique Constraint to Itineraries

  ## Overview
  Adds a unique constraint on trip_id to ensure one itinerary per trip.

  ## Changes
  1. **Itineraries Table**
     - Add unique constraint on trip_id column
     - Prevents duplicate itineraries for the same trip

  ## Notes
  - Uses IF NOT EXISTS pattern to be idempotent
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'itineraries_trip_id_key'
  ) THEN
    ALTER TABLE itineraries ADD CONSTRAINT itineraries_trip_id_key UNIQUE (trip_id);
  END IF;
END $$;