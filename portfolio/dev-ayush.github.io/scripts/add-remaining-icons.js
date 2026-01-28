const { Pool } = require('pg');
require('dotenv').config();

async function addRemainingSkillIcons() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Adding icons to remaining skills...');

    // Additional icon mappings for remaining skills
    const remainingSkillIcons = {
      'LLM': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'N8n': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
      'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
      'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg'
    };

    // Get skills that don't have icons yet
    const skillsResult = await client.query(
      'SELECT id, name FROM skills WHERE icon_url IS NULL ORDER BY name'
    );
    const skillsWithoutIcons = skillsResult.rows;

    console.log(`Found ${skillsWithoutIcons.length} skills without icons`);

    let updatedCount = 0;

    for (const skill of skillsWithoutIcons) {
      const iconUrl = remainingSkillIcons[skill.name];

      if (iconUrl) {
        await client.query(
          'UPDATE skills SET icon_url = $1, icon_type = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
          [iconUrl, 'url', skill.id]
        );
        console.log(`✅ Updated ${skill.name} with icon`);
        updatedCount++;
      } else {
        console.log(`⚠️  No icon mapping found for ${skill.name}`);
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} additional skills with icons`);

    // Show final count of skills with icons
    const finalCount = await client.query(
      'SELECT COUNT(*) as count FROM skills WHERE icon_url IS NOT NULL'
    );

    console.log(`\n📊 Total skills with icons: ${finalCount.rows[0].count}`);

    client.release();
    await pool.end();

  } catch (error) {
    console.error('❌ Error adding remaining skill icons:', error);
    await pool.end();
  }
}

addRemainingSkillIcons();