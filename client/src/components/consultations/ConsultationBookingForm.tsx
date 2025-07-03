import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { apiClient, type Profile, type LegalQuestion, type Consultation, type DocumentTemplate, type UserDocument, type AnonymousReport, type ConsultationReview } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Calendar as CalendarIcon, Clock, Video, Phone, MapPin } from 'lucide-react'
import { format } from 'date-fns'

interface ConsultationFormData {
  lawyer_id: string
  title: string
  description: string
  consultation_type: 'video' | 'phone' | 'in_person'
  scheduled_date: Date
  scheduled_time: string
  duration_minutes: number
  location?: string
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
]

export const ConsultationBookingForm = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [lawyers, setLawyers] = useState<Profile[]>([])
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedType, setSelectedType] = useState<string>('')
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<ConsultationFormData>()

  const consultationType = watch('consultation_type')

  useEffect(() => {
    fetchLawyers()
  }, [])

  const fetchLawyers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['lawyer', 'paralegal'])
        .order('full_name')

      if (error) throw error
      setLawyers(data || [])
    } catch (error: any) {
      toast({
        title: 'Error loading lawyers',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const onSubmit = async (data: ConsultationFormData) => {
    if (!user || !selectedDate) return

    setLoading(true)
    try {
      // Combine date and time
      const [hours, minutes] = data.scheduled_time.split(':').map(Number)
      const scheduledDateTime = new Date(selectedDate)
      scheduledDateTime.setHours(hours, minutes, 0, 0)

      const consultationData = {
        client_id: user.id,
        lawyer_id: data.lawyer_id,
        title: data.title,
        description: data.description,
        consultation_type: data.consultation_type,
        scheduled_date: scheduledDateTime.toISOString(),
        duration_minutes: data.duration_minutes,
        location: data.consultation_type === 'in_person' ? data.location : null,
        price: 0, // You can implement pricing logic here
        status: 'pending'
      }

      const { error } = await supabase
        .from('consultations')
        .insert(consultationData)

      if (error) throw error

      toast({
        title: 'Consultation booked',
        description: 'Your consultation request has been submitted successfully.',
      })
      
      reset()
      setSelectedDate(undefined)
    } catch (error: any) {
      toast({
        title: 'Booking failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
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

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="h-6 w-6 text-primary" />
          <span>Book Consultation</span>
        </CardTitle>
        <CardDescription>
          Schedule a consultation with a qualified lawyer
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="lawyer_id">Select Lawyer</Label>
            <Select onValueChange={(value) => setValue('lawyer_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a lawyer" />
              </SelectTrigger>
              <SelectContent>
                {lawyers.map((lawyer) => (
                  <SelectItem key={lawyer.id} value={lawyer.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{lawyer.full_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {lawyer.specialization}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register('lawyer_id', { required: 'Please select a lawyer' })}
            />
            {errors.lawyer_id && (
              <p className="text-sm text-destructive">{errors.lawyer_id.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Consultation Title</Label>
            <Input
              id="title"
              {...register('title', { required: 'Title is required' })}
              placeholder="Brief description of your legal matter"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register('description', { required: 'Description is required' })}
              placeholder="Provide details about your legal issue"
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Consultation Type</Label>
            <Select onValueChange={(value) => {
              setValue('consultation_type', value as any)
              setSelectedType(value)
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select consultation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="video">
                  <div className="flex items-center space-x-2">
                    <Video className="w-4 h-4" />
                    <span>Video Call</span>
                  </div>
                </SelectItem>
                <SelectItem value="phone">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Phone Call</span>
                  </div>
                </SelectItem>
                <SelectItem value="in_person">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>In Person</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register('consultation_type', { required: 'Please select consultation type' })}
            />
            {errors.consultation_type && (
              <p className="text-sm text-destructive">{errors.consultation_type.message}</p>
            )}
          </div>

          {consultationType === 'in_person' && (
            <div className="space-y-2">
              <Label htmlFor="location">Meeting Location</Label>
              <Input
                id="location"
                {...register('location', { 
                  required: consultationType === 'in_person' ? 'Location is required for in-person meetings' : false 
                })}
                placeholder="Enter meeting location"
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location.message}</p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date() || date.getDay() === 0}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduled_time">Select Time</Label>
              <Select onValueChange={(value) => setValue('scheduled_time', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{time}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input
                type="hidden"
                {...register('scheduled_time', { required: 'Please select a time' })}
              />
              {errors.scheduled_time && (
                <p className="text-sm text-destructive">{errors.scheduled_time.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration_minutes">Duration (minutes)</Label>
            <Select onValueChange={(value) => setValue('duration_minutes', parseInt(value))}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register('duration_minutes', { required: 'Please select duration' })}
            />
            {errors.duration_minutes && (
              <p className="text-sm text-destructive">{errors.duration_minutes.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={loading || !selectedDate}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Book Consultation
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}