"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useMobile } from "@/hooks/use-mobile"
import jsQR from "jsqr"

interface QrScannerProps {
  onQrCodeDetected: (result: string) => void
}

export default function QrScanner({ onQrCodeDetected }: QrScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { toast } = useToast()
  const isMobile = useMobile()

  const startScanner = async () => {
    try {
      const constraints = {
        video: {
          facingMode: isMobile ? "environment" : "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
        setIsScanning(true)
        scanQRCode()
      }
    } catch (error) {
      console.error("Error accessing camera:", error)
      toast({
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopScanner = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
      tracks.forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsScanning(false)
    }
  }

  const scanQRCode = () => {
    if (!isScanning) return

    const video = videoRef.current
    const canvas = canvasRef.current

    if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      canvas.height = video.videoHeight
      canvas.width = video.videoWidth

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      })

      if (code) {
        stopScanner()
        onQrCodeDetected(code.data)
        return
      }
    }

    requestAnimationFrame(scanQRCode)
  }

  useEffect(() => {
    return () => {
      stopScanner()
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full max-w-md aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4">
        {isScanning ? (
          <>
            <video ref={videoRef} className="w-full h-full object-cover" playsInline />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-0 border-2 border-dashed border-emerald-500 m-8 pointer-events-none"></div>
            <Button variant="outline" size="icon" className="absolute top-2 right-2 bg-white" onClick={stopScanner}>
              <X className="h-4 w-4" />
              <span className="sr-only">Stop scanning</span>
            </Button>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <Camera className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-sm text-center px-4">Camera preview will appear here</p>
          </div>
        )}
      </div>

      {!isScanning && (
        <Button onClick={startScanner} className="bg-primary hover:bg-primary/90">
          <Camera className="h-4 w-4 mr-2" />
          Start Camera
        </Button>
      )}

      <p className="text-sm text-gray-500 mt-4 text-center">
        Position the QR code within the frame to scan automatically
      </p>
    </div>
  )
}
