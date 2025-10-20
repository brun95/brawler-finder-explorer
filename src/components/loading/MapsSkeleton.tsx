'use client'

import { Skeleton } from "@/components/ui/skeleton";

export function MapsSkeleton() {
  return (
    <div className="space-y-12">
      {/* Game mode sections */}
      {[...Array(3)].map((_, sectionIndex) => (
        <section key={sectionIndex} className="space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-5 w-20" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="w-full aspect-[3/4] rounded-lg" />
                <Skeleton className="h-4 w-3/4 mx-auto" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
