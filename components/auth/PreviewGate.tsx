interface PreviewGateProps {
  title?: string
  description?: string
  compact?: boolean
}

export function PreviewGate({
  title = 'You are viewing a live preview',
  description = 'Explore the public preview, compare views, and export data snapshots.',
  compact = false,
}: PreviewGateProps) {
  void title
  void description
  void compact
  return null
}
