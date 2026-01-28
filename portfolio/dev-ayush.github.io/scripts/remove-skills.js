const { Pool } = require('pg');
require('dotenv').config();

async function removeSkills() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    // Skills to remove
    const skillsToRemove = [
      'TEST 123454',
      'ML-AI',
      'Java',
      'Test skill',
      'TypeScript',
      'Next.js',
      'Node.js',
      'MongoDB',
      'ts',
      'tsfadf'
    ];

    console.log('Removing unwanted skills...');

    let removedCount = 0;

    for (const skillName of skillsToRemove) {
      try {
        const deleteQuery = `DELETE FROM skills WHERE name = $1`;
        const result = await client.query(deleteQuery, [skillName]);

        if (result.rowCount > 0) {
          removedCount++;
          console.log(`✅ Removed: ${skillName}`);
        } else {
          console.log(`⚠️  Not found: ${skillName}`);
        }

      } catch (error) {
        console.error(`❌ Error removing ${skillName}:`, error.message);
      }
    }

    console.log(`\n🎉 Summary:`);
    console.log(`   Removed: ${removedCount} skills`);
    console.log(`   Not found: ${skillsToRemove.length - removedCount} skills`);

    // Show remaining skills
    console.log('\n=== REMAINING SKILLS ===');
    const remainingSkills = await client.query(`
      SELECT name, category, proficiency
      FROM skills
      ORDER BY category, name
    `);

    const categories = {};
    remainingSkills.rows.forEach(skill => {
      if (!categories[skill.category]) {
        categories[skill.category] = [];
      }
      categories[skill.category].push(skill);
    });

    Object.keys(categories).sort().forEach(category => {
      console.log(`\n${category.toUpperCase()}:`);
      categories[category].forEach(skill => {
        console.log(`   - ${skill.name} (Proficiency: ${skill.proficiency})`);
      });
    });

    console.log(`\nTotal remaining skills: ${remainingSkills.rows.length}`);

    await client.release();
  } catch (error) {
    console.error('Error removing skills:', error);
  } finally {
    await pool.end();
  }
}

removeSkills();