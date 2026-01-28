import { NextRequest, NextResponse } from 'next/server';
import { Testimonial, ApiResponse } from '@/types/portfolio';
import { testimonialOperations } from '@/lib/database';

// GET /api/testimonials - Public endpoint for fetching testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get('featured');
    const limit = parseInt(searchParams.get('limit') || '10');

    const filters = {
      page: 1,
      limit,
      featured: featured === 'true' ? true : undefined,
      search: undefined
    };

    const result = await testimonialOperations.getAll(filters);

    // Transform database format to API format
    const testimonials = result.testimonials.map(testimonial => ({
      id: testimonial.id,
      name: testimonial.name,
      position: testimonial.position,
      company: testimonial.company,
      content: testimonial.content,
      rating: testimonial.rating,
      imageUrl: testimonial.image_url,
      linkedinUrl: testimonial.linkedin_url,
      featured: Boolean(testimonial.featured),
      orderIndex: testimonial.order_index,
      createdAt: testimonial.created_at,
      updatedAt: testimonial.updated_at
    }));

    const response: ApiResponse<Testimonial[]> = {
      success: true,
      data: testimonials
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}