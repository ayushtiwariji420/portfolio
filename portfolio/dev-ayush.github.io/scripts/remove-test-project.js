const { Pool } = require('pg');
require('dotenv').config();

async function removeTestProject() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Finding test project...');

    // Find the test project by title
    const result = await client.query(
      "SELECT id, title FROM projects WHERE title LIKE '%Test Project%'"
    );

    console.log(`Found ${result.rows.length} test project(s):`);
    result.rows.forEach(project => {
      console.log(`- ID: ${project.id}, Title: ${project.title}`);
    });

    if (result.rows.length === 0) {
      console.log('No test projects found to remove.');
      client.release();
      await pool.end();
      return;
    }

    // Remove the test project
    const projectToRemove = result.rows[0];
    console.log(`\nRemoving test project: ${projectToRemove.title} (ID: ${projectToRemove.id})`);

    await client.query('DELETE FROM projects WHERE id = $1', [projectToRemove.id]);

    console.log('✅ Test project removed successfully!');

    // Verify removal
    const verifyResult = await client.query(
      "SELECT COUNT(*) as count FROM projects WHERE title LIKE '%Test Project%'"
    );

    console.log(`\nVerification: ${verifyResult.rows[0].count} test project(s) remaining`);

    client.release();
    await pool.end();

  } catch (error) {
    console.error('❌ Error removing test project:', error);
    await pool.end();
  }
}

removeTestProject();