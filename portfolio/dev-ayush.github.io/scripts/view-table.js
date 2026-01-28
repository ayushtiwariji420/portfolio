const { Pool } = require('pg');
require('dotenv').config();

async function viewTableData(tableName, limit = 10) {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log(`\n=== ${tableName.toUpperCase()} TABLE ===\n`);
    const client = await pool.connect();

    // Get table structure
    const structureQuery = `
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
      ORDER BY ordinal_position
    `;
    const structure = await client.query(structureQuery, [tableName]);
    console.log('Columns:', structure.rows.map(col => `${col.column_name} (${col.data_type})`).join(', '));

    // Get data - try created_at first, then updated_at
    let dataQuery;
    try {
      dataQuery = `SELECT * FROM ${tableName} ORDER BY created_at DESC LIMIT $1`;
      await client.query(dataQuery, [1]); // Test if created_at exists
    } catch (error) {
      // If created_at doesn't exist, use updated_at or no ordering
      try {
        dataQuery = `SELECT * FROM ${tableName} ORDER BY updated_at DESC LIMIT $1`;
        await client.query(dataQuery, [1]); // Test if updated_at exists
      } catch (error2) {
        // If neither exists, just select without ordering
        dataQuery = `SELECT * FROM ${tableName} LIMIT $1`;
      }
    }
    const result = await client.query(dataQuery, [limit]);

    if (result.rows.length === 0) {
      console.log('No data found in this table.');
    } else {
      console.log(`\nShowing ${result.rows.length} records:\n`);
      result.rows.forEach((row, index) => {
        console.log(`${index + 1}.`, JSON.stringify(row, null, 2));
        console.log('---');
      });
    }

    await client.release();
  } catch (error) {
    console.error(`Error viewing ${tableName}:`, error.message);
  } finally {
    await pool.end();
  }
}

// Get table name from command line argument
const tableName = process.argv[2];
if (!tableName) {
  console.log('Usage: node scripts/view-table.js <table_name> [limit]');
  console.log('Available tables: projects, skills, experiences, blogs, testimonials, educations, comments, personal_info, settings, users');
  process.exit(1);
}

const limit = parseInt(process.argv[3]) || 10;
viewTableData(tableName, limit);