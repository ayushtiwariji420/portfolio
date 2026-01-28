import { NextRequest, NextResponse } from 'next/server';
import { Education, CreateEducation, ApiResponse, PaginatedResponse } from '@/types/portfolio';
import { educationOperations } from '@/lib/database';
// GET /api/admin/education
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || undefined;

    const filters = {
      page,
      limit,
      search
    };

    const result = await educationOperations.getAll(filters);

    const response: PaginatedResponse<Education> = {
      success: true,
      data: result.educations.map(education => ({
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
      })),
      pagination: {
        total: result.totalCount,
        page,
        limit,
        totalPages: result.totalPages
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching education records:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch education records' },
      { status: 500 }
    );
  }
}

// POST /api/admin/education
export async function POST(request: NextRequest) {
  try {
    const data: CreateEducation = await request.json();
    
    // Validate required fields
    if (!data.degree || !data.institution || !data.startDate || !data.description || !data.achievements || !data.courses) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newEducation = await educationOperations.create({
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

    if (!newEducation) {
      return NextResponse.json(
        { success: false, error: 'Failed to create education record' },
        { status: 500 }
      );
    }

    const response: ApiResponse<Education> = {
      success: true,
      data: {
        id: newEducation.id,
        degree: newEducation.degree,
        institution: newEducation.institution,
        startDate: newEducation.start_date,
        endDate: newEducation.end_date,
        location: newEducation.location,
        grade: newEducation.grade,
        description: newEducation.description,
        achievements: newEducation.achievements,
        courses: newEducation.courses,
        institutionUrl: newEducation.institution_url,
        orderIndex: newEducation.order_index,
        createdAt: newEducation.created_at,
        updatedAt: newEducation.updated_at
      },
      message: 'Education record created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating education record:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create education record' },
      { status: 500 }
    );
  }
}
