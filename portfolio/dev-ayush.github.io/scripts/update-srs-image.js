const { Pool } = require('pg');
require('dotenv').config();

async function updateSRSImage() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Updating SRS Agent project image...');

    const updateQuery = `
      UPDATE projects
      SET
        image_url = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE title = $2
    `;

    const imageUrl = 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=600&h=400&fit=crop';
    const projectTitle = 'SRS Agent: AI-Powered Medical Documentation';

    const result = await client.query(updateQuery, [imageUrl, projectTitle]);

    if (result.rowCount > 0) {
      console.log('✅ SRS Agent image updated successfully!');
      console.log(`Updated ${result.rowCount} record(s)`);

      // Show the updated data
      console.log('\n=== UPDATED SRS AGENT PROJECT ===');
      const updatedData = await client.query('SELECT title, image_url, updated_at FROM projects WHERE title = $1', [projectTitle]);
      const project = updatedData.rows[0];

      console.log(`Title: ${project.title}`);
      console.log(`Image URL: ${project.image_url}`);
      console.log(`Updated at: ${project.updated_at}`);

    } else {
      console.log('❌ No records were updated. Project not found.');
    }

    await client.release();
  } catch (error) {
    console.error('Error updating SRS Agent image:', error);
  } finally {
    await pool.end();
  }
}

updateSRSImage();