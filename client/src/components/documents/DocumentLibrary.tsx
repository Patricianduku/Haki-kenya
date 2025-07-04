import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { apiClient, type Profile, type LegalQuestion, type Consultation, type DocumentTemplate, type UserDocument, type AnonymousReport, type ConsultationReview } from '@/lib/api'
import { useToast } from '@/hooks/use-toast'
import { Loader2, FileText, Download, Search, Filter } from 'lucide-react'

export const DocumentLibrary = () => {
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<DocumentTemplate[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<DocumentTemplate[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState<string[]>([])
  const { toast } = useToast()

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    filterDocuments()
  }, [documents, searchTerm, selectedCategory])

  const fetchDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('document_templates')
        .select('*')
        .eq('is_active', true)
        .order('download_count', { ascending: false })

      if (error) throw error
      
      setDocuments(data || [])
      
      // Extract unique categories
      const uniqueCategories = [...new Set(data?.map(doc => doc.category) || [])]
      setCategories(uniqueCategories)
    } catch (error: any) {
      toast({
        title: 'Error loading documents',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const filterDocuments = () => {
    let filtered = documents

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory)
    }

    setFilteredDocuments(filtered)
  }

  const handleDownload = async (document: DocumentTemplate) => {
    try {
      // Increment download count
      await supabase
        .from('document_templates')
        .update({ download_count: document.download_count + 1 })
        .eq('id', document.id)

      // Get signed URL for download
      const { data, error } = await supabase.storage
        .from('documents')
        .createSignedUrl(document.file_path, 60)

      if (error) throw error

      // Trigger download
      const link = document.createElement('a')
      link.href = data.signedUrl
      link.download = document.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Update local state
      setDocuments(prev => prev.map(doc => 
        doc.id === document.id 
          ? { ...doc, download_count: doc.download_count + 1 }
          : doc
      ))

      toast({
        title: 'Download started',
        description: `Downloading ${document.title}`,
      })
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  const getFileTypeColor = (fileType: string) => {
    switch (fileType?.toLowerCase()) {
      case 'pdf': return 'bg-red-100 text-red-800'
      case 'docx': case 'doc': return 'bg-blue-100 text-blue-800'
      case 'xlsx': case 'xls': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'Unknown size'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
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
            <FileText className="h-6 w-6" />
            <span>Legal Document Library</span>
          </CardTitle>
          <CardDescription>
            Browse and download legal document templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
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
          </div>

          {/* Documents Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="text-xs">
                      {document.category}
                    </Badge>
                    <Badge className={`text-xs ${getFileTypeColor(document.file_type)}`}>
                      {document.file_type?.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight">
                    {document.title}
                  </CardTitle>
                  {document.description && (
                    <CardDescription className="text-sm">
                      {document.description}
                    </CardDescription>
                  )}
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <span>{formatFileSize(document.file_size)}</span>
                    <span>{document.download_count} downloads</span>
                  </div>
                  
                  <Button 
                    onClick={() => handleDownload(document)}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDocuments.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No documents found matching your criteria.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}