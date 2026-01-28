import { NextRequest, NextResponse } from 'next/server';
import { skillOperations } from '@/lib/database';

interface UpdateSkill {
  name?: string;
  category?: string;
  proficiency?: number;
  iconUrl?: string;
  iconName?: string;
  iconLibrary?: string;
  iconEmoji?: string;
  iconType?: string;
  orderIndex?: number;
}

// PUT /api/admin/skills/[id]
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const data: UpdateSkill = await request.json();
    
    // Update the skill
    const updatedSkill = await skillOperations.update(id, {
      name: data.name,
      category: data.category,
      proficiency: data.proficiency,
      iconUrl: data.iconUrl,
      iconName: data.iconName,
      iconLibrary: data.iconLibrary,
      iconEmoji: data.iconEmoji,
      iconType: data.iconType,
      orderIndex: data.orderIndex
    });

    if (!updatedSkill) {
      return NextResponse.json(
        { success: false, error: 'Skill not found or failed to update' },
        { status: 404 }
      );
    }

    const response = {
      success: true,
      data: {
        id: updatedSkill.id,
        name: updatedSkill.name,
        category: updatedSkill.category,
        proficiency: updatedSkill.proficiency,
        iconUrl: updatedSkill.icon_url,
        iconName: updatedSkill.icon_name,
        iconLibrary: updatedSkill.icon_library,
        iconEmoji: updatedSkill.icon_emoji,
        iconType: updatedSkill.icon_type,
        orderIndex: updatedSkill.order_index,
        createdAt: updatedSkill.created_at,
        updatedAt: updatedSkill.updated_at
      },
      message: 'Skill updated successfully'
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error updating skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update skill' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/skills/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    const deleted = await skillOperations.delete(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Skill not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete skill' },
      { status: 500 }
    );
  }
}
