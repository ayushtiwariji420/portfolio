const { Pool } = require('pg');
require('dotenv').config();

async function updateProjectUrl() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Updating project URL...');

    const updateQuery = `
      UPDATE projects
      SET
        live_url = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE title = $2
    `;

    const liveUrl = 'https://app.baizel.ai/';
    const projectTitle = 'Bzail Site Selection Tool';

    const result = await client.query(updateQuery, [liveUrl, projectTitle]);

    if (result.rowCount > 0) {
      console.log('✅ Project URL updated successfully!');
      console.log(`Updated ${result.rowCount} record(s)`);

      // Show the updated data
      console.log('\n=== UPDATED PROJECT INFO ===');
      const updatedData = await client.query('SELECT title, live_url, updated_at FROM projects WHERE title = $1', [projectTitle]);
      const project = updatedData.rows[0];

      console.log(`Title: ${project.title}`);
      console.log(`Live URL: ${project.live_url}`);
      console.log(`Updated at: ${project.updated_at}`);

    } else {
      console.log('❌ No records were updated. Project not found.');
    }

    await client.release();
  } catch (error) {
    console.error('Error updating project URL:', error);
  } finally {
    await pool.end();
  }
}

updateProjectUrl();