'use client'

import { Suspense } from 'react'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import PortfolioApp from '@/components/PortfolioApp'

export default function Home() {
  return (
    <ThemeProvider>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      }>
        <PortfolioApp />
      </Suspense>
    </ThemeProvider>
  )
}
