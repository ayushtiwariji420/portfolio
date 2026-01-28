import { NextRequest, NextResponse } from 'next/server'
import { projectOperations } from '@/lib/database'
import { mapTechnologiesToIcons } from '@/utils/technologyIcons'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')
    
    const filters = {
      featured: featured === 'true' ? true : undefined,
      category: category || undefined,
      limit
    }
    
    const result = await projectOperations.getAll(filters)
    
    const projects = result.projects.map(project => ({
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
      startDate: project.created_at,
      endDate: project.updated_at,
      tags: project.technologies || [], // For compatibility with existing frontend
      icons: mapTechnologiesToIcons(project.technologies || []), // Dynamic icons based on technologies
      show: true,
      demoLink: project.live_url,
      githubLink: project.github_url
    }))

    return NextResponse.json(
      { 
        projects,
        total: result.totalCount
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Projects API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    )
  }
}
