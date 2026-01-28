const { Pool } = require('pg');
require('dotenv').config();

async function updateExperience() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Updating Steve\'s AI LAB experience...');

    const updatedExperience = {
      company: 'Steves AI Lab Pvt Ltd',
      position: 'Python Developer',
      description: 'Developed AI-powered applications and automation solutions using modern Python frameworks and AI technologies.',
      responsibilities: [
        'Developed custom AI chatbots using OpenAI & LangChain',
        'Integrated Large Language Models (LLM) for various applications',
        'Implemented web scraping solutions using Selenium and Beautiful Soup',
        'Built REST APIs using Flask and FastAPI frameworks',
        'Worked with OpenAI Products and OpenCV for computer vision tasks',
        'Processed and analyzed CSV data for various business applications',
        'Implemented automation solutions using Selenium WebDriver',
        'Developed data processing pipelines with DBC and Mf4 formats'
      ],
      technologies: [
        'Python',
        'OpenAI',
        'Large Language Models (LLM)',
        'Web Scraping',
        'Selenium',
        'Selenium WebDriver',
        'LangChain',
        'OpenCV',
        'Flask',
        'FastAPI',
        'Beautiful Soup',
        'CSV',
        'DBC',
        'Mf4',
        'OpenAI Products'
      ],
      start_date: '2024-02-01', // Feb 2024
      end_date: '2025-11-30',  // Nov 2025
      location: 'Indore, Madhya Pradesh, India',
      employment_type: 'full-time'
    };

    const updateQuery = `
      UPDATE experiences
      SET
        company = $1,
        position = $2,
        description = $3,
        responsibilities = $4,
        technologies = $5,
        start_date = $6,
        end_date = $7,
        location = $8,
        employment_type = $9,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 'exp_steve_ai_lab'
    `;

    const values = [
      updatedExperience.company,
      updatedExperience.position,
      updatedExperience.description,
      JSON.stringify(updatedExperience.responsibilities),
      JSON.stringify(updatedExperience.technologies),
      updatedExperience.start_date,
      updatedExperience.end_date,
      updatedExperience.location,
      updatedExperience.employment_type
    ];

    const result = await client.query(updateQuery, values);

    if (result.rowCount > 0) {
      console.log('✅ Experience updated successfully!');

      // Show the updated experience
      console.log('\n=== UPDATED EXPERIENCE ===');
      const updatedData = await client.query(`
        SELECT position, company, start_date, end_date, location, employment_type,
               description, responsibilities, technologies
        FROM experiences
        WHERE id = 'exp_steve_ai_lab'
      `);

      const exp = updatedData.rows[0];
      console.log(`Position: ${exp.position}`);
      console.log(`Company: ${exp.company}`);
      console.log(`Duration: ${exp.start_date} - ${exp.end_date || 'Present'}`);
      console.log(`Location: ${exp.location}`);
      console.log(`Type: ${exp.employment_type}`);
      console.log(`Description: ${exp.description}`);
      console.log(`Responsibilities: ${exp.responsibilities.length} items`);
      console.log(`Technologies: ${exp.technologies.join(', ')}`);

    } else {
      console.log('❌ No experience found with id "exp_steve_ai_lab".');
    }

    await client.release();
  } catch (error) {
    console.error('Error updating experience:', error);
  } finally {
    await pool.end();
  }
}

updateExperience();