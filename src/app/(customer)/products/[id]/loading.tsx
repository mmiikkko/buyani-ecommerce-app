import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back Button Skeleton */}
      <Skeleton className="mb-6 h-8 w-20" />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image Skeleton */}
          <Skeleton className="aspect-square w-full rounded-2xl" />

          {/* Thumbnail Gallery Skeleton */}
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-20 flex-shrink-0 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          {/* Category */}
          <Skeleton className="h-4 w-24" />

          {/* Product Name */}
          <Skeleton className="h-10 w-3/4" />

          {/* Rating */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>

          {/* Price */}
          <Skeleton className="h-12 w-32" />

          <Skeleton className="h-px w-full" />

          {/* Stock Status */}
          <Skeleton className="h-6 w-40" />

          {/* Quantity Selector */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-32 rounded-lg" />
              <div className="space-y-1">
                <Skeleton className="h-4 w-10" />
                <Skeleton className="h-7 w-20" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Skeleton className="h-11 flex-1 rounded-md" />
            <Skeleton className="h-11 flex-1 rounded-md" />
          </div>

          <Skeleton className="h-px w-full" />

          {/* Shop Info Skeleton */}
          <Skeleton className="h-20 w-full rounded-xl" />

          {/* Description Skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}
