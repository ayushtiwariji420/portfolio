const { Pool } = require('pg');
require('dotenv').config();

async function removeTensorFlow() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Finding TensorFlow skills...');

    // Find TensorFlow skills
    const result = await client.query(
      "SELECT id, name FROM skills WHERE LOWER(name) LIKE '%tensorflow%'"
    );

    console.log(`Found ${result.rows.length} TensorFlow skill(s):`);
    result.rows.forEach(skill => {
      console.log(`- ID: ${skill.id}, Name: ${skill.name}`);
    });

    if (result.rows.length === 0) {
      console.log('No TensorFlow skills found to remove.');
      client.release();
      await pool.end();
      return;
    }

    // Remove the first TensorFlow skill found
    const skillToRemove = result.rows[0];
    console.log(`\nRemoving TensorFlow skill: ${skillToRemove.name} (ID: ${skillToRemove.id})`);

    await client.query('DELETE FROM skills WHERE id = $1', [skillToRemove.id]);

    console.log('✅ TensorFlow skill removed successfully!');

    // Verify removal
    const verifyResult = await client.query(
      "SELECT COUNT(*) as count FROM skills WHERE LOWER(name) LIKE '%tensorflow%'"
    );

    console.log(`\nVerification: ${verifyResult.rows[0].count} TensorFlow skill(s) remaining`);

    client.release();
    await pool.end();

  } catch (error) {
    console.error('❌ Error removing TensorFlow skill:', error);
    await pool.end();
  }
}

removeTensorFlow();