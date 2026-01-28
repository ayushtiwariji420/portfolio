import { NextRequest, NextResponse } from 'next/server';
import { Project, UpdateProject, ApiResponse } from '@/types/portfolio';
import { projectOperations } from '@/lib/database';

// GET /api/admin/projects/[id]
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const project = await projectOperations.getById(id);
    
    if (!project) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<Project> = {
      success: true,
      data: {
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
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch project' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/projects/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data: UpdateProject = await request.json();
    
    const updatedProject = await projectOperations.update(id, {
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

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found or failed to update' },
        { status: 404 }
      );
    }

    const response: ApiResponse<Project> = {
      success: true,
      data: {
        id: updatedProject.id,
        title: updatedProject.title,
        description: updatedProject.description,
        longDescription: updatedProject.long_description,
        technologies: updatedProject.technologies,
        imageUrl: updatedProject.image_url,
        liveUrl: updatedProject.live_url,
        githubUrl: updatedProject.github_url,
        featured: updatedProject.featured,
        category: updatedProject.category,
        createdAt: updatedProject.created_at,
        updatedAt: updatedProject.updated_at
      },
      message: 'Project updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/projects/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const success = await projectOperations.delete(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    const response: ApiResponse<null> = {
      success: true,
      message: 'Project deleted successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
