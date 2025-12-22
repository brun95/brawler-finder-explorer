import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-100 pt-16">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Section Skeleton */}
                <div className="text-center mb-16">
                    <Skeleton className="h-16 w-96 mx-auto mb-6" />
                    <Skeleton className="h-6 w-2/3 mx-auto mb-4" />
                    <Skeleton className="h-12 w-48 mx-auto mb-8 rounded-lg" />
                </div>

                {/* Content Section */}
                <div className="text-center mb-12">
                    <Skeleton className="h-8 w-64 mx-auto mb-4" />
                    <Skeleton className="h-5 w-48 mx-auto" />
                </div>

                {/* Grid Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="bg-gray-200 rounded-lg p-6 border border-gray-300">
                            <Skeleton className="w-full h-40 rounded-lg mb-4" />
                            <Skeleton className="h-6 w-3/4 mb-2" />
                            <Skeleton className="h-4 w-1/2 mb-3" />
                            <div className="flex justify-between">
                                <Skeleton className="h-5 w-20" />
                                <Skeleton className="h-5 w-16" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}