'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { PageWrapper } from '@/components/layout/PageWrapper'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { normalizeUploadedDataset, type UploadPreview } from '@/lib/data/upload'
import type { EpaDataset } from '@/lib/data/types'
import { useEpaStore } from '@/lib/store/useEpaStore'

export default function UploadPage() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const router = useRouter()
  const setUploadedData = useEpaStore((state) => state.setUploadedData)
  const setActiveYear = useEpaStore((state) => state.setActiveYear)
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<UploadPreview | null>(null)
  const [uploadedDataset, setDataset] = useState<EpaDataset | null>(null)
  const [status, setStatus] = useState<string>('Drop an EPA workbook or CSV to build a preview dataset.')
  const [error, setError] = useState<string | null>(null)
  const [progress, setProgress] = useState<number>(0)

  async function handleFile(file: File) {
    setError(null)
    setProgress(15)
    setStatus('Reading file…')

    if (file.name.toLowerCase().endsWith('.zip')) {
      setProgress(100)
      setError('ZIP files are not supported in this build yet. Use the extracted .xlsx or .csv file instead.')
      setStatus('Upload a workbook or CSV to continue.')
      return
    }

    try {
      const arrayBuffer = await file.arrayBuffer()
      setProgress(45)
      setStatus('Parsing workbook and aggregating records…')
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      setProgress(80)
      const result = normalizeUploadedDataset(workbook, file.name)
      setPreview(result.preview)
      setDataset(result.dataset)
      setActiveYear(result.preview.detectedYears.at(-1) ?? 2023)
      setProgress(100)
      setStatus('Preview dataset ready.')
    } catch (uploadError) {
      setProgress(100)
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to parse that file.')
      setStatus('Upload another file to retry.')
    }
  }

  return (
    <RequireAuth>
      <main className="px-6 py-12 pt-28">
        <PageWrapper>
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold uppercase tracking-[0.1em] text-green-600">Upload</p>
          <h1 className="mt-3 font-display text-[clamp(2.2rem,4vw,3.4rem)] tracking-[-0.03em] text-green-950">
            Bring in your EPA workbook
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-muted">
            Verdeon can rebuild totals, sector mix, state rankings, and facility rankings when your file includes recognizable year and emissions columns.
          </p>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.15fr_.85fr]">
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
              Accepts `.xlsx` and `.csv` files. Verdeon reads the first worksheet, maps year, emissions, state, sector, and facility columns when present, then rebuilds dashboard totals, rankings, and charts from that upload.
            </p>
          </button>

          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.csv"
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
                <div className="text-xs uppercase tracking-[0.08em] text-muted">Years covered</div>
                <div className="mt-2 text-sm text-green-900">
                  {preview.detectedYears.length ? `${preview.detectedYears[0]}–${preview.detectedYears.at(-1)}` : 'Not detected'}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.08em] text-muted">Facility count</div>
                <div className="mt-2 text-sm text-green-900">{preview.facilityCount ?? 'Not detected'}</div>
              </div>
            </div>
              <div className="mt-4 text-sm text-muted">Worksheet: {preview.sheetName}</div>
              <div className="mt-2 text-sm text-muted">Rows parsed: {preview.rowCount}</div>
              <div className="mt-2 text-sm text-muted">Rows mapped into dataset: {preview.parsedRows}</div>
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
        <div className="space-y-6">
          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">Supported columns</h2>
            <p className="mt-3 text-sm leading-7 text-muted">
              Verdeon looks for common EPA-style column names. The more of these you include, the richer the reconstructed dataset becomes.
            </p>
            <div className="mt-5 space-y-4">
              <div>
                <div className="text-sm font-medium text-green-900">Required to map rows</div>
                <div className="mt-2 text-sm text-muted">`Reporting_Year` or `Year`, plus `Emissions_MT`, `Total_MT`, or similar emissions columns.</div>
              </div>
              <div>
                <div className="text-sm font-medium text-green-900">Recommended for rankings</div>
                <div className="mt-2 text-sm text-muted">`Facility_Name`, `State`, and `Sector`.</div>
              </div>
              <div>
                <div className="text-sm font-medium text-green-900">Recognized examples</div>
                <div className="mt-2 text-sm text-muted">`Reporting_Year`, `Facility_Name`, `State`, `Sector`, `Emissions_MT`.</div>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/sample-upload.csv" download>
                <Button variant="outline">Download sample CSV</Button>
              </a>
              <Link href="/methodology">
                <Button variant="outline">View methodology</Button>
              </Link>
            </div>
          </Card>

          <Card className="rounded-[24px] p-6 shadow-card">
            <h2 className="text-lg font-semibold text-green-900">How uploaded data is used</h2>
            <div className="mt-4 space-y-3 text-sm leading-7 text-muted">
              <p>1. Verdeon reads the first worksheet in your file.</p>
              <p>2. Matching rows are grouped by reporting year.</p>
              <p>3. State, sector, and facility totals are aggregated from those rows.</p>
              <p>4. The dashboard, explorer, facilities, and states pages use the rebuilt dataset until you refresh or upload another file.</p>
            </div>
          </Card>
        </div>
        </div>
        </PageWrapper>
      </main>
    </RequireAuth>
  )
}
