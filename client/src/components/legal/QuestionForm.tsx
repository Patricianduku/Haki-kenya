import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient, type Profile, type LegalQuestion, type Consultation, type DocumentTemplate, type UserDocument, type AnonymousReport, type ConsultationReview } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, FileQuestion } from 'lucide-react'

interface QuestionFormData {
  title: string
  description: string
  category: string
}

const legalCategories = [
  'Family Law',
  'Criminal Law',
  'Property Law',
  'Employment Law',
  'Business Law',
  'Contract Law',
  'Immigration Law',
  'Consumer Rights',
  'Personal Injury',
  'Other'
]

export const QuestionForm = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const { toast } = useToast()
  const { register, handleSubmit, formState: { errors }, reset } = useForm<QuestionFormData>()

  const onSubmit = async (data: QuestionFormData) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit a question.',
        variant: 'destructive',
      })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('legal_questions')
        .insert({
          client_id: user.id,
          title: data.title,
          description: data.description,
          category: data.category,
          status: 'pending',
        })

      if (error) throw error

      toast({
        title: 'Question submitted',
        description: 'Your legal question has been submitted successfully. A lawyer will review it soon.',
      })
      
      reset()
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
          <FileQuestion className="h-8 w-8 text-primary" />
          <div>
            <CardTitle>Submit Legal Question</CardTitle>
            <CardDescription>
              Get legal guidance from qualified lawyers
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select onValueChange={setSelectedCategory} value={selectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select a legal category" />
              </SelectTrigger>
              <SelectContent>
                {legalCategories.map((category) => (
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
            <Label htmlFor="title">Question Title</Label>
            <Input
              id="title"
              {...register('title', { 
                required: 'Title is required',
                minLength: {
                  value: 10,
                  message: 'Title must be at least 10 characters'
                }
              })}
              placeholder="Brief summary of your legal question"
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
              placeholder="Please provide detailed information about your legal situation, including relevant facts, dates, and any specific concerns you have."
              className="min-h-[120px]"
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium text-sm mb-2">Important Note:</h4>
            <p className="text-sm text-muted-foreground">
              This platform provides general legal guidance only. For urgent legal matters or 
              formal legal representation, please consult with a lawyer directly.
            </p>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Submit Question
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}