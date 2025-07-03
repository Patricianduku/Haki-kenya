/*
  # Create anonymous reporting system

  1. New Tables
    - `anonymous_reports`
      - `id` (uuid, primary key)
      - `category` (text)
      - `title` (text)
      - `description` (text)
      - `location` (text)
      - `incident_date` (date)
      - `status` (enum: pending, under_review, resolved, closed)
      - `priority` (enum: low, medium, high, urgent)
      - `assigned_to` (uuid, references profiles, optional)
      - `admin_notes` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Allow anonymous submissions
    - Restrict admin access
*/

-- Create report status enum
CREATE TYPE report_status AS ENUM ('pending', 'under_review', 'resolved', 'closed');

-- Create priority enum
CREATE TYPE report_priority AS ENUM ('low', 'medium', 'high', 'urgent');

-- Create anonymous reports table
CREATE TABLE IF NOT EXISTS anonymous_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category text NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  location text,
  incident_date date,
  status report_status DEFAULT 'pending',
  priority report_priority DEFAULT 'medium',
  assigned_to uuid REFERENCES profiles(id),
  admin_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE anonymous_reports ENABLE ROW LEVEL SECURITY;

-- Allow anonymous submissions
CREATE POLICY "Anyone can submit anonymous reports"
  ON anonymous_reports
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only lawyers and admins can view/manage reports
CREATE POLICY "Lawyers can view and manage reports"
  ON anonymous_reports
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('lawyer', 'paralegal')
    )
  );

-- Create indexes
CREATE INDEX idx_anonymous_reports_category ON anonymous_reports(category);
CREATE INDEX idx_anonymous_reports_status ON anonymous_reports(status);
CREATE INDEX idx_anonymous_reports_priority ON anonymous_reports(priority);
CREATE INDEX idx_anonymous_reports_assigned_to ON anonymous_reports(assigned_to);
CREATE INDEX idx_anonymous_reports_created_at ON anonymous_reports(created_at);