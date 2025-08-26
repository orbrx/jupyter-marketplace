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
