const { Pool } = require('pg');
require('dotenv').config();

// Usage: node scripts/transfer-db.js <SOURCE_DATABASE_URL>
const sourceUrl = process.argv[2];
const targetUrl = process.env.DATABASE_URL;

if (!sourceUrl) {
  console.error('Usage: node scripts/transfer-db.js <SOURCE_DATABASE_URL>');
  process.exit(1);
}
if (!targetUrl) {
  console.error('Target DATABASE_URL not found in .env');
  process.exit(1);
}

const tables = [
  'users',
  'projects',
  'skills',
  'experiences',
  'educations',
  'blogs',
  'comments',
  'testimonials',
  'personal_info',
  'settings',
  'contact_messages'
];

function normalizeValue(val) {
  if (val === null || val === undefined) return null;
  // If JSON-like string, try parse
  if (typeof val === 'string') {
    const s = val.trim();
    if ((s.startsWith('{') && s.endsWith('}')) || (s.startsWith('[') && s.endsWith(']'))) {
      try { return JSON.parse(s); } catch (e) { return val; }
    }
  }
  return val;
}

async function transfer() {
  const sourcePool = new Pool({ connectionString: sourceUrl, ssl: { rejectUnauthorized: false } });
  const targetPool = new Pool({ connectionString: targetUrl, ssl: { rejectUnauthorized: false } });

  try {
    const sourceClient = await sourcePool.connect();
    const targetClient = await targetPool.connect();

    for (const table of tables) {
      console.log(`\n=== TRANSFERRING TABLE: ${table} ===`);
      try {
        // get json/jsonb columns for this table so we can parse string values
        const colTypeRes = await sourceClient.query(
          `SELECT column_name, data_type FROM information_schema.columns WHERE table_name = $1`,
          [table]
        );
        const jsonCols = colTypeRes.rows
          .filter(r => r.data_type && (r.data_type.toLowerCase().includes('json')))
          .map(r => r.column_name);

        const res = await sourceClient.query(`SELECT * FROM ${table}`);
        console.log(`Found ${res.rows.length} rows in source.${table}`);
        let inserted = 0;

        for (const row of res.rows) {
          const cols = Object.keys(row);
          if (cols.length === 0) continue;
          const values = cols.map(c => {
            let v = row[c];
            if (v === null || v === undefined) return null;
            // If this column is json/jsonb in source, try to ensure JS object
            if (jsonCols.includes(c)) {
              // ensure we send a valid JSON string for json/jsonb columns
              if (typeof v === 'string') {
                // assume it's already JSON text
                return v;
              }
              try {
                return JSON.stringify(v);
              } catch (e) {
                return v;
              }
            }
            return normalizeValue(v);
          });
          const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

          // Build ON CONFLICT clause if primary key 'id' exists
          let conflictClause = '';
          if (cols.includes('id')) {
            const updateCols = cols.filter(c => c !== 'id');
            if (updateCols.length > 0) {
              const updates = updateCols.map(c => `${c}=EXCLUDED.${c}`).join(', ');
              conflictClause = `ON CONFLICT (id) DO UPDATE SET ${updates}`;
            } else {
              conflictClause = `ON CONFLICT (id) DO NOTHING`;
            }
          }

          const insertQuery = `INSERT INTO ${table} (${cols.join(',')}) VALUES (${placeholders}) ${conflictClause}`;

          try {
            await targetClient.query(insertQuery, values);
            inserted++;
          } catch (err) {
            console.error(`  Failed to upsert row in ${table}:`, err.message);
            console.error('    Query:', insertQuery);
            try { console.error('    Columns:', cols.join(',')); } catch (e) {}
            try { console.error('    Values sample:', JSON.stringify(values, null, 2)); } catch (e) { console.error('    (Could not stringify values)'); }
          }
        }

        console.log(`Inserted/Upserted ${inserted}/${res.rows.length} rows into target.${table}`);
      } catch (err) {
        console.error(`  Error processing table ${table}:`, err.message);
      }
    }

    sourceClient.release();
    targetClient.release();
  } catch (err) {
    console.error('Transfer error:', err.message);
  } finally {
    await sourcePool.end();
    await targetPool.end();
  }
}

transfer();
