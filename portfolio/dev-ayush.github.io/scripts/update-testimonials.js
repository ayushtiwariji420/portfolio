const { Pool } = require('pg');
require('dotenv').config();

async function updateTestimonials() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Updating testimonials to change "Pankaj" to "Naveen"...');

    // Update all testimonials that contain "Pankaj" in the content
    const updateQuery = `
      UPDATE testimonials
      SET
        content = REPLACE(content, 'Pankaj', 'Naveen'),
        updated_at = CURRENT_TIMESTAMP
      WHERE content LIKE '%Pankaj%'
    `;

    const result = await client.query(updateQuery);

    console.log(`✅ Updated ${result.rowCount} testimonial(s)`);

    // Show the updated testimonials
    console.log('\n=== UPDATED TESTIMONIALS ===');
    const updatedTestimonials = await client.query('SELECT name, content FROM testimonials ORDER BY order_index');

    updatedTestimonials.rows.forEach((testimonial, index) => {
      console.log(`${index + 1}. ${testimonial.name}:`);
      console.log(`   "${testimonial.content}"`);
      console.log('---');
    });

    await client.release();
  } catch (error) {
    console.error('Error updating testimonials:', error);
  } finally {
    await pool.end();
  }
}

updateTestimonials();