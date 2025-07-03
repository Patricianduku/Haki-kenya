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