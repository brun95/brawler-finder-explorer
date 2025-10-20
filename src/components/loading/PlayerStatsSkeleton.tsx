import { Skeleton } from "@/components/ui/skeleton"

export function PlayerStatsSkeleton() {
    return (
        <div className="min-h-screen bg-gray-900 pt-16">
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Player Header */}
                <div className="bg-gray-800 rounded-lg p-6 mb-6 border border-gray-700">
                    <div className="flex items-center gap-4">
                        <Skeleton className="w-20 h-20 rounded-full" />
                        <div className="flex-1">
                            <Skeleton className="h-8 w-48 mb-2" />
                            <Skeleton className="h-5 w-32 mb-1" />
                            <Skeleton className="h-5 w-40" />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                            <Skeleton className="h-6 w-24 mb-3" />
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-4 w-32" />
                        </div>
                    ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <Skeleton className="h-6 w-40 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                        <Skeleton className="h-6 w-32 mb-4" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>

                {/* Brawlers Grid */}
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <Skeleton className="h-6 w-32 mb-4" />
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="text-center">
                                <Skeleton className="w-16 h-16 rounded-lg mx-auto mb-2" />
                                <Skeleton className="h-4 w-12 mx-auto mb-1" />
                                <Skeleton className="h-3 w-8 mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}