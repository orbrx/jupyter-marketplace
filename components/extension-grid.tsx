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

import { useEffect, useState, useRef, useCallback } from "react"
import { ExtensionCard } from "@/components/extension-card"
import { createClient } from "@/lib/supabase"
import { SkeletonExtensionCard } from "@/components/skeleton-card"
import { LiveAnnouncer } from "@/components/live-announcer"

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
}

interface ExtensionGridProps {
  searchTerm: string
  selectedCategory: string
  sortBy: string
}

const EXTENSIONS_PER_PAGE = 50

export function ExtensionGrid({ searchTerm, selectedCategory, sortBy }: ExtensionGridProps) {
  const [extensions, setExtensions] = useState<Extension[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const [announcement, setAnnouncement] = useState("")
  const [error, setError] = useState<string | null>(null)
  const loadingRef = useRef(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const lastExtensionRef = useRef<HTMLDivElement | null>(null)
  const requestIdRef = useRef(0)

  // Get sort label for announcements
  const getSortLabel = (sortValue: string) => {
    const sortOptions = [
      { id: "new_and_rising", label: "New & Rising" },
      { id: "download_count_month", label: "Popular This Month" },
      { id: "download_count_total", label: "Most Downloaded" },
      { id: "github_stars", label: "Most Stars" },
      { id: "last_updated", label: "Recently Updated" },
      { id: "name", label: "Name (A-Z)" },
    ]
    return sortOptions.find(option => option.id === sortValue)?.label || "Popular This Month"
  }

  // Function to fetch extensions with pagination and filtering
  const fetchExtensions = useCallback(async (pageIndex: number, requestId: number) => {
    // Allow page 0 to proceed even if another request is running (we'll ignore stale responses)
    if (loadingRef.current && pageIndex > 0) return
    loadingRef.current = true
    setLoading(true)

    const supabase = createClient()
    let query = supabase
      .from("extensions")
      .select("id, name, description, summary, author, category, logo_url, github_stars, download_count_month, download_count_total, last_updated", { count: "exact" })
      .range(pageIndex * EXTENSIONS_PER_PAGE, (pageIndex + 1) * EXTENSIONS_PER_PAGE - 1)

    // Apply category filter on server side
    if (selectedCategory) {
      query = query.eq("category", selectedCategory)
    }

    // Apply search filter on server side
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%,summary.ilike.%${searchTerm}%,author.ilike.%${searchTerm}%`)
    }

    // Apply sorting on server side (use secondary id order for stable pagination)
    switch (sortBy) {
      case "new_and_rising":
        // For up and coming, we want:
        // 1. Recently updated extensions (within last 30 days)
        // 2. Lower download counts and stars (to exclude popular extensions)
        // 3. Order by update date to show newest first
        query = query
          .gte('last_updated', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .lt('download_count_total', 10000) // Exclude very popular extensions
          .lt('github_stars', 100) // Exclude extensions with lots of stars
          .order('last_updated', { ascending: false })
          .order('id', { ascending: true })
        break
      case "download_count_month":
        query = query
          .order("download_count_month", { ascending: false })
          .order('id', { ascending: true })
        break
      case "download_count_total":
        query = query
          .order("download_count_total", { ascending: false })
          .order('id', { ascending: true })
        break
      case "github_stars":
        query = query
          .order("github_stars", { ascending: false })
          .order('id', { ascending: true })
        break
      case "last_updated":
        query = query
          .order("last_updated", { ascending: false })
          .order('id', { ascending: true })
        break
      case "name":
        query = query
          .order("name", { ascending: true })
          .order('id', { ascending: true })
        break
      default:
        query = query
          .order("download_count_month", { ascending: false })
          .order('id', { ascending: true })
    }

    const { data, error, count } = await query

    if (error) {
      console.error("Error fetching extensions:", error)
      // On error, only clear loading if this response is current
      if (requestId === requestIdRef.current) {
        setError("Unable to load extensions. Please try again later.")
        setLoading(false)
      }
      loadingRef.current = false
      return
    }

    // Ignore stale responses
    if (requestId !== requestIdRef.current) {
      loadingRef.current = false
      return
    }

    const newItems = data || []
    if (pageIndex === 0) {
      // Ensure uniqueness on initial page
      const unique = Array.from(new Map(newItems.map(e => [e.name, e])).values())
      setExtensions(unique)
      // Only update total count when filters change (page 0)
      setTotalCount(count || 0)
      
      // Announce search results with sort information
      const totalFound = count || 0
      const sortLabel = getSortLabel(sortBy)
      if (searchTerm) {
        setAnnouncement(`Found ${totalFound} extension${totalFound !== 1 ? 's' : ''} matching "${searchTerm}", sorted by ${sortLabel}`)
      } else {
        setAnnouncement(`Loaded ${totalFound} extension${totalFound !== 1 ? 's' : ''}, sorted by ${sortLabel}`)
      }
    } else {
      // Merge with deduplication by name
      setExtensions(prev => {
        const byName = new Map<string, Extension>(prev.map(e => [e.name, e]))
        for (const item of newItems) {
          byName.set(item.name, item)
        }
        return Array.from(byName.values())
      })
      
      // Announce more items loaded
      if (newItems.length > 0) {
        setAnnouncement(`Loaded ${newItems.length} more extensions`)
      }
    }
    setHasMore(count ? (pageIndex + 1) * EXTENSIONS_PER_PAGE < count : false)

    setLoading(false)
    loadingRef.current = false
  }, [searchTerm, selectedCategory, sortBy])

  // Set up intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current) {
          setPage(prev => prev + 1)
        }
      },
      { 
        threshold: 0,
        rootMargin: '500px 0px' // Start loading when within 500px of the viewport
      }
    )
    observerRef.current = observer
    return () => observer.disconnect()
  }, [hasMore])

  // Observe last extension element
  useEffect(() => {
    const observer = observerRef.current
    const lastElement = lastExtensionRef.current
    if (observer && lastElement) {
      observer.observe(lastElement)
      return () => observer.unobserve(lastElement)
    }
  }, [extensions])

  // Fetch data when filters change
  useEffect(() => {
    setLoading(true)
    setExtensions([]) // Clear current extensions to show full skeleton
    setError(null) // Clear any previous errors
    setPage(0)
    // Bump request id for new filters
    requestIdRef.current += 1

    // Add a small delay to ensure the loading state is visible
    const timer = setTimeout(() => {
      fetchExtensions(0, requestIdRef.current)
    }, 100)

    return () => clearTimeout(timer)
  }, [searchTerm, selectedCategory, sortBy, fetchExtensions])

  // Fetch more data when page changes
  useEffect(() => {
    if (page > 0) {
      fetchExtensions(page, requestIdRef.current)
    }
  }, [page, fetchExtensions])

  return (
    <div>
      <LiveAnnouncer message={announcement} />
      <div className="flex items-center justify-between mb-4 md:mb-6">
        {loading ? (
          <div className="h-7 md:h-6 w-60 md:w-52 bg-muted rounded skeleton-pulse" />
        ) : (
          <h2 
            className="text-xl md:text-lg font-semibold"
            aria-live="polite"
            aria-atomic="true"
          >
            {totalCount} Extension{totalCount !== 1 ? 's' : ''}
            {searchTerm && ` matching "${searchTerm}"`}
          </h2>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
        {extensions.map((extension, index) => (
          <ExtensionCard 
            key={extension.name}
            ref={index === extensions.length - 1 ? lastExtensionRef : null}
            extension={extension}
            showUpdateTime={sortBy === "last_updated"}
            showMonthlyDownloads={sortBy === "download_count_month"}
          />
        ))}
        {loading && Array.from({ length: 15 }).map((_, i) => (
          <div key={`skeleton-${i}`}>
            <SkeletonExtensionCard />
          </div>
        ))}
      </div>
      {error && (
        <div className="text-center py-8 md:py-12">
          <p className="text-muted-foreground text-lg md:text-xl">Oops! Something went wrong</p>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            {error}
          </p>
          <p className="text-muted-foreground text-sm md:text-base mt-4">
            Having trouble? <a 
              href="https://github.com/orbrx/jupyter-marketplace/issues/new/choose" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Let us know
            </a> and we'll help fix it.
          </p>
        </div>
      )}
      {extensions.length === 0 && !loading && !error && (
        <div className="text-center py-8 md:py-12">
          <p className="text-muted-foreground text-lg md:text-xl">No extensions found</p>
          <p className="text-muted-foreground text-sm md:text-base mt-2">
            Try adjusting your search terms or filters
          </p>
          <p className="text-muted-foreground text-sm md:text-base mt-4">
            Missing an extension? <a 
              href="https://github.com/orbrx/jupyter-marketplace/issues/new/choose" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              Let us know
            </a> and we'll add it to the catalog.
          </p>
        </div>
      )}
    </div>
  )
}
