import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient, type Profile, type LegalQuestion, type Consultation, type DocumentTemplate, type UserDocument, type AnonymousReport, type ConsultationReview } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, FileQuestion, MessageSquare, Clock, CheckCircle } from 'lucide-react'

export const LawyerDashboard = () => {
  const { user } = useAuth()
  const [questions, setQuestions] = useState<LegalQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedQuestion, setSelectedQuestion] = useState<LegalQuestion | null>(null)
  const [answer, setAnswer] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('legal_questions')
        .select(`
          *,
          profiles:client_id (
            full_name,
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setQuestions(data || [])
    } catch (error: any) {
      toast({
        title: 'Error loading questions',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (questionId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('legal_questions')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', questionId)

      if (error) throw error

      await fetchQuestions()
      toast({
        title: 'Status updated',
        description: 'Question status has been updated successfully.',
      })
    } catch (error: any) {
      toast({
        title: 'Update failed',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const handleAnswerSubmit = async () => {
    if (!selectedQuestion || !answer.trim()) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('legal_questions')
        .update({
          answer: answer.trim(),
          lawyer_id: user?.id,
          status: 'answered',
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedQuestion.id)

      if (error) throw error

      await fetchQuestions()
      setSelectedQuestion(null)
      setAnswer('')
      toast({
        title: 'Answer submitted',
        description: 'Your legal guidance has been submitted successfully.',
      })
    } catch (error: any) {
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'answered':
        return <MessageSquare className="h-4 w-4" />
      case 'closed':
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileQuestion className="h-4 w-4" />
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'pending':
        return 'default'
      case 'answered':
        return 'secondary'
      case 'closed':
        return 'outline'
      default:
        return 'default'
    }
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileQuestion className="h-6 w-6" />
            <span>Legal Questions Dashboard</span>
          </CardTitle>
          <CardDescription>
            Review and respond to client legal questions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {questions.filter(q => q.status === 'pending').length}
              </div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-secondary">
                {questions.filter(q => q.status === 'answered').length}
              </div>
              <div className="text-sm text-muted-foreground">Answered</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-muted-foreground">
                {questions.length}
              </div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {questions.map((question) => (
                <TableRow key={question.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {question.title}
                  </TableCell>
                  <TableCell>{question.category}</TableCell>
                  <TableCell>
                    {(question as any).profiles?.full_name || 'Unknown'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(question.status)} className="flex items-center space-x-1 w-fit">
                      {getStatusIcon(question.status)}
                      <span className="capitalize">{question.status}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(question.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedQuestion(question)}
                          >
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{question.title}</DialogTitle>
                            <DialogDescription>
                              {question.category} • Submitted on {new Date(question.created_at).toLocaleDateString()}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <h4 className="font-medium mb-2">Client Information</h4>
                              <p className="text-sm text-muted-foreground">
                                <strong>Name:</strong> {(question as any).profiles?.full_name || 'Unknown'}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                <strong>Email:</strong> {(question as any).profiles?.email || 'Unknown'}
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-medium mb-2">Question Details</h4>
                              <p className="text-sm whitespace-pre-wrap">{question.description}</p>
                            </div>

                            {question.answer && (
                              <div>
                                <h4 className="font-medium mb-2">Your Answer</h4>
                                <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                                  {question.answer}
                                </p>
                              </div>
                            )}

                            {question.status === 'pending' && (
                              <div className="space-y-4">
                                <div>
                                  <h4 className="font-medium mb-2">Provide Legal Guidance</h4>
                                  <Textarea
                                    value={answer}
                                    onChange={(e) => setAnswer(e.target.value)}
                                    placeholder="Provide your professional legal guidance here..."
                                    className="min-h-[120px]"
                                  />
                                </div>
                                <Button
                                  onClick={handleAnswerSubmit}
                                  disabled={!answer.trim() || submitting}
                                  className="w-full"
                                >
                                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                  Submit Answer
                                </Button>
                              </div>
                            )}

                            <div className="flex items-center space-x-4">
                              <Select
                                value={question.status}
                                onValueChange={(value) => handleStatusUpdate(question.id, value)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="answered">Answered</SelectItem>
                                  <SelectItem value="closed">Closed</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {questions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No legal questions found. Questions will appear here as clients submit them.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}