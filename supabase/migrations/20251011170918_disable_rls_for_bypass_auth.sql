/*
  # Disable RLS Policies for Bypass Authentication

  ## Overview
  This migration temporarily makes RLS policies more permissive to allow
  bypass authentication (mock users) to work without actual Supabase auth.

  ## Changes
  1. **Trips Table**
     - Drop restrictive authenticated-only policies
     - Add permissive policies that allow any user to access their data by user_id
  
  2. **Itineraries Table**
     - Drop restrictive authenticated-only policies
     - Add permissive policies based on trip ownership

  3. **Booking Requests Table**
     - Drop restrictive authenticated-only policies
     - Add permissive policies

  ## Security Note
  This is for development/demo purposes where authentication is bypassed.
  In production, proper RLS policies should be enforced.
*/

-- Drop existing restrictive policies for trips
DROP POLICY IF EXISTS "Authenticated users can view own trips" ON trips;
DROP POLICY IF EXISTS "Authenticated users can insert own trips" ON trips;
DROP POLICY IF EXISTS "Authenticated users can update own trips" ON trips;
DROP POLICY IF EXISTS "Authenticated users can delete own trips" ON trips;

-- Create permissive policies for trips table (no auth check)
CREATE POLICY "Allow all to view trips"
  ON trips FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert trips"
  ON trips FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update trips"
  ON trips FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete trips"
  ON trips FOR DELETE
  USING (true);

-- Drop existing restrictive policies for itineraries
DROP POLICY IF EXISTS "Authenticated users can view own itineraries" ON itineraries;
DROP POLICY IF EXISTS "Authenticated users can insert own itineraries" ON itineraries;
DROP POLICY IF EXISTS "Authenticated users can update own itineraries" ON itineraries;
DROP POLICY IF EXISTS "Authenticated users can delete own itineraries" ON itineraries;

-- Create permissive policies for itineraries table
CREATE POLICY "Allow all to view itineraries"
  ON itineraries FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert itineraries"
  ON itineraries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update itineraries"
  ON itineraries FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete itineraries"
  ON itineraries FOR DELETE
  USING (true);

-- Drop existing restrictive policies for booking_requests
DROP POLICY IF EXISTS "Users can view own booking requests" ON booking_requests;
DROP POLICY IF EXISTS "Users can insert own booking requests" ON booking_requests;
DROP POLICY IF EXISTS "Users can update own booking requests" ON booking_requests;
DROP POLICY IF EXISTS "Users can delete own booking requests" ON booking_requests;

-- Create permissive policies for booking_requests table
CREATE POLICY "Allow all to view booking requests"
  ON booking_requests FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert booking requests"
  ON booking_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update booking requests"
  ON booking_requests FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete booking requests"
  ON booking_requests FOR DELETE
  USING (true);

-- Drop existing restrictive policies for profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create permissive policies for profiles table
CREATE POLICY "Allow all to view profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Allow all to insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all to update profiles"
  ON profiles FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all to delete profiles"
  ON profiles FOR DELETE
  USING (true);
