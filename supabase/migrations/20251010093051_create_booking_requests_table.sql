/*
  # Create Booking Requests Table

  ## Overview
  Creates a table to store booking requests with customer details and accommodation preferences.

  ## New Tables
  
  ### `booking_requests`
  Stores booking request information
  - `id` (uuid, primary key) - Unique booking request identifier
  - `user_id` (uuid, foreign key) - References auth.users(id)
  - `trip_id` (uuid, foreign key) - References trips(id)
  - `destination_name` (text) - Destination name
  - `adults` (integer) - Number of adults
  - `children` (integer) - Number of children
  - `seniors` (integer) - Number of seniors
  - `room_type` (text) - Room type preference (3-star, 4-star, 5-star)
  - `vehicle_type` (text) - Vehicle type preference
  - `special_requests` (text) - Special requests/notes
  - `customer_name` (text) - Customer full name
  - `customer_email` (text) - Customer email
  - `customer_phone` (text) - Customer phone number
  - `hotel_options` (jsonb) - Generated hotel options
  - `status` (text) - Booking status (pending, confirmed, cancelled)
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on booking_requests table
  - Users can only view and manage their own booking requests
  - All policies verify user ownership
*/

CREATE TABLE IF NOT EXISTS booking_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  trip_id uuid REFERENCES trips(id) ON DELETE CASCADE,
  destination_name text NOT NULL,
  adults integer NOT NULL DEFAULT 1,
  children integer NOT NULL DEFAULT 0,
  seniors integer NOT NULL DEFAULT 0,
  room_type text NOT NULL,
  vehicle_type text NOT NULL,
  special_requests text DEFAULT '',
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  hotel_options jsonb,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE booking_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own booking requests"
  ON booking_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own booking requests"
  ON booking_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own booking requests"
  ON booking_requests FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own booking requests"
  ON booking_requests FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_booking_requests_user_id ON booking_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_booking_requests_trip_id ON booking_requests(trip_id);
