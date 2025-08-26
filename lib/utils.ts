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
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRelativeTime(date: string): string {
  const now = new Date()
  const targetDate = new Date(date)
  const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) {
    return 'Updated today'
  } else if (diffInDays === 1) {
    return 'Updated yesterday'
  } else if (diffInDays < 7) {
    return `Updated ${diffInDays} days ago`
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7)
    return `Updated ${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  } else {
    return `Updated ${targetDate.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })}`
  }
}

export function calculateTrendingScore(extension: {
  download_count_day: number;
  download_count_week: number;
  download_count_month: number;
  github_stars: number;
  last_updated: string;
}): number {
  const NOW = Date.now();
  const daysSinceUpdate = (NOW - new Date(extension.last_updated).getTime()) / (1000 * 60 * 60 * 24);
  const updateFactor = Math.max(1, 30 / (daysSinceUpdate + 1)); // Higher for more recent updates

  return (
    (extension.download_count_day * 50) +    // Heavy weight on very recent activity
    (extension.download_count_week * 20) +   // Medium weight on recent activity
    (extension.download_count_month * 5) +   // Light weight on monthly activity
    (extension.github_stars * updateFactor)  // Stars weighted by recency
  );
}
