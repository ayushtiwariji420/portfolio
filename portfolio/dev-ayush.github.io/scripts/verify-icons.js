const { Pool } = require('pg');
require('dotenv').config();

async function verifyIcons() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT COUNT(*) as count FROM skills WHERE icon_url IS NOT NULL');
    console.log(`Total skills with icons: ${result.rows[0].count}`);
    client.release();
    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

verifyIcons();