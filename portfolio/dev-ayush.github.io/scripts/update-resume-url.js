const { Pool } = require('pg');
require('dotenv').config();

async function updateResumeUrl() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Updating resume URL...');

    const updateQuery = `
      UPDATE personal_info
      SET
        resume_url = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 'main'
    `;

    const resumeUrl = '/resume.pdf'; // Path to resume in public folder

    const result = await client.query(updateQuery, [resumeUrl]);

    if (result.rowCount > 0) {
      console.log('✅ Resume URL updated successfully!');
      console.log(`Updated ${result.rowCount} record(s)`);

      // Show the updated data
      console.log('\n=== UPDATED RESUME INFO ===');
      const updatedData = await client.query('SELECT name, resume_url, updated_at FROM personal_info WHERE id = \'main\'');
      const info = updatedData.rows[0];

      console.log(`Name: ${info.name}`);
      console.log(`Resume URL: ${info.resume_url}`);
      console.log(`Updated at: ${info.updated_at}`);

    } else {
      console.log('❌ No records were updated. Personal info with id "main" not found.');
    }

    await client.release();
  } catch (error) {
    console.error('Error updating resume URL:', error);
  } finally {
    await pool.end();
  }
}

updateResumeUrl();