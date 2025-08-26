import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

interface MarketplaceFiltersProps {
  sortBy: string
  onSortChange: (sortBy: string) => void
}

export function MarketplaceFilters({ 
  sortBy, 
  onSortChange,
}: MarketplaceFiltersProps) {

  const sortOptions = [
    { id: "up_and_coming", label: "New & Rising" },
    { id: "download_count_month", label: "Popular This Month" },
    { id: "download_count_total", label: "Most Downloaded" },
    { id: "github_stars", label: "Most Stars" },
    { id: "last_updated", label: "Recently Updated" },
    { id: "name", label: "Name (A-Z)" },
  ]

  return (
    <div className="flex flex-col lg:space-y-6 space-y-4">
      {/* Mobile: Show filters in a horizontal layout */}
      <div className="flex flex-col sm:flex-row gap-4 lg:flex-col lg:space-y-6 lg:gap-0">
        <Card className="flex-1 !gap-3">
          <CardHeader className="pb-2 !gap-0 !grid-rows-[auto]">
            <CardTitle className="text-base font-medium lg:text-sm">Sort By</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 lg:space-y-3">
            {sortOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-3">
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

