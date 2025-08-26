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
import { createClient } from "@/lib/supabase"

interface DataFreshnessBadgeProps {
  className?: string
}

export function DataFreshnessBadge({ className = "" }: DataFreshnessBadgeProps) {
  const [lastUpdate, setLastUpdate] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDataFreshness() {
      try {
        const supabase = createClient()
        
        // Get most recent update timestamp
        const { data, error } = await supabase
          .from("extensions")
          .select("last_updated")
          .order("last_updated", { ascending: false })
          .limit(1)

        if (error) {
          console.error("Error fetching data freshness:", error)
          setLoading(false)
          return
        }
        
        if (data && data.length > 0 && data[0].last_updated) {
          // Format the timestamp to UTC
          const date = new Date(data[0].last_updated)
          const formatted = date.toISOString().slice(0, 16).replace('T', ' ') + ' UTC'
          setLastUpdate(formatted)
        }
        
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data freshness:", error)
        setLoading(false)
      }
    }

    fetchDataFreshness()
  }, [])

  if (loading) {
    return (
      <div className={`text-xs text-muted-foreground ${className}`}>
        <div className="h-4 w-32 bg-muted rounded animate-pulse"></div>
      </div>
    )
  }

  if (!lastUpdate) {
    return null
  }

  return (
    <div className={`text-xs text-muted-foreground ${className}`}>
      Last update {lastUpdate}
    </div>
  )
}
