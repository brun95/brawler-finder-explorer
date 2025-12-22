import { Skeleton } from "@/components/ui/skeleton"

export function BrawlerCardSkeleton() {
    return (
        <div className="bg-gray-200 rounded-lg p-4 border border-gray-300">
            <Skeleton className="w-16 h-16 rounded-lg mx-auto mb-3" />
            <Skeleton className="h-5 w-3/4 mx-auto mb-2" />
            <Skeleton className="h-4 w-1/2 mx-auto mb-3" />
            <div className="flex gap-1 justify-center">
                <Skeleton className="h-6 w-12 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
            </div>
        </div>
    )
}

export function BrawlerGridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <BrawlerCardSkeleton key={i} />
            ))}
        </div>
    )
}