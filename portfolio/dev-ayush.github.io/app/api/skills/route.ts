import { NextRequest, NextResponse } from 'next/server'
import { skillOperations } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const filters = {
      category: category || undefined,
      limit
    }
    
    const result = await skillOperations.getAll(filters)
    
    const skills = result.skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      iconUrl: skill.icon_url,
      iconName: skill.icon_name,
      iconLibrary: skill.icon_library,
      iconEmoji: skill.icon_emoji,
      iconType: skill.icon_type,
      orderIndex: skill.order_index,
      createdAt: skill.created_at,
      updatedAt: skill.updated_at
    }))

    return NextResponse.json(
      { 
        skills,
        total: result.totalCount
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Skills API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch skills' },
      { status: 500 }
    )
  }
}
