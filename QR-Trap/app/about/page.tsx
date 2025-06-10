import Link from "next/link"
import { Shield, Lock, AlertTriangle, Eye, Database, Code } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">About QRTrap</h1>
        <p className="text-gray-600 mb-8">Learn how QRTrap protects you from malicious QR codes</p>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Shield className="h-6 w-6 text-primary mr-2" />
              Our Mission
            </h2>
            <p className="text-gray-700 mb-4">
              QRTrap was created to address the growing security threat posed by malicious QR codes. In our
              post-pandemic world, QR codes have become ubiquitous - from restaurant menus to payment systems - but most
              people scan them without a second thought.
            </p>
            <p className="text-gray-700 mb-4">
              Malicious actors exploit this trust to trick users into visiting phishing sites, downloading malware, or
              exposing sensitive information. QRTrap acts as a protective layer between you and potential threats,
              giving you visibility into what a QR code does before you interact with it.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Lock className="h-6 w-6 text-primary mr-2" />
              How Our Detection Works
            </h2>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-medium text-lg mb-3">URL Analysis</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Expands shortened URLs to reveal their true destination</li>
                <li>Performs WHOIS lookups to check domain age and registration details</li>
                <li>Detects suspicious patterns like raw IP addresses and unusual subdomains</li>
                <li>Identifies concerning keywords that may indicate phishing attempts</li>
                <li>Checks for proper HTTPS security implementation</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg mb-6">
              <h3 className="font-medium text-lg mb-3">Security Scoring</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Combines multiple risk factors into a comprehensive security score</li>
                <li>Categorizes QR codes as Safe, Suspicious, or Malicious</li>
                <li>Provides detailed explanations for each risk factor</li>
                <li>Updates scoring algorithms based on emerging threats</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="font-medium text-lg mb-3">Safe Preview</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Renders a static screenshot of the destination site</li>
                <li>Blocks all scripts, forms, and interactive elements</li>
                <li>Provides a visual preview without exposing you to risks</li>
                <li>Highlights potential danger areas in the preview</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Database className="h-6 w-6 text-primary mr-2" />
              Privacy & Data
            </h2>
            <p className="text-gray-700 mb-4">We take your privacy seriously. Here's how we handle your data:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
              <li>QR code images are processed in memory and not stored unless you submit a report</li>
              <li>URLs are analyzed in real-time and not permanently stored</li>
              <li>No personal information is collected during normal usage</li>
              <li>All network requests to third-party APIs are proxied securely</li>
              <li>Reported QR codes are stored securely to improve our detection systems</li>
            </ul>
            <p className="text-gray-700">For more details, please review our full Privacy Policy.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <AlertTriangle className="h-6 w-6 text-primary mr-2" />
              Common QR Code Threats
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-3 text-red-800">Phishing Attacks</h3>
                <p className="text-red-700 text-sm">
                  QR codes that lead to fake login pages designed to steal your credentials for banks, social media, or
                  other services.
                </p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-3 text-red-800">Malware Distribution</h3>
                <p className="text-red-700 text-sm">
                  QR codes that trigger automatic downloads of malicious software or direct you to compromised websites.
                </p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-3 text-red-800">Payment Fraud</h3>
                <p className="text-red-700 text-sm">
                  Fake payment QR codes that send money to scammers instead of legitimate businesses.
                </p>
              </div>
              <div className="bg-red-50 p-6 rounded-lg">
                <h3 className="font-medium text-lg mb-3 text-red-800">Data Theft</h3>
                <p className="text-red-700 text-sm">
                  QR codes that extract personal information or track your online behavior without consent.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Code className="h-6 w-6 text-primary mr-2" />
              Technical Stack
            </h2>
            <p className="text-gray-700 mb-4">QRTrap is built using modern, secure technologies:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
              <li>
                <span className="font-medium">Frontend:</span> React.js with Next.js for server-side rendering
              </li>
              <li>
                <span className="font-medium">QR Decoding:</span> jsQR and OpenCV for image processing
              </li>
              <li>
                <span className="font-medium">URL Analysis:</span> Custom security algorithms and third-party security
                APIs
              </li>
              <li>
                <span className="font-medium">Safe Preview:</span> Headless browser rendering with security sandboxing
              </li>
              <li>
                <span className="font-medium">Security Updates:</span> Regular updates to detection algorithms based on
                new threats
              </li>
            </ul>
          </section>

          <section className="bg-primary/5 p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center">Ready to Scan Safely?</h2>
            <p className="text-gray-700 mb-6 text-center">
              Start using QRTrap today to protect yourself from malicious QR codes.
            </p>
            <div className="flex justify-center">
              <Button asChild className="bg-primary hover:bg-primary/90">
                <Link href="/scan">
                  <Eye className="h-4 w-4 mr-2" />
                  Scan a QR Code Now
                </Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
