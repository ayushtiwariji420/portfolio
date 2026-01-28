const { Pool } = require('pg');
require('dotenv').config();

async function addMissingSkills() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    // Get existing skills
    const existingSkills = await client.query('SELECT name FROM skills');
    const existingNames = existingSkills.rows.map(row => row.name.toLowerCase());

    console.log('Checking for skills to add...');

    // Skills to potentially add
    const skillsToAdd = [
      { name: 'LLM', category: 'ai-ml', proficiency: 5 },
      { name: 'N8n', category: 'automation', proficiency: 4 },
      { name: 'Make.com', category: 'automation', proficiency: 4 },
      { name: 'Web Scraping', category: 'backend', proficiency: 4 },
      { name: 'OpenAI', category: 'ai-ml', proficiency: 5 },
      { name: 'LangChain', category: 'ai-ml', proficiency: 4 },
      { name: 'Vector DB', category: 'ai-ml', proficiency: 4 },
      { name: 'MCP', category: 'ai-ml', proficiency: 4 },
      { name: 'Agentic AI', category: 'ai-ml', proficiency: 5 },
      { name: 'AI Automation', category: 'ai-ml', proficiency: 5 },
      { name: 'Health Sector Automation', category: 'automation', proficiency: 4 },
      { name: 'Custom AI Tools', category: 'ai-ml', proficiency: 4 }
    ];

    let addedCount = 0;
    let skippedCount = 0;

    for (const skill of skillsToAdd) {
      if (existingNames.includes(skill.name.toLowerCase())) {
        console.log(`⏭️  Skipped: ${skill.name} (already exists)`);
        skippedCount++;
        continue;
      }

      try {
        const insertQuery = `
          INSERT INTO skills (
            id, name, category, proficiency, icon_type, order_index,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;

        const skillId = skill.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
        const values = [
          skillId,
          skill.name,
          skill.category,
          skill.proficiency,
          'react',
          0 // order_index
        ];

        await client.query(insertQuery, values);
        addedCount++;
        console.log(`✅ Added: ${skill.name} (${skill.category})`);

      } catch (error) {
        console.error(`❌ Error adding ${skill.name}:`, error.message);
      }
    }

    console.log(`\n🎉 Summary:`);
    console.log(`   Added: ${addedCount} skills`);
    console.log(`   Skipped: ${skippedCount} skills (already exist)`);

    // Show all skills after addition
    console.log('\n=== ALL SKILLS ===');
    const allSkills = await client.query(`
      SELECT name, category, proficiency
      FROM skills
      ORDER BY category, name
    `);

    const categories = {};
    allSkills.rows.forEach(skill => {
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

    await client.release();
  } catch (error) {
    console.error('Error managing skills:', error);
  } finally {
    await pool.end();
  }
}

addMissingSkills();