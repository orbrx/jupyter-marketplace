"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Star, Download, GitFork, AlertCircle, ExternalLink, Calendar, User, Shield, Package, Copy, Check, Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Extension {
  id: number
  name: string
  description: string | null
  summary: string | null
  version: string
  author: string | null
  license: string | null
  category: string | null
  logo_url?: string | null
  pypi_url: string
  github_url: string | null
  github_stars: number
  github_forks: number
  github_issues: number
  download_count_total: number
  download_count_month: number
  download_count_week: number
  download_count_day: number
  last_updated: string
}

function InstallCommand({ name }: { name: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`pip install ${name}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy install command:", err)
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 h-10 px-4 md:px-6 bg-background border rounded-md shadow-xs max-w-[40rem] w-full sm:w-auto flex-none">
      <code className="block text-sm md:text-base font-mono truncate">
        pip install {name}
      </code>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : "Copy"}
        className="text-foreground dark:text-foreground hover:text-orange-600 dark:hover:text-orange-400 border-0 hover:bg-transparent focus-visible:ring-0 focus-visible:border-0 size-10"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </Button>
    </div>
  )
}

export default function ExtensionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [extension, setExtension] = useState<Extension | null>(null)
  const [loading, setLoading] = useState(true)


  useEffect(() => {
    // Reset scroll position to top when navigating to this page
    window.scrollTo(0, 0)
    
    async function fetchExtension() {
      if (!params.id) return
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from("extensions")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error) {
        console.error("Error fetching extension:", error)
      } else {
        setExtension(data)
      }
      setLoading(false)
    }

    fetchExtension()
  }, [params.id])

  const formatNumber = (count: number) => {
    return count.toLocaleString()
  }

  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "widgets":
        return "bg-blue-100 text-blue-800"
      case "visualization":
        return "bg-purple-100 text-purple-800"
      case "data-analysis":
        return "bg-green-100 text-green-800"
      case "themes":
        return "bg-pink-100 text-pink-800"
      case "other":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-6"></div>
            <div className="h-12 bg-muted rounded w-2/3 mb-4"></div>
            <div className="h-6 bg-muted rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-muted rounded"></div>
                <div className="h-32 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!extension) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => {
              router.back()
              // Ensure we scroll to the very top after navigation
              setTimeout(() => window.scrollTo(0, 0), 100)
            }}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Extension Not Found</h1>
            <p className="text-muted-foreground">The extension you're looking for doesn't exist.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => {
            router.back()
            // Ensure we scroll to the very top after navigation
            setTimeout(() => window.scrollTo(0, 0), 100)
          }}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Button>

        {/* Header */}
        <div className="flex items-start gap-6 mb-8">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden bg-primary/10 flex items-center justify-center">
            {extension.logo_url ? (
              <img
                src={extension.logo_url}
                alt={`${extension.name} logo`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="text-primary font-bold text-4xl">
                {extension.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl md:text-5xl font-bold">{extension.name}</h1>
              {extension.category && (
                <Badge className={getCategoryColor(extension.category)}>
                  {extension.category}
                </Badge>
              )}
            </div>
            <p className="text-xl text-muted-foreground mb-4">
              {extension.summary || "No summary available."}
            </p>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{extension.author || "Unknown"}</span>
              </div>
              <div className="flex items-center gap-1">
                <Package className="w-4 h-4" />
                <span>v{extension.version}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Updated {formatDate(extension.last_updated)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Install Command + Actions */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <InstallCommand name={extension.name} />
          {extension.github_url && (
            <Button variant="outline" size="lg" asChild>
              <a href={extension.github_url} target="_blank" rel="noopener noreferrer">
                <GitFork className="w-4 h-4 mr-2" />
                View Source
              </a>
            </Button>
          )}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      // Override default styling for certain elements
                      p: ({node, ...props}) => <p className="text-muted-foreground leading-relaxed" {...props} />,
                      a: ({node, ...props}) => <a className="text-primary hover:text-primary/80" {...props} />,
                      code: ({node, className, ...props}) => 
                        className?.includes('language-') ? (
                          <code className="block bg-muted p-4 rounded-lg text-sm overflow-x-auto" {...props} />
                        ) : (
                          <code className="bg-muted px-1.5 py-0.5 rounded-sm text-sm" {...props} />
                        )
                    }}
                  >
                    {extension.description || "No description available for this extension."}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Release Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Current Version</p>
                    <p className="text-2xl font-bold text-primary">v{extension.version}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Last Updated</p>
                    <p className="text-sm text-muted-foreground">{formatDate(extension.last_updated)}</p>
                  </div>
                </div>
                {extension.license && (
                  <div className="mt-4 pt-4 border-t">
                    <div className="grid grid-cols-[auto,1fr] items-start gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">License</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="min-w-0 max-w-full whitespace-normal break-words overflow-hidden text-left"
                      >
                        {extension.license}
                      </Badge>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Statistics */}
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Total Downloads</span>
                  </div>
                  <span className="font-bold">{formatNumber(extension.download_count_total)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">This Month</span>
                  </div>
                  <span className="font-medium">{formatNumber(extension.download_count_month)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">This Week</span>
                  </div>
                  <span className="font-medium">{formatNumber(extension.download_count_week)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">Today</span>
                  </div>
                  <span className="font-medium">{formatNumber(extension.download_count_day)}</span>
                </div>
              </CardContent>
            </Card>

            {/* GitHub Stats */}
            {(extension.github_stars > 0 || extension.github_forks > 0 || extension.github_issues > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>GitHub Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {extension.github_stars > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">Stars</span>
                      </div>
                      <span className="font-bold">{formatNumber(extension.github_stars)}</span>
                    </div>
                  )}
                  {extension.github_forks > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <GitFork className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">Forks</span>
                      </div>
                      <span className="font-medium">{formatNumber(extension.github_forks)}</span>
                    </div>
                  )}
                  {extension.github_issues > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                        <span className="text-sm">Open Issues</span>
                      </div>
                      <span className="font-medium">{formatNumber(extension.github_issues)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <a href={extension.pypi_url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on PyPI
                  </a>
                </Button>
                {extension.github_url && (
                  <Button variant="outline" className="w-full" asChild>
                    <a href={extension.github_url} target="_blank" rel="noopener noreferrer">
                      <GitFork className="w-4 h-4 mr-2" />
                      GitHub Repository
                    </a>
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    const reportUrl = `https://github.com/orbrx/jupyter-marketplace/issues/new?template=data-correction.yml&title=[data]%20${encodeURIComponent(extension.name)}&labels=data,triage&pkg=${encodeURIComponent(extension.name)}&what=${encodeURIComponent(`URL: ${window.location.origin}/extensions/${extension.id}`)}`
                    window.open(reportUrl, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
