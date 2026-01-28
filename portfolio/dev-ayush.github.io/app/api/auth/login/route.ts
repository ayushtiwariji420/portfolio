import { NextRequest, NextResponse } from 'next/server'
import { userOperations } from '@/lib/database'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body || {}

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'email and password are required' }, { status: 400 })
    }

    const user = await userOperations.getByEmail(email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    if (!user.email_verified) {
      return NextResponse.json({ success: false, error: 'Email not verified' }, { status: 403 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const token = signToken({ sub: user.id, email: user.email, username: user.username })
    const res = NextResponse.json({ success: true, user: { id: user.id, email: user.email, username: user.username } })
    res.cookies.set('auth_token', token, { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, error: 'Failed to login' }, { status: 500 })
  }
}
