const { Pool } = require('pg');
require('dotenv').config();

async function listTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    const res = await client.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name");
    console.log('\nPublic tables:');
    res.rows.forEach(r => console.log('-', r.table_name));
    client.release();
  } catch (err) {
    console.error('Error listing tables:', err.message);
  } finally {
    await pool.end();
  }
}

listTables();
