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

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check } from "lucide-react"

const METRIC_OPTIONS = [
  { label: 'Total Downloads', value: 'downloads' },
  { label: 'Downloads (Month)', value: 'downloads-month' },
  { label: 'Downloads (Week)', value: 'downloads-week' },
  { label: 'Downloads (Day)', value: 'downloads-day' },
  { label: 'GitHub Stars', value: 'stars' },
  { label: 'Version', value: 'version' },
]

// Marketplace brand colors
const LEFT_COLOR = '#555' // Gray
const RIGHT_COLOR = '#F37620' // Jupyter Orange
const STYLE = 'flat' // Fixed flat style

interface BadgeConfiguratorProps {
  extensionName: string
}

export function BadgeConfigurator({ extensionName }: BadgeConfiguratorProps) {
  const [metric, setMetric] = useState('downloads')
  const [format, setFormat] = useState<'markdown' | 'html' | 'url'>('markdown')
  const [copied, setCopied] = useState(false)

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const badgeUrl = `${baseUrl}/api/badge/${extensionName}?metric=${metric}&leftColor=${encodeURIComponent(LEFT_COLOR)}&rightColor=${encodeURIComponent(RIGHT_COLOR)}&style=${STYLE}`
  const extensionUrl = `${baseUrl}/extensions/${extensionName}`

  const getCode = () => {
    switch (format) {
      case 'markdown':
        return `[![${extensionName}](${badgeUrl})](${extensionUrl})`
      case 'html':
        return `<a href="${extensionUrl}"><img src="${badgeUrl}" alt="${extensionName}"></a>`
      case 'url':
        return badgeUrl
      default:
        return badgeUrl
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(getCode())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Badge Generator</CardTitle>
        <CardDescription>
          Create a custom badge for your extension to display on GitHub, documentation, or website
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Preview</label>
          <div className="flex items-center justify-center p-6 bg-muted rounded-lg">
            <img src={badgeUrl} alt="Badge Preview" />
          </div>
        </div>

        {/* Metric Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Metric</label>
          <div className="flex flex-wrap gap-2">
            {METRIC_OPTIONS.map((option) => (
              <Badge
                key={option.value}
                variant={metric === option.value ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary/90"
                onClick={() => setMetric(option.value)}
              >
                {option.label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Code Format</label>
          <div className="flex gap-2">
            {['markdown', 'html', 'url'].map((f) => (
              <Button
                key={f}
                variant={format === f ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFormat(f as typeof format)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Code Output */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Code</label>
          <div className="relative">
            <pre className="p-4 bg-muted rounded-lg overflow-x-auto text-sm">
              <code>{getCode()}</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleCopy}
              className="absolute top-2 right-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
