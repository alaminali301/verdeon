'use client'

import { Download } from 'lucide-react'
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
  const ranked = filtered.slice().sort((a, b) => {
    const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 } as const

    return priorityOrder[a.priority] - priorityOrder[b.priority] || b.potentialReductionPct - a.potentialReductionPct
  })
  const combinedPotential = filtered.reduce(
    (sum, recommendation) => sum + recommendation.potentialReductionPct,
    0,
  )
  const topPriority = ranked[0]
  const fastest = ranked.find((recommendation) => recommendation.horizon.includes('0-12') || recommendation.horizon.includes('0-18')) ?? ranked[0]
  const structural = ranked.find((recommendation) => recommendation.priority === 'MEDIUM') ?? ranked[0]

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Recommendations</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            Reduction strategy roadmap by sector
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            The recommendations below are organized as a practical execution plan. Start with fast operational wins, then move into capital and process changes that require longer lead times.
          </p>
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

        <div className="mb-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Combined potential" value={`${combinedPotential}%`} detail="Stacked potential reduction across visible strategies" />
          <StatCard label="Strategies visible" value={String(filtered.length)} detail="Recommendations in the active scope" />
          <StatCard label="Priority focus" value={topPriority?.priority ?? 'N/A'} detail={topPriority?.title ?? 'No recommendation available'} />
          <StatCard label="Fastest win" value={fastest?.horizon ?? 'N/A'} detail={fastest?.owner ?? 'No owner available'} />
        </div>

        <div className="mb-8 grid gap-5 lg:grid-cols-2">
          <div className="rounded-[24px] border border-green-100 bg-white p-6 shadow-card">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Execution order</p>
            <h2 className="mt-3 text-lg font-semibold text-green-900">What to do first</h2>
            <div className="mt-4 space-y-4 text-sm leading-7 text-muted">
              <div className="rounded-[16px] bg-green-50 px-4 py-3">
                <div className="font-medium text-green-900">1. Fast operational fixes</div>
                <div>{fastest?.title ?? 'Choose the shortest-horizon recommendation in the active sector.'}</div>
              </div>
              <div className="rounded-[16px] bg-green-50 px-4 py-3">
                <div className="font-medium text-green-900">2. Largest structural lever</div>
                <div>{structural?.title ?? 'Use the medium-horizon recommendation to lock in durable reductions.'}</div>
              </div>
              <div className="rounded-[16px] bg-green-50 px-4 py-3">
                <div className="font-medium text-green-900">3. Scale the playbook</div>
                <div>Apply the strongest sector pattern to the rest of the facilities in that same sector.</div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-green-100 bg-white p-6 shadow-card">
            <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Interpretation</p>
            <h2 className="mt-3 text-lg font-semibold text-green-900">How to use this page</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <p>Pick a sector to isolate the strategies that actually fit that industrial profile.</p>
              <p>Use the horizon to separate quick operational work from capital-intensive changes.</p>
              <p>Use the owner line to understand who should drive the work internally.</p>
              <p>Use the KPI chips to turn a strategy into something measurable after deployment.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5">
          {ranked.map((recommendation) => (
            <RecommendationCard key={recommendation.id} recommendation={recommendation} />
          ))}
        </div>
      </PageWrapper>
    </main>
  )
}
