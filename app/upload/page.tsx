'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import baseDataset from '@/lib/data/epa-data.json'
import type { EpaDataset } from '@/lib/data/types'
import { useEpaStore } from '@/lib/store/useEpaStore'

interface UploadPreview {
  fileName: string
  detectedYear: number | null
  facilityCount: number | null
  sheetName: string
  rowCount: number
  columns: string[]
  sampleRows: Record<string, unknown>[]
}

function normalizeUploadedDataset(
  workbook: XLSX.WorkBook,
  fileName: string,
): { dataset: EpaDataset; preview: UploadPreview } {
  const firstSheetName = workbook.SheetNames[0]
  const firstSheet = workbook.Sheets[firstSheetName]
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet, { defval: null })
  const dataset: EpaDataset = structuredClone(baseDataset) as EpaDataset

  let detectedYear: number | null = null
  let facilityCount: number | null = null

  rows.forEach((row) => {
    const lower = Object.fromEntries(
      Object.entries(row).map(([key, value]) => [key.toLowerCase(), value]),
    ) as Record<string, unknown>

    const year = Number(
      lower.year ?? lower.reporting_year ?? lower.report_year ?? String(lower.date ?? '').match(/\b(20\d{2})\b/)?.[1],
    )
    const total = Number(lower.total_mt ?? lower.total ?? lower.emissions_mt ?? lower.mtco2e)
    const facilities = Number(lower.facilities ?? lower.facility_count ?? lower.count)

    if (!Number.isNaN(year) && dataset.years[String(year)]) {
      detectedYear = year
      if (!Number.isNaN(total) && total > 0) {
        dataset.years[String(year)].total_mt = total
      }
      if (!Number.isNaN(facilities) && facilities > 0) {
        dataset.years[String(year)].facilities = facilities
        facilityCount = facilities
      }
    }
  })

  dataset.meta = {
    ...dataset.meta,
    source: `Uploaded workbook: ${fileName}`,
  }

  return {
    dataset,
    preview: {
      fileName,
      detectedYear,
      facilityCount,
      sheetName: firstSheetName,
      rowCount: rows.length,
      columns: Object.keys(rows[0] ?? {}).slice(0, 8),
      sampleRows: rows.slice(0, 3),
    },
  }
}

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
  const setUploadedData = useEpaStore((state) => state.setUploadedData)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<UploadPreview | null>(null)
  const [uploadedDataset, setDataset] = useState<EpaDataset | null>(null)
  const [status, setStatus] = useState<string>('Drop an EPA workbook, CSV, or zipped export to preview it.')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)

  async function handleFile(file: File) {
    setError(null)
    setProgress(15)
    setStatus('Reading file…')

    if (file.name.toLowerCase().endsWith('.zip')) {
      setProgress(100)
      setError('ZIP preview is not enabled in this build yet. Use the extracted .xlsx or .csv file instead.')
      setStatus('Upload a workbook or CSV to continue.')
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      setProgress(45)
      setStatus('Parsing workbook…')
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      setProgress(80)
      const result = normalizeUploadedDataset(workbook, file.name)
      setPreview(result.preview)
      setDataset(result.dataset)
      setProgress(100)
      setStatus('Preview ready.')
    } catch (uploadError) {
      setProgress(100)
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to parse that file.')
      setStatus('Upload another file to retry.')
    }
  }

  return (
    <main className="px-6 py-12 pt-28">
      <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Upload</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            Bring in your EPA workbook
          </h1>
        </div>

        <Card className="rounded-[24px] p-8">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            onDragOver={(event) => {
              event.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={async (event) => {
              event.preventDefault()
              setIsDragging(false)
              const file = event.dataTransfer.files?.[0]
              if (file) await handleFile(file)
            }}
            className={[
              'flex min-h-[260px] w-full flex-col items-center justify-center rounded-[24px] border-2 border-dashed px-6 py-10 text-center transition-colors',
              isDragging
                ? 'border-green-700 bg-green-50'
                : 'border-green-200 bg-sand-100/40 hover:border-green-400',
            ].join(' ')}
          >
            <span className="text-4xl">📂</span>
            <h2 className="mt-4 text-xl font-semibold text-green-900">Drag and drop EPA files here</h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-muted">
              Accepts `.xlsx`, `.csv`, and zipped workbook exports. Verdeon will inspect the first worksheet and detect year and facility count when available.
            </p>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.csv,.zip"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0]
              if (file) await handleFile(file)
            }}
          />

          <p className="mt-5 text-sm text-muted">{status}</p>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-green-100">
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          {error ? <p className="mt-3 text-sm text-red-700">{error}</p> : null}

          {preview ? (
            <div className="mt-8 rounded-[18px] border border-green-100 bg-green-50 p-5">
              <h3 className="text-base font-semibold text-green-900">Preview</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.08em] text-muted">File</div>
                  <div className="mt-2 text-sm text-green-900">{preview.fileName}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.08em] text-muted">Detected year</div>
                  <div className="mt-2 text-sm text-green-900">{preview.detectedYear ?? 'Not detected'}</div>
                </div>
                <div>
                  <div className="text-xs uppercase tracking-[0.08em] text-muted">Facility count</div>
                  <div className="mt-2 text-sm text-green-900">{preview.facilityCount ?? 'Not detected'}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-muted">Worksheet: {preview.sheetName}</div>
              <div className="mt-2 text-sm text-muted">Rows parsed: {preview.rowCount}</div>
              <div className="mt-2 text-sm text-muted">
                Columns: {preview.columns.join(', ') || 'No headers detected'}
              </div>
              <div className="mt-4 overflow-x-auto rounded-[14px] border border-green-100 bg-white">
                <table className="min-w-full text-left text-xs">
                  <thead className="bg-green-900 text-white">
                    <tr>
                      {preview.columns.map((column) => (
                        <th key={column} className="px-3 py-2 font-medium">
                          {column}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.sampleRows.map((row, index) => (
                      <tr key={index} className="border-t border-green-100">
                        {preview.columns.map((column) => (
                          <td key={column} className="px-3 py-2 text-green-900">
                            {String(row[column] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => {
                    if (uploadedDataset) {
                      setUploadedData(uploadedDataset)
                    }
                    router.push('/dashboard')
                  }}
                >
                  Use this data
                </Button>
              </div>
            </div>
          ) : null}
        </Card>
      </PageWrapper>
    </main>
  )
}
