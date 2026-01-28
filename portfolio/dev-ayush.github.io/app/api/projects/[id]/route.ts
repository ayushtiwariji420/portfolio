import { NextRequest, NextResponse } from 'next/server'
import { projectOperations } from '@/lib/database'
import { mapTechnologiesToIcons } from '@/utils/technologyIcons'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }
    
    const project = await projectOperations.getById(id)
    
    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }
    
    const formattedProject = {
      id: project.id,
      title: project.title,
      description: project.description,
      longDescription: project.long_description,
      technologies: project.technologies || [],
      imageUrl: project.image_url,
      liveUrl: project.live_url,
      githubUrl: project.github_url,
      featured: project.featured,
      category: project.category,
      startDate: project.start_date,
      endDate: project.end_date,
      tags: project.technologies || [], // For compatibility with existing frontend
      icons: mapTechnologiesToIcons(project.technologies || []), // Dynamic icons based on technologies
      show: project.show,
      demoLink: project.live_url,
      githubLink: project.github_url,
      createdAt: project.created_at,
      updatedAt: project.updated_at
    }

    return NextResponse.json(
      { 
        project: formattedProject,
        success: true 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Project detail API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch project' },
      { status: 500 }
    )
  }
}