const { Pool } = require('pg');
require('dotenv').config();

async function createSchema() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Connecting to Neon Postgres...');
    const client = await pool.connect();
    
    console.log('Creating PostgreSQL schema...');

    // Create projects table
    await client.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        long_description TEXT,
        technologies JSONB NOT NULL,
        image_url TEXT,
        live_url TEXT,
        github_url TEXT,
        featured BOOLEAN NOT NULL DEFAULT false,
        category TEXT NOT NULL DEFAULT 'web',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created projects table');

    // Create skills table
    await client.query(`
      CREATE TABLE IF NOT EXISTS skills (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL DEFAULT 'other',
        proficiency INTEGER NOT NULL DEFAULT 1,
        icon_url TEXT,
        icon_name TEXT,
        icon_library TEXT,
        icon_emoji TEXT,
        icon_type TEXT DEFAULT 'react',
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created skills table');

    // Create experiences table
    await client.query(`
      CREATE TABLE IF NOT EXISTS experiences (
        id TEXT PRIMARY KEY,
        company TEXT NOT NULL,
        position TEXT NOT NULL,
        description TEXT NOT NULL,
        responsibilities JSONB NOT NULL,
        technologies JSONB NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        company_url TEXT,
        location TEXT NOT NULL,
        employment_type TEXT NOT NULL DEFAULT 'full-time',
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created experiences table');

    // Create blogs table
    await client.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        excerpt TEXT NOT NULL,
        slug TEXT NOT NULL UNIQUE,
        tags JSONB NOT NULL,
        image_url TEXT,
        published BOOLEAN NOT NULL DEFAULT false,
        featured BOOLEAN NOT NULL DEFAULT false,
        read_time INTEGER NOT NULL DEFAULT 5,
        likes_count INTEGER NOT NULL DEFAULT 0,
        dislikes_count INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created blogs table');

    // Create comments table
    await client.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id TEXT PRIMARY KEY,
        blog_id TEXT NOT NULL,
        parent_id TEXT,
        author TEXT,
        content TEXT NOT NULL,
        user_id TEXT,
        likes INTEGER NOT NULL DEFAULT 0,
        dislikes INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ Created comments table');

    // Create indexes for comments
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_comments_blog_id_created_at ON comments (blog_id, created_at)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments (parent_id)
    `);
    console.log('✓ Created comments indexes');

    // Create testimonials table
    await client.query(`
      CREATE TABLE IF NOT EXISTS testimonials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        position TEXT NOT NULL,
        company TEXT NOT NULL,
        content TEXT NOT NULL,
        rating INTEGER NOT NULL DEFAULT 5,
        image_url TEXT,
        linkedin_url TEXT,
        featured BOOLEAN NOT NULL DEFAULT false,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created testimonials table');

    // Create educations table
    await client.query(`
      CREATE TABLE IF NOT EXISTS educations (
        id TEXT PRIMARY KEY,
        degree TEXT NOT NULL,
        institution TEXT NOT NULL,
        start_date TEXT NOT NULL,
        end_date TEXT,
        location TEXT,
        grade TEXT,
        description JSONB NOT NULL,
        achievements JSONB NOT NULL,
        courses JSONB NOT NULL,
        institution_url TEXT,
        order_index INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created educations table');

    // Create personal_info table
    await client.query(`
      CREATE TABLE IF NOT EXISTS personal_info (
        id TEXT PRIMARY KEY DEFAULT 'main',
        name TEXT NOT NULL,
        title TEXT NOT NULL,
        bio TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        location TEXT NOT NULL,
        profile_image TEXT,
        resume_url TEXT,
        social_links JSONB NOT NULL,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created personal_info table');

    // Create settings table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id TEXT PRIMARY KEY DEFAULT 'main',
        site_name TEXT NOT NULL DEFAULT 'Portfolio',
        site_description TEXT NOT NULL DEFAULT 'Personal Portfolio Website',
        site_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
        contact_email TEXT NOT NULL,
        analytics_id TEXT,
        maintenance_mode BOOLEAN NOT NULL DEFAULT false,
        theme TEXT NOT NULL DEFAULT 'auto',
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created settings table');

    // Create contact_messages table
    await client.query(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT,
        message TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'unread',
        is_read BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created contact_messages table');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        mobile TEXT,
        email_verified BOOLEAN NOT NULL DEFAULT false,
        verification_token TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Created users table');

    console.log('\n🎉 PostgreSQL schema created successfully!');
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('Error creating schema:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run schema creation
if (require.main === module) {
  createSchema()
    .then(() => {
      console.log('\n✅ Schema creation completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Schema creation failed:', error);
      process.exit(1);
    });
}

module.exports = { createSchema };
