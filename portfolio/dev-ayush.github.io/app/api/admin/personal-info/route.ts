import { NextRequest, NextResponse } from 'next/server';
import { PersonalInfo, UpdatePersonalInfo, ApiResponse } from '@/types/portfolio';
import { personalInfoOperations } from '@/lib/database';

// GET /api/admin/personal-info
export async function GET(request: NextRequest) {
  try {
    const personalInfo = await personalInfoOperations.get();

    if (!personalInfo) {
      return NextResponse.json(
        { success: false, error: 'Personal information not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<PersonalInfo> = {
      success: true,
      data: {
        id: personalInfo.id,
        name: personalInfo.name,
        title: personalInfo.title,
        bio: personalInfo.bio,
        email: personalInfo.email,
        phone: personalInfo.phone,
        location: personalInfo.location,
        profileImage: personalInfo.profile_image,
        resumeUrl: personalInfo.resume_url,
        socialLinks: personalInfo.socialLinks,
        updatedAt: personalInfo.updated_at
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching personal info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch personal information' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/personal-info
export async function PUT(request: NextRequest) {
  try {
    const data: UpdatePersonalInfo = await request.json();
    
    // Validate required fields
    if (!data.name || !data.title || !data.bio || !data.email || !data.location) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

const updatedPersonalInfo = await personalInfoOperations.createOrUpdate({
      name: data.name,
      title: data.title,
      bio: data.bio,
      email: data.email,
      phone: data.phone,
      location: data.location,
      profileImage: data.profileImage,
      resumeUrl: data.resumeUrl,
      socialLinks: data.socialLinks || {}
    });

    if (!updatedPersonalInfo) {
      return NextResponse.json(
        { success: false, error: 'Failed to update personal information' },
        { status: 500 }
      );
    }

    const response: ApiResponse<PersonalInfo> = {
      success: true,
      data: {
        id: updatedPersonalInfo.id,
        name: updatedPersonalInfo.name,
        title: updatedPersonalInfo.title,
        bio: updatedPersonalInfo.bio,
        email: updatedPersonalInfo.email,
        phone: updatedPersonalInfo.phone,
        location: updatedPersonalInfo.location,
        profileImage: updatedPersonalInfo.profile_image,
        resumeUrl: updatedPersonalInfo.resume_url,
        socialLinks: updatedPersonalInfo.socialLinks,
        updatedAt: updatedPersonalInfo.updated_at
      },
      message: 'Personal information updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating personal info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update personal information' },
      { status: 500 }
    );
  }
}