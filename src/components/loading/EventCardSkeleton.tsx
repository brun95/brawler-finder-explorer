import { Skeleton } from "@/components/ui/skeleton"

export function EventCardSkeleton() {
    return (
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <Skeleton className="w-full h-32 rounded-lg mb-4" />
            <Skeleton className="h-5 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-3" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-4 w-16" />
            </div>
        </div>
    )
}

export function EventsSectionSkeleton() {
    return (
        <div className="space-y-12">
            <div>
                <Skeleton className="h-6 w-40 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))}
                </div>
            </div>
            <div>
                <Skeleton className="h-6 w-48 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <EventCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        </div>
    )
}