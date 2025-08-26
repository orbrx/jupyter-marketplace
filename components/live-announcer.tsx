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

interface LiveAnnouncerProps {
  message: string
  priority?: "polite" | "assertive"
}

export function LiveAnnouncer({ message, priority = "polite" }: LiveAnnouncerProps) {
  const [announcement, setAnnouncement] = useState("")

  useEffect(() => {
    if (message) {
      // Clear first to ensure the message is announced even if it's the same
      setAnnouncement("")
      // Use a small delay to ensure the screen reader picks up the change
      const timer = setTimeout(() => setAnnouncement(message), 100)
      return () => clearTimeout(timer)
    }
  }, [message])

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {announcement}
    </div>
  )
}
