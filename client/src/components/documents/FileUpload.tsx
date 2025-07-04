import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import { apiClient, type Profile, type LegalQuestion, type Consultation, type DocumentTemplate, type UserDocument, type AnonymousReport, type ConsultationReview } from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/use-toast'
import { Loader2, Upload, File, X } from 'lucide-react'

interface FileUploadProps {
  onUploadComplete?: () => void
}

export const FileUpload = ({ onUploadComplete }: FileUploadProps) => {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(true)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      setSelectedFile(file)
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '')) // Remove extension
      }
    }
  }, [title])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/plain': ['.txt'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  })

  const uploadFile = async () => {
    if (!selectedFile || !user || !title.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please select a file and provide a title.',
        variant: 'destructive',
      })
      return
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Generate unique file path
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

      // Upload file to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('user-documents')
        .upload(fileName, selectedFile, {
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100)
          }
        })

      if (uploadError) throw uploadError

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('user_documents')
        .insert({
          user_id: user.id,
          title: title.trim(),
          description: description.trim() || null,
          file_path: uploadData.path,
          file_size: selectedFile.size,
          file_type: selectedFile.type || fileExt,
          is_private: isPrivate
        })

      if (dbError) throw dbError

      toast({
        title: 'File uploaded successfully',
        description: `${selectedFile.name} has been uploaded.`,
      })

      // Reset form
      setSelectedFile(null)
      setTitle('')
      setDescription('')
      setIsPrivate(true)
      setUploadProgress(0)

      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (error: any) {
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      })
    } finally {
      setUploading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-6 w-6" />
          <span>Upload Document</span>
        </CardTitle>
        <CardDescription>
          Upload legal documents to your personal library
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Drop Zone */}
        {!selectedFile && (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/25 hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-lg">Drop the file here...</p>
            ) : (
              <div>
                <p className="text-lg mb-2">Drag & drop a file here, or click to select</p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, DOC, DOCX, XLS, XLSX, TXT, and images (max 10MB)
                </p>
              </div>
            )}
          </div>
        )}

        {/* Selected File */}
        {selectedFile && (
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <File className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(selectedFile.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={removeFile}
                disabled={uploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {uploading && (
              <div className="mt-4">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-muted-foreground mt-2">
                  Uploading... {Math.round(uploadProgress)}%
                </p>
              </div>
            )}
          </Card>
        )}

        {/* File Details Form */}
        {selectedFile && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Document Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter document title"
                disabled={uploading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of the document"
                disabled={uploading}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="private"
                checked={isPrivate}
                onCheckedChange={setIsPrivate}
                disabled={uploading}
              />
              <Label htmlFor="private">Keep document private</Label>
            </div>

            <Button
              onClick={uploadFile}
              disabled={uploading || !title.trim()}
              className="w-full"
            >
              {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Upload Document
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}