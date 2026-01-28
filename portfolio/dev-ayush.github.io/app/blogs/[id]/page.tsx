import { Suspense } from 'react'
import { ThemeProvider } from '@/contexts/ThemeProvider'
import BlogDetailView from '@/views/BlogDetail'
import AppWrapper from '@/components/AppWrapper'
import { blogOperations } from '@/lib/database'

export async function generateStaticParams() {
  try {
    // Pre-render published blogs for static export builds
    const { blogs } = await blogOperations.getAll({ published: true, limit: 1000 })
    return blogs.map((b: any) => ({ id: b.slug }))
  } catch {
    return []
  }
}

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const id = params.id

  return (
    <ThemeProvider>
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      }>
        <AppWrapper>
          <BlogDetailView />
        </AppWrapper>
      </Suspense>
    </ThemeProvider>
  )
}
