export function formatMt(value: number) {
  return `${Math.round(value).toLocaleString()} Mt`
}

export function formatPct(value: number) {
  return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`
}

export function formatFacilities(value: number) {
  return `${value.toLocaleString()} facilities`
}
