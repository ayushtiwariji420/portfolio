import { NextRequest, NextResponse } from 'next/server'
import { contactOperations } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || undefined
    const isRead = searchParams.get('isRead') === 'true' ? true :
                   searchParams.get('isRead') === 'false' ? false : undefined

    const result = await contactOperations.getAll({
      page,
      limit,
      status,
      isRead
    })

    return NextResponse.json({
      success: true,
      data: result.messages,
      pagination: {
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
      }
    })
  } catch (error) {
    console.error('Error fetching contact messages:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact messages' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    const contactMessage = await contactOperations.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim(),
      message: message.trim()
    })

    return NextResponse.json({
      success: true,
      data: contactMessage,
      message: 'Contact message created successfully'
    })
  } catch (error) {
    console.error('Error creating contact message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create contact message' },
      { status: 500 }
    )
  }
}