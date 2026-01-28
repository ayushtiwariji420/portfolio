const { Pool } = require('pg');
require('dotenv').config();

async function checkProjectCount() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT COUNT(*) as count FROM projects');
    console.log(`Total projects remaining: ${result.rows[0].count}`);
    client.release();
  } catch (error) {
    console.error('Error checking project count:', error);
  } finally {
    await pool.end();
  }
}

checkProjectCount();