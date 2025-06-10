"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AlertTriangle, ArrowLeft, ExternalLink, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function PreviewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [url, setUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const qrData = searchParams.get("data")

    if (!qrData) {
      // Try to get the URL from the results page state
      const storedUrl = sessionStorage.getItem("qrTrapUrl")
      if (storedUrl) {
        setUrl(storedUrl)
        setLoading(false)
      } else {
        setError("No URL provided for preview")
        setLoading(false)
      }
      return
    }

    // In a real app, we would validate the URL here
    try {
      // If the URL doesn't have a protocol, add https://
      let validUrl = qrData
      if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
        validUrl = "https://" + validUrl
      }

      // Store in session storage for later use
      sessionStorage.setItem("qrTrapUrl", validUrl)
      setUrl(validUrl)
    } catch (e) {
      setError("Invalid URL format")
    } finally {
      setLoading(false)
    }
  }, [searchParams])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !url) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Preview Error</h1>
          <p className="text-gray-600 mb-8">{error || "Could not generate preview"}</p>
          <Button asChild>
            <Link href="/scan">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Scanner
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" asChild>
            <Link href="/results">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Safe Preview</h1>
          <Button variant="outline" asChild>
            <a href={url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-2" />
              Visit Site
            </a>
          </Button>
        </div>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Shield className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-amber-800">Safe Preview Mode</h3>
              <p className="text-amber-700 text-sm">
                This is a static preview of the website. Interactive elements, forms, and scripts are disabled for your
                safety. The actual website may look different.
              </p>
            </div>
          </div>
        </div>

        <div className="border rounded-lg overflow-hidden bg-white mb-6">
          <div className="border-b p-2 flex items-center bg-gray-50">
            <div className="flex-1 truncate font-mono text-xs text-gray-600 px-2">{url}</div>
          </div>
          <div className="relative">
            {/* In a real app, this would be a server-rendered screenshot */}
            <div className="aspect-[16/9] bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500 text-center p-8">
                [In a production app, this would show a server-rendered screenshot of {url}]
              </p>
            </div>
            <div className="absolute inset-0 pointer-events-none border-4 border-amber-400 border-dashed m-4 rounded opacity-30"></div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800">Warning</h3>
              <p className="text-red-700 text-sm">
                This site may contain downloads, trackers, or unsafe forms. Always be cautious when visiting unfamiliar
                websites.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/results">Back to Analysis</Link>
          </Button>
          <Button asChild>
            <Link href="/report">Report This URL</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
