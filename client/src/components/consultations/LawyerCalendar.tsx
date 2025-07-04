import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar } from '@/components/ui/calendar'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { supabase, Consultation } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Calendar as CalendarIcon, Clock, Video, Phone, MapPin, User, CheckCircle, XCircle } from 'lucide-react'
import { format, isSameDay, parseISO } from 'date-fns'

export const LawyerCalendar = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null)
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchConsultations()
    }
  }, [user])

  const fetchConsultations = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('consultations')
        .select(`
          *,
          client:profiles!consultations_client_id_fkey(full_name, email, phone)
        `)
        .eq('lawyer_id', user.id)
        .order('scheduled_date', { ascending: true })

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

  const updateConsultationStatus = async (consultationId: string, status: string, notes?: string) => {
    setUpdating(true)
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      }

      if (notes) {
        updateData.notes = notes
      }

      if (status === 'confirmed' && selectedConsultation?.consultation_type === 'video') {
        // Generate a meeting link (you can integrate with Zoom, Google Meet, etc.)
        updateData.meeting_link = `https://meet.example.com/room/${consultationId}`
      }

      const { error } = await supabase
        .from('consultations')
        .update(updateData)
        .eq('id', consultationId)

      if (error) throw error

      await fetchConsultations()
      setSelectedConsultation(null)
      
      toast({
        title: 'Consultation updated',
        description: `Consultation status changed to ${status}`,
      })
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUpdating(false)
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

  const getDayConsultations = (date: Date) => {
    return consultations.filter(consultation => 
      isSameDay(parseISO(consultation.scheduled_date), date)
    )
  }

  const selectedDayConsultations = getDayConsultations(selectedDate)

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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CalendarIcon className="h-6 w-6" />
            <span>Consultation Calendar</span>
          </CardTitle>
          <CardDescription>
            Manage your consultation appointments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border"
                modifiers={{
                  hasConsultations: (date) => getDayConsultations(date).length > 0
                }}
                modifiersStyles={{
                  hasConsultations: { 
                    backgroundColor: 'hsl(var(--primary))', 
                    color: 'white',
                    fontWeight: 'bold'
                  }
                }}
              />
            </div>

            {/* Day's consultations */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                {format(selectedDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              
              {selectedDayConsultations.length === 0 ? (
                <p className="text-muted-foreground">No consultations scheduled for this day.</p>
              ) : (
                <div className="space-y-3">
                  {selectedDayConsultations.map((consultation) => (
                    <Card key={consultation.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(consultation.consultation_type)}
                            <span className="font-medium">{consultation.title}</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="w-4 h-4" />
                            <span>{format(parseISO(consultation.scheduled_date), 'HH:mm')}</span>
                            <span>({consultation.duration_minutes} min)</span>
                          </div>
                          
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{(consultation as any).client?.full_name}</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <Badge className={getStatusColor(consultation.status)}>
                            {consultation.status}
                          </Badge>
                          
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedConsultation(consultation)}
                              >
                                Manage
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Manage Consultation</DialogTitle>
                                <DialogDescription>
                                  Update consultation status and add notes
                                </DialogDescription>
                              </DialogHeader>
                              
                              {selectedConsultation && (
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <strong>Client:</strong> {(selectedConsultation as any).client?.full_name}
                                    </div>
                                    <div>
                                      <strong>Email:</strong> {(selectedConsultation as any).client?.email}
                                    </div>
                                    <div>
                                      <strong>Phone:</strong> {(selectedConsultation as any).client?.phone || 'N/A'}
                                    </div>
                                    <div>
                                      <strong>Type:</strong> {selectedConsultation.consultation_type}
                                    </div>
                                    <div>
                                      <strong>Date:</strong> {format(parseISO(selectedConsultation.scheduled_date), 'PPP')}
                                    </div>
                                    <div>
                                      <strong>Time:</strong> {format(parseISO(selectedConsultation.scheduled_date), 'HH:mm')}
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
                                          {selectedConsultation.meeting_link}
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
                                  
                                  <div className="flex space-x-2">
                                    {selectedConsultation.status === 'pending' && (
                                      <>
                                        <Button
                                          onClick={() => updateConsultationStatus(selectedConsultation.id, 'confirmed')}
                                          disabled={updating}
                                          className="flex items-center space-x-2"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                          <span>Confirm</span>
                                        </Button>
                                        <Button
                                          variant="destructive"
                                          onClick={() => updateConsultationStatus(selectedConsultation.id, 'cancelled')}
                                          disabled={updating}
                                          className="flex items-center space-x-2"
                                        >
                                          <XCircle className="w-4 h-4" />
                                          <span>Cancel</span>
                                        </Button>
                                      </>
                                    )}
                                    
                                    {selectedConsultation.status === 'confirmed' && (
                                      <Button
                                        onClick={() => updateConsultationStatus(selectedConsultation.id, 'completed')}
                                        disabled={updating}
                                        className="flex items-center space-x-2"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        <span>Mark Complete</span>
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              )}
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {consultations.filter(c => c.status === 'pending').length}
            </div>
            <div className="text-sm text-muted-foreground">Pending</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {consultations.filter(c => c.status === 'confirmed').length}
            </div>
            <div className="text-sm text-muted-foreground">Confirmed</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {consultations.filter(c => c.status === 'completed').length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {consultations.filter(c => c.status === 'cancelled').length}
            </div>
            <div className="text-sm text-muted-foreground">Cancelled</div>
          </div>
        </Card>
      </div>
    </div>
  )
}