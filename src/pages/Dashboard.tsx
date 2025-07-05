import { useAuth } from '@/hooks/useAuth'
import { UserProfile } from '@/components/auth/UserProfile'
import { QuestionForm } from '@/components/legal/QuestionForm'
import { LawyerDashboard } from '@/components/legal/LawyerDashboard'
import { ConsultationBookingForm } from '@/components/consultations/ConsultationBookingForm'
import { LawyerCalendar } from '@/components/consultations/LawyerCalendar'
import { DocumentLibrary } from '@/components/documents/DocumentLibrary'
import { FileUpload } from '@/components/documents/FileUpload'
import { AnonymousReportForm } from '@/components/reports/AnonymousReportForm'
import { AdminReportsDashboard } from '@/components/reports/AdminReportsDashboard'
import { ClientQuestionsHistory } from '@/components/legal/ClientQuestionsHistory'
import { ClientConsultationsHistory } from '@/components/consultations/ClientConsultationsHistory'
import { UserDocuments } from '@/components/documents/UserDocuments'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, LogOut, User, FileQuestion, Gavel, Calendar, FileText, Upload, Shield, AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const { user, profile, loading, signOut, isClient, isLawyer, isParalegal } = useAuth()
  const [searchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('profile')
  const navigate = useNavigate()

  useEffect(() => {
    const tab = searchParams.get('tab')
    if (tab) {
      setActiveTab(tab)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">Please log in to access your dashboard.</p>
            <Button onClick={() => window.location.href = '/auth'}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-soft border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">H</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Haki Kenya</h1>
                <p className="text-sm text-muted-foreground">
                  Welcome, {profile?.full_name}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center space-x-2">
                <span>← Back to Home</span>
              </Button>
              <Button variant="ghost" onClick={signOut} className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            
            {isClient && (
              <>
                <TabsTrigger value="questions" className="flex items-center space-x-2">
                  <FileQuestion className="h-4 w-4" />
                  <span>Questions</span>
                </TabsTrigger>
                <TabsTrigger value="consultations" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Consultations</span>
                </TabsTrigger>
                <TabsTrigger value="documents" className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Documents</span>
                </TabsTrigger>
                <TabsTrigger value="reports" className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4" />
                  <span>Report Issue</span>
                </TabsTrigger>
              </>
            )}
            
            {(isLawyer || isParalegal) && (
              <>
                <TabsTrigger value="lawyer-dashboard" className="flex items-center space-x-2">
                  <Gavel className="h-4 w-4" />
                  <span>Legal Cases</span>
                </TabsTrigger>
                <TabsTrigger value="calendar" className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>Calendar</span>
                </TabsTrigger>
                <TabsTrigger value="admin-reports" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>Reports</span>
                </TabsTrigger>
              </>
            )}
          </TabsList>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>

          {isClient && (
            <>
              <TabsContent value="questions">
                <div className="space-y-8">
                  <QuestionForm />
                  <ClientQuestionsHistory />
                </div>
              </TabsContent>

              <TabsContent value="consultations">
                <div className="space-y-8">
                  <ConsultationBookingForm />
                  <ClientConsultationsHistory />
                </div>
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-8">
                  <Tabs defaultValue="library" className="w-full">
                    <TabsList>
                      <TabsTrigger value="library">Document Library</TabsTrigger>
                      <TabsTrigger value="upload">Upload Document</TabsTrigger>
                      <TabsTrigger value="my-documents">My Documents</TabsTrigger>
                    </TabsList>
                    <TabsContent value="library">
                      <DocumentLibrary />
                    </TabsContent>
                    <TabsContent value="upload">
                      <FileUpload />
                    </TabsContent>
                    <TabsContent value="my-documents">
                      <UserDocuments />
                    </TabsContent>
                  </Tabs>
                </div>
              </TabsContent>

              <TabsContent value="reports">
                <AnonymousReportForm />
              </TabsContent>
            </>
          )}

          {(isLawyer || isParalegal) && (
            <>
              <TabsContent value="lawyer-dashboard">
                <LawyerDashboard />
              </TabsContent>

              <TabsContent value="calendar">
                <LawyerCalendar />
              </TabsContent>

              <TabsContent value="admin-reports">
                <AdminReportsDashboard />
              </TabsContent>
            </>
          )}
        </Tabs>
      </main>
    </div>
  )
}

export default Dashboard