const { Pool } = require('pg');
require('dotenv').config();

async function findNaveen() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  const client = await pool.connect();
  const checks = [
    { table: 'personal_info', cols: ['name','bio'] },
    { table: 'projects', cols: ['title','description','long_description'] },
    { table: 'blogs', cols: ['title','content','excerpt'] },
    { table: 'testimonials', cols: ['name','company','content'] },
    { table: 'users', cols: ['username','email'] },
    { table: 'contact_messages', cols: ['name','email','message'] }
  ];

  try {
    for (const c of checks) {
      for (const col of c.cols) {
        try {
          const res = await client.query(`SELECT id, ${col} FROM ${c.table} WHERE ${col} ILIKE '%Naveen%' LIMIT 20`);
          if (res.rows.length > 0) {
            console.log(`${c.table}.${col}:`);
            console.dir(res.rows, { depth: 2 });
          }
        } catch (e) {
          // ignore columns that don't exist or other errors
        }
      }
    }
  } finally {
    client.release();
    await pool.end();
  }
}

findNaveen().catch(err => { console.error(err); process.exit(1); });
