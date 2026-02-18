"use client"

import React, { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

type Blog = {
  id?: string
  title: string
  content?: string
  excerpt?: string
  slug: string
}

export default function BlogDetailView() {
  const pathname = usePathname() || ''
  const slug = pathname.split('/').pop() || ''
  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/blogs?limit=1000')
        const json = await res.json()
        const found = (json.data || []).find((b: any) => b.slug === slug)
        if (mounted) setBlog(found || null)
      } catch (err) {
        console.error('Failed to load blog', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [slug])

  if (loading) return <div className="min-h-screen py-20 px-4">Loading...</div>
  if (!blog) return <div className="min-h-screen py-20 px-4">Blog not found.</div>

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow">
        <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
        <div className="prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: blog.content || blog.excerpt || '' }} />
      </div>
    </div>
  )
}
