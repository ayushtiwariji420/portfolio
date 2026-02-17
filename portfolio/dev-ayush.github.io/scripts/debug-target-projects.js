const { Pool } = require('pg');
require('dotenv').config();

(async () => {
  const url = process.env.DATABASE_URL;
  if (!url) { console.error('Target DATABASE_URL not found'); process.exit(1); }
  const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });
  try {
    const client = await pool.connect();
    const cols = await client.query("SELECT column_name,data_type FROM information_schema.columns WHERE table_name='projects' ORDER BY ordinal_position");
    console.log('TARGET COLUMNS:', cols.rows);
    const r = await client.query("SELECT id, technologies FROM projects LIMIT 3");
    console.log('TARGET SAMPLE ROWS:');
    console.dir(r.rows, { depth: 5 });
    client.release();
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
})();
