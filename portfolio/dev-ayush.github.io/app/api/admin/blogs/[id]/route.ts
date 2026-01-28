import { NextRequest, NextResponse } from 'next/server'
import { blogOperations } from '@/lib/database'

// Helper function to check admin authentication (simplified for now)
function checkAdminAuth(request: NextRequest) {
  // You can implement proper JWT verification here
  const authHeader = request.headers.get('authorization')
  return authHeader === 'Bearer admin-token' // Simplified for demo
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const blog = await blogOperations.getById(params.id)
    
    if (!blog) {
      return NextResponse.json({
        success: false,
        error: 'Blog not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
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
      }
    })
  } catch (error) {
    console.error('Get blog error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch blog'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if blog exists
    const existingBlog = await blogOperations.getById(params.id)
    if (!existingBlog) {
      return NextResponse.json({
        success: false,
        error: 'Blog not found'
      }, { status: 404 })
    }

    // Check if slug already exists on another blog
    if (slug && slug !== existingBlog.slug) {
      const blogWithSlug = await blogOperations.getBySlug(slug)
      if (blogWithSlug && blogWithSlug.id !== params.id) {
        return NextResponse.json({
          success: false,
          error: 'Blog with this slug already exists'
        }, { status: 409 })
      }
    }

    const updates: any = {}
    if (title !== undefined) updates.title = title
    if (content !== undefined) updates.content = content
    if (excerpt !== undefined) updates.excerpt = excerpt
    if (slug !== undefined) updates.slug = slug
    if (tags !== undefined) updates.tags = tags
    if (imageUrl !== undefined) updates.imageUrl = imageUrl
    if (published !== undefined) updates.published = published
    if (featured !== undefined) updates.featured = featured
    if (readTime !== undefined) updates.readTime = readTime

    const updatedBlog = await blogOperations.update(params.id, updates)

    if (!updatedBlog) {
      return NextResponse.json({
        success: false,
        error: 'Failed to update blog'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedBlog.id,
        title: updatedBlog.title,
        content: updatedBlog.content,
        excerpt: updatedBlog.excerpt,
        slug: updatedBlog.slug,
        tags: updatedBlog.tags,
        imageUrl: updatedBlog.image_url,
        published: updatedBlog.published,
        featured: updatedBlog.featured,
        readTime: updatedBlog.read_time,
        createdAt: updatedBlog.created_at,
        updatedAt: updatedBlog.updated_at
      },
      message: 'Blog updated successfully'
    })
  } catch (error) {
    console.error('Update blog error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update blog'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    if (!checkAdminAuth(request)) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 })
    }

    const success = await blogOperations.delete(params.id)
    
    if (!success) {
      return NextResponse.json({
        success: false,
        error: 'Blog not found or failed to delete'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    })
  } catch (error) {
    console.error('Delete blog error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete blog'
    }, { status: 500 })
  }
}