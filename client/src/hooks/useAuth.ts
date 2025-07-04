import { useState, useEffect } from 'react'
import { apiClient, type Profile } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'

export const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    // Get current session
    const getCurrentSession = async () => {
      try {
        const { profile: profileData } = await apiClient.getCurrentUser()
        setUser({ id: profileData.id, email: profileData.email })
        setProfile(profileData)
      } catch (error) {
        setUser(null)
        setProfile(null)
      }
      setLoading(false)
    }

    getCurrentSession()
  }, [])

  const signOut = async () => {
    try {
      await apiClient.logout()
      setUser(null)
      setProfile(null)
      toast({
        title: 'Signed out successfully',
        description: 'You have been logged out of your account.',
      })
      // Redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Sign out error:', error)
      toast({
        title: 'Sign out failed',
        description: 'There was an error signing you out.',
        variant: 'destructive',
      })
    }
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