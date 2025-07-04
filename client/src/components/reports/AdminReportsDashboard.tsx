import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { apiClient, type Profile, type LegalQuestion, type Consultation, type DocumentTemplate, type UserDocument, type AnonymousReport, type ConsultationReview } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Shield, Filter, Search, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'

export const AdminReportsDashboard = () => {
  const { user, profile } = useAuth()
  const [loading, setLoading] = useState(true)
  const [reports, setReports] = useState<AnonymousReport[]>([])
  const [filteredReports, setFilteredReports] = useState<AnonymousReport[]>([])
  const [lawyers, setLawyers] = useState<Profile[]>([])
  const [selectedReport, setSelectedReport] = useState<AnonymousReport | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [adminNotes, setAdminNotes] = useState('')
  const [updating, setUpdating] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (user && (profile?.role === 'lawyer' || profile?.role === 'paralegal')) {
      fetchReports()
      fetchLawyers()
    }
  }, [user, profile])

  useEffect(() => {
    filterReports()
  }, [reports, searchTerm, statusFilter, priorityFilter, categoryFilter])

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from('anonymous_reports')
        .select(`
          *,
          assigned_lawyer:profiles!anonymous_reports_assigned_to_fkey(full_name)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReports(data || [])
    } catch (error: any) {
      toast({
        title: 'Error loading reports',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchLawyers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, specialization')
        .in('role', ['lawyer', 'paralegal'])
        .order('full_name')

      if (error) throw error
      setLawyers(data || [])
    } catch (error: any) {
      console.error('Error loading lawyers:', error)
    }
  }

  const filterReports = () => {
    let filtered = reports

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter)
    }

    // Filter by priority
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(report => report.priority === priorityFilter)
    }

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(report => report.category === categoryFilter)
    }

    setFilteredReports(filtered)
  }

  const updateReport = async (reportId: string, updates: Partial<AnonymousReport>) => {
    setUpdating(true)
    try {
      const { error } = await supabase
        .from('anonymous_reports')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId)

      if (error) throw error

      await fetchReports()
      setSelectedReport(null)
      setAdminNotes('')
      
      toast({
        title: 'Report updated',
        description: 'The report has been updated successfully.',
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'under_review': return <AlertTriangle className="h-4 w-4" />
      case 'resolved': return <CheckCircle className="h-4 w-4" />
      case 'closed': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'under_review': return 'bg-blue-100 text-blue-800'
      case 'resolved': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'urgent': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const categories = [...new Set(reports.map(r => r.category))]

  if (loading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (profile?.role !== 'lawyer' && profile?.role !== 'paralegal') {
    return (
      <Card className="w-full">
        <CardContent className="text-center py-8">
          <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Access denied. This dashboard is only available to lawyers and paralegals.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Shield className="h-6 w-6" />
            <span>Anonymous Reports Dashboard</span>
          </CardTitle>
          <CardDescription>
            Review and manage anonymous legal reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {reports.filter(r => r.status === 'pending').length}
                </div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {reports.filter(r => r.status === 'under_review').length}
                </div>
                <div className="text-sm text-muted-foreground">Under Review</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'resolved').length}
                </div>
                <div className="text-sm text-muted-foreground">Resolved</div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {reports.filter(r => r.priority === 'urgent').length}
                </div>
                <div className="text-sm text-muted-foreground">Urgent</div>
              </div>
            </Card>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="under_review">Under Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Priorities" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setPriorityFilter('all')
                setCategoryFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Reports Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium max-w-xs truncate">
                    {report.title}
                  </TableCell>
                  <TableCell>{report.category}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(report.priority)}>
                      {report.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getStatusColor(report.status)} flex items-center space-x-1 w-fit`}>
                      {getStatusIcon(report.status)}
                      <span className="capitalize">{report.status.replace('_', ' ')}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(report as any).assigned_lawyer?.full_name || 'Unassigned'}
                  </TableCell>
                  <TableCell>
                    {format(new Date(report.created_at), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedReport(report)
                            setAdminNotes(report.admin_notes || '')
                          }}
                        >
                          Manage
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Manage Report</DialogTitle>
                          <DialogDescription>
                            Review and update the anonymous report
                          </DialogDescription>
                        </DialogHeader>
                        
                        {selectedReport && (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <strong>Category:</strong> {selectedReport.category}
                              </div>
                              <div>
                                <strong>Priority:</strong> 
                                <Badge className={`ml-2 ${getPriorityColor(selectedReport.priority)}`}>
                                  {selectedReport.priority}
                                </Badge>
                              </div>
                              <div>
                                <strong>Status:</strong>
                                <Badge className={`ml-2 ${getStatusColor(selectedReport.status)}`}>
                                  {selectedReport.status.replace('_', ' ')}
                                </Badge>
                              </div>
                              <div>
                                <strong>Submitted:</strong> {format(new Date(selectedReport.created_at), 'PPP')}
                              </div>
                              {selectedReport.location && (
                                <div className="col-span-2">
                                  <strong>Location:</strong> {selectedReport.location}
                                </div>
                              )}
                              {selectedReport.incident_date && (
                                <div className="col-span-2">
                                  <strong>Incident Date:</strong> {format(new Date(selectedReport.incident_date), 'PPP')}
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <strong>Title:</strong>
                              <p className="mt-1 text-sm">{selectedReport.title}</p>
                            </div>
                            
                            <div>
                              <strong>Description:</strong>
                              <p className="mt-1 text-sm whitespace-pre-wrap">
                                {selectedReport.description}
                              </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                  value={selectedReport.status}
                                  onValueChange={(value) => 
                                    setSelectedReport({...selectedReport, status: value as any})
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="pending">Pending</SelectItem>
                                    <SelectItem value="under_review">Under Review</SelectItem>
                                    <SelectItem value="resolved">Resolved</SelectItem>
                                    <SelectItem value="closed">Closed</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Priority</label>
                                <Select
                                  value={selectedReport.priority}
                                  onValueChange={(value) => 
                                    setSelectedReport({...selectedReport, priority: value as any})
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="low">Low</SelectItem>
                                    <SelectItem value="medium">Medium</SelectItem>
                                    <SelectItem value="high">High</SelectItem>
                                    <SelectItem value="urgent">Urgent</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div>
                                <label className="text-sm font-medium">Assign To</label>
                                <Select
                                  value={selectedReport.assigned_to || ''}
                                  onValueChange={(value) => 
                                    setSelectedReport({...selectedReport, assigned_to: value || undefined})
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select lawyer" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="">Unassigned</SelectItem>
                                    {lawyers.map((lawyer) => (
                                      <SelectItem key={lawyer.id} value={lawyer.id}>
                                        {lawyer.full_name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div>
                              <label className="text-sm font-medium">Admin Notes</label>
                              <Textarea
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                placeholder="Add internal notes about this report..."
                                className="mt-1"
                              />
                            </div>

                            <div className="flex space-x-3">
                              <Button
                                onClick={() => updateReport(selectedReport.id, {
                                  status: selectedReport.status,
                                  priority: selectedReport.priority,
                                  assigned_to: selectedReport.assigned_to,
                                  admin_notes: adminNotes
                                })}
                                disabled={updating}
                              >
                                {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Update Report
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredReports.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No reports found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}