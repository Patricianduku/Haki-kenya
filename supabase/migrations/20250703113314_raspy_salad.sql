/*
  # Create document library system

  1. New Tables
    - `document_templates`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `category` (text)
      - `file_path` (text)
      - `file_size` (bigint)
      - `file_type` (text)
      - `download_count` (integer)
      - `is_active` (boolean)
      - `created_by` (uuid, references profiles)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `user_documents`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `file_path` (text)
      - `file_size` (bigint)
      - `file_type` (text)
      - `is_private` (boolean)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add appropriate policies
*/

-- Create document templates table
CREATE TABLE IF NOT EXISTS document_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL,
  file_path text NOT NULL,
  file_size bigint,
  file_type text,
  download_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create user documents table
CREATE TABLE IF NOT EXISTS user_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  file_path text NOT NULL,
  file_size bigint,
  file_type text,
  is_private boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_documents ENABLE ROW LEVEL SECURITY;

-- Policies for document templates (public read)
CREATE POLICY "Anyone can view active document templates"
  ON document_templates
  FOR SELECT
  TO authenticated
  USING (is_active = true);

CREATE POLICY "Lawyers can manage document templates"
  ON document_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() 
      AND role IN ('lawyer', 'paralegal')
    )
  );

-- Policies for user documents
CREATE POLICY "Users can view their own documents"
  ON user_documents
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage their own documents"
  ON user_documents
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE INDEX idx_document_templates_category ON document_templates(category);
CREATE INDEX idx_document_templates_active ON document_templates(is_active);
CREATE INDEX idx_user_documents_user_id ON user_documents(user_id);