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
import { ArrowLeft, TrendingUp, Package, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase"
import { MarketplaceHeader } from "@/components/marketplace-header"
import Link from "next/link"

interface EcosystemMetrics {
  totalExtensions: number
  totalDownloads: number
  downloads30d: number
  monthlyDownloads: Array<{ month: string; downloads: number }>
}

function formatNumber(num: number): string {
  if (num >= 1_000_000) {
    const millions = num / 1_000_000
    // Only show decimals if not a whole number
    return millions % 1 === 0 ? `${millions}M` : `${millions.toFixed(1)}M`
  }
  if (num >= 1_000) {
    const thousands = num / 1_000
    // Only show decimals if not a whole number
    return thousands % 1 === 0 ? `${thousands}K` : `${thousands.toFixed(1)}K`
  }
  return num.toString()
}

function formatNumberFull(num: number): string {
  return num.toLocaleString()
}

function getNiceNumber(value: number): number {
  // Round to a "nice" number for chart ticks
  const magnitude = Math.pow(10, Math.floor(Math.log10(value)))
  const normalized = value / magnitude
  
  let nice: number
  if (normalized <= 1) nice = 1
  else if (normalized <= 2) nice = 2
  else if (normalized <= 2.5) nice = 2.5
  else if (normalized <= 5) nice = 5
  else if (normalized <= 7.5) nice = 7.5
  else nice = 10
  
  return nice * magnitude
}

export default function EcosystemPage() {
  const [metrics, setMetrics] = useState<EcosystemMetrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchEcosystemMetrics() {
      try {
        const supabase = createClient()

        // Fetch total extensions
        const { count: extensionCount } = await supabase
          .from("extensions")
          .select("*", { count: "exact", head: true })

        // Fetch total downloads and 30-day downloads
        const { data: downloadData } = await supabase
          .from("extensions")
          .select("download_count_total, download_count_month")

        const totalDownloads = downloadData?.reduce((sum, ext) => sum + (ext.download_count_total || 0), 0) || 0
        const downloads30d = downloadData?.reduce((sum, ext) => sum + (ext.download_count_month || 0), 0) || 0

        // Fetch monthly download trends
        // This aggregates the downloads_trend_365d data across all extensions
        const { data: trendData } = await supabase
          .from("extensions")
          .select("downloads_trend_365d")
          .not("downloads_trend_365d", "is", null)

        // Aggregate weekly downloads into monthly buckets
        const monthlyMap = new Map<string, number>()

        trendData?.forEach((ext) => {
          const trends = ext.downloads_trend_365d as Array<{ week: string; downloads: number }>
          trends?.forEach(({ week, downloads }) => {
            // Extract year-month from week date (format: YYYY-MM-DD)
            const yearMonth = week.substring(0, 7) // Get YYYY-MM
            monthlyMap.set(yearMonth, (monthlyMap.get(yearMonth) || 0) + downloads)
          })
        })

        // Convert to array and sort by month (most recent first)
        const monthlyDownloads = Array.from(monthlyMap.entries())
          .map(([month, downloads]) => ({ month, downloads }))
          .sort((a, b) => b.month.localeCompare(a.month))
          .slice(0, 12) // Last 12 months
          .reverse() // Oldest to newest for chart

        setMetrics({
          totalExtensions: extensionCount || 0,
          totalDownloads,
          downloads30d,
          monthlyDownloads,
        })
      } catch (error) {
        console.error("Error fetching ecosystem metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEcosystemMetrics()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <main className="container mx-auto px-4 md:px-6 py-6">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Extensions
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Ecosystem Metrics</h1>
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <div className="h-32 bg-muted rounded-lg"></div>
              <div className="h-32 bg-muted rounded-lg"></div>
              <div className="h-32 bg-muted rounded-lg"></div>
            </div>
            <div className="h-96 bg-muted rounded-lg"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <main className="container mx-auto px-4 md:px-6 py-6">
          <div className="mb-6">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Extensions
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Ecosystem Metrics</h1>
          <p className="text-muted-foreground">Failed to load ecosystem metrics.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="container mx-auto px-4 md:px-6 py-6">
        {/* Back button */}
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Extensions
            </Button>
          </Link>
        </div>

        {/* Page title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Ecosystem Metrics</h1>
        <p className="text-muted-foreground mb-8">
          Overview of the JupyterLab extensions ecosystem
        </p>

        {/* Big numbers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Extensions</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{formatNumberFull(metrics.totalExtensions)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Available in the marketplace
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Downloads</CardTitle>
              <Download className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{formatNumberFull(metrics.totalDownloads)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time downloads across all extensions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">30-Day Downloads</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl md:text-3xl font-bold">{formatNumberFull(metrics.downloads30d)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Downloads in the last 30 days
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly downloads chart */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Downloads (Last 12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {metrics.monthlyDownloads.length > 0 ? (
              <div className="space-y-4">
                <div className="h-80 w-full">
                  <svg viewBox="0 0 400 200" className="w-full h-full">
                    {(() => {
                      const dataPoints = metrics.monthlyDownloads.map((d) => d.downloads)
                      const dataMax = Math.max(...dataPoints, 1)
                      const dataMin = Math.min(...dataPoints, 0)
                      const min = 0 // Always start from 0
                      const max = getNiceNumber(dataMax) // Use nice number for scale
                      const range = max - min || 1

                      const xStart = 40
                      const xEnd = 390
                      const yTop = 20
                      const yBottom = 170
                      const xRange = xEnd - xStart
                      const yRange = yBottom - yTop

                      // Build line path for solid line (all except last segment)
                      const solidPathD = dataPoints
                        .slice(0, -1)
                        .map((downloads, i) => {
                          const x = xStart + (i / (dataPoints.length - 1)) * xRange
                          const y = yBottom - ((downloads - min) / range) * yRange
                          return i === 0 ? `M${x},${y}` : `L${x},${y}`
                        })
                        .join(" ")

                      // Build line path for dotted line (last segment - current month)
                      const lastIdx = dataPoints.length - 1
                      const secondLastX = xStart + ((lastIdx - 1) / (dataPoints.length - 1)) * xRange
                      const secondLastY = yBottom - ((dataPoints[lastIdx - 1] - min) / range) * yRange
                      const lastX = xStart + (lastIdx / (dataPoints.length - 1)) * xRange
                      const lastY = yBottom - ((dataPoints[lastIdx] - min) / range) * yRange
                      const dottedPathD = `M${secondLastX},${secondLastY} L${lastX},${lastY}`

                      // Build area fill (complete area including dotted part)
                      const pathD = dataPoints
                        .map((downloads, i) => {
                          const x = xStart + (i / (dataPoints.length - 1)) * xRange
                          const y = yBottom - ((downloads - min) / range) * yRange
                          return i === 0 ? `M${x},${y}` : `L${x},${y}`
                        })
                        .join(" ")
                      const areaD = pathD + ` L${xEnd},${yBottom} L${xStart},${yBottom} Z`

                      // Y-axis ticks and labels with nice rounded numbers
                      const yTicks = [
                        { value: max, label: formatNumber(max) },
                        { value: getNiceNumber(max * 0.75), label: formatNumber(getNiceNumber(max * 0.75)) },
                        { value: getNiceNumber(max * 0.5), label: formatNumber(getNiceNumber(max * 0.5)) },
                        { value: getNiceNumber(max * 0.25), label: formatNumber(getNiceNumber(max * 0.25)) },
                        { value: getNiceNumber(dataMin), label: formatNumber(getNiceNumber(dataMin)) },
                      ].filter((tick, idx, arr) => 
                        // Remove duplicate values
                        idx === 0 || tick.value !== arr[idx - 1].value
                      )

                      return (
                        <>
                          {/* Grid lines and Y-axis labels */}
                          {yTicks.map((tick, idx) => {
                            const y = yBottom - ((tick.value - min) / range) * yRange
                            return (
                              <g key={idx}>
                                <line
                                  x1={xStart}
                                  y1={y}
                                  x2={xEnd}
                                  y2={y}
                                  className="stroke-border"
                                  strokeWidth={0.5}
                                  strokeDasharray="4,4"
                                  opacity={0.3}
                                />
                                <text x={35} y={y + 4} className="fill-muted-foreground text-[11px] font-medium" textAnchor="end">
                                  {tick.label}
                                </text>
                              </g>
                            )
                          })}
                          
                          {/* Area fill */}
                          <path d={areaD} className="fill-primary/20" />
                          
                          {/* Solid line (complete months) */}
                          <path d={solidPathD} className="stroke-primary" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                          
                          {/* Dotted line (current partial month) */}
                          <path d={dottedPathD} className="stroke-primary" fill="none" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6,4" opacity={0.7} />
                          
                          {/* Data points */}
                          {dataPoints.map((downloads, i) => {
                            const x = xStart + (i / (dataPoints.length - 1)) * xRange
                            const y = yBottom - ((downloads - min) / range) * yRange
                            const isCurrentMonth = i === dataPoints.length - 1
                            return (
                              <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r={3.5}
                                className="fill-primary"
                                opacity={isCurrentMonth ? 0.7 : 1}
                              />
                            )
                          })}

                          {/* X-axis labels */}
                          <text x={xStart} y={190} className="fill-muted-foreground text-[11px] font-medium" textAnchor="start">
                            {metrics.monthlyDownloads[0]?.month
                              ? new Date(metrics.monthlyDownloads[0].month + "-01").toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </text>
                          <text x={200} y={190} className="fill-muted-foreground text-[11px] font-medium" textAnchor="middle">
                            {metrics.monthlyDownloads[Math.floor(metrics.monthlyDownloads.length / 2)]?.month
                              ? new Date(
                                  metrics.monthlyDownloads[Math.floor(metrics.monthlyDownloads.length / 2)].month + "-01"
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </text>
                          <text x={xEnd} y={190} className="fill-muted-foreground text-[11px] font-medium" textAnchor="end">
                            {metrics.monthlyDownloads[metrics.monthlyDownloads.length - 1]?.month
                              ? new Date(
                                  metrics.monthlyDownloads[metrics.monthlyDownloads.length - 1].month + "-01"
                                ).toLocaleDateString("en-US", {
                                  month: "short",
                                  year: "numeric",
                                })
                              : ""}
                          </text>
                        </>
                      )
                    })()}
                  </svg>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">No download trend data available.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
