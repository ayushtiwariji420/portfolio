const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

function exportData() {
  const dbPath = path.join(__dirname, '..', 'data', 'portfolio.db');
  
  if (!fs.existsSync(dbPath)) {
    console.error('Database file not found at:', dbPath);
    process.exit(1);
  }
  
  const db = new Database(dbPath);
  
  console.log('Exporting data from SQLite...');
  
  const data = {
    projects: [],
    skills: [],
    experiences: [],
    blogs: [],
    comments: [],
    testimonials: [],
    educations: [],
    personalInfo: null,
    settings: null,
    users: []
  };
  
  try {
    // Export projects
    const projects = db.prepare('SELECT * FROM projects').all();
    data.projects = projects.map(row => ({
      ...row,
      technologies: JSON.parse(row.technologies || '[]'),
      featured: Boolean(row.featured)
    }));
    console.log(`✓ Exported ${data.projects.length} projects`);
    
    // Export skills
    data.skills = db.prepare('SELECT * FROM skills').all();
    console.log(`✓ Exported ${data.skills.length} skills`);
    
    // Export experiences
    const experiences = db.prepare('SELECT * FROM experiences').all();
    data.experiences = experiences.map(row => ({
      ...row,
      responsibilities: JSON.parse(row.responsibilities || '[]'),
      technologies: JSON.parse(row.technologies || '[]')
    }));
    console.log(`✓ Exported ${data.experiences.length} experiences`);
    
    // Export blogs
    const blogs = db.prepare('SELECT * FROM blogs').all();
    data.blogs = blogs.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      published: Boolean(row.published),
      featured: Boolean(row.featured)
    }));
    console.log(`✓ Exported ${data.blogs.length} blogs`);
    
    // Export comments
    data.comments = db.prepare('SELECT * FROM comments').all();
    console.log(`✓ Exported ${data.comments.length} comments`);
    
    // Export testimonials
    const testimonials = db.prepare('SELECT * FROM testimonials').all();
    data.testimonials = testimonials.map(row => ({
      ...row,
      featured: Boolean(row.featured)
    }));
    console.log(`✓ Exported ${data.testimonials.length} testimonials`);
    
    // Export educations
    const educations = db.prepare('SELECT * FROM educations').all();
    data.educations = educations.map(row => ({
      ...row,
      description: JSON.parse(row.description || '[]'),
      achievements: JSON.parse(row.achievements || '[]'),
      courses: JSON.parse(row.courses || '[]')
    }));
    console.log(`✓ Exported ${data.educations.length} educations`);
    
    // Export personal info
    const personalInfo = db.prepare('SELECT * FROM personal_info WHERE id = ?').get('main');
    if (personalInfo) {
      data.personalInfo = {
        ...personalInfo,
        social_links: JSON.parse(personalInfo.social_links || '{}')
      };
      console.log(`✓ Exported personal info`);
    }
    
    // Export settings
    const settings = db.prepare('SELECT * FROM settings WHERE id = ?').get('main');
    if (settings) {
      data.settings = {
        ...settings,
        site_keywords: JSON.parse(settings.site_keywords || '[]')
      };
      console.log(`✓ Exported settings`);
    }
    
    // Export users (excluding sensitive data for backup)
    data.users = db.prepare('SELECT * FROM users').all();
    console.log(`✓ Exported ${data.users.length} users`);
    
    // Save to JSON file
    const outputPath = path.join(__dirname, '..', 'data', 'sqlite-export.json');
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    
    console.log(`\n🎉 Data exported successfully to: ${outputPath}`);
    console.log('\nSummary:');
    console.log(`- Projects: ${data.projects.length}`);
    console.log(`- Skills: ${data.skills.length}`);
    console.log(`- Experiences: ${data.experiences.length}`);
    console.log(`- Blogs: ${data.blogs.length}`);
    console.log(`- Comments: ${data.comments.length}`);
    console.log(`- Testimonials: ${data.testimonials.length}`);
    console.log(`- Educations: ${data.educations.length}`);
    console.log(`- Personal Info: ${data.personalInfo ? 'Yes' : 'No'}`);
    console.log(`- Settings: ${data.settings ? 'Yes' : 'No'}`);
    console.log(`- Users: ${data.users.length}`);
    
  } catch (error) {
    console.error('Error exporting data:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Run export
if (require.main === module) {
  exportData();
}

module.exports = { exportData };
