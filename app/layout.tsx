import type { Metadata } from 'next'
import { Instrument_Sans, Playfair_Display } from 'next/font/google'
import { Footer } from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import { Providers } from '@/components/providers/Providers'
import './globals.css'

const playfair = Playfair_Display({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://verdeon.io'),
  title: {
    default: 'Verdeon',
    template: '%s · Verdeon',
  },
  description:
    'Carbon intelligence platform built on EPA GHGRP data with dashboards, facility rankings, state views, and reduction recommendations.',
  applicationName: 'Verdeon',
  keywords: [
    'EPA GHGRP',
    'carbon intelligence',
    'emissions dashboard',
    'greenhouse gas reporting',
    'sustainability analytics',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Verdeon',
    description:
      'Turn 14 years of EPA greenhouse gas reporting data into clear insights, rankings, and reduction strategies.',
    url: 'https://verdeon.io',
    siteName: 'Verdeon',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verdeon',
    description:
      'Carbon intelligence platform built on EPA GHGRP data with dashboards, state rankings, and facility insights.',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${instrumentSans.variable}`}>
      <body className="min-h-screen bg-green-50 font-body text-charcoal antialiased">
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
