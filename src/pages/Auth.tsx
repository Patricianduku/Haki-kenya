import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignUpForm } from '@/components/auth/SignUpForm'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center text-white">
          <h1 className="text-3xl font-bold mb-2">Haki Kenya</h1>
          <p className="text-white/80">Legal Aid Platform</p>
        </div>

        {isLogin ? <LoginForm /> : <SignUpForm />}

        <div className="text-center">
          <Button
            variant="ghost"
            className="text-white hover:text-white/80"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin 
              ? "Don't have an account? Sign up" 
              : "Already have an account? Login"
            }
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Auth