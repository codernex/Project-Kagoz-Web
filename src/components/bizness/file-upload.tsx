"use client"

import * as React from "react"
import { X, Upload, Camera } from "lucide-react"
import Image from "next/image"
import { Label } from "@/components/ui/label"
import { cn, appendApi } from "@/lib/utils"

interface UploadedFile {
  id: string
  file: File | null
  preview: string
  name: string
  size: string
}

interface FileUploaderProps {
  label?: string
  description?: string
  required?: boolean
  max?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
  recommendedSize?: string
  value?: UploadedFile[]
  onChange?: (files: UploadedFile[]) => void
  onError?: (error: string) => void
  className?: string
}

export default function FileUploader({
  label = "Upload Files",
  description,
  required = false,
  max = 1,
  maxSizeMB = 2,
  acceptedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"],
  recommendedSize,
  value = [],
  onChange,
  onError,
  className
}: FileUploaderProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>(value)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const [imageErrors, setImageErrors] = React.useState<Set<string>>(new Set())
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [sizeWarning, setSizeWarning] = React.useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const resolvePreviewSrc = (src?: string): string => {
    console.log("🔍 resolvePreviewSrc called with:", { src, type: typeof src, length: src?.length })
    
    if (!src) return ""
    // For data URLs or blob URLs, use as-is
    if (src.startsWith("data:") || src.startsWith("blob:")) return src
    // For HTTP URLs, use as-is
    if (src.startsWith("http")) return src
    
    // Direct fallback to localhost:9000/uploads/ for API images
    const directUrl = `http://localhost:9000/api/v1/uploads/${src}`
    console.log("🔍 Direct URL construction:", { src, directUrl })
    return directUrl
  }


  // Handle image load errors
  const handleImageError = (fileId: string | undefined) => {
    if (!fileId) return;
    console.log("❌ Image load error for file:", fileId);
    setImageErrors(prev => new Set(prev).add(fileId));
  }

  // Handle successful image loads
  const handleImageLoad = (fileId: string | undefined) => {
    if (!fileId) return;
    console.log("✅ Image loaded successfully for file:", fileId);
    setImageErrors(prev => {
      const newSet = new Set(prev);
      newSet.delete(fileId);
      return newSet;
    });
  }

  React.useEffect(() => {
    console.log("🔍 FileUploader received value:", value)
    setFiles(value)
  }, [value])

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const createFilePreview = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target?.result as string)
      reader.readAsDataURL(file)
    })
  }

  const validateFile = (file: File): string | null => {
    // Check file size
    const maxSizeBytes = maxSizeMB * 1024 * 1024
    console.log(`Validating file: ${file.name}, size: ${(file.size / (1024 * 1024)).toFixed(2)}MB, max allowed: ${maxSizeMB}MB`)
    
    if (file.size > maxSizeBytes) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2)
      const errorMsg = `File "${file.name}" is too large (${fileSizeMB}MB). Maximum allowed size is ${maxSizeMB}MB`
      console.log('File size validation failed:', errorMsg)
      return errorMsg
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      const readableTypes = acceptedTypes
        .map(t => (t.startsWith('image/') ? t.split('/')[1]?.toUpperCase() || t : t))
        .join(', ')
      const errorMsg = `File "${file.name}" has unsupported format. Allowed formats: ${readableTypes}`
      console.log('File type validation failed:', errorMsg)
      return errorMsg
    }

    console.log('File validation passed:', file.name)
    return null
  }

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList) return

    const fileArray = Array.from(fileList)
    const validFiles: File[] = []

    console.log('Processing files:', fileArray.length, 'files, maxSizeMB:', maxSizeMB)

    // Clear any previous warnings
    setSizeWarning(null)

    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        // For size errors, show immediate error and reject the file
        if (error.includes('too large')) {
          onError?.(error)
          console.log('File size validation failed:', error)
          continue // Skip this file
        } else {
          // For other errors (like file type), show error and reject
          onError?.(error)
          console.log('File validation failed:', error)
          continue // Skip this file
        }
      } else {
        validFiles.push(file)
      }
    }

    // No need for size warnings since we reject large files immediately

    // If no valid files after filtering, silently return without error
    if (validFiles.length === 0) {
      console.log('No valid files to upload after validation')
      return
    }

    // Check if adding these files would exceed the max limit
    if (files.length + validFiles.length > max) {
      const errorMessage = `You can only upload ${max} file${max > 1 ? 's' : ''} at a time. Currently you have ${files.length} file${files.length > 1 ? 's' : ''} uploaded.`
      console.log('File limit exceeded (silently rejected):', errorMessage)
      return
    }

    const uploadedFiles: UploadedFile[] = []
    
    try {
      setIsProcessing(true)
      for (const file of validFiles) {
        const preview = await createFilePreview(file)
        const uploadedFile: UploadedFile = {
          id: Math.random().toString(36).substr(2, 9),
          file,
          preview,
          name: file.name,
          size: formatFileSize(file.size)
        }
        uploadedFiles.push(uploadedFile)
      }

      const updatedFiles = max === 1 ? uploadedFiles : [...files, ...uploadedFiles]
      setFiles(updatedFiles)
      onChange?.(updatedFiles)
    } catch (error) {
      console.error('File processing error:', error)
      const errorMessage = 'Failed to process files. Please check your files and try again.'
      console.log('File processing failed (silently rejected):', errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = (id: string) => {
    const newFiles = files.filter(file => file.id !== id)
    setFiles(newFiles)
    onChange?.(newFiles)
  }

  const clearWarning = () => {
    setSizeWarning(null)
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
      if (type === 'image/png') return 'PNG'
      if (type === 'image/jpeg' || type === 'image/jpg') return 'JPG'
      return type.split('/')[1]?.toUpperCase() || type
    })
    return types.join(', ')
  }

  // Single file layout (max = 1)
  if (max === 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {label && (
          <Label className="text-sm font-medium text-gray-700">
            {label} {required && <span className="text-red-500">*</span>}
          </Label>
        )}
        {description && (
          <p className="text-xs text-gray-500">{description}</p>
        )}
        
        {/* Size Warning Display */}
        {sizeWarning && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-2">
            <div className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0">⚠️</div>
            <div className="flex-1">
              <p className="text-sm text-yellow-700 font-medium">File Size Warning</p>
              <p className="text-xs text-yellow-600 mt-1 whitespace-pre-line">{sizeWarning}</p>
            </div>
            <button
              onClick={clearWarning}
              className="text-yellow-400 hover:text-yellow-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {files.length === 0 ? (
          // Upload area
          <div
            className={cn(
              "border-2 border-dashed rounded-[8px] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
              isDragOver 
                ? "border-purple-400 bg-purple-50" 
                : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
            )}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isProcessing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
            ) : (
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-600">
              {isProcessing ? 'Processing files...' : 'Drop your image here or click to browse'}
            </p>
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
        ) : (
          // File preview (single file)
          <div className="border border-gray-200 rounded-[8px] p-4 bg-white">
            <div className="flex items-center gap-3">
              {files[0] && imageErrors.has(files[0].id) ? (
                <div className="w-12 h-12 sm:h-[80px] sm:w-[80px] bg-gray-200 rounded flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              ) : files[0] ? (
                <Image
                  width={80}
                  height={80}
                  src={resolvePreviewSrc(files[0].preview)}
                  alt={files[0].name || 'Uploaded file'}
                  className="w-12 h-12 sm:h-[80px] sm:w-[80px] object-cover rounded"
                  onError={() => handleImageError(files[0]?.id)}
                  onLoad={() => handleImageLoad(files[0]?.id)}
                  unoptimized={true}
                />
              ) : null}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {files[0]?.name}
                </p>
                <p className="text-xs text-gray-500">{files[0]?.size}</p>
              </div>
              <button
                type="button"
                onClick={() => files[0]?.id && removeFile(files[0].id)}
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

  // Multiple files layout (max > 1)
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      
      {/* Size Warning Display */}
      {sizeWarning && (
        <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-md mb-2">
          <div className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0">⚠️</div>
          <div className="flex-1">
            <p className="text-sm text-yellow-700 font-medium">File Size Warning</p>
            <p className="text-xs text-yellow-600 mt-1 whitespace-pre-line">{sizeWarning}</p>
          </div>
          <button
            onClick={clearWarning}
            className="text-yellow-400 hover:text-yellow-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Initial upload area - only shown when no files are uploaded */}
      {files.length === 0 && (
        <div
          className={cn(
            "border-2 border-dashed rounded-[8px] p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-colors",
            isDragOver 
              ? "border-purple-400 bg-purple-50" 
              : "border-gray-300 hover:border-purple-400 hover:bg-gray-50"
          )}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mb-2"></div>
          ) : (
            <Camera className="h-8 w-8 text-gray-400 mb-2" />
          )}
          <p className="text-sm text-gray-600">
            {isProcessing ? 'Processing files...' : 'Drop your image here or click to browse'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {getAcceptedTypesText()} up to {maxSizeMB}MB
          </p>
        </div>
      )}

      {/* Gallery Row with Plus Icon - shown when files exist */}
      {files.length > 0 && (
        <div className="flex gap-3 overflow-x-auto py-3">
          {files.map((file) => (
            <div key={file.id} className="relative flex-shrink-0">
              {imageErrors.has(file.id) ? (
                <div className="w-20 h-20 sm:h-[80px] sm:w-[150px] bg-gray-200 rounded-[8px] flex items-center justify-center">
                  <Camera className="w-6 h-6 text-gray-400" />
                </div>
              ) : (
                <Image
                  width={150}
                  height={80}
                  src={resolvePreviewSrc(file.preview)}
                  alt={file.name || 'Uploaded file'}
                  className="w-20 h-20 sm:h-[80px] sm:w-[150px] object-cover rounded-[8px]"
                  onError={() => handleImageError(file.id)}
                  onLoad={() => handleImageLoad(file.id)}
                  unoptimized={true}
                />
              )}
              <button
                type="button"
                onClick={() => removeFile(file.id)}
                className="absolute -top-1 -right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          
          {/* Plus Icon - inline with thumbnails for adding more images */}
          {files.length < max && (
            <div
              className="flex-shrink-0 w-20 h-20 sm:h-[80px] sm:w-[150px] border-2 border-dashed border-gray-300 rounded-[8px] flex items-center justify-center cursor-pointer hover:border-purple-400 hover:bg-gray-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <span className="text-2xl font-bold text-gray-400">+</span>
            </div>
          )}
        </div>
      )}

      {/* Hidden file input - shared between both upload areas */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(',')}
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  )
}
