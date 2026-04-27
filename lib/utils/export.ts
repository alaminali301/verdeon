export function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  })
  downloadBlob(filename, blob)
}

export function downloadCsv(
  filename: string,
  columns: string[],
  rows: Array<Array<string | number>>,
) {
  const lines = [columns, ...rows].map((row) =>
    row
      .map((cell) => {
        const value = String(cell)
        return /[",\n]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value
      })
      .join(','),
  )

  const blob = new Blob([lines.join('\n')], {
    type: 'text/csv;charset=utf-8',
  })

  downloadBlob(filename, blob)
}

function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  URL.revokeObjectURL(url)
}
