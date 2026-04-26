import type { Metadata } from 'next'
import { Instrument_Sans, Playfair_Display } from 'next/font/google'
import { Providers } from '@/components/providers/Providers'
import './globals.css'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
})

export const metadata: Metadata = {
  title: 'Verdeon',
  description: 'Carbon intelligence platform built on EPA GHGRP data.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${instrumentSans.variable}`}>
      <body className="min-h-screen bg-green-50 font-body text-charcoal antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
