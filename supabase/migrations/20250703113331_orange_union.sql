/*
  # Create consultation reviews system

  1. New Tables
    - `consultation_reviews`
      - `id` (uuid, primary key)
      - `consultation_id` (uuid, references consultations)
      - `client_id` (uuid, references profiles)
      - `lawyer_id` (uuid, references profiles)
      - `rating` (integer, 1-5)
      - `review_text` (text)
      - `is_approved` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Only clients can create reviews
    - Public read for approved reviews
*/

-- Create consultation reviews table
CREATE TABLE IF NOT EXISTS consultation_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid REFERENCES consultations(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  lawyer_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text text,
  is_approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(consultation_id, client_id)
);

-- Enable RLS
ALTER TABLE consultation_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Clients can create reviews for their consultations"
  ON consultation_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = client_id AND
    EXISTS (
      SELECT 1 FROM consultations 
      WHERE id = consultation_id 
      AND client_id = auth.uid()
      AND status = 'completed'
    )
  );

CREATE POLICY "Anyone can view approved reviews"
  ON consultation_reviews
  FOR SELECT
  TO authenticated
  USING (is_approved = true);

CREATE POLICY "Users can view their own reviews"
  ON consultation_reviews
  FOR SELECT
  TO authenticated
  USING (auth.uid() = client_id OR auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can approve reviews"
  ON consultation_reviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('lawyer', 'paralegal')
    )
  );

-- Create indexes
CREATE INDEX idx_consultation_reviews_lawyer_id ON consultation_reviews(lawyer_id);
CREATE INDEX idx_consultation_reviews_approved ON consultation_reviews(is_approved);
CREATE INDEX idx_consultation_reviews_rating ON consultation_reviews(rating);