const { Pool } = require('pg');
require('dotenv').config();

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();
  try {
    const url = 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=1200&q=80';
    await client.query('UPDATE projects SET image_url = $1 WHERE id = $2', [url, 'hubspot-dropbox-integration-1769174910097']);
    const r = await client.query("SELECT id, image_url FROM projects WHERE id = $1", ['hubspot-dropbox-integration-1769174910097']);
    console.log('project image:', r.rows[0]);
  } catch (e) {
    console.error('Error:', e.message);
  } finally {
    client.release();
    await pool.end();
  }
})();
