import { NextRequest, NextResponse } from 'next/server';
import { PersonalInfo, ApiResponse } from '@/types/portfolio';
import { personalInfoOperations } from '@/lib/database';


// GET /api/personal-info - Public endpoint for fetching personal information
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
