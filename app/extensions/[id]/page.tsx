/*
 * Copyright 2025, Orange Bricks
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
import rehypeRaw from "rehype-raw"
import rehypeSanitize from "rehype-sanitize"
import { BadgeConfigurator } from "@/components/badge-configurator"

// Preprocess markdown to handle HTML comments and improve GitHub compatibility
function preprocessMarkdown(markdown: string): string {
  return markdown
    // Remove HTML comments (including Jekyll/Liquid comments)
    .replace(/<!--[\s\S]*?-->/g, '')
    // Remove Jekyll/Liquid template tags
    .replace(/\{\%[\s\S]*?\%\}/g, '')
    // Clean up extra whitespace left by removed comments
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .trim()
}

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
  first_published: string | null
  jupyterlab_versions: number[]
  downloads_trend_365d: { week: string; downloads: number }[] | null
  download_trend_30d_pct: number | null
  download_trend_direction: "up" | "down" | "stable" | null
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
        .select("*, jupyterlab_versions, downloads_trend_365d, download_trend_30d_pct, download_trend_direction, first_published")
        .eq("name", params.id)
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

  const formatTrendBadge = () => {
    if (extension?.download_trend_30d_pct == null || extension.download_trend_direction == null) {
      return null
    }

    const pct = extension.download_trend_30d_pct
    const rounded = Math.round(pct)
    const formattedPct = `${rounded > 0 ? "+" : ""}${rounded}%`

    let label = ""
    let className = "px-2 py-0.5 rounded-full text-xs font-medium inline-flex items-center gap-1"

    if (extension.download_trend_direction === "up") {
      if (pct >= 100) {
        label = `🔥 Hot · ${formattedPct}`
        className += " bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
      } else {
        label = `▲ Growing · ${formattedPct}`
        className += " bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
      }
    } else if (extension.download_trend_direction === "stable") {
      label = `→ Stable · ${formattedPct}`
      className += " bg-muted text-muted-foreground"
    } else {
      label = `▼ Declining · ${formattedPct}`
      className += " bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
    }

    return (
      <span className={className} aria-label={`Download trend over last 30 days: ${label}`}>
        {label}
      </span>
    )
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
          <a 
            href={`https://codespaces.new/orbrx/try-labextensions/tree/${extension.name}?quickstart=1&editor=jupyter`}
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="https://github.com/codespaces/badge.svg" 
              alt="Open in GitHub Codespaces" 
              className="h-10"
            />
          </a>
          <a 
            href={`https://mybinder.org/v2/gh/orbrx/try-labextensions/${extension.name}?urlpath=lab`}
            target="_blank" 
            rel="noopener noreferrer"
          >
            <img 
              src="https://mybinder.org/badge_logo.svg" 
              alt="Launch in Binder" 
              className="h-10"
            />
          </a>
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
                    rehypePlugins={[rehypeRaw, rehypeSanitize]}
                    components={{
                      // Override default styling for certain elements
                      p: ({node, ...props}) => <p className="text-muted-foreground leading-relaxed mb-4" {...props} />,
                      a: ({node, ...props}) => <a className="text-primary hover:text-primary/80 underline" target="_blank" rel="noopener noreferrer" {...props} />,
                      h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4 mt-8 text-foreground" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-3 mt-6 text-foreground" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-2 mt-4 text-foreground" {...props} />,
                      h4: ({node, ...props}) => <h4 className="text-lg font-medium mb-2 mt-3 text-foreground" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                      ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                      li: ({node, ...props}) => <li className="text-muted-foreground" {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary/20 pl-4 italic text-muted-foreground mb-4" {...props} />,
                      img: ({node, ...props}) => (
                        <img 
                          className="max-w-full h-auto rounded-lg shadow-sm mb-4" 
                          loading="lazy"
                          {...props} 
                        />
                      ),
                      code: ({node, className, children, ...props}) => {
                        const isInline = !className?.includes('language-')
                        return isInline ? (
                          <code className="bg-muted px-1.5 py-0.5 rounded-sm text-sm font-mono" {...props}>
                            {children}
                          </code>
                        ) : (
                          <div className="mb-4">
                            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                              <code className="text-sm font-mono" {...props}>
                                {children}
                              </code>
                            </pre>
                          </div>
                        )
                      },
                      pre: ({node, children, ...props}) => <div>{children}</div>, // Prevent double wrapping with code component
                      table: ({node, ...props}) => (
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full border-collapse border border-border" {...props} />
                        </div>
                      ),
                      th: ({node, ...props}) => <th className="border border-border px-4 py-2 bg-muted font-semibold text-left" {...props} />,
                      td: ({node, ...props}) => <td className="border border-border px-4 py-2" {...props} />,
                      hr: ({node, ...props}) => <hr className="border-border my-6" {...props} />
                    }}
                  >
                    {preprocessMarkdown(extension.description || "No description available for this extension.")}
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
                {extension.first_published && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium">First Published</p>
                    <p className="text-sm text-muted-foreground">{formatDate(extension.first_published)}</p>
                  </div>
                )}
                {extension.jupyterlab_versions && extension.jupyterlab_versions.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Supported JupyterLab Versions</p>
                    <div className="flex flex-wrap gap-2">
                      {extension.jupyterlab_versions.sort((a, b) => b - a).map((version) => (
                        <Badge key={version} variant="secondary" className="text-sm">
                          JupyterLab {version}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
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
                {extension.download_trend_30d_pct != null && (
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Download className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">30-day Trend</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Based on downloads in the last 30 days vs the previous 30 days.
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {formatTrendBadge()}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Download Trend Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Download Trend (last year)</CardTitle>
              </CardHeader>
              <CardContent>
                {extension.downloads_trend_365d && extension.downloads_trend_365d.length > 0 ? (
                  <div className="space-y-3">
                    <div className="h-32 w-full">
                      <svg viewBox="0 0 100 40" className="w-full h-full">
                        {(() => {
                          const rawData = extension.downloads_trend_365d || []
                          
                          // Create 52-week array, pad with null on the left for new extensions
                          const totalWeeks = 52
                          const dataPoints: Array<number | null> = new Array(totalWeeks).fill(null)
                          
                          // Fill in actual data at the END (most recent weeks)
                          const actualData = rawData.map(d => d.downloads)
                          const startIndex = totalWeeks - actualData.length
                          actualData.forEach((value, i) => {
                            dataPoints[startIndex + i] = value
                          })
                          
                          // Get min/max from actual data only
                          const validData = dataPoints.filter((d): d is number => d !== null)
                          const max = Math.max(...validData, 1)
                          const min = Math.min(...validData, 0)  // Use actual minimum to show detail
                          const range = max - min || 1
                          
                          const xStart = 5
                          const xEnd = 95
                          const xRange = xEnd - xStart
                          
                          // Build path with gaps for null values
                          let pathD = ''
                          let inSegment = false
                          
                          dataPoints.forEach((downloads, i) => {
                            const x = xStart + (i / (dataPoints.length - 1)) * xRange
                            
                            if (downloads !== null) {
                              const y = 35 - ((downloads - min) / range) * 25
                              pathD += inSegment ? ` L${x},${y}` : ` M${x},${y}`
                              inSegment = true
                            } else {
                              inSegment = false
                            }
                          })
                          
                          // Build area fill only for data segments
                          let areaD = ''
                          let currentSegment = ''
                          let segmentStartX = 0
                          
                          dataPoints.forEach((downloads, i) => {
                            const x = xStart + (i / (dataPoints.length - 1)) * xRange
                            
                            if (downloads !== null) {
                              const y = 35 - ((downloads - min) / range) * 25
                              if (!currentSegment) {
                                segmentStartX = x
                                currentSegment = `M${x},${y}`
                              } else {
                                currentSegment += ` L${x},${y}`
                              }
                            } else if (currentSegment) {
                              // Close this segment
                              const lastX = xStart + ((i - 1) / (dataPoints.length - 1)) * xRange
                              areaD += ` ${currentSegment} L${lastX},35 L${segmentStartX},35 Z`
                              currentSegment = ''
                            }
                          })
                          
                          // Close final segment if exists
                          if (currentSegment) {
                            const lastX = xStart + ((dataPoints.length - 1) / (dataPoints.length - 1)) * xRange
                            areaD += ` ${currentSegment} L${lastX},35 L${segmentStartX},35 Z`
                          }

                          return (
                            <>
                              <path d={areaD} className="fill-primary/10" />
                              <path d={pathD} className="stroke-primary" fill="none" strokeWidth={1.5} />
                              <line x1={xStart} y1={35} x2={xEnd} y2={35} className="stroke-muted-foreground/40" strokeWidth={0.3} />
                              
                              <text x={3} y={35} textAnchor="end" className="fill-muted-foreground" fontSize={3}>
                                {min.toLocaleString()}
                              </text>
                              <text x={3} y={12} textAnchor="end" className="fill-muted-foreground" fontSize={3}>
                                {max.toLocaleString()}
                              </text>
                              
                              <text x={xStart} y={38} textAnchor="start" className="fill-muted-foreground" fontSize={3}>
                                12 mo
                              </text>
                              <text x={50} y={38} textAnchor="middle" className="fill-muted-foreground" fontSize={3}>
                                6 mo
                              </text>
                              <text x={xEnd} y={38} textAnchor="end" className="fill-muted-foreground" fontSize={3}>
                                Now
                              </text>
                            </>
                          )
                        })()}
                      </svg>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Weekly downloads over the last 52 weeks. Higher areas indicate more downloads.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">Trend data is not available yet for this extension.</p>
                )}
              </CardContent>
            </Card>

            {/* Security */}
            <Card>
              <CardHeader>
                <CardTitle>Security</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Security analysis powered by Snyk Advisor
                  </p>
                  <a 
                    href={`https://snyk.io/advisor/python/${extension.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <img 
                      src={`https://snyk.io/advisor/python/${extension.name}/badge.svg`}
                      alt={`${extension.name} Snyk security score`}
                      className="max-w-full h-auto"
                      loading="lazy"
                    />
                  </a>
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
                    const reportUrl = `https://github.com/orbrx/jupyter-marketplace/issues/new?template=data-correction.yml&title=[data]%20${encodeURIComponent(extension.name)}&labels=data,triage&pkg=${encodeURIComponent(extension.name)}&what=${encodeURIComponent(`URL: ${window.location.origin}/extensions/${extension.name}`)}`
                    window.open(reportUrl, '_blank', 'noopener,noreferrer')
                  }}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Report Issue
                </Button>
              </CardContent>
            </Card>

            {/* Badge Configurator */}
            <BadgeConfigurator extensionName={extension.name} />
          </div>
        </div>
      </div>
    </div>
  )
}
