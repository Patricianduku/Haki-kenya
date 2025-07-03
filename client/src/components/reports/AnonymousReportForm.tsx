import { useState } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { Loader2, Shield, Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'

interface ReportFormData {
  category: string
  title: string
  description: string
  location?: string
  incident_date?: Date
}

const reportCategories = [
  'Police Misconduct',
  'Corruption',
  'Human Rights Violation',
  'Gender-Based Violence',
  'Land Disputes',
  'Employment Issues',
  'Consumer Rights',
  'Environmental Issues',
  'Other'
]

export const AnonymousReportForm = () => {
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedCategory, setSelectedCategory] = useState('')
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReportFormData>()

  const onSubmit = async (data: ReportFormData) => {
    setLoading(true)
    try {
      const reportData = {
        category: data.category,
        title: data.title,
        description: data.description,
        location: data.location || null,
        incident_date: selectedDate ? selectedDate.toISOString().split('T')[0] : null,
        status: 'pending',
        priority: 'medium'
      }

      const { error } = await supabase
        .from('anonymous_reports')
        .insert(reportData)

      if (error) throw error

      toast({
        title: 'Report submitted',
        description: 'Your anonymous report has been submitted successfully. It will be reviewed by our legal team.',
      })
      
      reset()
      setSelectedDate(undefined)
      setSelectedCategory('')
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <CardTitle>Anonymous Legal Report</CardTitle>
            <CardDescription>
              Report legal issues anonymously. Your identity will be protected.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Privacy Notice</h4>
          <p className="text-sm text-blue-800">
            This form allows you to report legal issues anonymously. We do not collect any 
            personal information that could identify you. Your report will be reviewed by 
            qualified legal professionals who can provide guidance or take appropriate action.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Issue Category</Label>
            <Select onValueChange={(value) => {
              setSelectedCategory(value)
              // Register the value manually since we're using Select component
              register('category', { required: 'Please select a category' })
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select the type of legal issue" />
              </SelectTrigger>
              <SelectContent>
                {reportCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <input
              type="hidden"
              {...register('category', { required: 'Please select a category' })}
              value={selectedCategory}
            />
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Report Title</Label>
            <Input
              id="title"
              {...register('title', { 
                required: 'Title is required',
                minLength: {
                  value: 10,
                  message: 'Title must be at least 10 characters'
                }
              })}
              placeholder="Brief summary of the issue"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              {...register('description', { 
                required: 'Description is required',
                minLength: {
                  value: 50,
                  message: 'Description must be at least 50 characters'
                }
              })}
              placeholder="Provide detailed information about the legal issue, including what happened, when, and any other relevant details."
              className="min-h-[120px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location (Optional)</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="Where did this occur?"
              />
            </div>

            <div className="space-y-2">
              <Label>Incident Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-900 mb-2">Important Notes</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• This report is completely anonymous</li>
              <li>• Provide as much detail as possible for better assistance</li>
              <li>• For urgent matters, contact emergency services directly</li>
              <li>• Reports are reviewed by qualified legal professionals</li>
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Anonymous Report
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}