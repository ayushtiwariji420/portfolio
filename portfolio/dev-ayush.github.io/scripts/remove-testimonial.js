const { Pool } = require('pg');
require('dotenv').config();

async function removeTestimonial() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Removing Sarah Johnson testimonial...');

    const deleteQuery = `
      DELETE FROM testimonials
      WHERE name = $1
    `;

    const name = 'Sarah Johnson';

    const result = await client.query(deleteQuery, [name]);

    if (result.rowCount > 0) {
      console.log('✅ Testimonial removed successfully!');
      console.log(`Removed ${result.rowCount} record(s)`);

      // Update order_index for remaining testimonials
      console.log('Updating order indexes...');
      const updateOrderQuery = `
        UPDATE testimonials
        SET order_index = order_index - 1
        WHERE order_index > 1
      `;
      await client.query(updateOrderQuery);
      console.log('✅ Order indexes updated');

    } else {
      console.log('❌ No records were removed. Testimonial not found.');
    }

    await client.release();
  } catch (error) {
    console.error('Error removing testimonial:', error);
  } finally {
    await pool.end();
  }
}

removeTestimonial();