import { Card, CardContent, CardHeader } from "@/components/ui/card"

export type SkeletonExtensionCardProps = {
  borderless?: boolean
}

export function SkeletonExtensionCard({ borderless = false }: SkeletonExtensionCardProps) {
  return (
    <Card
      className={`h-[280px] md:h-[250px] flex flex-col min-h-0 !gap-3 !py-3 md:!py-3 relative overflow-hidden skeleton-pulse ${borderless ? 'no-shadow border-0' : ''}`}
    >
      <CardHeader className="pb-0 pt-2 !px-3 md:!px-3 md:pt-2 !flex !flex-col !items-center !text-center gap-2">
        <div className="w-14 h-14 md:w-12 md:h-12 bg-muted rounded-lg" />
        <div className="w-3/4 h-4 bg-muted rounded" />
        <div className="w-1/2 h-3 bg-muted rounded" />
      </CardHeader>
      <CardContent className="flex-1 pt-1 !px-3 md:!px-3 flex flex-col min-h-0 gap-3 justify-between">
        <div className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full h-3 bg-muted rounded" />
          <div className="w-11/12 h-3 bg-muted rounded" />
          <div className="w-4/5 h-3 bg-muted rounded" />
        </div>
        <div className="space-y-2 mt-auto">
          <div className="flex items-center justify-center space-x-2 md:space-x-1.5">
            <div className="w-16 h-3 bg-muted rounded" />
            <div className="w-12 h-3 bg-muted rounded" />
          </div>
          <div className="flex items-center justify-center">
            <div className="w-20 h-2 bg-muted rounded mb-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SkeletonExtensionCard

