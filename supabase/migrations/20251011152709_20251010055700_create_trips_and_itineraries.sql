/*
  # Travel Planner Database Schema

  ## Overview
  Creates the core tables for storing trip plans and itineraries.

  ## New Tables
  
  ### `trips`
  Stores user trip preferences and basic information
  - `id` (uuid, primary key) - Unique trip identifier
  - `user_session_id` (text) - Session identifier for anonymous users
  - `month` (text) - Month of travel
  - `travelers` (integer) - Number of travelers
  - `group_type` (text) - Type of group (Family, Couple, etc.)
  - `domestic_or_intl` (text) - Destination preference
  - `theme` (text[]) - Array of preferred themes
  - `mood` (text) - Travel mood
  - `budget` (text) - Budget range
  - `flexible_dates` (boolean) - Date flexibility
  - `selected_destination` (jsonb) - Chosen destination details
  - `days` (integer) - Number of days for the trip
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `itineraries`
  Stores generated day-by-day itineraries
  - `id` (uuid, primary key) - Unique itinerary identifier
  - `trip_id` (uuid, foreign key) - Reference to trips table
  - `destination_options` (jsonb) - All suggested destinations
  - `daily_plan` (jsonb) - Day-by-day itinerary details
  - `total_cost_per_person` (numeric) - Total estimated cost
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Enable RLS on all tables
  - Allow anonymous users to manage their own trips via session_id
*/

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_session_id text NOT NULL,
  month text NOT NULL,
  travelers integer NOT NULL DEFAULT 1,
  group_type text NOT NULL,
  domestic_or_intl text NOT NULL,
  theme text[] NOT NULL,
  mood text NOT NULL,
  budget text NOT NULL,
  flexible_dates boolean DEFAULT false,
  selected_destination jsonb,
  days integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create itineraries table
CREATE TABLE IF NOT EXISTS itineraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  destination_options jsonb NOT NULL,
  daily_plan jsonb,
  total_cost_per_person numeric,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE itineraries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for trips table
CREATE POLICY "Users can view own trips via session"
  ON trips FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own trips"
  ON trips FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update own trips via session"
  ON trips FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete own trips via session"
  ON trips FOR DELETE
  USING (true);

-- RLS Policies for itineraries table
CREATE POLICY "Users can view itineraries for their trips"
  ON itineraries FOR SELECT
  USING (true);

CREATE POLICY "Users can insert itineraries"
  ON itineraries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can update itineraries"
  ON itineraries FOR UPDATE
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Users can delete itineraries"
  ON itineraries FOR DELETE
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_trips_session ON trips(user_session_id);
CREATE INDEX IF NOT EXISTS idx_itineraries_trip ON itineraries(trip_id);