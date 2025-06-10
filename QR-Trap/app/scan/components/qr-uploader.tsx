"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, File, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import jsQR from "jsqr"

interface QrUploaderProps {
  onQrCodeDetected: (result: string) => void
}

export default function QrUploader({ onQrCodeDetected }: QrUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    setFile(file)
    processQRCode(file)
  }

  const processQRCode = (file: File) => {
    setIsProcessing(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")

        if (!ctx) {
          setIsProcessing(false)
          toast({
            title: "Processing Error",
            description: "Could not process the image. Please try again.",
            variant: "destructive",
          })
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        ctx.drawImage(img, 0, 0)

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        })

        setIsProcessing(false)

        if (code) {
          onQrCodeDetected(code.data)
        } else {
          toast({
            title: "No QR Code Found",
            description: "Could not detect a valid QR code in the image. Please try another image.",
            variant: "destructive",
          })
        }
      }

      img.onerror = () => {
        setIsProcessing(false)
        toast({
          title: "Image Error",
          description: "Could not load the image. Please try another file.",
          variant: "destructive",
        })
      }

      img.src = e.target?.result as string
    }

    reader.readAsDataURL(file)
  }

  const clearFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="flex flex-col items-center">
      <input type="file" ref={fileInputRef} onChange={handleFileInput} accept="image/*" className="hidden" />

      {!file ? (
        <div
          className={`w-full max-w-md border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300 hover:border-primary hover:bg-gray-50"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-10 w-10 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload QR Code Image</h3>
          <p className="text-sm text-gray-500 mb-4">Drag and drop an image file here, or click to select a file</p>
          <p className="text-xs text-gray-400">Supports JPG, PNG, GIF up to 5MB</p>
        </div>
      ) : (
        <div className="w-full max-w-md">
          <div className="relative bg-gray-100 rounded-lg p-4 mb-4">
            <div className="flex items-center">
              <File className="h-8 w-8 text-gray-400 mr-3" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <Button variant="ghost" size="icon" onClick={clearFile} disabled={isProcessing}>
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
            {isProcessing && (
              <div className="mt-2">
                <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full animate-pulse" style={{ width: "100%" }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">Processing QR code...</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <Button variant="outline" onClick={clearFile} disabled={isProcessing} className="mr-2">
              Choose Another
            </Button>
            <Button
              onClick={() => processQRCode(file)}
              disabled={isProcessing}
              className="bg-primary hover:bg-primary/90"
            >
              {isProcessing ? "Processing..." : "Analyze QR Code"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
