import { NextRequest, NextResponse } from 'next/server'
import { userOperations } from '@/lib/database'
import { isDisposableEmail, isValidEmailFormat } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, mobile } = body || {}

    if (!email || !username || !password) {
      return NextResponse.json({ success: false, error: 'email, username, password are required' }, { status: 400 })
    }
    if (!isValidEmailFormat(email)) {
      return NextResponse.json({ success: false, error: 'Invalid email format' }, { status: 400 })
    }
    if (isDisposableEmail(email)) {
      return NextResponse.json({ success: false, error: 'Disposable emails are not allowed' }, { status: 400 })
    }

    const existing = await userOperations.getByEmail(email)
    if (existing) {
      return NextResponse.json({ success: false, error: 'Email already registered' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const verificationToken = Math.random().toString(36).slice(2) + Date.now().toString(36)
    const user = userOperations.create({ email, username, passwordHash, mobile, verificationToken })
    if (!user) {
      return NextResponse.json({ success: false, error: 'Failed to create user' }, { status: 500 })
    }

    // In production you would send an email with this token link.
    // For development, return token so it can be verified manually via POST /api/auth/verify
    const devToken = process.env.NODE_ENV !== 'production' ? verificationToken : undefined

    return NextResponse.json({ success: true, message: 'Registered. Please verify your email.', verificationToken: devToken })
  } catch (error) {
    console.error('Register error:', error)
    return NextResponse.json({ success: false, error: 'Failed to register' }, { status: 500 })
  }
}
