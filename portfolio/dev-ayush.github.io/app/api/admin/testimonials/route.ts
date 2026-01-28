import { NextRequest, NextResponse } from 'next/server';
import { Testimonial, CreateTestimonial, ApiResponse, PaginatedResponse } from '@/types/portfolio';
import { testimonialOperations } from '@/lib/database';
// GET /api/admin/testimonials
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search') || undefined;

    const filters = {
      page,
      limit,
      featured: featured ? featured === 'true' : undefined,
      search
    };

const result = await testimonialOperations.getAll(filters);

    const response: PaginatedResponse<Testimonial> = {
      success: true,
      data: result.testimonials.map(testimonial => ({
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
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

// POST /api/admin/testimonials
export async function POST(request: NextRequest) {
  try {
    const data: CreateTestimonial = await request.json();
    
    // Validate required fields
    if (!data.name || !data.position || !data.company || !data.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating
    if (!data.rating || data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

const newTestimonial = await testimonialOperations.create({
      name: data.name,
      position: data.position,
      company: data.company,
      content: data.content,
      rating: data.rating,
      imageUrl: data.imageUrl,
      linkedinUrl: data.linkedinUrl,
      featured: data.featured,
      orderIndex: data.orderIndex
    });

    if (!newTestimonial) {
      return NextResponse.json(
        { success: false, error: 'Failed to create testimonial' },
        { status: 500 }
      );
    }

    const response: ApiResponse<Testimonial> = {
      success: true,
      data: {
        id: newTestimonial.id,
        name: newTestimonial.name,
        position: newTestimonial.position,
        company: newTestimonial.company,
        content: newTestimonial.content,
        rating: newTestimonial.rating,
        imageUrl: newTestimonial.image_url,
        linkedinUrl: newTestimonial.linkedin_url,
        featured: Boolean(newTestimonial.featured),
        orderIndex: newTestimonial.order_index,
        createdAt: newTestimonial.created_at,
        updatedAt: newTestimonial.updated_at
      },
      message: 'Testimonial created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}