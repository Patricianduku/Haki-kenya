import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'

interface Notification {
  id: string
  type: 'question' | 'consultation' | 'report' | 'review'
  title: string
  message: string
  read: boolean
  created_at: string
}

export const useNotifications = () => {
  const { user, profile } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    if (user && profile) {
      setupRealtimeSubscriptions()
    }

    return () => {
      // Cleanup subscriptions
    }
  }, [user, profile])

  const setupRealtimeSubscriptions = () => {
    if (!user || !profile) return

    // Subscribe to legal questions for lawyers
    if (profile.role === 'lawyer' || profile.role === 'paralegal') {
      const questionsSubscription = supabase
        .channel('new_questions')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'legal_questions' },
          (payload) => {
            showNotification({
              type: 'question',
              title: 'New Legal Question',
              message: `A new question has been submitted: ${payload.new.title}`,
            })
          }
        )
        .subscribe()

      // Subscribe to consultation requests
      const consultationsSubscription = supabase
        .channel('new_consultations')
        .on('postgres_changes', 
          { 
            event: 'INSERT', 
            schema: 'public', 
            table: 'consultations',
            filter: `lawyer_id=eq.${user.id}`
          },
          (payload) => {
            showNotification({
              type: 'consultation',
              title: 'New Consultation Request',
              message: `You have a new consultation request: ${payload.new.title}`,
            })
          }
        )
        .subscribe()

      // Subscribe to anonymous reports
      const reportsSubscription = supabase
        .channel('new_reports')
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'anonymous_reports' },
          (payload) => {
            showNotification({
              type: 'report',
              title: 'New Anonymous Report',
              message: `A new report has been submitted: ${payload.new.title}`,
            })
          }
        )
        .subscribe()
    }

    // Subscribe to question answers for clients
    if (profile.role === 'client') {
      const answersSubscription = supabase
        .channel('question_answers')
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'legal_questions',
            filter: `client_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new.answer && !payload.old.answer) {
              showNotification({
                type: 'question',
                title: 'Question Answered',
                message: `Your question "${payload.new.title}" has been answered by a lawyer.`,
              })
            }
          }
        )
        .subscribe()

      // Subscribe to consultation updates
      const consultationUpdatesSubscription = supabase
        .channel('consultation_updates')
        .on('postgres_changes', 
          { 
            event: 'UPDATE', 
            schema: 'public', 
            table: 'consultations',
            filter: `client_id=eq.${user.id}`
          },
          (payload) => {
            if (payload.new.status !== payload.old.status) {
              showNotification({
                type: 'consultation',
                title: 'Consultation Updated',
                message: `Your consultation "${payload.new.title}" status changed to ${payload.new.status}.`,
              })
            }
          }
        )
        .subscribe()
    }
  }

  const showNotification = (notification: Omit<Notification, 'id' | 'read' | 'created_at'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      created_at: new Date().toISOString()
    }

    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]) // Keep last 50
    setUnreadCount(prev => prev + 1)

    // Show toast notification
    toast({
      title: notification.title,
      description: notification.message,
    })
  }

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  const clearNotifications = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications
  }
}