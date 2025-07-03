import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase, UserRole } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface SignUpFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  role: UserRole
  phone?: string
  location?: string
  specialization?: string
  barNumber?: string
}

export const SignUpForm = () => {
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole>('client')
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors }, watch } = useForm<SignUpFormData>()

  const password = watch('password')

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      toast({
        title: 'Passwords do not match',
        description: 'Please make sure your passwords match.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            role: data.role,
          }
        }
      })

      if (authError) throw authError

      // Create profile
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: data.email,
            full_name: data.fullName,
            role: data.role,
            phone: data.phone,
            location: data.location,
            specialization: data.specialization,
            bar_number: data.barNumber,
          })

        if (profileError) throw profileError
      }

      toast({
        title: 'Account created!',
        description: 'Please check your email to verify your account.',
      })
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Join Haki Kenya</CardTitle>
        <CardDescription>
          Create your legal aid account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              {...register('fullName', { required: 'Full name is required' })}
            />
            {errors.fullName && (
              <p className="text-sm text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Select onValueChange={(value: UserRole) => setSelectedRole(value)} defaultValue="client">
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="client">Client</SelectItem>
                <SelectItem value="lawyer">Lawyer</SelectItem>
                <SelectItem value="paralegal">Paralegal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              {...register('location')}
            />
          </div>

          {(selectedRole === 'lawyer' || selectedRole === 'paralegal') && (
            <>
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    {...register('specialization', { 
                      required: (selectedRole === 'lawyer' || selectedRole === 'paralegal') ? 'Specialization is required' : false 
                    })}
                    placeholder="e.g., Family Law, Criminal Law"
                  />
                {errors.specialization && (
                  <p className="text-sm text-destructive">{errors.specialization.message}</p>
                )}
              </div>

              {selectedRole === 'lawyer' && (
                <div className="space-y-2">
                  <Label htmlFor="barNumber">Bar Number</Label>
                  <Input
                    id="barNumber"
                    {...register('barNumber', { 
                      required: selectedRole === 'lawyer' ? 'Bar number is required' : undefined 
                    })}
                  />
                  {errors.barNumber && (
                    <p className="text-sm text-destructive">{errors.barNumber.message}</p>
                  )}
                </div>
              )}
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Account
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}