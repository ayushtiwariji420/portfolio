import { NextRequest, NextResponse } from 'next/server'
import { experienceOperations } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const filters = {
      limit
    }
    
    const result = await experienceOperations.getAll(filters)
    
    const experiences = result.experiences.map(experience => ({
      id: experience.id,
      company: experience.company,
      position: experience.position,
      description: experience.description,
      responsibilities: experience.responsibilities,
      technologies: experience.technologies,
      startDate: experience.start_date,
      endDate: experience.end_date,
      companyUrl: experience.company_url,
      location: experience.location,
      employmentType: experience.employment_type,
      orderIndex: experience.order_index,
      createdAt: experience.created_at,
      updatedAt: experience.updated_at
    }))

    return NextResponse.json(
      { 
        experiences,
        total: result.totalCount
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Experiences API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch experiences' },
      { status: 500 }
    )
  }
}
