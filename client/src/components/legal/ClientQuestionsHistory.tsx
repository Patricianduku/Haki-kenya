import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { apiClient, type Profile, type LegalQuestion, type Consultation, type DocumentTemplate, type UserDocument, type AnonymousReport, type ConsultationReview } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, FileQuestion, Clock, MessageSquare, CheckCircle } from 'lucide-react'
import { format } from 'date-fns'

export const ClientQuestionsHistory = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [questions, setQuestions] = useState<LegalQuestion[]>([])
  const [selectedQuestion, setSelectedQuestion] = useState<LegalQuestion | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchQuestions()
      
      // Set up real-time subscription
      const subscription = supabase
        .channel('client_questions')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'legal_questions',
            filter: `client_id=eq.${user.id}`
          },
          () => {
            fetchQuestions()
          }
        )
        .subscribe()

      return () => subscription.unsubscribe()
    }
  }, [user])

  const fetchQuestions = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('legal_questions')
        .select(`
          *,
          lawyer:profiles!legal_questions_lawyer_id_fkey(full_name, specialization)
        `)
        .eq('client_id', user.id)
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileQuestion className="h-6 w-6" />
          <span>Your Legal Questions</span>
        </CardTitle>
        <CardDescription>
          Track the status of your submitted legal questions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {questions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            You haven't submitted any questions yet. Use the form above to ask your first legal question.
          </div>
        ) : (
          <div className="space-y-4">
            {questions.map((question) => (
              <Card key={question.id} className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium">{question.title}</h3>
                      <Badge variant={getStatusVariant(question.status)} className="flex items-center space-x-1">
                        {getStatusIcon(question.status)}
                        <span className="capitalize">{question.status}</span>
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Category:</span> {question.category}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">Submitted:</span> {format(new Date(question.created_at), 'PPP')}
                    </div>
                    
                    {(question as any).lawyer && (
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">Answered by:</span> {(question as any).lawyer.full_name}
                      </div>
                    )}
                  </div>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedQuestion(question)}
                      >
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{question.title}</DialogTitle>
                        <DialogDescription>
                          {question.category} • Submitted on {format(new Date(question.created_at), 'PPP')}
                        </DialogDescription>
                      </DialogHeader>
                      
                      {selectedQuestion && (
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium mb-2">Your Question</h4>
                            <p className="text-sm whitespace-pre-wrap bg-muted p-3 rounded">
                              {selectedQuestion.description}
                            </p>
                          </div>

                          {selectedQuestion.answer ? (
                            <div>
                              <h4 className="font-medium mb-2">Legal Guidance</h4>
                              <div className="bg-primary/5 border border-primary/20 p-4 rounded">
                                <p className="text-sm whitespace-pre-wrap">
                                  {selectedQuestion.answer}
                                </p>
                                {(selectedQuestion as any).lawyer && (
                                  <div className="mt-3 pt-3 border-t border-primary/20">
                                    <p className="text-xs text-muted-foreground">
                                      Answered by {(selectedQuestion as any).lawyer.full_name}
                                      {(selectedQuestion as any).lawyer.specialization && 
                                        ` • ${(selectedQuestion as any).lawyer.specialization}`
                                      }
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                              <p className="text-sm text-yellow-800">
                                Your question is pending review. A qualified lawyer will provide guidance soon.
                              </p>
                            </div>
                          )}

                          <div className="text-xs text-muted-foreground">
                            <p><strong>Status:</strong> {selectedQuestion.status}</p>
                            <p><strong>Last Updated:</strong> {format(new Date(selectedQuestion.updated_at), 'PPP')}</p>
                          </div>
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