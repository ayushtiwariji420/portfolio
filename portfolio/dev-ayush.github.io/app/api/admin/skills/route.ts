import { skillOperations } from '@/lib/database';
import { NextRequest, NextResponse } from 'next/server';

// Types for API responses
interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  iconUrl?: string;
  iconName?: string;
  iconLibrary?: string;
  iconEmoji?: string;
  iconType?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateSkill {
  name: string;
  category: string;
  proficiency: number;
  iconUrl?: string;
  iconName?: string;
  iconLibrary?: string;
  iconEmoji?: string;
  iconType?: string;
  orderIndex?: number;
}

// Mock data - keeping for reference but using database instead
let mockSkills: any[] = [
  {
    id: '1',
    name: 'React',
    category: 'frontend',
    proficiency: 5,
    iconUrl: '/icons/react.svg',
    order: 1,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Next.js',
    category: 'frontend',
    proficiency: 4,
    iconUrl: '/icons/nextjs.svg',
    order: 2,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    name: 'TypeScript',
    category: 'frontend',
    proficiency: 5,
    iconUrl: '/icons/typescript.svg',
    order: 3,
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    name: 'Node.js',
    category: 'backend',
    proficiency: 4,
    iconUrl: '/icons/nodejs.svg',
    order: 4,
    createdAt: '2024-01-04T00:00:00Z',
    updatedAt: '2024-01-04T00:00:00Z'
  },
  {
    id: '5',
    name: 'Express.js',
    category: 'backend',
    proficiency: 4,
    iconUrl: '/icons/express.svg',
    order: 5,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'MongoDB',
    category: 'database',
    proficiency: 4,
    iconUrl: '/icons/mongodb.svg',
    order: 6,
    createdAt: '2024-01-06T00:00:00Z',
    updatedAt: '2024-01-06T00:00:00Z'
  },
  {
    id: '7',
    name: 'PostgreSQL',
    category: 'database',
    proficiency: 3,
    iconUrl: '/icons/postgresql.svg',
    order: 7,
    createdAt: '2024-01-07T00:00:00Z',
    updatedAt: '2024-01-07T00:00:00Z'
  },
  {
    id: '8',
    name: 'Git',
    category: 'tools',
    proficiency: 5,
    iconUrl: '/icons/git.svg',
    order: 8,
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '9',
    name: 'Docker',
    category: 'tools',
    proficiency: 3,
    iconUrl: '/icons/docker.svg',
    order: 9,
    createdAt: '2024-01-09T00:00:00Z',
    updatedAt: '2024-01-09T00:00:00Z'
  },
  {
    id: '10',
    name: 'AWS',
    category: 'tools',
    proficiency: 3,
    iconUrl: '/icons/aws.svg',
    order: 10,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  }
];

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// GET /api/admin/skills
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    const result = await skillOperations.getAll({
      page,
      limit,
      category: category || undefined,
      search: search || undefined
    });

    const skills = result.skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      category: skill.category,
      proficiency: skill.proficiency,
      iconUrl: skill.icon_url,
      iconName: skill.icon_name,
      iconLibrary: skill.icon_library,
      iconEmoji: skill.icon_emoji,
      iconType: skill.icon_type,
      orderIndex: skill.order_index,
      createdAt: skill.created_at,
      updatedAt: skill.updated_at
    }));

    const response = {
      success: true,
      data: skills,
      pagination: {
        total: result.totalCount,
        page,
        limit,
        totalPages: result.totalPages
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch skills' },
      { status: 500 }
    );
  }
}

// POST /api/admin/skills
export async function POST(request: NextRequest) {
  try {
    const data: CreateSkill = await request.json();
    
    // Validate required fields
    if (!data.name || !data.category || typeof data.proficiency !== 'number') {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newSkill = await skillOperations.create({
      name: data.name,
      category: data.category,
      proficiency: data.proficiency,
      iconUrl: data.iconUrl,
      iconName: data.iconName,
      iconLibrary: data.iconLibrary,
      iconEmoji: data.iconEmoji,
      iconType: data.iconType,
      orderIndex: data.orderIndex || 0
    });

    if (!newSkill) {
      return NextResponse.json(
        { success: false, error: 'Failed to create skill' },
        { status: 500 }
      );
    }

    const response = {
      success: true,
      data: {
        id: newSkill.id,
        name: newSkill.name,
        category: newSkill.category,
        proficiency: newSkill.proficiency,
        iconUrl: newSkill.icon_url,
        iconName: newSkill.icon_name,
        iconLibrary: newSkill.icon_library,
        iconEmoji: newSkill.icon_emoji,
        iconType: newSkill.icon_type,
        orderIndex: newSkill.order_index,
        createdAt: newSkill.created_at,
        updatedAt: newSkill.updated_at
      },
      message: 'Skill created successfully'
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create skill' },
      { status: 500 }
    );
  }
}
