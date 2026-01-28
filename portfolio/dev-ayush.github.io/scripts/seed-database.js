const Database = require('better-sqlite3');
const path = require('path');
const { existingBlogs } = require('./blog-seed-data');

// Database setup (simplified version of database.ts)
function getDatabase() {
  const dbPath = path.join(__dirname, '..', 'data', 'portfolio.db');
  const db = new Database(dbPath);
  
  // Enable WAL mode
  db.pragma('journal_mode = WAL');
  db.pragma('synchronous = NORMAL');
  
  // Create projects table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      technologies TEXT NOT NULL,
      image_url TEXT,
      live_url TEXT,
      github_url TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL DEFAULT 'web',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create skills table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS skills (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'other',
      proficiency INTEGER NOT NULL DEFAULT 1,
      icon_url TEXT,
      icon_name TEXT,
      icon_library TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create testimonials table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      position TEXT NOT NULL,
      company TEXT NOT NULL,
      content TEXT NOT NULL,
      rating INTEGER NOT NULL DEFAULT 5,
      image_url TEXT,
      linkedin_url TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create educations table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS educations (
      id TEXT PRIMARY KEY,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      location TEXT,
      grade TEXT,
      description TEXT NOT NULL,
      achievements TEXT NOT NULL,
      courses TEXT NOT NULL,
      institution_url TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create personal_info table if it doesn't exist
  db.exec(`
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
      social_links TEXT NOT NULL,
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create blogs table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      tags TEXT NOT NULL,
      image_url TEXT,
      published INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      read_time INTEGER NOT NULL DEFAULT 5,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
  
  return db;
}

function createProject(db, project) {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  const stmt = db.prepare(`
    INSERT INTO projects (
      id, title, description, long_description, technologies, 
      image_url, live_url, github_url, featured, category
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      id,
      project.title,
      project.description,
      project.longDescription || null,
      JSON.stringify(project.technologies),
      project.imageUrl || null,
      project.liveUrl || null,
      project.githubUrl || null,
      project.featured ? 1 : 0,
      project.category
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error creating project:', error);
    return false;
  }
}

function createSkill(db, skill) {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  const stmt = db.prepare(`
    INSERT INTO skills (
      id, name, category, proficiency, icon_url, order_index
    ) VALUES (?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      id,
      skill.name,
      skill.category,
      skill.proficiency,
      skill.iconUrl || null,
      skill.orderIndex || 0
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error creating skill:', error);
    return false;
  }
}

function createTestimonial(db, testimonial) {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  const stmt = db.prepare(`
    INSERT INTO testimonials (
      id, name, position, company, content, rating, image_url,
      linkedin_url, featured, order_index
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      id,
      testimonial.name,
      testimonial.position,
      testimonial.company,
      testimonial.content,
      testimonial.rating,
      testimonial.imageUrl || null,
      testimonial.linkedinUrl || null,
      testimonial.featured ? 1 : 0,
      testimonial.orderIndex || 0
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return false;
  }
}

function createEducation(db, education) {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  const stmt = db.prepare(`
    INSERT INTO educations (
      id, degree, institution, start_date, end_date, location, grade,
      description, achievements, courses, institution_url, order_index
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      id,
      education.degree,
      education.institution,
      education.startDate,
      education.endDate || null,
      education.location || null,
      education.grade || null,
      JSON.stringify(education.description),
      JSON.stringify(education.achievements),
      JSON.stringify(education.courses),
      education.institutionUrl || null,
      education.orderIndex || 0
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error creating education:', error);
    return false;
  }
}

function createOrUpdatePersonalInfo(db, personalInfo) {
  const stmt = db.prepare(`
    INSERT INTO personal_info (
      id, name, title, bio, email, phone, location,
      profile_image, resume_url, social_links
    ) VALUES ('main', ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      title = excluded.title,
      bio = excluded.bio,
      email = excluded.email,
      phone = excluded.phone,
      location = excluded.location,
      profile_image = excluded.profile_image,
      resume_url = excluded.resume_url,
      social_links = excluded.social_links,
      updated_at = datetime('now')
  `);

  try {
    const result = stmt.run(
      personalInfo.name,
      personalInfo.title,
      personalInfo.bio,
      personalInfo.email,
      personalInfo.phone || null,
      personalInfo.location,
      personalInfo.profileImage || null,
      personalInfo.resumeUrl || null,
      JSON.stringify(personalInfo.socialLinks || {})
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error creating/updating personal info:', error);
    return false;
  }
}

function getProjectsCount(db) {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM projects');
  const result = stmt.get();
  return result.count;
}

function getSkillsCount(db) {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM skills');
  const result = stmt.get();
  return result.count;
}

function getTestimonialsCount(db) {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM testimonials');
  const result = stmt.get();
  return result.count;
}

function getEducationsCount(db) {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM educations');
  const result = stmt.get();
  return result.count;
}

function getPersonalInfoExists(db) {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM personal_info WHERE id = ?');
  const result = stmt.get('main');
  return result.count > 0;
}

function createBlog(db, blog) {
  const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
  
  const stmt = db.prepare(`
    INSERT INTO blogs (
      id, title, content, excerpt, slug, tags, image_url,
      published, featured, read_time
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  try {
    const result = stmt.run(
      id,
      blog.title,
      blog.content,
      blog.excerpt,
      blog.slug,
      JSON.stringify(blog.tags),
      blog.imageUrl || null,
      blog.published ? 1 : 0,
      blog.featured ? 1 : 0,
      blog.readTime
    );
    
    return result.changes > 0;
  } catch (error) {
    console.error('Error creating blog:', error);
    return false;
  }
}

function getBlogsCount(db) {
  const stmt = db.prepare('SELECT COUNT(*) as count FROM blogs');
  const result = stmt.get();
  return result.count;
}

// Existing project data from projectData.ts
const existingProjects = [
  {
    title: 'POS AUTOMATION',
    description: 'The POS Automation project involved integrating multiple Point of Sale (POS) systems, including NCR Aloha, QuBeyond, Clover, and Square, into the client software.',
    longDescription: 'By using AWS services like Lambda and API Gateway, the integration allowed real-time synchronization of sales, inventory, and customer data across all systems, providing businesses with a unified platform for managing their operations. AWS Lambda handled event-driven transaction processing, while API Gateway ensured secure communication between client and the POS systems. SAM CLI was utilized to deploy serverless applications efficiently, and Pytest was used to validate functionality with unit and integration tests.',
    technologies: ['Python', 'AWS Cloud Formation', 'AWS SAM CLI'],
    imageUrl: '/project_images/pos.png',
    githubUrl: 'https://github.com/dev-Naveen PatidarK/Clover-POS-third-party-api-intg.git',
    liveUrl: 'https://youtu.be/drI_J-anbps?si=59KWMAZqoaspKqpJ',
    featured: true,
    category: 'web'
  },
  {
    title: 'FinChat: AI-Powered Assistant',
    description: 'An AI-powered chatbot designed for financial institutions, FinChat serves as a multi-agent assistant integrated with OpenAI.',
    longDescription: 'Users can inquire about various banking services, from checking account balances to raising service requests, enhancing customer engagement and support through intelligent automation.',
    technologies: ['OpenAI', 'Python', 'AI', 'Chatbot', 'Financial Services', 'Machine Learning', 'NLP'],
    imageUrl: '/project_images/finchat.png',
    githubUrl: 'https://github.com/dev-Naveen PatidarK/Finchat.git',
    liveUrl: 'https://youtu.be/AWGilgp66j0',
    featured: true,
    category: 'web'
  },
  {
    title: 'SRS Agent: AI-Powered Medical Documentation',
    description: 'The SRS Agent is an innovative solution designed to identify deficiencies within Software Requirement Specification (SRS) documents specifically tailored for medical software applications.',
    longDescription: 'This AI-powered tool leverages OpenAI\'s capabilities and advanced Natural Language Processing (NLP) techniques to analyze and improve SRS documents. By automating the review process, it replaces traditional manual checking methods, providing users with a refined SRS document after thorough modifications. Built using Python and the python-docx library, this project enhances the accuracy and efficiency of SRS documentation, making it an essential tool for medical software developers and medical professionals alike.',
    technologies: ['OpenAI', 'Python', 'NLP', 'Medical Software', 'AI', 'Documentation'],
    imageUrl: '/project_images/SRS.png',
    githubUrl: 'https://github.com/dev-Naveen PatidarK/SRS_medical_softwares.git',
    liveUrl: 'https://youtu.be/U-jn0PO2mzg',
    featured: true,
    category: 'other'
  },
  {
    title: 'ChatPDF Powered by Azure - Automation',
    description: 'This application leverages Azure AI alongside other Azure services like Blob Storage, Cognitive Search, and Azure Function App to create an automated AI assistant.',
    longDescription: 'Users can upload knowledge bases in PDF format, and the AI assistant is automatically generated to answer questions from the provided documents. Originally designed to assist doctors in clinical trials, this tool simplifies the process by automatically retrieving relevant findings from lengthy reports, eliminating the need for manual searches. It greatly enhances efficiency and decision-making in medical research and other document-heavy domains.',
    technologies: ['Azure AI', 'Azure CLI', 'Python', 'Automation', 'Cognitive Search'],
    imageUrl: '/project_images/azureChatPdf.png',
    githubUrl: 'https://github.com/dev-Naveen PatidarK/Azure_chatpdf.git',
    liveUrl: 'https://youtu.be/blSaRQ2o3ic',
    featured: true,
    category: 'web'
  }
];

// Skills data based on existing skillData.ts
const existingSkills = [
  { name: 'Python', category: 'backend', proficiency: 5, iconUrl: null, orderIndex: 1 },
  { name: 'Machine Learning', category: 'ai-ml', proficiency: 5, iconUrl: null, orderIndex: 2 },
  { name: 'Deep Learning', category: 'ai-ml', proficiency: 4, iconUrl: null, orderIndex: 3 },
  { name: 'AWS', category: 'cloud', proficiency: 5, iconUrl: null, orderIndex: 4 },
  { name: 'Azure', category: 'cloud', proficiency: 4, iconUrl: null, orderIndex: 5 },
  { name: 'Google Cloud', category: 'cloud', proficiency: 4, iconUrl: null, orderIndex: 6 },
  { name: 'LLMs', category: 'ai-ml', proficiency: 4, iconUrl: null, orderIndex: 7 },
  { name: 'RAG', category: 'ai-ml', proficiency: 4, iconUrl: null, orderIndex: 8 },
  { name: 'FastAPI', category: 'backend', proficiency: 5, iconUrl: null, orderIndex: 9 },
  { name: 'Java', category: 'backend', proficiency: 4, iconUrl: null, orderIndex: 10 },
  { name: 'React', category: 'frontend', proficiency: 4, iconUrl: null, orderIndex: 11 },
  { name: 'TypeScript', category: 'frontend', proficiency: 4, iconUrl: null, orderIndex: 12 },
  { name: 'Next.js', category: 'frontend', proficiency: 4, iconUrl: null, orderIndex: 13 },
  { name: 'Node.js', category: 'backend', proficiency: 4, iconUrl: null, orderIndex: 14 },
  { name: 'PostgreSQL', category: 'database', proficiency: 4, iconUrl: null, orderIndex: 15 },
  { name: 'MongoDB', category: 'database', proficiency: 4, iconUrl: null, orderIndex: 16 },
  { name: 'Docker', category: 'tools', proficiency: 4, iconUrl: null, orderIndex: 17 },
  { name: 'Kubernetes', category: 'tools', proficiency: 3, iconUrl: null, orderIndex: 18 },
  { name: 'Git', category: 'tools', proficiency: 5, iconUrl: null, orderIndex: 19 },
  { name: 'TensorFlow', category: 'ai-ml', proficiency: 4, iconUrl: null, orderIndex: 20 }
];

// Sample testimonials data
const existingTestimonials = [
  {
    name: 'Sarah Johnson',
    position: 'Product Manager',
    company: 'TechCorp Solutions',
    content: 'Working with Naveen was an absolute pleasure. His expertise in AI and machine learning helped us build cutting-edge solutions that exceeded our expectations. The ChatPDF project he delivered revolutionized how our medical research team analyzes clinical trial documents.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b577?w=150&h=150&fit=crop&crop=face',
    linkedinUrl: 'https://linkedin.com/in/sarahjohnson',
    featured: true,
    orderIndex: 1
  },
  {
    name: 'Michael Chen',
    position: 'CTO',
    company: 'FinanceAI Inc',
    content: 'Naveen\'s work on our FinChat AI assistant was exceptional. He demonstrated deep understanding of both technical implementation and business requirements. The multi-agent system he built has significantly improved our customer engagement rates.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    linkedinUrl: 'https://linkedin.com/in/michaelchen',
    featured: true,
    orderIndex: 2
  },
  {
    name: 'Dr. Emily Rodriguez',
    position: 'Research Director',
    company: 'MedTech Innovations',
    content: 'The SRS Agent tool that Naveen developed for our medical software documentation has been a game-changer. His attention to detail and understanding of healthcare compliance requirements made the project a huge success.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
    linkedinUrl: 'https://linkedin.com/in/emilyrodriguez',
    featured: false,
    orderIndex: 3
  },
  {
    name: 'David Kim',
    position: 'Operations Manager',
    company: 'Restaurant Group LLC',
    content: 'The POS automation system Naveen built integrated seamlessly with all our existing systems. His expertise with AWS and API integration made what seemed impossible, possible. Highly recommend his services!',
    rating: 4,
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    linkedinUrl: 'https://linkedin.com/in/davidkim',
    featured: false,
    orderIndex: 4
  },
  {
    name: 'Lisa Thompson',
    position: 'Head of Digital Transformation',
    company: 'Global Enterprise Corp',
    content: 'Naveen brings a unique combination of technical excellence and business acumen. His work on our cloud migration to Azure was flawless, and his proactive communication throughout the project was outstanding.',
    rating: 5,
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
    linkedinUrl: 'https://linkedin.com/in/lisathompson',
    featured: true,
    orderIndex: 5
  }
];

// Sample personal info data based on existing hardcoded data
const existingPersonalInfo = {
  name: 'Naveen Patidar',
  title: 'AI & Cloud Solutions Developer | Full Stack Engineer',
  bio: 'Passionate AI and Cloud Solutions Developer with expertise in building innovative applications using cutting-edge technologies. Experienced in machine learning, cloud platforms (AWS, Azure, GCP), and full-stack development.',
  email: 'naveenpatidar951@gmail.com',
  phone: '+91 98765 43210',
  location: 'Bhopal, India',
  profileImage: null,
  resumeUrl: null,
  socialLinks: {
    linkedin: 'https://www.linkedin.com/in/naveenpatidar1/',
    github: 'https://github.com/naveenpatidar1211/Portfolio',
    twitter: null,
    instagram: null,
    youtube: null,
    website: null
  }
};

// Sample education data based on existing hardcoded data
const existingEducations = [
  {
    degree: 'B.S in Data Science',
    institution: 'Indian Institute of Technology Madras',
    startDate: '2022',
    endDate: '2026',
    location: 'Chennai, India',
    grade: '8.10 GPA',
    description: [
      'Pursuing Bachelor of Science in Data Science',
      'Current GPA: 8.10',
      'Focus on Machine Learning, Data Analysis, and AI'
    ],
    achievements: [
      'Currently pursuing degree in Data Science',
      'Maintaining strong academic performance'
    ],
    courses: [
      'Machine Learning',
      'Data Analysis',
      'Artificial Intelligence',
      'Statistics',
      'Programming',
      'Data Structures'
    ],
    orderIndex: 1
  },
  {
    degree: 'Higher Secondary (12th)',
    institution: 'Govt. Subhash H. S. Excellence School Bhopal',
    startDate: '2016',
    endDate: '2017',
    location: 'Bhopal, India',
    grade: '86.2%',
    description: [
      'Completed Higher Secondary Education',
      'Scored 86.2% in final examinations'
    ],
    achievements: [
      'Achieved 86.2% in final examinations'
    ],
    courses: [
      'Mathematics',
      'Physics',
      'Chemistry',
      'Computer Science'
    ],
    orderIndex: 2
  },
  {
    degree: 'High School (10th)',
    institution: 'Govt. Model H. S. School, Makhan Nagar',
    startDate: '2014',
    endDate: '2015',
    location: 'Bhopal, India',
    grade: '94.6%',
    description: [
      'Completed High School Education',
      'District Topper'
    ],
    achievements: [
      'District Topper',
      'Scored 94.6% in final examinations'
    ],
    courses: [
      'Mathematics',
      'Science',
      'Social Studies',
      'English'
    ],
    orderIndex: 3
  },
  {
    degree: 'B.Tech in Mining (Incomplete)',
    institution: 'Not specified',
    startDate: '2019',
    endDate: '2021',
    location: 'India',
    grade: '7.2 GPA',
    description: [
      'Pursued Bachelor of Technology in Mining Engineering',
      'GPA: 7.2'
    ],
    achievements: [
      'Maintained GPA of 7.2 during studies'
    ],
    courses: [
      'Mining Engineering',
      'Geology',
      'Mineral Processing',
      'Mine Planning'
    ],
    orderIndex: 4
  }
];

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  try {
    const db = getDatabase();
    
    // Check if data already exists
    const existingProjectCount = getProjectsCount(db);
    const existingSkillCount = getSkillsCount(db);
    const existingTestimonialCount = getTestimonialsCount(db);
    const existingEducationCount = getEducationsCount(db);
    const existingBlogCount = getBlogsCount(db);
    const personalInfoExists = getPersonalInfoExists(db);
    
    if (existingProjectCount > 0 && existingSkillCount > 0 && existingTestimonialCount > 0 && existingEducationCount > 0 && existingBlogCount > 0) {
      console.log('Database already contains most data. Will still check/update personal info.');
      console.log(`Current projects count: ${existingProjectCount}`);
      console.log(`Current skills count: ${existingSkillCount}`);
      console.log(`Current testimonials count: ${existingTestimonialCount}`);
      console.log(`Current education count: ${existingEducationCount}`);
      console.log(`Current blogs count: ${existingBlogCount}`);
      console.log(`Personal info exists: ${personalInfoExists}`);
      
      // Still update personal info even if other data exists
      console.log('\nSeeding/Updating database with personal info data...');
      
      const created = createOrUpdatePersonalInfo(db, existingPersonalInfo);
      if (created) {
        console.log(`✓ Created/Updated personal info for: ${existingPersonalInfo.name}`);
        console.log('\nPersonal Info:');
        console.log(`Name: ${existingPersonalInfo.name}`);
        console.log(`Title: ${existingPersonalInfo.title}`);
        console.log(`Email: ${existingPersonalInfo.email}`);
        console.log(`Location: ${existingPersonalInfo.location}`);
        console.log('\n✓ Personal info updated successfully!');
      } else {
        console.error(`✗ Failed to create/update personal info`);
      }
      
      db.close();
      return;
    }

    let projectSuccessCount = 0;
    let skillSuccessCount = 0;
    let testimonialSuccessCount = 0;
    let educationSuccessCount = 0;
    let blogSuccessCount = 0;
    let personalInfoSuccess = false;

    // Seed projects if they don't exist
    if (existingProjectCount === 0) {
      console.log('Seeding database with project data...');
      
      for (const project of existingProjects) {
        const created = createProject(db, project);
        if (created) {
          console.log(`✓ Created project: ${project.title}`);
          projectSuccessCount++;
        } else {
          console.error(`✗ Failed to create project: ${project.title}`);
        }
      }
    } else {
      console.log(`Projects already exist (${existingProjectCount} found), skipping...`);
      projectSuccessCount = existingProjectCount;
    }

    // Seed skills if they don't exist
    if (existingSkillCount === 0) {
      console.log('\nSeeding database with skills data...');
      
      for (const skill of existingSkills) {
        const created = createSkill(db, skill);
        if (created) {
          console.log(`✓ Created skill: ${skill.name}`);
          skillSuccessCount++;
        } else {
          console.error(`✗ Failed to create skill: ${skill.name}`);
        }
      }
    } else {
      console.log(`Skills already exist (${existingSkillCount} found), skipping...`);
      skillSuccessCount = existingSkillCount;
    }

    // Seed testimonials if they don't exist
    if (existingTestimonialCount === 0) {
      console.log('\nSeeding database with testimonials data...');
      
      for (const testimonial of existingTestimonials) {
        const created = createTestimonial(db, testimonial);
        if (created) {
          console.log(`✓ Created testimonial from: ${testimonial.name}`);
          testimonialSuccessCount++;
        } else {
          console.error(`✗ Failed to create testimonial from: ${testimonial.name}`);
        }
      }
    } else {
      console.log(`Testimonials already exist (${existingTestimonialCount} found), skipping...`);
      testimonialSuccessCount = existingTestimonialCount;
    }

    // Seed education if they don't exist
    if (existingEducationCount === 0) {
      console.log('\nSeeding database with education data...');
      
      for (const education of existingEducations) {
        const created = createEducation(db, education);
        if (created) {
          console.log(`✓ Created education: ${education.degree} at ${education.institution}`);
          educationSuccessCount++;
        } else {
          console.error(`✗ Failed to create education: ${education.degree}`);
        }
      }
    } else {
      console.log(`Education records already exist (${existingEducationCount} found), skipping...`);
      educationSuccessCount = existingEducationCount;
    }

    // Seed blogs if they don't exist
    if (existingBlogCount === 0) {
      console.log('\nSeeding database with blog data...');
      
      for (const blog of existingBlogs) {
        const created = createBlog(db, blog);
        if (created) {
          console.log(`✓ Created blog: ${blog.title}`);
          blogSuccessCount++;
        } else {
          console.error(`✗ Failed to create blog: ${blog.title}`);
        }
      }
    } else {
      console.log(`Blogs already exist (${existingBlogCount} found), skipping...`);
      blogSuccessCount = existingBlogCount;
    }

    // Seed/Update personal info (always update to ensure correct data)
    console.log('\nSeeding/Updating database with personal info data...');
    
    const created = createOrUpdatePersonalInfo(db, existingPersonalInfo);
    if (created) {
      console.log(`✓ Created/Updated personal info for: ${existingPersonalInfo.name}`);
      personalInfoSuccess = true;
    } else {
      console.error(`✗ Failed to create/update personal info`);
    }
    
    console.log(`\n🎉 Database seeding completed successfully!`);
    console.log(`Total projects: ${projectSuccessCount}`);
    console.log(`Total skills: ${skillSuccessCount}`);
    console.log(`Total testimonials: ${testimonialSuccessCount}`);
    console.log(`Total education: ${educationSuccessCount}`);
    console.log(`Total blogs: ${blogSuccessCount}`);
    console.log(`Personal info: ${personalInfoSuccess ? 'Created/Updated' : 'Failed'}`);
    
    // List the data
    if (projectSuccessCount > 0) {
      console.log('\nProjects:');
      existingProjects.forEach((project, index) => {
        console.log(`${index + 1}. ${project.title} (${project.category})`);
      });
    }
    
    if (skillSuccessCount > 0) {
      console.log('\nSkills:');
      existingSkills.forEach((skill, index) => {
        console.log(`${index + 1}. ${skill.name} (${skill.category}) - Level ${skill.proficiency}`);
      });
    }
    
    if (testimonialSuccessCount > 0) {
      console.log('\nTestimonials:');
      existingTestimonials.forEach((testimonial, index) => {
        console.log(`${index + 1}. ${testimonial.name} from ${testimonial.company} (${testimonial.rating} stars)`);
      });
    }
    
    if (educationSuccessCount > 0) {
      console.log('\nEducation:');
      existingEducations.forEach((education, index) => {
        console.log(`${index + 1}. ${education.degree} at ${education.institution} (${education.startDate}-${education.endDate || 'Present'})`);
      });
    }
    
    if (blogSuccessCount > 0) {
      console.log('\nBlogs:');
      existingBlogs.forEach((blog, index) => {
        console.log(`${index + 1}. ${blog.title} (${blog.published ? 'Published' : 'Draft'}) - ${blog.readTime} min read`);
      });
    }
    
    if (personalInfoSuccess) {
      console.log('\nPersonal Info:');
      console.log(`Name: ${existingPersonalInfo.name}`);
      console.log(`Title: ${existingPersonalInfo.title}`);
      console.log(`Email: ${existingPersonalInfo.email}`);
      console.log(`Location: ${existingPersonalInfo.location}`);
    }
    
    db.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding if this script is executed directly
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log('\n✅ Database seeding process completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Database seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedDatabase };