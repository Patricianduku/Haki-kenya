import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { apiClient, Profile } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, User } from 'lucide-react'

interface ProfileFormData {
  full_name: string
  phone?: string
  location?: string
  specialization?: string
  bar_number?: string
}

export const UserProfile = () => {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfileFormData>()

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name,
        phone: profile.phone || '',
        location: profile.location || '',
        specialization: profile.specialization || '',
        bar_number: profile.bar_number || '',
      })
    }
  }, [profile, reset])

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    setLoading(true)
    try {
      await apiClient.updateProfile(user.id, data)

      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      })
      setEditing(false)
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (!profile) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>User Profile</CardTitle>
              <CardDescription>
                Manage your account information
              </CardDescription>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setEditing(!editing)}
            disabled={loading}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={profile.email}
                disabled
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={profile.role}
                disabled
                className="bg-muted capitalize"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name</Label>
            <Input
              id="full_name"
              {...register('full_name', { required: 'Full name is required' })}
              disabled={!editing}
            />
            {errors.full_name && (
              <p className="text-sm text-destructive">{errors.full_name.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                disabled={!editing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register('location')}
                disabled={!editing}
              />
            </div>
          </div>

          {(profile.role === 'lawyer' || profile.role === 'paralegal') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Textarea
                  id="specialization"
                  {...register('specialization')}
                  disabled={!editing}
                  placeholder="e.g., Family Law, Criminal Law, Corporate Law"
                />
              </div>

              {profile.role === 'lawyer' && (
                <div className="space-y-2">
                  <Label htmlFor="bar_number">Bar Number</Label>
                  <Input
                    id="bar_number"
                    {...register('bar_number')}
                    disabled={!editing}
                  />
                </div>
              )}
            </>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
            <div>
              <strong>Created:</strong> {new Date(profile.created_at).toLocaleDateString()}
            </div>
            <div>
              <strong>Last Updated:</strong> {new Date(profile.updated_at).toLocaleDateString()}
            </div>
          </div>

          {editing && (
            <div className="flex space-x-3">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}