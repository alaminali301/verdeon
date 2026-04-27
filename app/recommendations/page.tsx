'use client'

import { Download } from 'lucide-react'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { RecommendationCard } from '@/components/data/RecommendationCard'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/ui/StatCard'
import { sectors } from '@/constants/sectors'
import { recommendations } from '@/lib/data/recommendations'
import { useEpaStore } from '@/lib/store/useEpaStore'
import { downloadJson } from '@/lib/utils/export'

export default function RecommendationsPage() {
  const activeSector = useEpaStore((state) => state.activeSector)
  const setActiveSector = useEpaStore((state) => state.setActiveSector)
  const filtered = activeSector
    ? recommendations.filter((recommendation) => recommendation.sector === activeSector)
    : recommendations
  const combinedPotential = filtered.reduce(
    (sum, recommendation) => sum + recommendation.potentialReductionPct,
    0,
  )

  return (
    <RequireAuth>
      <main className="px-6 py-12 pt-28">
        <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Recommendations</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            Reduction strategies by sector
          </h1>
          <div className="mt-5">
            <Button
              variant="outline"
              onClick={() =>
                downloadJson(`verdeon-recommendations-${activeSector ?? 'all'}.json`, {
                  activeSector,
                  recommendations: filtered,
                  combinedPotential,
                })
              }
            >
              <Download size={14} />
              Export recommendations
            </Button>
          </div>
        </div>

        <div className="mb-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveSector(null)}
            className={[
              'rounded-full border px-4 py-2 text-sm transition-colors',
              activeSector === null
                ? 'border-green-900 bg-green-900 text-white'
                : 'border-green-200 bg-white text-green-900 hover:bg-green-50',
            ].join(' ')}
          >
            All sectors
          </button>
          {sectors.map((sector) => (
            <button
              key={sector.name}
              type="button"
              onClick={() => setActiveSector(activeSector === sector.name ? null : sector.name)}
              className={[
                'rounded-full border px-4 py-2 text-sm transition-colors',
                activeSector === sector.name
                  ? 'border-green-900 bg-green-900 text-white'
                  : 'border-green-200 bg-white text-green-900 hover:bg-green-50',
              ].join(' ')}
            >
              {sector.name}
            </button>
          ))}
        </div>

        <div className="mb-8 grid gap-5 md:grid-cols-2">
          <StatCard label="Combined potential" value={`${combinedPotential}%`} detail="Stacked potential reduction across visible strategies" />
          <StatCard label="Strategies visible" value={String(filtered.length)} detail="Recommendations in the active scope" />
        </div>

        <div className="grid gap-5">
          {filtered.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
        </PageWrapper>
      </main>
    </RequireAuth>
  )
}
