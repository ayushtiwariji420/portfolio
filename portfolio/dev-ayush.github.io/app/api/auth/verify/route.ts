import { NextRequest, NextResponse } from 'next/server'
import { userOperations } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { token } = body || {}
    if (!token) {
      return NextResponse.json({ success: false, error: 'token is required' }, { status: 400 })
    }

    const user = userOperations.getByVerificationToken(token)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid token' }, { status: 400 })
    }

    const ok = userOperations.verifyEmailByToken(token)
    if (!ok) {
      return NextResponse.json({ success: false, error: 'Verification failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Email verified. You may log in now.' })
  } catch (error) {
    console.error('Verify error:', error)
    return NextResponse.json({ success: false, error: 'Failed to verify' }, { status: 500 })
  }
}
