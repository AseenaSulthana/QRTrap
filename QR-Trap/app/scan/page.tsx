"use client"

import { useState } from "react"
import { Upload, Camera, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import QrScanner from "./components/qr-scanner"
import QrUploader from "./components/qr-uploader"

export default function ScanPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleQrCodeDetected = (result: string) => {
    // In a real app, we would validate the result here
    if (result) {
      // Encode the result to pass it safely in the URL
      const encodedResult = encodeURIComponent(result)
      router.push(`/results?data=${encodedResult}`)
    } else {
      setError("Could not detect a valid QR code. Please try again.")
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-3xl -z-10"></div>

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2 animate-fade-in">Scan QR Code</h1>
        <p className="text-gray-600 text-center mb-8 animate-fade-in-delay">
          Upload a QR code image or scan directly with your camera
        </p>

        <Tabs defaultValue="upload" className="w-full animate-fade-in-delay-2">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="upload" className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
              <Upload className="h-4 w-4" />
              <span>Upload Image</span>
            </TabsTrigger>
            <TabsTrigger value="camera" className="flex items-center gap-2 transition-all duration-300 hover:scale-105">
              <Camera className="h-4 w-4" />
              <span>Use Camera</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <Card className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-6">
                <QrUploader onQrCodeDetected={handleQrCodeDetected} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="camera">
            <Card className="backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
              <CardContent className="pt-6">
                <QrScanner onQrCodeDetected={handleQrCodeDetected} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {error && (
          <div className="mt-4 p-4 bg-red-50/90 backdrop-blur-sm border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 animate-pulse" />
            <div>
              <h3 className="font-medium text-red-800">Error</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-8 p-4 bg-amber-50/90 backdrop-blur-sm border border-amber-200 rounded-lg animate-fade-in-delay-3">
          <h3 className="font-medium text-amber-800 flex items-center gap-2 mb-2">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <span>Safety Tip</span>
          </h3>
          <p className="text-amber-700 text-sm">
            Never scan QR codes from untrusted sources. QR codes can lead to malicious websites, initiate downloads, or
            expose your device to security risks.
          </p>
        </div>
      </div>
    </div>
  )
}
;<style jsx>{`
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.6s ease-out;
  }
  
  .animate-fade-in-delay {
    animation: fade-in 0.6s ease-out 0.1s both;
  }
  
  .animate-fade-in-delay-2 {
    animation: fade-in 0.6s ease-out 0.2s both;
  }
  
  .animate-fade-in-delay-3 {
    animation: fade-in 0.6s ease-out 0.3s both;
  }
`}</style>
