const { Pool } = require('pg');
require('dotenv').config();

async function updateEducation() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    const client = await pool.connect();
    console.log('Connected — updating data...');

    // 1) Delete 7 Frames experience
    const deleteExpResult = await client.query(
      `DELETE FROM experiences WHERE id = 'exp_7_frames'`
    );
    console.log(`✅ Removed 7 Frames experience (${deleteExpResult.rowCount} rows deleted)`);

    // 2) Clear existing educations
    const deleteEduResult = await client.query(`DELETE FROM educations`);
    console.log(`✅ Cleared ${deleteEduResult.rowCount} existing educations`);

    // 3) Insert MCA (Master of Computer Applications)
    await client.query(
      `INSERT INTO educations (
        id, degree, institution, start_date, end_date, location, grade,
        description, achievements, courses, order_index, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        'edu_mca_' + Date.now(),
        'Master of Computer Applications (MCA)',
        'Dr. A P J Abdul Kalam University',
        '2022-06-01',
        '2024-07-31',
        'Indore',
        '7.8',
        JSON.stringify(['Advanced studies in Computer Science and Applications']),
        JSON.stringify(['Completed MCA with grade 7.8']),
        JSON.stringify(['Data Structures', 'Web Development', 'Machine Learning', 'Database Management']),
        0
      ]
    );
    console.log('✅ Added MCA (Dr. A P J Abdul Kalam University)');

    // 4) Insert Bachelor's degree
    await client.query(
      `INSERT INTO educations (
        id, degree, institution, start_date, end_date, location, grade,
        description, achievements, courses, order_index, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [
        'edu_bsc_' + Date.now(),
        'Bachelor of Science in Computer Science',
        'Maharaja Chhatarsal College of Education',
        '2017-06-01',
        '2020-05-31',
        'Chhatarpur',
        'B',
        JSON.stringify(['Undergraduate degree in Computer Science']),
        JSON.stringify(['Active in theatre, music, and anchoring']),
        JSON.stringify(['Programming', 'Database Design', 'Web Technologies', 'Software Engineering']),
        1
      ]
    );
    console.log('✅ Added Bachelor\'s degree (Maharaja Chhatarsal College)');

    // Show summary
    console.log('\n=== EDUCATION SUMMARY ===');
    const allEdu = await client.query(
      `SELECT degree, institution, start_date, end_date, grade FROM educations ORDER BY order_index`
    );
    allEdu.rows.forEach((edu, i) => {
      console.log(`${i + 1}. ${edu.degree}`);
      console.log(`   Institution: ${edu.institution}`);
      console.log(`   Duration: ${edu.start_date} - ${edu.end_date} | Grade: ${edu.grade}`);
    });

    await client.release();
  } catch (err) {
    console.error('Error updating education:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

updateEducation();