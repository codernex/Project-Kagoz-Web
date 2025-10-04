"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export interface ImageUploadFile {
  id: string
  file: File | null
  preview: string
  name: string
  size: string
  uploaded?: boolean
  error?: string
}

export interface ImageUploadProps {
  label?: string
  description?: string
  required?: boolean
  max?: number
  maxSizeMB?: number
  acceptedTypes?: string[]
  recommendedSize?: string
  value?: ImageUploadFile[]
  onChange?: (files: ImageUploadFile[]) => void
  onError?: (error: string) => void
  onUpload?: (file: File) => Promise<string | void>
  disableRemove?: boolean
}

export function ImageUpload({
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
  onUpload,
  disableRemove = false,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File): string | null => {
      if (!acceptedTypes.includes(file.type)) {
        return `File type not accepted. Please upload: ${acceptedTypes
          .map((type) => type.split("/")[1]?.toUpperCase() ?? type)
          .join(", ")}`
      }

      const fileSizeMB = file.size / (1024 * 1024)
      if (fileSizeMB > maxSizeMB) {
        return `File size exceeds ${maxSizeMB}MB limit`
      }

      return null
    },
    [acceptedTypes, maxSizeMB],
  )

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const currentCount = value.length
      const availableSlots = max - currentCount

      if (availableSlots <= 0) {
        onError?.(`Maximum ${max} ${max === 1 ? "file" : "files"} allowed`)
        return
      }

      const filesToProcess = Array.from(files).slice(0, availableSlots)
      const newFiles: ImageUploadFile[] = []

      for (const file of filesToProcess) {
        const error = validateFile(file)
        if (error) {
          onError?.(error)
          continue
        }

        const preview = URL.createObjectURL(file)
        const id = `${Date.now()}-${Math.random()}`
        const fileSizeMB = file.size / (1024 * 1024)

        newFiles.push({
          id,
          file,
          preview,
          name: file.name,
          size: `${fileSizeMB.toFixed(2)} MB`,
          uploaded: false,
        })
      }

      if (newFiles.length === 0) return

      const updatedFiles = [...value, ...newFiles]
      onChange?.(updatedFiles)

      if (onUpload) {
        setIsUploading(true)
        for (const newFile of newFiles) {
          try {
            await onUpload(newFile.file!)
            const fileIndex = updatedFiles.findIndex((f) => f.id === newFile.id)
            if (fileIndex !== -1) {
              updatedFiles[fileIndex]!.uploaded = true
              onChange?.([...updatedFiles])
            }
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Upload failed"
            onError?.(errorMessage)
            const fileIndex = updatedFiles.findIndex((f) => f.id === newFile.id)
            if (fileIndex !== -1) {
              updatedFiles[fileIndex]!.error = errorMessage
              onChange?.([...updatedFiles])
            }
          }
        }
        setIsUploading(false)
      }
    },
    [value, max, validateFile, onChange, onError, onUpload],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFiles(e.dataTransfer?.files ?? null)
    },
    [handleFiles],
  )

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target?.files ?? null)
      if (e.target) e.target.value = ""
    },
    [handleFiles],
  )

  const handleRemove = useCallback(
    (id: string) => {
      const fileToRemove = value.find((f) => f.id === id)
      if (fileToRemove?.file) {
        URL.revokeObjectURL(fileToRemove.preview)
      }
      onChange?.(value.filter((f) => f.id !== id))
    },
    [value, onChange],
  )

  const handleBrowseClick = () => fileInputRef.current?.click()
  const handleAddMore = () => fileInputRef.current?.click()

  const acceptString = acceptedTypes.join(",")
  const hasFiles = value.length > 0
  const canAddMore = value.length < max
  const isMultiple = max > 1

  return (
    <div className="w-full space-y-2">
      <div className="space-y-1">
        <h3 className="text-sm font-medium text-foreground !text-[#111827]">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </h3>
        {description && <p className="text-sm text-muted-foreground !text-[#111827]">{description}</p>}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptString}
        multiple={isMultiple}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {!hasFiles ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={cn(
            "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer",
            "min-h-[160px] px-6 py-8 sm:min-h-[180px]",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border bg-background hover:border-primary/50 hover:bg-accent/50",
          )}
        >
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-muted p-3">
              <Upload className="h-5 w-5 text-muted-foreground text-[#111827]" />
            </div>
            <div className="space-y-1">
              <p className="text-sm text-foreground">
                Drop your image here or <span className="text-primary font-medium">click to browse</span>
              </p>
              <p className="text-xs text-muted-foreground">
                {acceptedTypes.map((type) => type.split("/")[1]?.toUpperCase() ?? type).join(", ")} up to {maxSizeMB}MB
              </p>
              {recommendedSize && <p className="text-xs text-muted-foreground">Recommended size: {recommendedSize}</p>}
            </div>
          </div>
        </div>
      ) : isMultiple ? (
        <div className="flex flex-wrap gap-3 sm:gap-4">
          {value.map((file) => (
            <div
              key={file.id}
              className="relative group rounded-[8px] overflow-hidden border border-[#E4E4E4] bg-muted text-[#111827]"
              style={{ width: "120px", height: "80px" }}
            >
              <img 
                src={file.preview || "/placeholder.svg"} 
                alt="Preview" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error('Image failed to load:', file.preview);
                  e.currentTarget.src = "/placeholder.svg";
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', file.preview);
                }}
              />
              {!disableRemove && (
                <button
                  onClick={() => handleRemove(file.id)}
                  className="absolute top-1 right-1 rounded-sm bg-red-600 text-white p-0.5 shadow-lg hover:bg-red-700 transition-colors z-10"
                  aria-label="Remove image"
                >
                  <X className="h-[14px] w-[14px] stroke-[2.5]" />
                </button>
              )}
              {file.error && (
                <div className="absolute inset-0 bg-destructive/90 flex items-center justify-center p-2">
                  <p className="text-xs text-destructive-foreground text-center">{file.error}</p>
                </div>
              )}
            </div>
          ))}

          {canAddMore && (
            <button
              onClick={handleAddMore}
              disabled={isUploading}
              className={cn(
                "flex items-center justify-center rounded-[8px] border border-dashed border-[#111827] bg-muted/50 hover:border-primary hover:bg-accent transition-colors",
                "w-[120px] h-[80px]",
                isUploading && "opacity-50 cursor-not-allowed",
              )}
              aria-label="Add more images"
            >
              <Upload className="h-[18px] w-[18px] text-muted-foreground !text-[#111827]" />
            </button>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-[8px] border border-[#E4E4E4] text-[#111827] p-[12px]">
          <div className="flex-shrink-0 w-12 h-12 md:h-[60px] md:w-[60px] rounded overflow-hidden bg-muted">
            <img 
              src={value[0]?.preview || "/placeholder.svg"} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Image failed to load:', value[0]?.preview);
                e.currentTarget.src = "/placeholder.svg";
              }}
              onLoad={() => {
                console.log('Image loaded successfully:', value[0]?.preview);
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#111827] truncate">{value[0]?.name ?? ""}</p>
            <p className="text-xs text-muted-foreground">{value[0]?.size ?? ""}</p>
            {value[0]?.error && <p className="text-xs text-destructive mt-1">{value[0].error}</p>}
          </div>
          {!disableRemove && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => value[0] && handleRemove(value[0].id)}
              disabled={isUploading}
              className="flex-shrink-0 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <X className="h-[16px] w-[16px] text-red-600" />
            </Button>
          )}
        </div>
      )}

      {isUploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
    </div>
  )
}
