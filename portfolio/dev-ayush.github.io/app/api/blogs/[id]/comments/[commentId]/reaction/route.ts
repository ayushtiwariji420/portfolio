import { NextRequest, NextResponse } from 'next/server'
import { commentOperations } from '@/lib/database'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const body = await request.json()
    const action = body?.action as 'like' | 'dislike'

    if (action !== 'like' && action !== 'dislike') {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
    }

    const updated = commentOperations.incrementReaction(params.commentId, action)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Comment not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Comment reaction error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update reaction' }, { status: 500 })
  }
}
