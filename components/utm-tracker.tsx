"use client"

import { useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { track } from "@vercel/analytics"

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const

export function UtmTracker() {
  const searchParams = useSearchParams()
  const hasTrackedRef = useRef(false)

  useEffect(() => {
    if (hasTrackedRef.current) {
      return
    }

    const utmData = Object.fromEntries(
      UTM_KEYS.flatMap((key) => {
        const value = searchParams.get(key)
        return value ? [[key, value]] : []
      })
    )

    if (Object.keys(utmData).length === 0) {
      return
    }

    hasTrackedRef.current = true
    track("Campaign Visit", utmData)
  }, [searchParams])

  return null
}
