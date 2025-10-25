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

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase'

type BadgeMetric = 'downloads' | 'downloads-month' | 'downloads-week' | 'downloads-day' | 'stars' | 'version'
type BadgeStyle = 'flat' | 'flat-square' | 'for-the-badge'

const COLOR_PRESETS = {
  blue: '#007ec6',
  green: '#4c1',
  orange: '#fe7d37',
  red: '#e05d44',
  yellow: '#dfb317',
  purple: '#9f5ac3',
  pink: '#e91e63',
  teal: '#00d1b2',
  gray: '#555',
  black: '#000',
  brightgreen: '#44cc11',
}

function formatNumber(num: number, format: string = 'international'): string {
  if (format === 'international') {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
    }
  }
  return num.toLocaleString()
}

function getMetricData(extension: any, metric: BadgeMetric): { label: string; value: string; defaultColor: string } {
  switch (metric) {
    case 'downloads':
      return {
        label: 'downloads',
        value: formatNumber(extension.download_count_total || 0),
        defaultColor: COLOR_PRESETS.blue,
      }
    case 'downloads-month':
      return {
        label: 'downloads/month',
        value: formatNumber(extension.download_count_month || 0),
        defaultColor: COLOR_PRESETS.green,
      }
    case 'downloads-week':
      return {
        label: 'downloads/week',
        value: formatNumber(extension.download_count_week || 0),
        defaultColor: COLOR_PRESETS.green,
      }
    case 'downloads-day':
      return {
        label: 'downloads/day',
        value: formatNumber(extension.download_count_day || 0),
        defaultColor: COLOR_PRESETS.green,
      }
    case 'stars':
      return {
        label: 'stars',
        value: formatNumber(extension.github_stars || 0),
        defaultColor: COLOR_PRESETS.yellow,
      }
    case 'version':
      return {
        label: 'version',
        value: extension.version || '0.0.0',
        defaultColor: COLOR_PRESETS.blue,
      }
    default:
      return {
        label: 'downloads',
        value: formatNumber(extension.download_count_total || 0),
        defaultColor: COLOR_PRESETS.blue,
      }
  }
}

function generateSVG(
  label: string,
  value: string,
  leftColor: string = '#555',
  rightColor: string = '#007ec6',
  style: BadgeStyle = 'flat',
  baseUrl: string = ''
): string {
  // Calculate text widths (approximate, 1 char ≈ 6-7 pixels for most fonts)
  const charWidth = 7
  const iconWidth = 20 // Space for icon
  const labelTextWidth = label.length * charWidth + 14
  const labelWidth = iconWidth + labelTextWidth
  const valueWidth = value.length * charWidth + 20
  const totalWidth = labelWidth + valueWidth

  const isFlat = style === 'flat'
  const isSquare = style === 'flat-square'
  const isBadge = style === 'for-the-badge'

  const height = isBadge ? 28 : 20
  const fontSize = isBadge ? 11 : 11
  const radius = isSquare ? 0 : 3
  const textY = isBadge ? 18 : 14

  // Jupyter Marketplace logo positioning
  const logoSize = 14
  const logoX = 3
  const logoY = (height - logoSize) / 2
  const logoUrl = `${baseUrl}/jupyter-marketplace-logo.png`

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalWidth}" height="${height}" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="${height}" rx="${radius}" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="${height}" fill="${leftColor}"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="${height}" fill="${rightColor}"/>
    ${isFlat ? `<rect width="${totalWidth}" height="${height}" fill="url(#s)"/>` : ''}
    <image x="${logoX}" y="${logoY}" width="${logoSize}" height="${logoSize}" xlink:href="${logoUrl}"/>
    <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="${fontSize}">
      <text x="${iconWidth + labelTextWidth / 2}" y="${textY}" fill="#010101" fill-opacity=".3">${label}</text>
      <text x="${iconWidth + labelTextWidth / 2}" y="${textY - 1}" fill="#fff">${label}</text>
      <text x="${labelWidth + valueWidth / 2}" y="${textY}" fill="#010101" fill-opacity=".3">${value}</text>
      <text x="${labelWidth + valueWidth / 2}" y="${textY - 1}" fill="#fff">${value}</text>
    </g>
  </g>
</svg>`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const searchParams = request.nextUrl.searchParams
    
    // Get base URL for absolute logo reference
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`
    
    // Get query parameters
    const metric = (searchParams.get('metric') || 'downloads') as BadgeMetric
    const leftColor = searchParams.get('leftColor') || '#555'
    const rightColor = searchParams.get('rightColor') || null
    const style = (searchParams.get('style') || 'flat') as BadgeStyle
    const format = searchParams.get('format') || 'international'
    const label = searchParams.get('label') || null

    // Fetch extension data
    const supabase = createClient()
    const { data: extension, error } = await supabase
      .from('extensions')
      .select('*')
      .eq('name', name)
      .single()

    if (error || !extension) {
      // Return error badge
      const errorSvg = generateSVG('extension', 'not found', '#555', '#e05d44', style, baseUrl)
      return new NextResponse(errorSvg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
        },
      })
    }

    // Get metric data
    const metricData = getMetricData(extension, metric)
    const finalLabel = label || metricData.label
    const finalRightColor = rightColor || metricData.defaultColor

    // Generate SVG badge
    const svg = generateSVG(finalLabel, metricData.value, leftColor, finalRightColor, style, baseUrl)

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error('Badge generation error:', error)
    const errorSvg = generateSVG('badge', 'error', '#555', '#e05d44', 'flat', '')
    return new NextResponse(errorSvg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=300',
      },
    })
  }
}
