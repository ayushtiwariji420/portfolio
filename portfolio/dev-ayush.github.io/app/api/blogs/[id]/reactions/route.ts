import { NextRequest, NextResponse } from 'next/server'
import { blogOperations } from '@/lib/database'

async function resolveBlogId(idOrSlug: string) {
  const byId = await blogOperations.getById(idOrSlug)
  if (byId) return byId.id as string
  const bySlug = await blogOperations.getBySlug(idOrSlug)
  return bySlug ? (bySlug.id as string) : null
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const action = body?.action as 'like' | 'dislike'

    if (action !== 'like' && action !== 'dislike') {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
    }

    const blogId = await resolveBlogId(params.id)
    if (!blogId) {
      return NextResponse.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    const updated = await blogOperations.incrementReaction(blogId, action)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update reaction' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updated.id,
        likesCount: updated.likes_count ?? 0,
        dislikesCount: updated.dislikes_count ?? 0,
      },
    })
  } catch (error) {
    console.error('Blog reaction error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update reaction' }, { status: 500 })
  }
}
