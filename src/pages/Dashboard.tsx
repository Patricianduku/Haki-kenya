import { useAuth } from '@/hooks/useAuth'
import { UserProfile } from '@/components/auth/UserProfile'
import { QuestionForm } from '@/components/legal/QuestionForm'
import { LawyerDashboard } from '@/components/legal/LawyerDashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, LogOut, User, FileQuestion, Gavel } from 'lucide-react'

const Dashboard = () => {
  const { user, profile, loading, signOut, isClient, isLawyer, isParalegal } = useAuth()

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
            
            <Button variant="ghost" onClick={signOut} className="flex items-center space-x-2">
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </TabsTrigger>
            {isClient && (
              <TabsTrigger value="questions" className="flex items-center space-x-2">
                <FileQuestion className="h-4 w-4" />
                <span>My Questions</span>
              </TabsTrigger>
            )}
            {(isLawyer || isParalegal) && (
              <TabsTrigger value="lawyer-dashboard" className="flex items-center space-x-2">
                <Gavel className="h-4 w-4" />
                <span>Legal Cases</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="profile">
            <UserProfile />
          </TabsContent>

          {isClient && (
            <TabsContent value="questions">
              <div className="space-y-8">
                <QuestionForm />
                
                {/* Client's Questions History could go here */}
                <Card>
                  <CardHeader>
                    <CardTitle>Your Questions</CardTitle>
                    <CardDescription>
                      Track the status of your submitted legal questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Your question history will appear here once you submit questions.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}

          {(isLawyer || isParalegal) && (
            <TabsContent value="lawyer-dashboard">
              <LawyerDashboard />
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  )
}

export default Dashboard