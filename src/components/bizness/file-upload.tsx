"use client"

import * as React from "react"
import { X, Upload, Camera } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface UploadedFile {
  id: string
  file: File
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
  maxSizeMB = 10,
  acceptedTypes = ["image/png", "image/jpeg", "image/jpg"],
  recommendedSize,
  value = [],
  onChange,
  onError,
  className
}: FileUploaderProps) {
  const [files, setFiles] = React.useState<UploadedFile[]>(value)
  const [isDragOver, setIsDragOver] = React.useState(false)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  React.useEffect(() => {
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
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `File size must be less than ${maxSizeMB}MB`
    }

    // Check file type
    if (!acceptedTypes.includes(file.type)) {
      return `File type not supported. Please upload ${acceptedTypes.join(', ')}`
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
    if (files.length + validFiles.length > max) {
      onError?.(`Maximum ${max} file${max > 1 ? 's' : ''} allowed`)
      return
    }

    const uploadedFiles: UploadedFile[] = []
    
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
  }

  const removeFile = (id: string) => {
    const newFiles = files.filter(file => file.id !== id)
    setFiles(newFiles)
    onChange?.(newFiles)
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
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Drop your image here or click to browse</p>
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
              <img
                src={files[0]?.preview}
                alt={files[0]?.name}
                className="w-12 h-12 sm:h-[80px] sm:w-[80px] object-cover rounded"
              />
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
          <Camera className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600">Drop your image here or click to browse</p>
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
              <img
                src={file.preview}
                alt={file.name}
                className="w-20 h-20 sm:h-[80px] sm:w-[150px] object-cover rounded-[8px]"
              />
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
