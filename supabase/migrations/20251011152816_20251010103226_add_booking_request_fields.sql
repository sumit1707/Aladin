/*
  # Add Hotel, Room and Car Count Fields to Booking Requests

  1. Changes to `booking_requests` table
    - Add `number_of_hotels` column (integer, default 1)
    - Add `number_of_rooms` column (integer, default 1)
    - Add `number_of_cars` column (integer, default 1)
  
  2. Notes
    - These fields track the customer's requirements for hotels, rooms, and cars
    - All fields have a default value of 1 to ensure valid data
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'booking_requests' AND column_name = 'number_of_hotels'
  ) THEN
    ALTER TABLE booking_requests ADD COLUMN number_of_hotels integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'booking_requests' AND column_name = 'number_of_rooms'
  ) THEN
    ALTER TABLE booking_requests ADD COLUMN number_of_rooms integer DEFAULT 1;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'booking_requests' AND column_name = 'number_of_cars'
  ) THEN
    ALTER TABLE booking_requests ADD COLUMN number_of_cars integer DEFAULT 1;
  END IF;
END $$;