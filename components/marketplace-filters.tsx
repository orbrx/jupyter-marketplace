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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface MarketplaceFiltersProps {
  sortBy: string
  onSortChange: (sortBy: string) => void
  selectedVersion: string
  onVersionChange: (version: string) => void
}

export function MarketplaceFilters({ 
  sortBy, 
  onSortChange,
  selectedVersion,
  onVersionChange,
}: MarketplaceFiltersProps) {

  const sortOptions = [
    { id: "new_and_rising", label: "New & Rising" },
    { id: "download_count_month", label: "Popular This Month" },
    { id: "download_count_total", label: "Most Downloaded" },
    { id: "github_stars", label: "Most Stars" },
    { id: "last_updated", label: "Recently Updated" },
    { id: "name", label: "Name (A-Z)" },
  ]

  const versionOptions = [
    { id: "4", label: "JupyterLab 4" },
    { id: "3", label: "JupyterLab 3" },
    { id: "all", label: "All Versions" },
  ]

  return (
    <div className="flex flex-col lg:space-y-6 space-y-4">
      {/* Mobile: Show filters in a horizontal layout */}
      <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:space-y-6 lg:gap-0">
        <Card className="flex-1 !gap-3">
          <CardContent className="space-y-4 lg:space-y-3 pt-6">
            <fieldset>
              <legend className="text-base font-medium lg:text-sm mb-4 lg:mb-3">JupyterLab Version</legend>
              {versionOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 mb-4 lg:mb-3 last:mb-0">
                  <input
                    type="radio"
                    id={`version-${option.id}`}
                    name="version"
                    checked={selectedVersion === option.id}
                    onChange={() => onVersionChange(option.id)}
                    className="w-5 h-5 lg:w-4 lg:h-4 text-primary"
                  />
                  <Label htmlFor={`version-${option.id}`} className="text-base lg:text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </fieldset>
          </CardContent>
        </Card>
        <Card className="flex-1 !gap-3">
          <CardContent className="space-y-4 lg:space-y-3 pt-6">
            <fieldset>
              <legend className="text-base font-medium lg:text-sm mb-4 lg:mb-3">Sort By</legend>
              {sortOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 mb-4 lg:mb-3 last:mb-0">
                  <input
                    type="radio"
                    id={option.id}
                    name="sort"
                    checked={sortBy === option.id}
                    onChange={() => onSortChange(option.id)}
                    className="w-5 h-5 lg:w-4 lg:h-4 text-primary"
                  />
                  <Label htmlFor={option.id} className="text-base lg:text-sm cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </fieldset>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

