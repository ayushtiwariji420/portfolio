const { Pool } = require('pg');
require('dotenv').config();

async function updateEducation() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to database...');
    const client = await pool.connect();

    console.log('Removing old education entries...');

    // Remove all existing education entries
    const deleteResult = await client.query('DELETE FROM educations');
    console.log(`✅ Removed ${deleteResult.rowCount} old education entries`);

    console.log('Adding new education entries...');

    const newEducations = [
      {
        id: 'edu_mca_rgpv_' + Date.now(),
        degree: 'Master of Computer Applications (MCA)',
        institution: 'RGPV University',
        start_date: '2023',
        end_date: '2025',
        location: 'Bhopal, Madhya Pradesh, India',
        grade: '',
        description: [
          'Pursuing Master of Computer Applications',
          'Focus on advanced computer science concepts and applications',
          'Specialization in software development and system design'
        ],
        achievements: [
          'Currently pursuing MCA degree',
          'Gaining expertise in advanced computing technologies'
        ],
        courses: [
          'Advanced Programming',
          'Database Management Systems',
          'Software Engineering',
          'Web Technologies',
          'Data Structures and Algorithms',
          'Computer Networks',
          'Operating Systems'
        ],
        institution_url: '',
        order_index: 0
      },
      {
        id: 'edu_bca_vikram_' + Date.now(),
        degree: 'Bachelor of Computer Application (BCA), Computer Science',
        institution: 'Vikram University',
        start_date: '2020',
        end_date: '2023',
        location: 'Ujjain, Madhya Pradesh, India',
        grade: '',
        description: [
          'Completed Bachelor of Computer Applications in Computer Science',
          'Comprehensive study of computer science fundamentals and applications',
          'Hands-on experience with programming and software development'
        ],
        achievements: [
          'Successfully completed BCA degree',
          'Developed strong foundation in computer science',
          'Gained practical programming skills'
        ],
        courses: [
          'Programming Fundamentals',
          'Data Structures',
          'Computer Organization',
          'Database Management',
          'Web Development',
          'Software Engineering',
          'Computer Networks',
          'Operating Systems',
          'Mathematics for Computing'
        ],
        institution_url: '',
        order_index: 1
      }
    ];

    let addedCount = 0;

    for (const education of newEducations) {
      try {
        const insertQuery = `
          INSERT INTO educations (
            id, degree, institution, start_date, end_date, location, grade,
            description, achievements, courses, institution_url, order_index,
            created_at, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `;

        const values = [
          education.id,
          education.degree,
          education.institution,
          education.start_date,
          education.end_date,
          education.location,
          education.grade,
          JSON.stringify(education.description),
          JSON.stringify(education.achievements),
          JSON.stringify(education.courses),
          education.institution_url,
          education.order_index
        ];

        await client.query(insertQuery, values);
        addedCount++;
        console.log(`✅ Added: ${education.degree} from ${education.institution}`);

      } catch (error) {
        console.error(`❌ Error adding ${education.degree}:`, error.message);
      }
    }

    console.log(`\n🎉 Summary:`);
    console.log(`   Removed: ${deleteResult.rowCount} old entries`);
    console.log(`   Added: ${addedCount} new entries`);

    // Show the updated education
    console.log('\n=== UPDATED EDUCATION ===');
    const allEducation = await client.query(`
      SELECT degree, institution, start_date, end_date, location
      FROM educations
      ORDER BY order_index
    `);

    allEducation.rows.forEach((edu, index) => {
      console.log(`${index + 1}. ${edu.degree}`);
      console.log(`   Institution: ${edu.institution}`);
      console.log(`   Duration: ${edu.start_date} - ${edu.end_date}`);
      console.log(`   Location: ${edu.location}`);
      console.log('---');
    });

    console.log(`\nTotal education entries: ${allEducation.rows.length}`);

    await client.release();
  } catch (error) {
    console.error('Error updating education:', error);
  } finally {
    await pool.end();
  }
}

updateEducation();