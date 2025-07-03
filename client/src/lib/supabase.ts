import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type UserRole = 'client' | 'lawyer' | 'paralegal'

export interface Profile {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  location?: string
  specialization?: string
  bar_number?: string
  created_at: string
  updated_at: string
}

export interface LegalQuestion {
  id: string
  client_id: string
  title: string
  description: string
  category: string
  status: 'pending' | 'answered' | 'closed'
  answer?: string
  lawyer_id?: string
  created_at: string
  updated_at: string
}

export interface Consultation {
  id: string
  client_id: string
  lawyer_id: string
  title: string
  description: string
  consultation_type: 'video' | 'phone' | 'in_person'
  scheduled_date: string
  duration_minutes: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  meeting_link?: string
  location?: string
  price: number
  notes?: string
  created_at: string
  updated_at: string
}

export interface DocumentTemplate {
  id: string
  title: string
  description?: string
  category: string
  file_path: string
  file_size?: number
  file_type?: string
  download_count: number
  is_active: boolean
  created_by?: string
  created_at: string
  updated_at: string
}

export interface UserDocument {
  id: string
  user_id: string
  title: string
  description?: string
  file_path: string
  file_size?: number
  file_type?: string
  is_private: boolean
  created_at: string
  updated_at: string
}

export interface AnonymousReport {
  id: string
  category: string
  title: string
  description: string
  location?: string
  incident_date?: string
  status: 'pending' | 'under_review' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assigned_to?: string
  admin_notes?: string
  created_at: string
  updated_at: string
}

export interface ConsultationReview {
  id: string
  consultation_id: string
  client_id: string
  lawyer_id: string
  rating: number
  review_text?: string
  is_approved: boolean
  created_at: string
  updated_at: string
}