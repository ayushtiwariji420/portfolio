import { NextRequest, NextResponse } from 'next/server'
import { blogOperations } from '@/lib/database'
// Helper function to check admin authentication (simplified for now)
function checkAdminAuth(request: NextRequest) {
  // You can implement proper JWT verification here
  const authHeader = request.headers.get('authorization')
  return authHeader === 'Bearer admin-token' // Simplified for demo
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    
    const filters = {
      page,
      limit,
      published: published === 'true' ? true : published === 'false' ? false : undefined,
      featured: featured === 'true' ? true : featured === 'false' ? false : undefined,
      search: search || undefined,
      tag: tag || undefined
    }
    
    const result = await blogOperations.getAll(filters)
    
    const blogs = result.blogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      slug: blog.slug,
      tags: blog.tags,
      imageUrl: blog.image_url,
      published: blog.published,
      featured: blog.featured,
      readTime: blog.read_time,
      createdAt: blog.created_at,
      updatedAt: blog.updated_at
    }))

    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        total: result.totalCount,
        page,
        limit,
        totalPages: result.totalPages
      }
    })
  } catch (error) {
    console.error('Admin blogs API error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blogs'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, excerpt, slug, tags, imageUrl, published, featured, readTime } = body

    // Validate required fields
    if (!title || !content || !excerpt || !slug) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: title, content, excerpt, slug'
      }, { status: 400 })
    }

    // Check if slug already exists
    const existingBlog = await blogOperations.getBySlug(slug)
    if (existingBlog) {
      return NextResponse.json({
        success: false,
        error: 'Blog with this slug already exists'
      }, { status: 409 })
    }

    const newBlog = await blogOperations.create({
      title,
      content,
      excerpt,
      slug,
      tags: tags || [],
      imageUrl,
      published: published || false,
      featured: featured || false,
      readTime: readTime || 5
    })

    if (!newBlog) {
      return NextResponse.json({
        success: false,
        error: 'Failed to create blog'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: newBlog.id,
        title: newBlog.title,
        content: newBlog.content,
        excerpt: newBlog.excerpt,
        slug: newBlog.slug,
        tags: newBlog.tags,
        imageUrl: newBlog.image_url,
        published: newBlog.published,
        featured: newBlog.featured,
        readTime: newBlog.read_time,
        createdAt: newBlog.created_at,
        updatedAt: newBlog.updated_at
      },
      message: 'Blog created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Create blog error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create blog'
    }, { status: 500 })
  }
}