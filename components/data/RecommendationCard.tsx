import { Badge } from '@/components/ui/Badge'
import type { Recommendation } from '@/lib/data/types'

export interface RecommendationCardProps {
  recommendation: Recommendation
}

const priorityBorder: Record<Recommendation['priority'], string> = {
  HIGH: 'border-red-300',
  MEDIUM: 'border-amber-300',
  LOW: 'border-green-300',
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  return (
    <div
      className={[
        'rounded-[18px] border-l-4 border border-green-100 bg-white p-5 shadow-card',
        priorityBorder[recommendation.priority],
      ].join(' ')}
    >
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant={recommendation.priority}>{recommendation.priority}</Badge>
        <Badge sector={recommendation.sector}>{recommendation.sector}</Badge>
      </div>
      <h3 className="mt-4 text-lg font-semibold text-green-900">{recommendation.title}</h3>
      <p className="mt-3 text-sm leading-7 text-muted">{recommendation.description}</p>
      <div className="mt-4 text-sm font-medium text-green-700">
        Potential reduction: {recommendation.potentialReductionPct}%
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {recommendation.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-green-100 bg-green-50 px-3 py-1 text-xs text-green-800"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  )
}
