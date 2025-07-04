import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { supabase, UserDocument } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, FileText, Download, Trash2, Eye, EyeOff } from 'lucide-react'
import { format } from 'date-fns'

export const UserDocuments = () => {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [documents, setDocuments] = useState<UserDocument[]>([])
  const [deleting, setDeleting] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchDocuments()
    }
  }, [user])

  const fetchDocuments = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('user_documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setDocuments(data || [])
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

  const handleDownload = async (document: UserDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-documents')
        .createSignedUrl(document.file_path, 60)

      if (error) throw error

      // Trigger download
      const link = document.createElement('a')
      link.href = data.signedUrl
      link.download = document.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

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

  const handleDelete = async (document: UserDocument) => {
    setDeleting(document.id)
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-documents')
        .remove([document.file_path])

      if (storageError) throw storageError

      // Delete from database
      const { error: dbError } = await supabase
        .from('user_documents')
        .delete()
        .eq('id', document.id)

      if (dbError) throw dbError

      await fetchDocuments()
      toast({
        title: 'Document deleted',
        description: `${document.title} has been deleted successfully.`,
      })
    } catch (error: any) {
      toast({
        title: 'Delete failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setDeleting(null)
    }
  }

  const togglePrivacy = async (document: UserDocument) => {
    try {
      const { error } = await supabase
        .from('user_documents')
        .update({ 
          is_private: !document.is_private,
          updated_at: new Date().toISOString()
        })
        .eq('id', document.id)

      if (error) throw error

      await fetchDocuments()
      toast({
        title: 'Privacy updated',
        description: `Document is now ${!document.is_private ? 'private' : 'public'}.`,
      })
    } catch (error: any) {
      toast({
        title: 'Update failed',
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-6 w-6" />
          <span>My Documents</span>
        </CardTitle>
        <CardDescription>
          Manage your uploaded documents
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            You haven't uploaded any documents yet. Use the Upload tab to add your first document.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((document) => (
              <Card key={document.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge className={`text-xs ${getFileTypeColor(document.file_type)}`}>
                        {document.file_type?.toUpperCase()}
                      </Badge>
                      <Badge variant={document.is_private ? "default" : "secondary"} className="text-xs">
                        {document.is_private ? (
                          <>
                            <EyeOff className="w-3 h-3 mr-1" />
                            Private
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3 mr-1" />
                            Public
                          </>
                        )}
                      </Badge>
                    </div>
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
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{formatFileSize(document.file_size)}</span>
                      <span>{format(new Date(document.created_at), 'MMM d, yyyy')}</span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        onClick={() => handleDownload(document)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      
                      <Button
                        onClick={() => togglePrivacy(document)}
                        variant="ghost"
                        size="sm"
                      >
                        {document.is_private ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deleting === document.id}
                          >
                            {deleting === document.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Document</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{document.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(document)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}