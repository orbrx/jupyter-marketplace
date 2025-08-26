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
import { X } from "lucide-react"

const DISMISS_KEY = "jlmp_banner_dismissed"
const DISMISS_AT_KEY = "jlmp_banner_dismissed_at"
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

export function BetaBanner({ feedbackHref = "#" }: { feedbackHref?: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(DISMISS_KEY) === "true"
      const dismissedAtRaw = localStorage.getItem(DISMISS_AT_KEY)
      const dismissedAt = dismissedAtRaw ? Number(dismissedAtRaw) : 0
      const expired = !dismissedAt || Date.now() - dismissedAt > THIRTY_DAYS_MS

      if (dismissed && !expired) {
        setVisible(false)
      } else {
        // Expired or not previously dismissed — show banner again
        setVisible(true)
        if (expired) {
          // Clean up stale state
          localStorage.removeItem(DISMISS_KEY)
          localStorage.removeItem(DISMISS_AT_KEY)
        }
      }
    } catch {
      // If localStorage is unavailable, show the banner by default
      setVisible(true)
    }
  }, [])

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, "true")
      localStorage.setItem(DISMISS_AT_KEY, String(Date.now()))
    } catch {
      // ignore
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="region"
      aria-label="Community beta notice"
      className="w-full bg-amber-50 border-b border-amber-200 text-amber-900 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-200"
    >
      <div className="container mx-auto px-4 md:px-6 h-10 flex items-center justify-between gap-3">
        <p className="flex-1 text-xs md:text-sm leading-tight truncate whitespace-nowrap">
          <span className="font-medium">Community beta</span>
          <span className="sm:hidden">
            {" "}—{" "}
            <a href={feedbackHref} className="underline underline-offset-2 hover:no-underline font-medium">Feedback</a>
          </span>
          <span className="hidden sm:inline">
            . Not affiliated with Project Jupyter. Built by Orange Bricks. <span className="mx-1">→</span>
            <a href={feedbackHref} className="underline underline-offset-2 hover:no-underline font-medium">Feedback</a>
          </span>
        </p>
        <button
          type="button"
          aria-label="Dismiss beta banner"
          onClick={dismiss}
          className="shrink-0 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs md:text-sm text-amber-900/80 hover:text-amber-900 hover:bg-amber-100 dark:text-amber-200/80 dark:hover:text-amber-100 dark:hover:bg-amber-900/40"
        >
          <X className="h-4 w-4" />
          <span>Dismiss</span>
        </button>
      </div>
    </div>
  )
}
