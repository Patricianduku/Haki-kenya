import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { CheckCircle, AlertCircle, Info, XCircle, Star, Phone, Mail, Calendar, Download, FileText } from "lucide-react"

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

  const showSuccess = (title: string, description?: string) => {
    toast({
      title,
      description,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      className: "border-green-200 bg-green-50",
    })
  }

  const showError = (title: string, description?: string) => {
    toast({
      title,
      description,
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      className: "border-red-200 bg-red-50",
    })
  }

  const showWarning = (title: string, description?: string) => {
    toast({
      title,
      description,
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      className: "border-yellow-200 bg-yellow-50",
    })
  }

  const showInfo = (title: string, description?: string) => {
    toast({
      title,
      description,
      icon: <Info className="w-5 h-5 text-blue-600" />,
      className: "border-blue-200 bg-blue-50",
    })
  }

  const showBookingConfirmation = (lawyerName: string, date: string, time: string) => {
    toast({
      title: "Booking Confirmed!",
      description: `Your consultation with ${lawyerName} is scheduled for ${date} at ${time}`,
      icon: <Calendar className="w-5 h-5 text-green-600" />,
      className: "border-green-200 bg-green-50",
    })
  }

  const showCallInitiated = (phoneNumber: string) => {
    toast({
      title: "Call Initiated",
      description: `Calling ${phoneNumber}...`,
      icon: <Phone className="w-5 h-5 text-blue-600" />,
      className: "border-blue-200 bg-blue-50",
    })
  }

  const showEmailOpened = (email: string) => {
    toast({
      title: "Email Client Opened",
      description: `Opening email client for ${email}`,
      icon: <Mail className="w-5 h-5 text-blue-600" />,
      className: "border-blue-200 bg-blue-50",
    })
  }

  const showDownloadStarted = (fileName: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${fileName}...`,
      icon: <Download className="w-5 h-5 text-green-600" />,
      className: "border-green-200 bg-green-50",
    })
  }

  const showDocumentSaved = (fileName: string) => {
    toast({
      title: "Document Saved",
      description: `${fileName} has been saved to your documents`,
      icon: <FileText className="w-5 h-5 text-green-600" />,
      className: "border-green-200 bg-green-50",
    })
  }

  const showRatingSubmitted = (rating: number) => {
    toast({
      title: "Rating Submitted",
      description: `Thank you for your ${rating}-star rating!`,
      icon: <Star className="w-5 h-5 text-yellow-600" />,
      className: "border-yellow-200 bg-yellow-50",
    })
  }

  const showOfflineMode = () => {
    toast({
      title: "Offline Mode",
      description: "You're currently offline. Some features may be limited.",
      icon: <AlertCircle className="w-5 h-5 text-yellow-600" />,
      className: "border-yellow-200 bg-yellow-50",
    })
  }

  const showOnlineMode = () => {
    toast({
      title: "Back Online",
      description: "Connection restored. All features are now available.",
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      className: "border-green-200 bg-green-50",
    })
  }

  const showLanguageChanged = (language: string) => {
    toast({
      title: "Language Changed",
      description: `Switched to ${language}`,
      icon: <Info className="w-5 h-5 text-blue-600" />,
      className: "border-blue-200 bg-blue-50",
    })
  }

  const showSearchResults = (count: number, query?: string) => {
    toast({
      title: "Search Complete",
      description: `Found ${count} results${query ? ` for "${query}"` : ''}`,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      className: "border-green-200 bg-green-50",
    })
  }

  const showNoResults = (query?: string) => {
    toast({
      title: "No Results Found",
      description: query ? `No results found for "${query}". Try different keywords.` : "No results found. Try adjusting your search.",
      icon: <Info className="w-5 h-5 text-blue-600" />,
      className: "border-blue-200 bg-blue-50",
    })
  }

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showBookingConfirmation,
    showCallInitiated,
    showEmailOpened,
    showDownloadStarted,
    showDocumentSaved,
    showRatingSubmitted,
    showOfflineMode,
    showOnlineMode,
    showLanguageChanged,
    showSearchResults,
    showNoResults,
  }
}