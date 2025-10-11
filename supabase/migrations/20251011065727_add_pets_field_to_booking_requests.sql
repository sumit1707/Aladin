/*
  # Add Pets Field to Booking Requests

  ## Overview
  Adds a boolean field to track whether travelers are bringing pets.

  ## Changes
  - Add `has_pets` column to booking_requests table
  - Default value is false (no pets)
  - Field is optional and can be updated

  ## Notes
  - This helps hotels and car rental services prepare for pet-friendly accommodations
  - Non-breaking change - existing records will default to false
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'booking_requests' AND column_name = 'has_pets'
  ) THEN
    ALTER TABLE booking_requests ADD COLUMN has_pets boolean DEFAULT false;
  END IF;
END $$;
