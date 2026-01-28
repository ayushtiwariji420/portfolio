const { Pool } = require('pg');
require('dotenv').config();

async function addExperience() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Adding new experience...');

    const newExperience = {
      id: 'exp_freelance_genai_' + Date.now(),
      company: 'Self Employed · Freelance',
      position: 'Freelance Generative AI Developer',
      description: 'Helping startups, agencies, and enterprises build end-to-end Gen AI applications using LLMs, RAG, LangChain, OpenAI, and Pinecone.',
      responsibilities: [
        'Developed custom AI chatbots using OpenAI & LangChain',
        'Integrated RAG pipelines for enterprise data',
        'Built AI tools for document parsing, summarization, and automation',
        'Worked with ChromaDB, Pinecone, Weaviate',
        'Delivered projects using FastAPI, Django, and Streamlit',
        'Deployed scalable AI services on AWS & Docker'
      ],
      technologies: [
        'Python',
        'LLMs',
        'RAG',
        'LangChain',
        'OpenAI',
        'Pinecone',
        'ChromaDB',
        'Weaviate',
        'FastAPI',
        'Django',
        'Streamlit',
        'AWS',
        'Docker'
      ],
      start_date: '2022-03-01',
      end_date: null, // Present
      company_url: null,
      location: 'Indore, Madhya Pradesh, India · Remote',
      employment_type: 'freelance',
      order_index: 0 // Will be the first/most recent experience
    };

    // First, update existing experiences to increment their order_index
    await client.query('UPDATE experiences SET order_index = order_index + 1');

    const insertQuery = `
      INSERT INTO experiences (
        id, company, position, description, responsibilities, technologies,
        start_date, end_date, company_url, location, employment_type, order_index,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    const values = [
      newExperience.id,
      newExperience.company,
      newExperience.position,
      newExperience.description,
      JSON.stringify(newExperience.responsibilities),
      JSON.stringify(newExperience.technologies),
      newExperience.start_date,
      newExperience.end_date,
      newExperience.company_url,
      newExperience.location,
      newExperience.employment_type,
      newExperience.order_index
    ];

    const result = await client.query(insertQuery, values);

    if (result.rowCount > 0) {
      console.log('✅ Experience added successfully!');

      // Show the updated experiences
      console.log('\n=== ALL EXPERIENCES ===');
      const allExperiences = await client.query(`
        SELECT position, company, start_date, end_date, location, employment_type
        FROM experiences
        ORDER BY order_index
      `);

      allExperiences.rows.forEach((exp, index) => {
        console.log(`${index + 1}. ${exp.position} at ${exp.company}`);
        console.log(`   ${exp.start_date} - ${exp.end_date || 'Present'} | ${exp.location} | ${exp.employment_type}`);
        console.log('---');
      });

    } else {
      console.log('❌ Failed to add experience.');
    }

    await client.release();
  } catch (error) {
    console.error('Error adding experience:', error);
  } finally {
    await pool.end();
  }
}

addExperience();