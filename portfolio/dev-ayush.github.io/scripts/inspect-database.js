const { Pool } = require('pg');
require('dotenv').config();

async function inspectDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('\n=== DATABASE INSPECTION ===\n');

    // Check projects
    console.log('PROJECTS:');
    const projects = await client.query('SELECT id, title, description, featured, category FROM projects ORDER BY created_at DESC LIMIT 5');
    projects.rows.forEach(project => {
      console.log(`- ${project.title} (${project.category}) - Featured: ${project.featured}`);
    });

    // Check skills
    console.log('\nSKILLS:');
    const skills = await client.query('SELECT name, category, proficiency FROM skills ORDER BY order_index LIMIT 10');
    skills.rows.forEach(skill => {
      console.log(`- ${skill.name} (${skill.category}) - Proficiency: ${skill.proficiency}`);
    });

    // Check experiences
    console.log('\nEXPERIENCES:');
    const experiences = await client.query('SELECT company, position, start_date, end_date FROM experiences ORDER BY order_index');
    experiences.rows.forEach(exp => {
      console.log(`- ${exp.position} at ${exp.company} (${exp.start_date} - ${exp.end_date || 'Present'})`);
    });

    // Check testimonials
    console.log('\nTESTIMONIALS:');
    const testimonials = await client.query('SELECT COUNT(*) as count FROM testimonials');
    console.log(`Total testimonials: ${testimonials.rows[0].count}`);

    // Check blogs
    console.log('\nBLOGS:');
    const blogs = await client.query('SELECT COUNT(*) as count FROM blogs');
    console.log(`Total blogs: ${blogs.rows[0].count}`);

    // Check educations
    console.log('\nEDUCATIONS:');
    const educations = await client.query('SELECT COUNT(*) as count FROM educations');
    console.log(`Total educations: ${educations.rows[0].count}`);

    await client.release();
    console.log('\n=== INSPECTION COMPLETE ===');

  } catch (error) {
    console.error('Error inspecting database:', error);
  } finally {
    await pool.end();
  }
}

inspectDatabase();