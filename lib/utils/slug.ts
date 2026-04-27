export function slugifyLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function findLabelBySlug(items: string[], slug: string) {
  return items.find((item) => slugifyLabel(item) === slug) ?? null
}
