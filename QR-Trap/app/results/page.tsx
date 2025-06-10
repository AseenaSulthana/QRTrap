"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle, CheckCircle, ExternalLink, Eye, Info, Shield, X, Calendar, Lock, Unlock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { analyzeUrl } from "../lib/url-analyzer"

interface AnalysisResult {
  url: string
  isShortened: boolean
  expandedUrl?: string
  domain: string
  hasHttps: boolean
  domainAge: number
  suspiciousTokens: string[]
  hasRawIp: boolean
  hasLongSubdomains: boolean
  score: number
  riskLevel: "safe" | "suspicious" | "malicious"
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const qrData = searchParams.get("data")
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const performAnalysis = async () => {
      if (!qrData) {
        setError("No QR code data provided")
        setLoading(false)
        return
      }

      try {
        // In a real app, this would be a server-side API call
        const result = await analyzeUrl(qrData)
        setAnalysis(result)
      } catch (err) {
        setError("Failed to analyze the QR code data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    performAnalysis()
  }, [qrData])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-8"></div>
            <div className="h-64 bg-gray-200 rounded mb-4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">Analysis Error</h1>
          <p className="text-gray-600 mb-8">{error || "Could not analyze the QR code"}</p>
          <Link href="/scan">
            <Button>Try Another QR Code</Button>
          </Link>
        </div>
      </div>
    )
  }

  const getRiskBadge = () => {
    switch (analysis.riskLevel) {
      case "safe":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Safe
          </div>
        )
      case "suspicious":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            <AlertTriangle className="h-4 w-4 mr-1" />
            Suspicious
          </div>
        )
      case "malicious":
        return (
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <X className="h-4 w-4 mr-1" />
            Malicious
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">QR Code Analysis</h1>
          {getRiskBadge()}
        </div>

        <Card className="mb-8">
          <CardHeader className="pb-3">
            <CardTitle>Detected URL</CardTitle>
            <CardDescription>This is the URL encoded in the QR code</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg break-all font-mono text-sm mb-4">{analysis.url}</div>
            {analysis.isShortened && analysis.expandedUrl && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Expanded URL:</p>
                <div className="bg-gray-50 p-4 rounded-lg break-all font-mono text-sm">{analysis.expandedUrl}</div>
              </div>
            )}
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm" className="mr-2" asChild>
                <Link href="/preview">
                  <Eye className="h-4 w-4 mr-2" />
                  Safe Preview
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={analysis.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Visit URL
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="analysis">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="analysis">
              <Shield className="h-4 w-4 mr-2" />
              Security Analysis
            </TabsTrigger>
            <TabsTrigger value="details">
              <Info className="h-4 w-4 mr-2" />
              Technical Details
            </TabsTrigger>
          </TabsList>
          <TabsContent value="analysis">
            <Card>
              <CardHeader>
                <CardTitle>Security Score</CardTitle>
                <CardDescription>Based on multiple security factors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Risk Level: {analysis.riskLevel}</span>
                    <span className="text-sm font-medium">{analysis.score}/100</span>
                  </div>
                  <Progress value={analysis.score} className="h-2" />
                </div>

                <div className="space-y-4">
                  <div className="flex items-start">
                    {analysis.hasHttps ? (
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Lock className="h-3 w-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <Unlock className="h-3 w-3 text-red-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">HTTPS Security</p>
                      <p className="text-xs text-gray-500">
                        {analysis.hasHttps
                          ? "This URL uses secure HTTPS protocol"
                          : "This URL uses insecure HTTP protocol"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    {analysis.domainAge > 365 ? (
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Calendar className="h-3 w-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <Calendar className="h-3 w-3 text-amber-600" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">Domain Age</p>
                      <p className="text-xs text-gray-500">
                        {analysis.domainAge > 365
                          ? `Domain is over ${Math.floor(analysis.domainAge / 365)} year(s) old`
                          : `Domain is only ${analysis.domainAge} days old (recently registered domains are riskier)`}
                      </p>
                    </div>
                  </div>

                  {analysis.hasRawIp && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Raw IP Address</p>
                        <p className="text-xs text-gray-500">
                          URL contains a raw IP address instead of a domain name, which is suspicious
                        </p>
                      </div>
                    </div>
                  )}

                  {analysis.hasLongSubdomains && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                        <AlertTriangle className="h-3 w-3 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Suspicious Subdomains</p>
                        <p className="text-xs text-gray-500">URL contains unusually long or complex subdomains</p>
                      </div>
                    </div>
                  )}

                  {analysis.suspiciousTokens.length > 0 && (
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-5 w-5 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">Suspicious Keywords</p>
                        <p className="text-xs text-gray-500">
                          URL contains suspicious keywords: {analysis.suspiciousTokens.join(", ")}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Technical Details</CardTitle>
                <CardDescription>Detailed information about the URL</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Domain</h3>
                    <p className="text-sm bg-gray-50 p-2 rounded">{analysis.domain}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Protocol</h3>
                    <p className="text-sm bg-gray-50 p-2 rounded">
                      {analysis.hasHttps ? "HTTPS (Secure)" : "HTTP (Insecure)"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-1">Domain Age</h3>
                    <p className="text-sm bg-gray-50 p-2 rounded">
                      {analysis.domainAge > 365
                        ? `${Math.floor(analysis.domainAge / 365)} year(s) and ${analysis.domainAge % 365} day(s)`
                        : `${analysis.domainAge} day(s)`}
                    </p>
                  </div>
                  {analysis.isShortened && (
                    <div>
                      <h3 className="text-sm font-medium mb-1">URL Type</h3>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        Shortened URL (original URL has been expanded for analysis)
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-between">
          <Button variant="outline" asChild>
            <Link href="/scan">Scan Another QR Code</Link>
          </Button>
          <Button asChild>
            <Link href="/report">Report This QR Code</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
