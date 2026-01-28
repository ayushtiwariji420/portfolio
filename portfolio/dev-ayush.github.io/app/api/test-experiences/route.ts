import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { 
        success: true,
        message: 'Test endpoint is working',
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Test API failed' 
      },
      { status: 500 }
    )
  }
}