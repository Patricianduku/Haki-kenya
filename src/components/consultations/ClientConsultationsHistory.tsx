import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { supabase, Consultation } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Calendar, Clock, Video, Phone, MapPin, Star, MessageSquare } from 'lucide-react'
import { format, parseISO } from 'date-fns'

export const ClientConsultationsHistory = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewText, setReviewText] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchConsultations()
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('client_consultations')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'consultations',
            filter: `client_id=eq.${user.id}`
          },
          () => {
            fetchConsultations()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user])

  const fetchConsultations = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          lawyer:profiles!consultations_lawyer_id_fkey(full_name, specialization, email),
          review:consultation_reviews(id, rating, review_text, is_approved)
        `)
        .eq('client_id', user.id)
        .order('scheduled_date', { ascending: false })

      if (error) throw error
      setConsultations(data || [])
    } catch (error: any) {
      toast({
        title: 'Error loading consultations',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const submitReview = async () => {
    if (!selectedConsultation || !user) return

    setSubmittingReview(true)
    try {
      const { error } = await supabase
        .from('consultation_reviews')
        .insert({
          consultation_id: selectedConsultation.id,
          client_id: user.id,
          lawyer_id: selectedConsultation.lawyer_id,
          rating: reviewRating,
          review_text: reviewText.trim() || null,
          is_approved: false
        })

      if (error) throw error

      toast({
        title: 'Review submitted',
        description: 'Your review has been submitted and is pending approval.',
      })

      setReviewText('')
      setReviewRating(5)
      setSelectedConsultation(null)
      await fetchConsultations()
    } catch (error: any) {
      toast({
        title: 'Review submission failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSubmittingReview(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />
      case 'phone': return <Phone className="w-4 h-4" />
      case 'in_person': return <MapPin className="w-4 h-4" />
      default: return null
    }
  }

  const renderStars = (rating: number, interactive = false, onRatingChange?: (rating: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating 
                ? 'text-yellow-400 fill-current' 
                : 'text-gray-300'
            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
            onClick={interactive && onRatingChange ? () => onRatingChange(star) : undefined}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-6 w-6" />
          <span>Your Consultations</span>
        </CardTitle>
        <CardDescription>
          View and manage your consultation appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {consultations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            You haven't booked any consultations yet. Use the form above to schedule your first consultation.
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((consultation) => (
              <Card key={consultation.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(consultation.consultation_type)}
                      <h3 className="font-medium">{consultation.title}</h3>
                      <Badge className={getStatusColor(consultation.status)}>
                        {consultation.status}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Lawyer:</span> {(consultation as any).lawyer?.full_name}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{format(parseISO(consultation.scheduled_date), 'PPP')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{format(parseISO(consultation.scheduled_date), 'HH:mm')}</span>
                      </div>
                    </div>

                    {(consultation as any).review?.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">Your review:</span>
                        {renderStars((consultation as any).review[0].rating)}
                        {(consultation as any).review[0].is_approved ? (
                          <Badge variant="outline" className="text-xs">Published</Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs">Pending approval</Badge>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedConsultation(consultation)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{consultation.title}</DialogTitle>
                        <DialogDescription>
                          Consultation with {(consultation as any).lawyer?.full_name}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedConsultation && (
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <strong>Type:</strong> {selectedConsultation.consultation_type}
                            </div>
                            <div>
                              <strong>Duration:</strong> {selectedConsultation.duration_minutes} minutes
                            </div>
                            <div>
                              <strong>Date:</strong> {format(parseISO(selectedConsultation.scheduled_date), 'PPP')}
                            </div>
                            <div>
                              <strong>Time:</strong> {format(parseISO(selectedConsultation.scheduled_date), 'HH:mm')}
                            </div>
                            <div>
                              <strong>Status:</strong> 
                              <Badge className={`ml-2 ${getStatusColor(selectedConsultation.status)}`}>
                                {selectedConsultation.status}
                              </Badge>
                            </div>
                            <div>
                              <strong>Price:</strong> KES {selectedConsultation.price}
                            </div>
                          </div>
                          
                          <div>
                            <strong>Description:</strong>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {selectedConsultation.description}
                            </p>
                          </div>

                          {selectedConsultation.location && (
                            <div>
                              <strong>Location:</strong>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {selectedConsultation.location}
                              </p>
                            </div>
                          )}

                          {selectedConsultation.meeting_link && (
                            <div>
                              <strong>Meeting Link:</strong>
                              <p className="mt-1 text-sm text-primary">
                                <a href={selectedConsultation.meeting_link} target="_blank" rel="noopener noreferrer">
                                  Join Meeting
                                </a>
                              </p>
                            </div>
                          )}

                          {selectedConsultation.notes && (
                            <div>
                              <strong>Notes:</strong>
                              <p className="mt-1 text-sm text-muted-foreground">
                                {selectedConsultation.notes}
                              </p>
                            </div>
                          )}

                          {/* Review Section */}
                          {selectedConsultation.status === 'completed' && !(selectedConsultation as any).review?.length && (
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-3">Leave a Review</h4>
                              <div className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Rating</label>
                                  <div className="mt-1">
                                    {renderStars(reviewRating, true, setReviewRating)}
                                  </div>
                                </div>
                                
                                <div>
                                  <label className="text-sm font-medium">Review (Optional)</label>
                                  <Textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder="Share your experience with this consultation..."
                                    className="mt-1"
                                  />
                                </div>
                                
                                <Button
                                  onClick={submitReview}
                                  disabled={submittingReview}
                                  className="w-full"
                                >
                                  {submittingReview && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Submit Review
                                </Button>
                              </div>
                            </div>
                          )}

                          {(selectedConsultation as any).review?.length > 0 && (
                            <div className="border-t pt-4">
                              <h4 className="font-medium mb-3">Your Review</h4>
                              <div className="space-y-2">
                                {renderStars((selectedConsultation as any).review[0].rating)}
                                {(selectedConsultation as any).review[0].review_text && (
                                  <p className="text-sm text-muted-foreground">
                                    {(selectedConsultation as any).review[0].review_text}
                                  </p>
                                )}
                                <Badge variant="outline" className="text-xs">
                                  {(selectedConsultation as any).review[0].is_approved ? 'Published' : 'Pending approval'}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}