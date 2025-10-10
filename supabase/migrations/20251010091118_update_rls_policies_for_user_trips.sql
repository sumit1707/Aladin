/*
  # Update RLS Policies for User Trips

  ## Overview
  Updates RLS policies to properly restrict trip and itinerary access to authenticated users only.

  ## Changes
  1. **Trips Table Policies**
     - Drop existing permissive policies
     - Add restrictive policies that check user_id against auth.uid()
     - Users can only view, insert, update, and delete their own trips

  2. **Itineraries Table Policies**
     - Drop existing permissive policies
     - Add restrictive policies that check trip ownership
     - Users can only access itineraries for their own trips

  ## Security
  - All policies now require authentication
  - All policies verify user ownership before granting access
  - Prevents unauthorized access to other users' data
*/

-- Drop existing policies for trips
DROP POLICY IF EXISTS "Users can view own trips via session" ON trips;
DROP POLICY IF EXISTS "Users can insert own trips" ON trips;
DROP POLICY IF EXISTS "Users can update own trips via session" ON trips;
DROP POLICY IF EXISTS "Users can delete own trips via session" ON trips;

-- Drop existing policies for itineraries
DROP POLICY IF EXISTS "Users can view itineraries for their trips" ON itineraries;
DROP POLICY IF EXISTS "Users can insert itineraries" ON itineraries;
DROP POLICY IF EXISTS "Users can update itineraries" ON itineraries;
DROP POLICY IF EXISTS "Users can delete itineraries" ON itineraries;

-- Create restrictive policies for trips table
CREATE POLICY "Authenticated users can view own trips"
  ON trips FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert own trips"
  ON trips FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update own trips"
  ON trips FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete own trips"
  ON trips FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create restrictive policies for itineraries table
CREATE POLICY "Authenticated users can view own itineraries"
  ON itineraries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can insert own itineraries"
  ON itineraries FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can update own itineraries"
  ON itineraries FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can delete own itineraries"
  ON itineraries FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM trips
      WHERE trips.id = itineraries.trip_id
      AND trips.user_id = auth.uid()
    )
  );
