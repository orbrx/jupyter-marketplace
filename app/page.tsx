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

import { useState, useEffect } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { MarketplaceSearch } from "@/components/marketplace-search"
import { ExtensionGrid } from "@/components/extension-grid"
import { MarketplaceFilters } from "@/components/marketplace-filters"
import { SkeletonExtensionCard } from "@/components/skeleton-card"
import { BackToTop } from "@/components/back-to-top"


export default function MarketplacePage() {
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<string>("new_and_rising")
  const [selectedVersion, setSelectedVersion] = useState<string>("all")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Load preferences once on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlSort = searchParams.get("sort")
      const urlQ = searchParams.get("q")
      const urlVersion = searchParams.get("version")
      const savedSortBy = localStorage.getItem("sortBy")
      const savedVersion = localStorage.getItem("selectedVersion")

      // Prefer URL params; fall back to localStorage; then defaults
      if (urlSort) setSortBy(urlSort)
      else if (savedSortBy) setSortBy(savedSortBy)

      if (urlVersion) setSelectedVersion(urlVersion)
      else if (savedVersion) setSelectedVersion(savedVersion)

      if (urlQ) setSearchTerm(urlQ)

      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounce search term to avoid rapid queries
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300)
    return () => clearTimeout(t)
  }, [searchTerm])

  useEffect(() => {
    localStorage.setItem("sortBy", sortBy)
    localStorage.setItem("selectedVersion", selectedVersion)
    // Scroll to top when filter changes (but not on initial load)
    if (typeof window !== 'undefined' && !isLoading) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }, [sortBy, selectedVersion, isLoading])

  // Keep URL in sync with current filters (avoid pushing history on every change)
  useEffect(() => {
    if (!pathname) return
    const params = new URLSearchParams()
    if (debouncedSearch) params.set("q", debouncedSearch)
    if (sortBy) params.set("sort", sortBy)
    if (selectedVersion) params.set("version", selectedVersion)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }, [debouncedSearch, sortBy, selectedVersion, pathname, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <main className="container mx-auto px-4 md:px-6 py-4 md:py-6">
          <div>
            {/* Search bar skeleton */}
            <div className="h-10 bg-muted rounded-lg w-full max-w-xl mb-6 animate-pulse"></div>
            <div className="flex flex-col lg:flex-row gap-6">
              <aside className="w-full lg:w-64 lg:flex-shrink-0">
                <div className="h-[400px] bg-muted rounded-lg animate-pulse"></div>
              </aside>
              <div className="flex-1">
                {/* Caption skeleton matching \"XYZ Extensions\" */}
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <div className="h-7 md:h-6 w-60 md:w-52 bg-muted rounded animate-pulse" />
                </div>
                {/* Card skeletons matching ExtensionCard layout */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={`initial-skel-${i}`}>
                      <SkeletonExtensionCard borderless />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40">
        <div className="container mx-auto px-4 md:px-6 py-4">
          <MarketplaceSearch 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </div>
      </div>

      <main id="main-content" className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sticky Filters Sidebar */}
          <aside className="w-full lg:w-64 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-24">
              <MarketplaceFilters 
                sortBy={sortBy}
                onSortChange={setSortBy}
                selectedVersion={selectedVersion}
                onVersionChange={setSelectedVersion}
              />
            </div>
          </aside>
          <div className="flex-1">
            <ExtensionGrid 
              searchTerm={debouncedSearch}
              selectedCategory=""
              sortBy={sortBy}
              selectedVersion={selectedVersion}
            />
          </div>
        </div>
      </main>
      <BackToTop />
    </div>
  )
}

