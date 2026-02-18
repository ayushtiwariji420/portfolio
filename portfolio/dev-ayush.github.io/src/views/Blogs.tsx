"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

type Blog = {
  id?: string
  title: string
  excerpt?: string
  slug: string
}

export default function BlogsView() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await fetch('/api/blogs?limit=100')
        const json = await res.json()
        if (mounted && json && Array.isArray(json.data)) setBlogs(json.data)
      } catch (err) {
        console.error('Failed to load blogs', err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()

    return () => { mounted = false }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Blogs</h1>
        {blogs.length === 0 ? (
          <p className="text-gray-600">No blogs found.</p>
        ) : (
          <div className="grid gap-6">
            {blogs.map((b) => (
              <article key={b.slug} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/blogs/${b.slug}`}>
                    <a className="text-purple-600 hover:underline">{b.title}</a>
                  </Link>
                </h2>
                {b.excerpt && <p className="text-gray-600">{b.excerpt}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
