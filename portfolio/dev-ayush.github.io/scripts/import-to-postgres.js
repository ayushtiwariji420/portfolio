const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function importData() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    console.log('Loading exported data...');
    const dataPath = path.join(__dirname, '..', 'data', 'sqlite-export.json');
    
    if (!fs.existsSync(dataPath)) {
      console.error('Export file not found. Please run export-sqlite-data.js first');
      process.exit(1);
    }
    
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    
    console.log('Connecting to Neon Postgres...');
    const client = await pool.connect();
    
    console.log('\nImporting data to PostgreSQL...\n');
    
    let successCount = {
      projects: 0,
      skills: 0,
      experiences: 0,
      blogs: 0,
      comments: 0,
      testimonials: 0,
      educations: 0,
      personalInfo: 0,
      settings: 0,
      users: 0
    };
    
    // Import projects
    if (data.projects && data.projects.length > 0) {
      console.log('Importing projects...');
      for (const project of data.projects) {
        try {
          await client.query(`
            INSERT INTO projects (
              id, title, description, long_description, technologies,
              image_url, live_url, github_url, featured, category,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              description = EXCLUDED.description,
              long_description = EXCLUDED.long_description,
              technologies = EXCLUDED.technologies,
              image_url = EXCLUDED.image_url,
              live_url = EXCLUDED.live_url,
              github_url = EXCLUDED.github_url,
              featured = EXCLUDED.featured,
              category = EXCLUDED.category,
              updated_at = EXCLUDED.updated_at
          `, [
            project.id,
            project.title,
            project.description,
            project.long_description,
            JSON.stringify(project.technologies),
            project.image_url,
            project.live_url,
            project.github_url,
            project.featured,
            project.category,
            project.created_at,
            project.updated_at
          ]);
          successCount.projects++;
          console.log(`  ✓ ${project.title}`);
        } catch (err) {
          console.error(`  ✗ Failed to import project: ${project.title}`, err.message);
        }
      }
    }
    
    // Import skills
    if (data.skills && data.skills.length > 0) {
      console.log('\nImporting skills...');
      for (const skill of data.skills) {
        try {
          await client.query(`
            INSERT INTO skills (
              id, name, category, proficiency, icon_url, icon_name,
              icon_library, icon_emoji, icon_type, order_index,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              category = EXCLUDED.category,
              proficiency = EXCLUDED.proficiency,
              icon_url = EXCLUDED.icon_url,
              icon_name = EXCLUDED.icon_name,
              icon_library = EXCLUDED.icon_library,
              icon_emoji = EXCLUDED.icon_emoji,
              icon_type = EXCLUDED.icon_type,
              order_index = EXCLUDED.order_index,
              updated_at = EXCLUDED.updated_at
          `, [
            skill.id,
            skill.name,
            skill.category,
            skill.proficiency,
            skill.icon_url,
            skill.icon_name,
            skill.icon_library,
            skill.icon_emoji,
            skill.icon_type || 'react',
            skill.order_index,
            skill.created_at,
            skill.updated_at
          ]);
          successCount.skills++;
          console.log(`  ✓ ${skill.name}`);
        } catch (err) {
          console.error(`  ✗ Failed to import skill: ${skill.name}`, err.message);
        }
      }
    }
    
    // Import experiences
    if (data.experiences && data.experiences.length > 0) {
      console.log('\nImporting experiences...');
      for (const exp of data.experiences) {
        try {
          await client.query(`
            INSERT INTO experiences (
              id, company, position, description, responsibilities, technologies,
              start_date, end_date, company_url, location, employment_type,
              order_index, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (id) DO UPDATE SET
              company = EXCLUDED.company,
              position = EXCLUDED.position,
              description = EXCLUDED.description,
              responsibilities = EXCLUDED.responsibilities,
              technologies = EXCLUDED.technologies,
              start_date = EXCLUDED.start_date,
              end_date = EXCLUDED.end_date,
              company_url = EXCLUDED.company_url,
              location = EXCLUDED.location,
              employment_type = EXCLUDED.employment_type,
              order_index = EXCLUDED.order_index,
              updated_at = EXCLUDED.updated_at
          `, [
            exp.id,
            exp.company,
            exp.position,
            exp.description,
            JSON.stringify(exp.responsibilities),
            JSON.stringify(exp.technologies),
            exp.start_date,
            exp.end_date,
            exp.company_url,
            exp.location,
            exp.employment_type,
            exp.order_index,
            exp.created_at,
            exp.updated_at
          ]);
          successCount.experiences++;
          console.log(`  ✓ ${exp.company} - ${exp.position}`);
        } catch (err) {
          console.error(`  ✗ Failed to import experience: ${exp.company}`, err.message);
        }
      }
    }
    
    // Import blogs
    if (data.blogs && data.blogs.length > 0) {
      console.log('\nImporting blogs...');
      for (const blog of data.blogs) {
        try {
          await client.query(`
            INSERT INTO blogs (
              id, title, content, excerpt, slug, tags, image_url,
              published, featured, read_time, likes_count, dislikes_count,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (id) DO UPDATE SET
              title = EXCLUDED.title,
              content = EXCLUDED.content,
              excerpt = EXCLUDED.excerpt,
              slug = EXCLUDED.slug,
              tags = EXCLUDED.tags,
              image_url = EXCLUDED.image_url,
              published = EXCLUDED.published,
              featured = EXCLUDED.featured,
              read_time = EXCLUDED.read_time,
              likes_count = EXCLUDED.likes_count,
              dislikes_count = EXCLUDED.dislikes_count,
              updated_at = EXCLUDED.updated_at
          `, [
            blog.id,
            blog.title,
            blog.content,
            blog.excerpt,
            blog.slug,
            JSON.stringify(blog.tags),
            blog.image_url,
            blog.published,
            blog.featured,
            blog.read_time,
            blog.likes_count || 0,
            blog.dislikes_count || 0,
            blog.created_at,
            blog.updated_at
          ]);
          successCount.blogs++;
          console.log(`  ✓ ${blog.title}`);
        } catch (err) {
          console.error(`  ✗ Failed to import blog: ${blog.title}`, err.message);
        }
      }
    }
    
    // Import comments
    if (data.comments && data.comments.length > 0) {
      console.log('\nImporting comments...');
      for (const comment of data.comments) {
        try {
          await client.query(`
            INSERT INTO comments (
              id, blog_id, parent_id, author, content, user_id,
              likes, dislikes, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            ON CONFLICT (id) DO UPDATE SET
              blog_id = EXCLUDED.blog_id,
              parent_id = EXCLUDED.parent_id,
              author = EXCLUDED.author,
              content = EXCLUDED.content,
              user_id = EXCLUDED.user_id,
              likes = EXCLUDED.likes,
              dislikes = EXCLUDED.dislikes,
              updated_at = EXCLUDED.updated_at
          `, [
            comment.id,
            comment.blog_id,
            comment.parent_id,
            comment.author,
            comment.content,
            comment.user_id,
            comment.likes,
            comment.dislikes,
            comment.created_at,
            comment.updated_at
          ]);
          successCount.comments++;
          console.log(`  ✓ Comment by ${comment.author || 'Anonymous'}`);
        } catch (err) {
          console.error(`  ✗ Failed to import comment`, err.message);
        }
      }
    }
    
    // Import testimonials
    if (data.testimonials && data.testimonials.length > 0) {
      console.log('\nImporting testimonials...');
      for (const testimonial of data.testimonials) {
        try {
          await client.query(`
            INSERT INTO testimonials (
              id, name, position, company, content, rating,
              image_url, linkedin_url, featured, order_index,
              created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            ON CONFLICT (id) DO UPDATE SET
              name = EXCLUDED.name,
              position = EXCLUDED.position,
              company = EXCLUDED.company,
              content = EXCLUDED.content,
              rating = EXCLUDED.rating,
              image_url = EXCLUDED.image_url,
              linkedin_url = EXCLUDED.linkedin_url,
              featured = EXCLUDED.featured,
              order_index = EXCLUDED.order_index,
              updated_at = EXCLUDED.updated_at
          `, [
            testimonial.id,
            testimonial.name,
            testimonial.position,
            testimonial.company,
            testimonial.content,
            testimonial.rating,
            testimonial.image_url,
            testimonial.linkedin_url,
            testimonial.featured,
            testimonial.order_index,
            testimonial.created_at,
            testimonial.updated_at
          ]);
          successCount.testimonials++;
          console.log(`  ✓ ${testimonial.name} from ${testimonial.company}`);
        } catch (err) {
          console.error(`  ✗ Failed to import testimonial: ${testimonial.name}`, err.message);
        }
      }
    }
    
    // Import educations
    if (data.educations && data.educations.length > 0) {
      console.log('\nImporting educations...');
      for (const edu of data.educations) {
        try {
          await client.query(`
            INSERT INTO educations (
              id, degree, institution, start_date, end_date, location,
              grade, description, achievements, courses, institution_url,
              order_index, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
            ON CONFLICT (id) DO UPDATE SET
              degree = EXCLUDED.degree,
              institution = EXCLUDED.institution,
              start_date = EXCLUDED.start_date,
              end_date = EXCLUDED.end_date,
              location = EXCLUDED.location,
              grade = EXCLUDED.grade,
              description = EXCLUDED.description,
              achievements = EXCLUDED.achievements,
              courses = EXCLUDED.courses,
              institution_url = EXCLUDED.institution_url,
              order_index = EXCLUDED.order_index,
              updated_at = EXCLUDED.updated_at
          `, [
            edu.id,
            edu.degree,
            edu.institution,
            edu.start_date,
            edu.end_date,
            edu.location,
            edu.grade,
            JSON.stringify(edu.description),
            JSON.stringify(edu.achievements),
            JSON.stringify(edu.courses),
            edu.institution_url,
            edu.order_index,
            edu.created_at,
            edu.updated_at
          ]);
          successCount.educations++;
          console.log(`  ✓ ${edu.degree} at ${edu.institution}`);
        } catch (err) {
          console.error(`  ✗ Failed to import education: ${edu.degree}`, err.message);
        }
      }
    }
    
    // Import personal info
    if (data.personalInfo) {
      console.log('\nImporting personal info...');
      try {
        await client.query(`
          INSERT INTO personal_info (
            id, name, title, bio, email, phone, location,
            profile_image, resume_url, social_links, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            title = EXCLUDED.title,
            bio = EXCLUDED.bio,
            email = EXCLUDED.email,
            phone = EXCLUDED.phone,
            location = EXCLUDED.location,
            profile_image = EXCLUDED.profile_image,
            resume_url = EXCLUDED.resume_url,
            social_links = EXCLUDED.social_links,
            updated_at = EXCLUDED.updated_at
        `, [
          data.personalInfo.id || 'main',
          data.personalInfo.name,
          data.personalInfo.title,
          data.personalInfo.bio,
          data.personalInfo.email,
          data.personalInfo.phone,
          data.personalInfo.location,
          data.personalInfo.profile_image,
          data.personalInfo.resume_url,
          JSON.stringify(data.personalInfo.social_links),
          data.personalInfo.updated_at
        ]);
        successCount.personalInfo++;
        console.log(`  ✓ ${data.personalInfo.name}`);
      } catch (err) {
        console.error(`  ✗ Failed to import personal info`, err.message);
      }
    }
    
    // Import settings
    if (data.settings) {
      console.log('\nImporting settings...');
      try {
        await client.query(`
          INSERT INTO settings (
            id, site_name, site_description, site_keywords, contact_email,
            analytics_id, maintenance_mode, theme, updated_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
          ON CONFLICT (id) DO UPDATE SET
            site_name = EXCLUDED.site_name,
            site_description = EXCLUDED.site_description,
            site_keywords = EXCLUDED.site_keywords,
            contact_email = EXCLUDED.contact_email,
            analytics_id = EXCLUDED.analytics_id,
            maintenance_mode = EXCLUDED.maintenance_mode,
            theme = EXCLUDED.theme,
            updated_at = EXCLUDED.updated_at
        `, [
          data.settings.id || 'main',
          data.settings.site_name,
          data.settings.site_description,
          JSON.stringify(data.settings.site_keywords),
          data.settings.contact_email,
          data.settings.analytics_id,
          data.settings.maintenance_mode,
          data.settings.theme,
          data.settings.updated_at
        ]);
        successCount.settings++;
        console.log(`  ✓ Settings imported`);
      } catch (err) {
        console.error(`  ✗ Failed to import settings`, err.message);
      }
    }
    
    // Import users
    if (data.users && data.users.length > 0) {
      console.log('\nImporting users...');
      for (const user of data.users) {
        try {
          await client.query(`
            INSERT INTO users (
              id, email, username, password_hash, mobile,
              email_verified, verification_token, created_at, updated_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            ON CONFLICT (id) DO UPDATE SET
              email = EXCLUDED.email,
              username = EXCLUDED.username,
              password_hash = EXCLUDED.password_hash,
              mobile = EXCLUDED.mobile,
              email_verified = EXCLUDED.email_verified,
              verification_token = EXCLUDED.verification_token,
              updated_at = EXCLUDED.updated_at
          `, [
            user.id,
            user.email,
            user.username,
            user.password_hash,
            user.mobile,
            user.email_verified,
            user.verification_token,
            user.created_at,
            user.updated_at
          ]);
          successCount.users++;
          console.log(`  ✓ ${user.username}`);
        } catch (err) {
          console.error(`  ✗ Failed to import user: ${user.username}`, err.message);
        }
      }
    }
    
    console.log('\n🎉 Data import completed successfully!');
    console.log('\nImport Summary:');
    console.log(`- Projects: ${successCount.projects}/${data.projects.length}`);
    console.log(`- Skills: ${successCount.skills}/${data.skills.length}`);
    console.log(`- Experiences: ${successCount.experiences}/${data.experiences.length}`);
    console.log(`- Blogs: ${successCount.blogs}/${data.blogs.length}`);
    console.log(`- Comments: ${successCount.comments}/${data.comments.length}`);
    console.log(`- Testimonials: ${successCount.testimonials}/${data.testimonials.length}`);
    console.log(`- Educations: ${successCount.educations}/${data.educations.length}`);
    console.log(`- Personal Info: ${successCount.personalInfo}/${data.personalInfo ? 1 : 0}`);
    console.log(`- Settings: ${successCount.settings}/${data.settings ? 1 : 0}`);
    console.log(`- Users: ${successCount.users}/${data.users.length}`);
    
    client.release();
    await pool.end();
  } catch (error) {
    console.error('Error importing data:', error);
    await pool.end();
    process.exit(1);
  }
}

// Run import
if (require.main === module) {
  importData()
    .then(() => {
      console.log('\n✅ Data import process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Data import failed:', error);
      process.exit(1);
    });
}

module.exports = { importData };
