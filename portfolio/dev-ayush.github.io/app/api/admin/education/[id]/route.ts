import { NextRequest, NextResponse } from 'next/server';
import { Education, UpdateEducation, ApiResponse } from '@/types/portfolio';
import { educationOperations } from '@/lib/database';

// GET /api/admin/education/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const education = await educationOperations.getById(params.id);

    if (!education) {
      return NextResponse.json(
        { success: false, error: 'Education record not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<Education> = {
      success: true,
      data: {
        id: education.id,
        degree: education.degree,
        institution: education.institution,
        startDate: education.start_date,
        endDate: education.end_date,
        location: education.location,
        grade: education.grade,
        description: education.description,
        achievements: education.achievements,
        courses: education.courses,
        institutionUrl: education.institution_url,
        orderIndex: education.order_index,
        createdAt: education.created_at,
        updatedAt: education.updated_at
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching education record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education record' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/education/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data: UpdateEducation = await request.json();

    const updatedEducation = await educationOperations.update(params.id, {
      degree: data.degree,
      institution: data.institution,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      grade: data.grade,
      description: data.description,
      achievements: data.achievements,
      courses: data.courses,
      institutionUrl: data.institutionUrl,
      orderIndex: data.orderIndex
    });

    if (!updatedEducation) {
      return NextResponse.json(
        { success: false, error: 'Education record not found or failed to update' },
        { status: 404 }
      );
    }

    const response: ApiResponse<Education> = {
      success: true,
      data: {
        id: updatedEducation.id,
        degree: updatedEducation.degree,
        institution: updatedEducation.institution,
        startDate: updatedEducation.start_date,
        endDate: updatedEducation.end_date,
        location: updatedEducation.location,
        grade: updatedEducation.grade,
        description: updatedEducation.description,
        achievements: updatedEducation.achievements,
        courses: updatedEducation.courses,
        institutionUrl: updatedEducation.institution_url,
        orderIndex: updatedEducation.order_index,
        createdAt: updatedEducation.created_at,
        updatedAt: updatedEducation.updated_at
      },
      message: 'Education record updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating education record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update education record' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/education/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await educationOperations.delete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Education record not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Education record deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting education record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete education record' },
      { status: 500 }
    );
  }
}
