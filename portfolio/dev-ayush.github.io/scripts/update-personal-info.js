const { Pool } = require('pg');
require('dotenv').config();

async function updatePersonalInfo() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Updating personal info...');

    const updateQuery = `
      UPDATE personal_info
      SET
        name = $1,
        title = $2,
        email = $3,
        phone = $4,
        location = $5,
        social_links = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = 'main'
    `;

    const newSocialLinks = {
      github: 'https://github.com/naveenpatidar1211',
      twitter: '',
      website: '',
      youtube: '',
      linkedin: 'https://www.linkedin.com/in/naveenpatidar1/',
      instagram: ''
    };

    const values = [
      'Naveen Patidar',                    // name
      'Python & Gen. AI Developer',        // title
      'naveenpatidar951@gmail.com',        // email
      '9171809182',                        // phone
      'Indore(M.P.) INDIA',                // location
      JSON.stringify(newSocialLinks)       // social_links
    ];

    const result = await client.query(updateQuery, values);

    if (result.rowCount > 0) {
      console.log('✅ Personal info updated successfully!');
      console.log(`Updated ${result.rowCount} record(s)`);

      // Show the updated data
      console.log('\n=== UPDATED PERSONAL INFO ===');
      const updatedData = await client.query('SELECT * FROM personal_info WHERE id = \'main\'');
      const info = updatedData.rows[0];

      console.log(`Name: ${info.name}`);
      console.log(`Title: ${info.title}`);
      console.log(`Email: ${info.email}`);
      console.log(`Phone: ${info.phone}`);
      console.log(`Location: ${info.location}`);
      console.log(`GitHub: ${info.social_links.github}`);
      console.log(`LinkedIn: ${info.social_links.linkedin}`);
      console.log(`Updated at: ${info.updated_at}`);

    } else {
      console.log('❌ No records were updated. Personal info with id "main" not found.');
    }

    await client.release();
  } catch (error) {
    console.error('Error updating personal info:', error);
  } finally {
    await pool.end();
  }
}

updatePersonalInfo();