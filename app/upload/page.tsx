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

  async function handleFile(file: File) {
    setStatus('Parsing file…')
    const arrayBuffer = await file.arrayBuffer()
    const workbook = XLSX.read(arrayBuffer, { type: 'array' })
    const result = normalizeUploadedDataset(workbook, file.name)
    setPreview(result.preview)
    setDataset(result.dataset)
    setStatus('Preview ready.')
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
