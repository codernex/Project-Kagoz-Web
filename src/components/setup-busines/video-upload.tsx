"use client"

import * as React from "react"
import { X, Upload, Play, Link } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface UploadedVideo {
  id: string
  file?: File
  preview?: string
  name: string
  size?: string
  url?: string
  type: 'file' | 'url'
}

interface VideoUploaderProps {
  label?: string
  description?: string
  required?: boolean
  max?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
  recommendedSize?: string
  value?: UploadedVideo[]
  onChange?: (videos: UploadedVideo[]) => void
  onError?: (error: string) => void
  className?: string
  allowUrl?: boolean
  urlPlaceholder?: string
}

export default function VideoUploader({
  label = "Upload Videos",
  description,
  required = false,
  max = 1,
  maxSizeMB = 100,
  acceptedTypes = ["video/mp4", "video/webm", "video/ogg"],
  recommendedSize,
  value = [],
  onChange,
  onError,
  className,
  allowUrl = true,
  urlPlaceholder = "Paste YouTube link"
}: VideoUploaderProps) {
  const [videos, setVideos] = React.useState<UploadedVideo[]>(value)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [urlInput, setUrlInput] = React.useState("")
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
    setVideos(value)
  }, [value])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const createVideoPreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please upload ${acceptedTypes.join(', ')}`
    }

    return null
  }

  const validateUrl = (url: string): string | null => {
    if (!url.trim()) return "URL is required"
    
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/
    if (!youtubeRegex.test(url)) {
      return "Please enter a valid YouTube URL"
    }

    return null
  }

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return

    const fileArray = Array.from(fileList)
    const errors: string[] = []
    const validFiles: File[] = []

    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        errors.push(`${file.name}: ${error}`)
      } else {
        validFiles.push(file)
      }
    }

    if (errors.length > 0) {
      onError?.(errors.join('\n'))
      return
    }

    // Check if adding these files would exceed the max limit
    if (videos.length + validFiles.length > max) {
      onError?.(`Maximum ${max} video${max > 1 ? 's' : ''} allowed`)
      return
    }

    const uploadedVideos: UploadedVideo[] = []
    
    for (const file of validFiles) {
      const preview = await createVideoPreview(file)
      const uploadedVideo: UploadedVideo = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview,
        name: file.name,
        size: formatFileSize(file.size),
        type: 'file'
      }
      uploadedVideos.push(uploadedVideo)
    }

    const updatedVideos = max === 1 ? uploadedVideos : [...videos, ...uploadedVideos]
    setVideos(updatedVideos)
    onChange?.(updatedVideos)
  }

  const handleUrlSubmit = () => {
    const error = validateUrl(urlInput)
    if (error) {
      onError?.(error)
      return
    }

    if (videos.length >= max) {
      onError?.(`Maximum ${max} video${max > 1 ? 's' : ''} allowed`)
      return
    }

    const uploadedVideo: UploadedVideo = {
      id: Math.random().toString(36).substr(2, 9),
      url: urlInput,
      name: "YouTube Video",
      type: 'url'
    }

    const updatedVideos = max === 1 ? [uploadedVideo] : [...videos, uploadedVideo]
    setVideos(updatedVideos)
    onChange?.(updatedVideos)
    setUrlInput("")
  }

  const removeVideo = (id: string) => {
    const newVideos = videos.filter(video => video.id !== id)
    setVideos(newVideos)
    onChange?.(newVideos)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    handleFiles(e.dataTransfer.files)
  }

  const getAcceptedTypesText = () => {
    const types = acceptedTypes.map(type => {
      if (type === 'video/mp4') return 'MP4'
      if (type === 'video/webm') return 'WebM'
      if (type === 'video/ogg') return 'OGG'
      return type.split('/')[1]?.toUpperCase() || type
    })
    return types.join(', ')
  }

  const getYouTubeThumbnail = (url: string) => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
    return videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : null
  }

  // Single video layout (max = 1)
  if (max === 1) {
    return (
      <div className={cn("space-y-4", className)}>
        {label && (
          <Label className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}

        {videos.length === 0 ? (
          <div className="space-y-4">
            {/* URL Input */}
            {allowUrl && (
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder={urlPlaceholder}
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button 
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 bg-[#6F00FF] hover:bg-purple-700 text-white"
                >
                  Add
                </Button>
              </div>
            )}

            {/* Upload area */}
            <div
              className={cn(
                "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
                isDragOver 
                  ? "border-purple-400 bg-purple-50" 
                  : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drop your video here or click to browse</p>
              <p className="text-xs text-gray-500 mt-1">
                {getAcceptedTypesText()} up to {maxSizeMB}MB
              </p>
              {recommendedSize && (
                <p className="text-xs text-gray-500">Recommended size: {recommendedSize}</p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept={acceptedTypes.join(',')}
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
          </div>
        ) : (
          // Video preview (single video)
          <div className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 flex-shrink-0">
                {videos[0].type === 'file' && videos[0].preview ? (
                  <video
                    src={videos[0].preview}
                    className="w-full h-full object-cover rounded"
                  />
                ) : videos[0].type === 'url' && videos[0].url ? (
                  <img
                    src={getYouTubeThumbnail(videos[0].url) || '/placeholder-video.jpg'}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                    <Play className="h-6 w-6 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center">
                    <Play className="h-4 w-4 text-white" />
                  </div>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {videos[0].name}
                </p>
                {videos[0].size && (
                  <p className="text-xs text-gray-500">{videos[0].size}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => removeVideo(videos[0].id)}
                className="p-1 text-red-500 hover:text-red-700 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Multiple videos layout (max > 1)
  return (
    <div className={cn("space-y-4", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}

      {/* Video Grid */}
      {videos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-4">
          {videos.map((video) => (
            <div key={video.id} className="relative group">
              <div className="relative w-full h-24">
                {video.type === 'file' && video.preview ? (
                  <video
                    src={video.preview}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : video.type === 'url' && video.url ? (
                  <img
                    src={getYouTubeThumbnail(video.url) || '/placeholder-video.jpg'}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                    <Play className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-6 h-6 bg-black/50 rounded-full flex items-center justify-center">
                    <Play className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeVideo(video.id)}
                className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload area for multiple videos */}
      {videos.length < max && (
        <div className="space-y-4">
          {/* URL Input */}
          {allowUrl && (
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <Link className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={urlPlaceholder}
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button 
                onClick={handleUrlSubmit}
                className="px-4 py-2 bg-[#6F00FF] hover:bg-purple-700 text-white"
              >
                Add
              </Button>
            </div>
          )}

          {/* File Upload */}
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
              isDragOver 
                ? "border-purple-400 bg-purple-50" 
                : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Drop your video here or click to browse</p>
            <p className="text-xs text-gray-500 mt-1">
              {getAcceptedTypesText()} up to {maxSizeMB}MB
            </p>
            {videos.length > 0 && (
              <p className="text-xs text-gray-500">
                {videos.length} of {max} videos uploaded
              </p>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept={acceptedTypes.join(',')}
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
