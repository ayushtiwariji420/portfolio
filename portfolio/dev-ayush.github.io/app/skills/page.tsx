'use client'

import { Suspense } from 'react'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import SkillsView from '@/views/Skills'
import AppWrapper from '@/components/AppWrapper'

export default function SkillsPage() {
  return (
    <ThemeProvider>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      }>
        <AppWrapper>
          <SkillsView />
        </AppWrapper>
      </Suspense>
    </ThemeProvider>
  )
}
