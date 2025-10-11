/*
  # Remove Foreign Key Constraints for Bypass Authentication

  ## Overview
  This migration removes foreign key constraints to auth.users table to allow
  bypass authentication (mock users) to work without actual Supabase auth users.

  ## Changes
  1. **Trips Table**
     - Drop foreign key constraint from user_id to auth.users
  
  2. **Booking Requests Table**
     - Drop foreign key constraint from user_id to auth.users

  3. **Profiles Table**
     - Drop foreign key constraint from id to auth.users

  ## Security Note
  This is for development/demo purposes where authentication is bypassed.
  In production, proper foreign key constraints should be enforced.
*/

-- Drop foreign key constraint on trips.user_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'trips_user_id_fkey' 
    AND table_name = 'trips'
  ) THEN
    ALTER TABLE trips DROP CONSTRAINT trips_user_id_fkey;
  END IF;
END $$;

-- Drop foreign key constraint on booking_requests.user_id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'booking_requests_user_id_fkey' 
    AND table_name = 'booking_requests'
  ) THEN
    ALTER TABLE booking_requests DROP CONSTRAINT booking_requests_user_id_fkey;
  END IF;
END $$;

-- Drop foreign key constraint on profiles.id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles DROP CONSTRAINT profiles_id_fkey;
  END IF;
END $$;
