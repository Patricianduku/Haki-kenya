import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
}

export const LoginForm = () => {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)
    try {
      // Simulate login process
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      // Check if user exists in demo storage
      const demoUser = localStorage.getItem('demo_user')
      if (demoUser) {
        const userData = JSON.parse(demoUser)
        if (userData.email === data.email) {
          localStorage.setItem('demo_auth', 'true')
          toast({
            title: 'Welcome back!',
            description: 'You have successfully logged in.',
          })
          
          // Redirect to dashboard
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 1500);
          return
        }
      }
      
      // If no user found, show demo message
      toast({
        title: 'Demo Login',
        description: 'This is a demo. Please sign up first to create an account.',
        variant: 'destructive',
      })
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: 'Please try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (email: string) => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address first.',
        variant: 'destructive',
      })
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: 'Password reset sent',
        description: 'Check your email for the password reset link.',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Login to Haki Kenya</CardTitle>
        <CardDescription>
          Access your legal aid account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              {...register('password', { required: 'Password is required' })}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Login
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => {
              const email = (document.getElementById('email') as HTMLInputElement)?.value
              handleForgotPassword(email)
            }}
          >
            Forgot Password?
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}