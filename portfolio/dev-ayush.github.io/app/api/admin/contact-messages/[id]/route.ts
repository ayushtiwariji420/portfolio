import { NextRequest, NextResponse } from 'next/server'
import { contactOperations } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const message = await contactOperations.getById(params.id)

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: message
    })
  } catch (error) {
    console.error('Error fetching contact message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact message' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status is required' },
        { status: 400 }
      )
    }

    const updatedMessage = await contactOperations.updateStatus(params.id, status)

    if (!updatedMessage) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedMessage,
      message: 'Contact message updated successfully'
    })
  } catch (error) {
    console.error('Error updating contact message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update contact message' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const updatedMessage = await contactOperations.markAsRead(params.id)

    if (!updatedMessage) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedMessage,
      message: 'Contact message marked as read'
    })
  } catch (error) {
    console.error('Error marking contact message as read:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to mark message as read' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deletedMessage = await contactOperations.delete(params.id)

    if (!deletedMessage) {
      return NextResponse.json(
        { success: false, error: 'Contact message not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Contact message deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting contact message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact message' },
      { status: 500 }
    )
  }
}