import { NextRequest, NextResponse } from 'next/server';
import { Project, CreateProject, ApiResponse, PaginatedResponse } from '@/types/portfolio';
import { projectOperations } from '@/lib/database';
// GET /api/admin/projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const category = searchParams.get('category') || undefined;
    const featured = searchParams.get('featured');
    const search = searchParams.get('search') || undefined;

    const filters = {
      page,
      limit,
      category,
      featured: featured ? featured === 'true' : undefined,
      search
    };

    const result = await projectOperations.getAll(filters);

    const response: PaginatedResponse<Project> = {
      success: true,
      data: result.projects.map(project => ({
        id: project.id,
        title: project.title,
        description: project.description,
        longDescription: project.long_description,
        technologies: project.technologies,
        imageUrl: project.image_url,
        liveUrl: project.live_url,
        githubUrl: project.github_url,
        featured: project.featured,
        category: project.category,
        createdAt: project.created_at,
        updatedAt: project.updated_at
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
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/admin/projects
export async function POST(request: NextRequest) {
  try {
    const data: CreateProject = await request.json();
    
    // Validate required fields
    if (!data.title || !data.description || !data.technologies || !data.category) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newProject = await projectOperations.create({
      title: data.title,
      description: data.description,
      longDescription: data.longDescription,
      technologies: data.technologies,
      imageUrl: data.imageUrl,
      liveUrl: data.liveUrl,
      githubUrl: data.githubUrl,
      featured: data.featured,
      category: data.category
    });

    if (!newProject) {
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      );
    }

    const response: ApiResponse<Project> = {
      success: true,
      data: {
        id: newProject.id,
        title: newProject.title,
        description: newProject.description,
        longDescription: newProject.long_description,
        technologies: newProject.technologies,
        imageUrl: newProject.image_url,
        liveUrl: newProject.live_url,
        githubUrl: newProject.github_url,
        featured: newProject.featured,
        category: newProject.category,
        createdAt: newProject.created_at,
        updatedAt: newProject.updated_at
      },
      message: 'Project created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
