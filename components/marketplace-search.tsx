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
import { useRef } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"

interface MarketplaceSearchProps {
  searchTerm: string
  onSearchChange: (term: string) => void
}

export function MarketplaceSearch({ searchTerm, onSearchChange }: MarketplaceSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div className="flex items-center space-x-4">
      <div className="relative flex-1 max-w-2xl">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 md:w-4 md:h-4" />
        <Input
          ref={inputRef}
          placeholder="Search JupyterLab extensions..."
          className="pl-12 md:pl-10 pr-12 h-14 md:h-12 text-lg md:text-base rounded-lg border-foreground/30 dark:border-foreground/30 hover:border-foreground/50 focus-visible:border-orange-600 dark:focus-visible:border-orange-400 focus-visible:ring-orange-500/25"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchTerm && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onSearchChange("")
              inputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-orange-600 dark:hover:text-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/30"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}
