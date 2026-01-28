import { NextRequest, NextResponse } from 'next/server'


import { experienceOperations } from '@/lib/database'


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')
    const search = searchParams.get('search')
    
    const filters = {
      page,
      limit,
      search: search || undefined
    }
    
    const result = await experienceOperations.getAll(filters)
    
    return NextResponse.json(
      { 
        success: true,
        data: result.experiences,
        total: result.totalCount,
        totalPages: result.totalPages,
        currentPage: page
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin experiences API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch experiences' 
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const {
      company,
      position,
      description,
      responsibilities,
      technologies,
      startDate,
      endDate,
      companyUrl,
      location,
      employmentType,
      orderIndex
    } = body

    // Validation
    if (!company || !position || !description || !location || !employmentType || !startDate) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required fields: company, position, description, location, employmentType, startDate' 
        },
        { status: 400 }
      )
    }

    const experienceData = {
      company,
      position,
      description,
      responsibilities: responsibilities || [],
      technologies: technologies || [],
      startDate,
      endDate: endDate || undefined,
      companyUrl: companyUrl || undefined,
      location,
      employmentType,
      orderIndex: orderIndex || 0
    }

const newExperience = await experienceOperations.create(experienceData)

    if (!newExperience) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to create experience' 
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true,
        data: newExperience
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Admin create experience API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to create experience' 
      },
      { status: 500 }
    )
  }
}