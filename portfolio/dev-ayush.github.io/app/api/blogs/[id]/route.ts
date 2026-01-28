import { NextRequest, NextResponse } from 'next/server'
import { blogOperations } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try by ID first, fall back to slug for convenience
    let blog = await blogOperations.getById(params.id)
    if (!blog) {
      blog = await blogOperations.getBySlug(params.id)
    }
    
    if (!blog) {
      return NextResponse.json({
        success: false,
        error: 'Blog not found'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...blog,
        imageUrl: blog.image_url,
        readTime: blog.read_time,
        likesCount: blog.likes_count ?? 0,
        dislikesCount: blog.dislikes_count ?? 0,
        author: 'Ayush Tiwari',
        date: new Date(blog.created_at).toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
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
        ...updatedBlog,
        imageUrl: updatedBlog.image_url,
        readTime: updatedBlog.read_time,
        likesCount: updatedBlog.likes_count ?? 0,
        dislikesCount: updatedBlog.dislikes_count ?? 0,
        createdAt: updatedBlog.created_at,
        updatedAt: updatedBlog.updated_at
      }
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
    const success = blogOperations.delete(params.id)
    
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