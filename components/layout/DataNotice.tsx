'use client'

import { useSyncExternalStore } from 'react'
import Link from 'next/link'

const NOTICE_STORAGE_KEY = 'verdeon-data-notice-compact'

function getNoticeSnapshot() {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(NOTICE_STORAGE_KEY) === '1'
}

function subscribeToNoticeChange(callback: () => void) {
  if (typeof window === 'undefined') {
    return () => {}
  }

  const onStorage = () => callback()
  const onNoticeChange = () => callback()

  window.addEventListener('storage', onStorage)
  window.addEventListener('verdeon-data-notice-change', onNoticeChange)

  return () => {
    window.removeEventListener('storage', onStorage)
    window.removeEventListener('verdeon-data-notice-change', onNoticeChange)
  }
}

export function DataNotice() {
  const isCompact = useSyncExternalStore(subscribeToNoticeChange, getNoticeSnapshot, () => false)

  return (
    <div className="sticky top-[4.5rem] z-[45] mx-auto w-full max-w-[1120px] px-3 pt-3 md:top-[5rem]">
      <div className="rounded-[18px] border border-amber-300 bg-amber-50/95 px-4 py-3 text-[0.82rem] leading-6 text-amber-950 shadow-lift backdrop-blur-md">
        {isCompact ? (
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p className="text-[0.78rem]">
              <span className="font-semibold">Data accuracy notice:</span> Public EPA data may contain errors. Verify important figures against the source.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[0.78rem] font-medium">
              <Link href="/methodology" className="underline-offset-4 hover:underline">
                Read methodology
              </Link>
              <Link href="/contact" className="underline-offset-4 hover:underline">
                Report a correction
              </Link>
              <button
                type="button"
                onClick={() => {
                  window.localStorage.setItem(NOTICE_STORAGE_KEY, '0')
                  window.dispatchEvent(new Event('verdeon-data-notice-change'))
                }}
                className="rounded-full border border-amber-300 bg-white px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-amber-950"
              >
                Show details
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <p>
              <span className="font-semibold">Data accuracy notice:</span> Verdeon visualizes public EPA data and may contain omissions, delays, or interpretation errors. This tool is for research and informational purposes only and should not be used for regulatory compliance or official reporting. Verify all data against original EPA sources.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-[0.78rem] font-medium">
              <Link href="/methodology" className="underline-offset-4 hover:underline">
                Read methodology
              </Link>
              <Link href="/contact" className="underline-offset-4 hover:underline">
                Report a correction
              </Link>
              <button
                type="button"
                onClick={() => {
                  window.localStorage.setItem(NOTICE_STORAGE_KEY, '1')
                  window.dispatchEvent(new Event('verdeon-data-notice-change'))
                }}
                className="rounded-full border border-amber-300 bg-white px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-amber-950"
              >
                Compact
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
