export function formatMt(value: number) {
  return `${value.toLocaleString()} Mt`
}

export function formatPct(value: number) {
  return `${value.toFixed(1)}%`
}

export function formatFacilities(value: number) {
  return value.toLocaleString()
}
