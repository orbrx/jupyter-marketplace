/*
 * Copyright 2025, Orange Bricks
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { Analytics } from '@vercel/analytics/next'
import { BetaBanner } from '@/components/beta-banner'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'JupyterLab Marketplace',
  description: 'Community-run marketplace for JupyterLab extensions with real-world signals from PyPI and GitHub',
  metadataBase: new URL('https://marketplace.orbrx.io'),
  icons: {
    icon: '/orbrx.png',
    shortcut: '/orbrx.png',
    apple: '/orbrx.png',
  },
  openGraph: {
    title: 'JupyterLab Marketplace',
    description: 'Community-run marketplace for JupyterLab extensions with real-world signals from PyPI and GitHub',
    type: 'website',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Jupyter Marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JupyterLab Marketplace',
    description: 'Community-run marketplace for JupyterLab extensions with real-world signals from PyPI and GitHub',
    images: ['/og.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className={inter.className}>
        <BetaBanner feedbackHref="https://github.com/orbrx/jupyter-marketplace/issues/new/choose" />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
