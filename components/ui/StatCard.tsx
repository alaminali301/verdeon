import { Card } from '@/components/ui/Card'

export interface StatCardProps {
  label: string
  value: string
  source?: string
}

export function StatCard({ label, value, source }: StatCardProps) {
  return (
    <Card>
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-green-600">{label}</p>
      <p className="mt-3 font-display text-4xl text-green-950">{value}</p>
      {source ? <p className="mt-2 text-sm text-muted">{source}</p> : null}
    </Card>
  )
}
