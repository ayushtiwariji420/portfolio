const { Pool } = require('pg');
require('dotenv').config();

async function patchExperiences() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('Connected — patching experiences...');

    // 1) Update freelance start date and description
    const freelanceQuery = `UPDATE experiences
       SET start_date = $1,
           description = $2,
           responsibilities = $3,
           technologies = $4,
           location = $5,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $6 OR (company ILIKE '%Freelance%' AND position ILIKE '%Generative AI%')`;

    const freelanceParams = [
      '2021-09-01',
      `Helping startups, agencies, and enterprises build end-to-end Gen AI applications using LLMs, RAG, LangChain, OpenAI, and Pinecone. Open for short/long-term freelance projects.`,
      JSON.stringify([
        'Developed custom AI chatbots using OpenAI & LangChain',
        'Integrated RAG pipelines for enterprise data',
        'Built AI tools for document parsing, summarization, and automation',
        'Worked with ChromaDB, Pinecone, Weaviate',
        'Delivered projects using FastAPI, Django, and Streamlit',
        'Deployed scalable AI services on AWS & Docker'
      ]),
      JSON.stringify([
        'Python','LLMs','RAG','LangChain','OpenAI','Pinecone','ChromaDB','Weaviate','FastAPI','Django','Streamlit','AWS','Docker'
      ]),
      'Indore, Madhya Pradesh, India · Remote',
      'exp_freelance_genai_1768542257564'
    ];

    console.log('Running freelance UPDATE with params:', freelanceParams);
    await client.query(freelanceQuery, freelanceParams);

    console.log('✅ Freelance entry updated (if present)');

    // 2) Update Steves AI Lab dates and brief tech list
    await client.query(
      `UPDATE experiences
       SET start_date = $1,
           end_date = $2,
           position = $3,
           technologies = $4,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = 'exp_steve_ai_lab'` ,
      [ '2023-02-01', '2025-08-31', 'Python Developer', JSON.stringify(['Python','OpenAI','Web Scraping','Flask','FastAPI']) ]
    );

    console.log('✅ Steves AI Lab entry updated');

    // 3) Insert Shiva Concept Solution internship if not exists
    const { rowCount } = await client.query(
      `SELECT 1 FROM experiences WHERE id = 'exp_shiva_concept_2022' LIMIT 1`
    );

    if (rowCount === 0) {
      await client.query(
        `INSERT INTO experiences (
          id, company, position, description, responsibilities, technologies,
          start_date, end_date, company_url, location, employment_type, order_index, created_at, updated_at
        ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,CURRENT_TIMESTAMP,CURRENT_TIMESTAMP)` ,
        [
          'exp_shiva_concept_2022',
          'Shiva Concept Solution',
          'Full Stack Developer (Internship)',
          'Internship — worked on front-end and back-end tasks using modern web stacks and Django.',
          JSON.stringify([
            'Worked on HTML5, CSS, JavaScript, Bootstrap',
            'Built backend features using Python and Django',
            'Collaborated with the team on integration and QA'
          ]),
          JSON.stringify(['HTML5','CSS','JavaScript','Bootstrap','Python','Django']),
          '2022-03-01',
          '2022-10-31',
          null,
          'Indore, Madhya Pradesh, India · On-site',
          'internship',
          3
        ]
      );
      console.log('✅ Shiva Concept Solution (internship) inserted');
    } else {
      console.log('ℹ️ Shiva Concept Solution already exists — skipping insert');
    }

    await client.release();
  } catch (err) {
    console.error('Error patching experiences:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

patchExperiences();
