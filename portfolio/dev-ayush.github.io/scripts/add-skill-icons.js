const { Pool } = require('pg');
require('dotenv').config();

async function addSkillIcons() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Adding icons to skills...');

    // Icon mappings for skills - using direct URLs from reliable sources
    const skillIcons = {
      // AI/ML Skills
      'Custom AI Tools': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'AI Automation': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
      'Agentic AI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'MCP': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Vector DB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
      'LangChain': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'OpenAI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',

      // Automation Skills
      'Health Sector Automation': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Make.com': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',

      // Backend Skills
      'Web Scraping': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'FastAPI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
      'Node.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',

      // Frontend Skills
      'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
      'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
      'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',

      // Database Skills
      'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
      'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',

      // Cloud Skills
      'AWS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg',
      'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
      'Google Cloud': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg',

      // Tools
      'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
      'Kubernetes': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg',
      'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',

      // AI/ML Categories
      'Machine Learning': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'Deep Learning': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
      'LLMs': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
      'RAG': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'
    };

    // Get all skills
    const skillsResult = await client.query('SELECT id, name FROM skills ORDER BY name');
    const skills = skillsResult.rows;

    console.log(`Found ${skills.length} skills to update with icons`);

    let updatedCount = 0;

    for (const skill of skills) {
      const iconUrl = skillIcons[skill.name];

      if (iconUrl) {
        await client.query(
          'UPDATE skills SET icon_url = $1, icon_type = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3',
          [iconUrl, 'url', skill.id]
        );
        console.log(`✅ Updated ${skill.name} with icon`);
        updatedCount++;
      } else {
        console.log(`⚠️  No icon found for ${skill.name}`);
      }
    }

    console.log(`\n🎉 Updated ${updatedCount} out of ${skills.length} skills with icons`);

    // Show updated skills
    console.log('\n📋 Skills with icons:');
    const updatedSkills = await client.query(
      'SELECT name, icon_url FROM skills WHERE icon_url IS NOT NULL ORDER BY name'
    );

    updatedSkills.rows.forEach(skill => {
      console.log(`- ${skill.name}: ${skill.icon_url}`);
    });

    client.release();
    await pool.end();

  } catch (error) {
    console.error('❌ Error adding skill icons:', error);
    await pool.end();
  }
}

addSkillIcons();