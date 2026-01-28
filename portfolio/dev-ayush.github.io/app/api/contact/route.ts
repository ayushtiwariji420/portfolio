import { NextRequest, NextResponse } from 'next/server'
import { contactOperations } from '@/lib/database'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required' },
        { status: 400 }
      )
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Store message in database
    const contactMessage = await contactOperations.create({
      name: name.trim(),
      email: email.trim(),
      subject: subject?.trim(),
      message: message.trim()
    })

    console.log('Contact message stored successfully:', {
      id: contactMessage.id,
      name: contactMessage.name,
      email: contactMessage.email,
      subject: contactMessage.subject,
      created_at: contactMessage.created_at
    })

    // Here you can also integrate with EmailJS or any email service if needed
    // const emailjsResponse = await emailjs.send(...)

    return NextResponse.json(
      {
        message: 'Message sent successfully!',
        messageId: contactMessage.id
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
