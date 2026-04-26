export interface ChartSkeletonProps {
  className?: string
}

export function ChartSkeleton({ className = '' }: ChartSkeletonProps) {
  return (
    <div
      className={[
        'h-full min-h-[200px] w-full animate-pulse rounded-[18px] border border-green-100 bg-green-50',
        className,
      ].join(' ')}
      aria-hidden="true"
    />
  )
}
