import { NextRequest, NextResponse } from 'next/server'
import { blogOperations, commentOperations } from '@/lib/database'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'

async function resolveBlogId(idOrSlug: string) {
  const byId = await blogOperations.getById(idOrSlug)
  if (byId) return byId.id as string
  const bySlug = await blogOperations.getBySlug(idOrSlug)
  return bySlug ? (bySlug.id as string) : null
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = await resolveBlogId(params.id)
    if (!blogId) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const result = await commentOperations.getForBlog(blogId, { page, limit })

    return NextResponse.json({
      success: true,
      data: result.comments,
      pagination: {
        total: result.totalCount,
        page,
        limit,
        totalPages: result.totalPages,
      },
    })
  } catch (error) {
    console.error('Get comments error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch comments' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blogId = await resolveBlogId(params.id)
    if (!blogId) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    // Require Google auth via NextAuth session
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, parentId } = body || {}

    if (!content || typeof content !== 'string' || !content.trim()) {
      return NextResponse.json({ success: false, error: 'Content is required' }, { status: 400 })
    }

    const newComment = await commentOperations.create({ blogId, author: session.user?.name || session.user?.email || 'User', content: content.trim(), parentId, userId: session.user?.email || undefined })
    if (!newComment) {
      return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: newComment }, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create comment' }, { status: 500 })
  }
}
