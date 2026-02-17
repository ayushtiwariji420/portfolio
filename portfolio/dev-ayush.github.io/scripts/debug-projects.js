const { Pool } = require('pg');

(async () => {
  const source = process.argv[2];
  if (!source) {
    console.error('Usage: node scripts/debug-projects.js <SOURCE_DATABASE_URL>');
    process.exit(1);
  }
  const pool = new Pool({ connectionString: source, ssl: { rejectUnauthorized: false } });
  try {
    const client = await pool.connect();
    const cols = await client.query("SELECT column_name,data_type FROM information_schema.columns WHERE table_name='projects' ORDER BY ordinal_position");
    console.log('COLUMNS:', cols.rows);
    const r = await client.query("SELECT id, technologies, long_description FROM projects LIMIT 5");
    console.log('SAMPLE ROWS:');
    console.dir(r.rows, { depth: 5 });
    client.release();
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
})();
