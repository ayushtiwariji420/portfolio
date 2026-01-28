import { NextRequest, NextResponse } from 'next/server'
import { experienceOperations } from '@/lib/database'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Experience ID is required' },
        { status: 400 }
      )
    }
    
const experience = await experienceOperations.getById(id)
    
    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { success: true, data: experience },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin get experience API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch experience' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Experience ID is required' },
        { status: 400 }
      )
    }

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

    const updateData: any = {}
    
    if (company !== undefined) updateData.company = company
    if (position !== undefined) updateData.position = position
    if (description !== undefined) updateData.description = description
    if (responsibilities !== undefined) updateData.responsibilities = responsibilities
    if (technologies !== undefined) updateData.technologies = technologies
    if (startDate !== undefined) updateData.startDate = startDate
    if (endDate !== undefined) updateData.endDate = endDate
    if (companyUrl !== undefined) updateData.companyUrl = companyUrl
    if (location !== undefined) updateData.location = location
    if (employmentType !== undefined) updateData.employmentType = employmentType
    if (orderIndex !== undefined) updateData.orderIndex = orderIndex

const updatedExperience = await experienceOperations.update(id, updateData)

    if (!updatedExperience) {
      return NextResponse.json(
        { success: false, error: 'Failed to update experience' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, data: updatedExperience },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin update experience API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update experience' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Experience ID is required' },
        { status: 400 }
      )
    }

const deleted = await experienceOperations.delete(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Experience not found or failed to delete' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Experience deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Admin delete experience API error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete experience' },
      { status: 500 }
    )
  }
}