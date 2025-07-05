import { useState, useEffect } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from '@/lib/supabase'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for demo authentication
    const demoAuth = localStorage.getItem('demo_auth')
    const demoUser = localStorage.getItem('demo_user')
    
    if (demoAuth === 'true' && demoUser) {
      try {
        const userData = JSON.parse(demoUser)
        setUser(userData)
        setProfile(userData)
      } catch (error) {
        console.error('Error parsing demo user data:', error)
      }
    }
    
    setLoading(false)
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    localStorage.removeItem('demo_auth')
    localStorage.removeItem('demo_user')
    setUser(null)
    setProfile(null)
  }

  return {
    user,
    profile,
    loading,
    signOut,
    isAuthenticated: !!user,
    isClient: profile?.role === 'client',
    isLawyer: profile?.role === 'lawyer',
    isParalegal: profile?.role === 'paralegal',
  }
}