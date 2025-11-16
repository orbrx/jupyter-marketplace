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
import { Star, Download, Clock, Flag } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { formatRelativeTime } from "@/lib/utils"
import Link from "next/link"
import React, { forwardRef } from "react"

interface Extension {
  id: number
  name: string
  description: string | null
  author: string | null
  category: string | null
  logo_url?: string | null
  github_stars: number
  download_count_month: number
  download_count_total: number
  last_updated: string
  // Optional fields that we don't fetch initially for performance
  summary?: string | null
  version?: string
  license?: string | null
  pypi_url?: string
  github_url?: string | null
  github_forks?: number
  github_issues?: number
  download_count_week?: number
  download_count_day?: number
  download_trend_30d_pct?: number | null
  download_trend_direction?: "up" | "down" | "stable" | null
}

interface ExtensionCardProps {
  extension: Extension
  showUpdateTime?: boolean
  showMonthlyDownloads?: boolean
  showTrendBadge?: boolean
}

export const ExtensionCard = forwardRef<HTMLDivElement, ExtensionCardProps>(function ExtensionCard({ extension, showUpdateTime = false, showMonthlyDownloads = false, showTrendBadge = false }, ref) {
  const formatNumber = (count: number) => {
    if (count >= 1000000) {
      const millions = count / 1000000
      // Show decimal point only for numbers less than 100M and when decimal is significant
      return millions < 100 && millions % 1 >= 0.1 
        ? `${millions.toFixed(1)}M` 
        : `${Math.floor(millions)}M`
    }
    if (count >= 1000) {
      const thousands = count / 1000
      // Show decimal point only for numbers less than 100K and when decimal is significant
      return thousands < 100 && thousands % 1 >= 0.1
        ? `${thousands.toFixed(1)}K`
        : `${Math.floor(thousands)}K`
    }
    return count.toString()
  }

  const formatNumberForScreenReader = (count: number) => {
    return count.toLocaleString()
  }

  const renderTrendBadge = () => {
    if (extension.download_trend_30d_pct == null || extension.download_trend_direction == null) {
      return null
    }

    const pct = extension.download_trend_30d_pct
    const rounded = Math.round(pct)
    const formattedPct = `${rounded > 0 ? "+" : ""}${rounded}%`

    let label = ""
    let className = "px-1.5 py-0.5 rounded-full text-[10px] font-medium inline-flex items-center gap-1"
    let ariaLabel = ""

    if (extension.download_trend_direction === "up") {
      if (pct >= 100) {
        label = `🔥 ${formattedPct}`
        className += " bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200"
        ariaLabel = `Downloads up ${formattedPct} in the last 30 days (hot)`
      } else {
        label = `📈 ${formattedPct}`
        className += " bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
        ariaLabel = `Downloads up ${formattedPct} in the last 30 days`
      }
    } else if (extension.download_trend_direction === "stable") {
      label = `→ ${formattedPct}`
      className += " bg-muted text-muted-foreground"
      ariaLabel = `Downloads stable over the last 30 days (${formattedPct})`
    } else {
      label = `📉 ${formattedPct}`
      className += " bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200"
      ariaLabel = `Downloads down ${formattedPct} in the last 30 days`
    }

    return (
      <span className={className} aria-label={ariaLabel}>
        {label}
      </span>
    )
  }

  const handleReportClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation() // Prevent card click
    const reportUrl = `https://github.com/orbrx/jupyter-marketplace/issues/new?template=data-correction.yml&title=[data]%20${encodeURIComponent(extension.name)}&labels=data,triage&pkg=${encodeURIComponent(extension.name)}&what=${encodeURIComponent(`URL: ${window.location.origin}/extensions/${extension.name}`)}`
    window.open(reportUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <Link 
      href={`/extensions/${extension.name}`}
      className="block h-[280px] md:h-[250px] group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg"
    >
      <Card 
        ref={ref}
        role="article"
        aria-labelledby={`extension-${extension.id}-title`}
        className="h-full flex flex-col min-h-0 !gap-3 !py-3 md:!py-3 overflow-hidden hover:diagonal-shadow transition-shadow duration-150 relative group-hover:diagonal-shadow group-focus-visible:diagonal-shadow"
      >
      {/* Report button */}
      <button
        onClick={handleReportClick}
        className="absolute top-2 right-2 p-1 rounded-md bg-background/80 hover:bg-background text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 z-10"
        title="Report issue with this package"
        aria-label="Report issue"
        tabIndex={-1}
        onFocus={(e) => {
          // Make button visible when focused
          e.currentTarget.style.opacity = '1'
        }}
        onBlur={(e) => {
          // Hide button when focus leaves, unless parent is hovered
          if (!e.currentTarget.closest('.group:hover')) {
            e.currentTarget.style.opacity = '0'
          }
        }}
      >
        <Flag className="w-3 h-3" />
      </button>
      
      <CardHeader className="pb-0 pt-2 !px-3 md:!px-3 md:pt-2 !flex !flex-col !items-center !text-center gap-2">
        <div className="w-14 h-14 md:w-12 md:h-12 rounded-lg overflow-hidden bg-primary/10 flex items-center justify-center">
          {extension.logo_url ? (
            <img
              src={extension.logo_url}
              alt={`${extension.name} logo`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <span className="text-primary font-bold text-2xl md:text-xl">{extension.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <h3 id={`extension-${extension.id}-title`} className="font-semibold text-base md:text-base single-line-fade w-full leading-tight">{extension.name}</h3>
        <p className="text-xs md:text-xs text-muted-foreground leading-tight single-line-fade w-full font-medium">{extension.author || "Unknown"}</p>
      </CardHeader>

      <CardContent className="flex-1 pt-1 !px-3 md:!px-3 flex flex-col min-h-0 gap-3">
        <p className="text-xs md:text-xs text-muted-foreground line-clamp-fade-right-3 text-center leading-snug break-words">
          {extension.summary || "No summary available."}
        </p>
        <div className="space-y-2 mt-auto">
          <div className="flex items-center justify-center space-x-2 md:space-x-1.5 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span aria-label={`${formatNumberForScreenReader(extension.download_count_total)} downloads`}>
                {formatNumber(extension.download_count_total)}
              </span>
            </div>
            {extension.github_stars > 0 && (
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span aria-label={`${formatNumberForScreenReader(extension.github_stars)} stars`}>
                  {formatNumber(extension.github_stars)}
                </span>
              </div>
            )}
          </div>
          {showMonthlyDownloads && (
            <div className="flex items-center justify-center text-[10px] text-muted-foreground pb-0">
              <Download className="w-3 h-3 mr-1" />
              <span aria-label={`${formatNumberForScreenReader(extension.download_count_month)} downloads this month`}>
                {formatNumber(extension.download_count_month)} this month
              </span>
            </div>
          )}
          {showTrendBadge && (
            <div className="flex items-center justify-center text-[10px] pb-0">
              {renderTrendBadge()}
            </div>
          )}
          {showUpdateTime && (
            <div className="flex items-center justify-center text-[10px] text-muted-foreground pb-0">
              <Clock className="w-3 h-3 mr-1" />
              <span>{formatRelativeTime(extension.last_updated)}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
    </Link>
  )
})
