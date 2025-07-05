import { useState, useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SuccessNotificationProps {
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

export const SuccessNotification = ({ 
  message, 
  isVisible, 
  onClose, 
  duration = 5000 
}: SuccessNotificationProps) => {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true)
      const timer = setTimeout(() => {
        setIsAnimating(false)
        setTimeout(onClose, 300) // Wait for animation to complete
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  if (!isVisible) return null

  return (
    <div className={cn(
      "fixed top-4 right-4 z-50 transition-all duration-300 ease-in-out",
      isAnimating 
        ? "translate-x-0 opacity-100" 
        : "translate-x-full opacity-0"
    )}>
      <div className="bg-success text-success-foreground rounded-lg shadow-lg p-4 max-w-sm">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={() => {
              setIsAnimating(false)
              setTimeout(onClose, 300)
            }}
            className="ml-auto flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
} 