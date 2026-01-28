import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Ayush Tiwari - Full Stack Developer',
  description: 'Portfolio of Ayush Tiwari, a passionate Full Stack Developer specializing in modern web technologies.',
  keywords: 'Ayush Tiwari, Full Stack Developer, React, Node.js, TypeScript, Portfolio',
  authors: [{ name: 'Ayush Tiwari' }],
  openGraph: {
    title: 'Ayush Tiwari - Full Stack Developer',
    description: 'Portfolio of Ayush Tiwari, a passionate Full Stack Developer',
    url: 'https://github.com/ayushtiwariji420',
    siteName: 'Ayush Tiwari Portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ayush Tiwari - Full Stack Developer',
    description: 'Portfolio of Ayush Tiwari, a passionate Full Stack Developer',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
