import { NextRequest, NextResponse } from 'next/server';
import { Testimonial, UpdateTestimonial, ApiResponse } from '@/types/portfolio';
import { testimonialOperations } from '@/lib/database';

// GET /api/admin/testimonials/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
const testimonial = await testimonialOperations.getById(params.id);

    if (!testimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<Testimonial> = {
      success: true,
      data: {
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
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonial' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/testimonials/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data: UpdateTestimonial = await request.json();
    
    // Validate rating if provided
    if (data.rating && (data.rating < 1 || data.rating > 5)) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

const updatedTestimonial = await testimonialOperations.update(params.id, {
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

    if (!updatedTestimonial) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found or failed to update' },
        { status: 404 }
      );
    }

    const response: ApiResponse<Testimonial> = {
      success: true,
      data: {
        id: updatedTestimonial.id,
        name: updatedTestimonial.name,
        position: updatedTestimonial.position,
        company: updatedTestimonial.company,
        content: updatedTestimonial.content,
        rating: updatedTestimonial.rating,
        imageUrl: updatedTestimonial.image_url,
        linkedinUrl: updatedTestimonial.linkedin_url,
        featured: Boolean(updatedTestimonial.featured),
        orderIndex: updatedTestimonial.order_index,
        createdAt: updatedTestimonial.created_at,
        updatedAt: updatedTestimonial.updated_at
      },
      message: 'Testimonial updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/testimonials/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
const deleted = await testimonialOperations.delete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<null> = {
      success: true,
      data: null,
      message: 'Testimonial deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}