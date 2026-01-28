import { NextRequest, NextResponse } from 'next/server';
import { Education, ApiResponse } from '@/types/portfolio';
import { educationOperations } from '@/lib/database';

// GET /api/education - Public endpoint for fetching education records
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');

    const filters = {
      page: 1,
      limit,
      search: undefined
    };

    const result = await educationOperations.getAll(filters);

    // Transform database format to API format
    const educations = result.educations.map(education => ({
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
    }));

    const response: ApiResponse<Education[]> = {
      success: true,
      data: educations
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
