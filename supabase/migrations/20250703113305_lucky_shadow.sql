/*
  # Create consultations system

  1. New Tables
    - `consultations`
      - `id` (uuid, primary key)
      - `client_id` (uuid, references profiles)
      - `lawyer_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `consultation_type` (enum: video, phone, in_person)
      - `scheduled_date` (timestamptz)
      - `duration_minutes` (integer)
      - `status` (enum: pending, confirmed, completed, cancelled)
      - `meeting_link` (text, optional)
      - `location` (text, optional)
      - `price` (decimal)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `consultations` table
    - Add policies for clients and lawyers
*/

-- Create consultation type enum
CREATE TYPE consultation_type AS ENUM ('video', 'phone', 'in_person');

-- Create consultation status enum
CREATE TYPE consultation_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');

-- Create consultations table
CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lawyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  consultation_type consultation_type NOT NULL,
  scheduled_date timestamptz NOT NULL,
  duration_minutes integer DEFAULT 30,
  status consultation_status DEFAULT 'pending',
  meeting_link text,
  location text,
  price decimal(10,2) DEFAULT 0,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Policies for consultations
CREATE POLICY "Users can view their own consultations"
  ON consultations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

CREATE POLICY "Clients can create consultations"
  ON consultations
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = client_id);

CREATE POLICY "Users can update their own consultations"
  ON consultations
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

-- Create indexes
CREATE INDEX idx_consultations_client_id ON consultations(client_id);
CREATE INDEX idx_consultations_lawyer_id ON consultations(lawyer_id);
CREATE INDEX idx_consultations_scheduled_date ON consultations(scheduled_date);
CREATE INDEX idx_consultations_status ON consultations(status);