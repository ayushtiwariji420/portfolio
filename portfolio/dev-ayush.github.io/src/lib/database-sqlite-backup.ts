import Database from 'better-sqlite3';
import path from 'path';

// Database connection
let db: Database.Database | null = null;

function getDatabase(): Database.Database {
  if (!db) {
    const dbPath = path.join(process.cwd(), 'data', 'portfolio.db');
    db = new Database(dbPath);
    
    // Enable WAL mode for better performance
    db.pragma('journal_mode = WAL');
    db.pragma('synchronous = NORMAL');
    
    initializeDatabase();
  }
  return db;
}

function initializeDatabase() {
  if (!db) return;
  
  // Create projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      technologies TEXT NOT NULL, -- JSON array as string
      image_url TEXT,
      live_url TEXT,
      github_url TEXT,
      featured INTEGER NOT NULL DEFAULT 0,
      category TEXT NOT NULL DEFAULT 'web',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create skills table
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

  // Add new columns to existing skills table if they don't exist
  try {
    db.exec('ALTER TABLE skills ADD COLUMN icon_name TEXT');
  } catch (error) {
    // Column already exists, ignore error
  }
  try {
    db.exec('ALTER TABLE skills ADD COLUMN icon_library TEXT');
  } catch (error) {
    // Column already exists, ignore error
  }
  try {
    db.exec('ALTER TABLE skills ADD COLUMN icon_emoji TEXT');
  } catch (error) {
    // Column already exists, ignore error
  }
  try {
    db.exec('ALTER TABLE skills ADD COLUMN icon_type TEXT DEFAULT "react"');
  } catch (error) {
    // Column already exists, ignore error
  }

  // Create experiences table
  db.exec(`
    CREATE TABLE IF NOT EXISTS experiences (
      id TEXT PRIMARY KEY,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      description TEXT NOT NULL,
      responsibilities TEXT NOT NULL, -- JSON array as string
      technologies TEXT NOT NULL, -- JSON array as string
      start_date TEXT NOT NULL,
      end_date TEXT,
      company_url TEXT,
      location TEXT NOT NULL,
      employment_type TEXT NOT NULL DEFAULT 'full-time',
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create blogs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS blogs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE,
      tags TEXT NOT NULL, -- JSON array as string
      image_url TEXT,
      published INTEGER NOT NULL DEFAULT 0,
      featured INTEGER NOT NULL DEFAULT 0,
      read_time INTEGER NOT NULL DEFAULT 5,
      likes_count INTEGER NOT NULL DEFAULT 0,
      dislikes_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Add likes/dislikes columns if they don't exist (for existing DBs)
  try {
    db.exec('ALTER TABLE blogs ADD COLUMN likes_count INTEGER NOT NULL DEFAULT 0');
  } catch (error) {
    // Column already exists
  }
  try {
    db.exec('ALTER TABLE blogs ADD COLUMN dislikes_count INTEGER NOT NULL DEFAULT 0');
  } catch (error) {
    // Column already exists
  }

  // Create comments table
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      id TEXT PRIMARY KEY,
      blog_id TEXT NOT NULL,
      parent_id TEXT,
      author TEXT,
      content TEXT NOT NULL,
      likes INTEGER NOT NULL DEFAULT 0,
      dislikes INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (blog_id) REFERENCES blogs(id) ON DELETE CASCADE
    )
  `);

  // Add parent_id column if missing
  try {
    db.exec('ALTER TABLE comments ADD COLUMN parent_id TEXT');
  } catch (error) {
    // Column already exists
  }

  // Helpful indexes for comments lookups
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_comments_blog_id_created_at ON comments (blog_id, created_at);
  `);
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments (parent_id);
  `);

  // Add user_id to comments for authenticated authors
  try {
    db.exec('ALTER TABLE comments ADD COLUMN user_id TEXT');
  } catch (error) {
    // Column may already exist
  }

  // Create testimonials table
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

  // Create educations table
  db.exec(`
    CREATE TABLE IF NOT EXISTS educations (
      id TEXT PRIMARY KEY,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT,
      location TEXT,
      grade TEXT,
      description TEXT NOT NULL, -- JSON array as string
      achievements TEXT NOT NULL, -- JSON array as string
      courses TEXT NOT NULL, -- JSON array as string
      institution_url TEXT,
      order_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create personal_info table
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
      social_links TEXT NOT NULL, -- JSON object as string
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS settings (
      id TEXT PRIMARY KEY DEFAULT 'main',
      site_name TEXT NOT NULL DEFAULT 'Portfolio',
      site_description TEXT NOT NULL DEFAULT 'Personal Portfolio Website',
      site_keywords TEXT NOT NULL DEFAULT '[]', -- JSON array as string
      contact_email TEXT NOT NULL,
      analytics_id TEXT,
      maintenance_mode INTEGER NOT NULL DEFAULT 0,
      theme TEXT NOT NULL DEFAULT 'auto',
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      mobile TEXT,
      email_verified INTEGER NOT NULL DEFAULT 0,
      verification_token TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  console.log('Database initialized successfully');
}

// Project operations
export const projectOperations = {
  getAll: (filters: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
  } = {}) => {
    const database = getDatabase();
    const {
      page = 1,
      limit = 10,
      category,
      featured,
      search
    } = filters;

    let query = 'SELECT * FROM projects WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (featured !== undefined) {
      query += ' AND featured = ?';
      params.push(featured ? 1 : 0);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ? OR technologies LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY created_at DESC';

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const totalCount = database.prepare(countQuery).get(params) as { count: number };

    // Apply pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = database.prepare(query);
    const rows = stmt.all(params) as any[];

    const projects = rows.map(row => ({
      ...row,
      technologies: JSON.parse(row.technologies || '[]'),
      featured: Boolean(row.featured)
    }));

    return {
      projects,
      totalCount: totalCount.count,
      totalPages: Math.ceil(totalCount.count / limit)
    };
  },

  getById: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM projects WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      ...row,
      technologies: JSON.parse(row.technologies || '[]'),
      featured: Boolean(row.featured)
    };
  },

  create: (project: {
    title: string;
    description: string;
    longDescription?: string;
    technologies: string[];
    imageUrl?: string;
    liveUrl?: string;
    githubUrl?: string;
    featured: boolean;
    category: string;
  }) => {
    const database = getDatabase();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const stmt = database.prepare(`
      INSERT INTO projects (
        id, title, description, long_description, technologies, 
        image_url, live_url, github_url, featured, category
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

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

    if (result.changes > 0) {
      return projectOperations.getById(id);
    }
    
    return null;
  },

  update: (id: string, updates: Partial<{
    title: string;
    description: string;
    longDescription: string;
    technologies: string[];
    imageUrl: string;
    liveUrl: string;
    githubUrl: string;
    featured: boolean;
    category: string;
  }>) => {
    const database = getDatabase();
    
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'technologies') {
          fields.push('technologies = ?');
          values.push(JSON.stringify(value));
        } else if (key === 'longDescription') {
          fields.push('long_description = ?');
          values.push(value);
        } else if (key === 'imageUrl') {
          fields.push('image_url = ?');
          values.push(value);
        } else if (key === 'liveUrl') {
          fields.push('live_url = ?');
          values.push(value);
        } else if (key === 'githubUrl') {
          fields.push('github_url = ?');
          values.push(value);
        } else if (key === 'featured') {
          fields.push('featured = ?');
          values.push(value ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    if (fields.length === 0) return null;

    fields.push('updated_at = datetime(\'now\')');
    
    const stmt = database.prepare(`
      UPDATE projects 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    values.push(id);
    const result = stmt.run(...values);
    
    if (result.changes > 0) {
      return projectOperations.getById(id);
    }
    
    return null;
  },

  delete: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('DELETE FROM projects WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

// Experience operations
export const experienceOperations = {
  getAll: (filters: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    const database = getDatabase();
    const {
      page = 1,
      limit = 50,
      search
    } = filters;

    let query = 'SELECT * FROM experiences WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (company LIKE ? OR position LIKE ? OR description LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY order_index ASC, start_date DESC';

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const totalCount = database.prepare(countQuery).get(params) as { count: number };

    // Apply pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = database.prepare(query);
    const rows = stmt.all(params) as any[];

    const experiences = rows.map(row => ({
      ...row,
      responsibilities: JSON.parse(row.responsibilities || '[]'),
      technologies: JSON.parse(row.technologies || '[]')
    }));

    return {
      experiences,
      totalCount: totalCount.count,
      totalPages: Math.ceil(totalCount.count / limit)
    };
  },

  getById: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM experiences WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      ...row,
      responsibilities: JSON.parse(row.responsibilities || '[]'),
      technologies: JSON.parse(row.technologies || '[]')
    };
  },

  create: (experience: {
    company: string;
    position: string;
    description: string;
    responsibilities: string[];
    technologies: string[];
    startDate: string;
    endDate?: string;
    companyUrl?: string;
    location: string;
    employmentType: string;
    orderIndex: number;
  }) => {
    const database = getDatabase();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const stmt = database.prepare(`
      INSERT INTO experiences (
        id, company, position, description, responsibilities, technologies,
        start_date, end_date, company_url, location, employment_type, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      experience.company,
      experience.position,
      experience.description,
      JSON.stringify(experience.responsibilities),
      JSON.stringify(experience.technologies),
      experience.startDate,
      experience.endDate || null,
      experience.companyUrl || null,
      experience.location,
      experience.employmentType,
      experience.orderIndex
    );

    if (result.changes > 0) {
      return experienceOperations.getById(id);
    }
    
    return null;
  },

  update: (id: string, updates: Partial<{
    company: string;
    position: string;
    description: string;
    responsibilities: string[];
    technologies: string[];
    startDate: string;
    endDate: string;
    companyUrl: string;
    location: string;
    employmentType: string;
    orderIndex: number;
  }>) => {
    const database = getDatabase();
    
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'responsibilities') {
          fields.push('responsibilities = ?');
          values.push(JSON.stringify(value));
        } else if (key === 'technologies') {
          fields.push('technologies = ?');
          values.push(JSON.stringify(value));
        } else if (key === 'startDate') {
          fields.push('start_date = ?');
          values.push(value);
        } else if (key === 'endDate') {
          fields.push('end_date = ?');
          values.push(value);
        } else if (key === 'companyUrl') {
          fields.push('company_url = ?');
          values.push(value);
        } else if (key === 'employmentType') {
          fields.push('employment_type = ?');
          values.push(value);
        } else if (key === 'orderIndex') {
          fields.push('order_index = ?');
          values.push(value);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    if (fields.length === 0) return null;

    fields.push('updated_at = datetime(\'now\')');
    
    const stmt = database.prepare(`
      UPDATE experiences 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    values.push(id);
    const result = stmt.run(...values);
    
    if (result.changes > 0) {
      return experienceOperations.getById(id);
    }
    
    return null;
  },

  delete: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('DELETE FROM experiences WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

// Skills operations
export const skillOperations = {
  getAll: (filters: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  } = {}) => {
    const database = getDatabase();
    const {
      page = 1,
      limit = 50,
      category,
      search
    } = filters;

    let query = 'SELECT * FROM skills WHERE 1=1';
    const params: any[] = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    if (search) {
      query += ' AND name LIKE ?';
      params.push(`%${search}%`);
    }

    query += ' ORDER BY order_index ASC';

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const totalCount = database.prepare(countQuery).get(params) as { count: number };

    // Apply pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = database.prepare(query);
    const skills = stmt.all(params) as any[];

    return {
      skills,
      totalCount: totalCount.count,
      totalPages: Math.ceil(totalCount.count / limit)
    };
  },

  getById: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM skills WHERE id = ?');
    return stmt.get(id) as any;
  },

  create: (skill: {
    name: string;
    category: string;
    proficiency: number;
    iconUrl?: string;
    iconName?: string;
    iconLibrary?: string;
    iconEmoji?: string;
    iconType?: string;
    orderIndex?: number;
  }) => {
    const database = getDatabase();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const stmt = database.prepare(`
      INSERT INTO skills (
        id, name, category, proficiency, icon_url, icon_name, icon_library, icon_emoji, icon_type, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      id,
      skill.name,
      skill.category,
      skill.proficiency,
      skill.iconUrl || null,
      skill.iconName || null,
      skill.iconLibrary || null,
      skill.iconEmoji || null,
      skill.iconType || 'react',
      skill.orderIndex || 0
    );

    if (result.changes > 0) {
      return skillOperations.getById(id);
    }
    
    return null;
  },

  update: (id: string, updates: Partial<{
    name: string;
    category: string;
    proficiency: number;
    iconUrl: string;
    iconName: string;
    iconLibrary: string;
    iconEmoji: string;
    iconType: string;
    orderIndex: number;
  }>) => {
    const database = getDatabase();
    
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'iconUrl') {
          fields.push('icon_url = ?');
          values.push(value);
        } else if (key === 'iconName') {
          fields.push('icon_name = ?');
          values.push(value);
        } else if (key === 'iconLibrary') {
          fields.push('icon_library = ?');
          values.push(value);
        } else if (key === 'iconEmoji') {
          fields.push('icon_emoji = ?');
          values.push(value);
        } else if (key === 'iconType') {
          fields.push('icon_type = ?');
          values.push(value);
        } else if (key === 'orderIndex') {
          fields.push('order_index = ?');
          values.push(value);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    if (fields.length === 0) return null;

    fields.push('updated_at = datetime(\'now\')');
    
    const stmt = database.prepare(`
      UPDATE skills 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    values.push(id);
    const result = stmt.run(...values);
    
    if (result.changes > 0) {
      return skillOperations.getById(id);
    }
    
    return null;
  },

  delete: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('DELETE FROM skills WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

// Testimonial operations
export const testimonialOperations = {
  getAll: (filters: {
    page?: number;
    limit?: number;
    featured?: boolean;
    search?: string;
  } = {}) => {
    const database = getDatabase();
    const {
      page = 1,
      limit = 10,
      featured,
      search
    } = filters;

    let query = 'SELECT * FROM testimonials WHERE 1=1';
    const params: any[] = [];

    if (featured !== undefined) {
      query += ' AND featured = ?';
      params.push(featured ? 1 : 0);
    }

    if (search) {
      query += ' AND (name LIKE ? OR company LIKE ? OR content LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY order_index ASC, created_at DESC';

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const totalCount = database.prepare(countQuery).get(params) as { count: number };

    // Apply pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = database.prepare(query);
    const testimonials = stmt.all(params) as any[];

    return {
      testimonials,
      totalCount: totalCount.count,
      totalPages: Math.ceil(totalCount.count / limit)
    };
  },

  getById: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM testimonials WHERE id = ?');
    return stmt.get(id) as any;
  },

  create: (testimonial: {
    name: string;
    position: string;
    company: string;
    content: string;
    rating: number;
    imageUrl?: string;
    linkedinUrl?: string;
    featured: boolean;
    orderIndex?: number;
  }) => {
    const database = getDatabase();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const stmt = database.prepare(`
      INSERT INTO testimonials (
        id, name, position, company, content, rating, image_url, 
        linkedin_url, featured, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

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

    if (result.changes > 0) {
      return testimonialOperations.getById(id);
    }
    
    return null;
  },

  update: (id: string, updates: Partial<{
    name: string;
    position: string;
    company: string;
    content: string;
    rating: number;
    imageUrl: string;
    linkedinUrl: string;
    featured: boolean;
    orderIndex: number;
  }>) => {
    const database = getDatabase();
    
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'imageUrl') {
          fields.push('image_url = ?');
          values.push(value);
        } else if (key === 'linkedinUrl') {
          fields.push('linkedin_url = ?');
          values.push(value);
        } else if (key === 'featured') {
          fields.push('featured = ?');
          values.push(value ? 1 : 0);
        } else if (key === 'orderIndex') {
          fields.push('order_index = ?');
          values.push(value);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    if (fields.length === 0) return null;

    fields.push('updated_at = datetime(\'now\')');
    
    const stmt = database.prepare(`
      UPDATE testimonials 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    values.push(id);
    const result = stmt.run(...values);
    
    if (result.changes > 0) {
      return testimonialOperations.getById(id);
    }
    
    return null;
  },

  delete: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('DELETE FROM testimonials WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

// Education operations
export const educationOperations = {
  getAll: (filters: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    const database = getDatabase();
    const {
      page = 1,
      limit = 50,
      search
    } = filters;

    let query = 'SELECT * FROM educations WHERE 1=1';
    const params: any[] = [];

    if (search) {
      query += ' AND (degree LIKE ? OR institution LIKE ? OR description LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    query += ' ORDER BY order_index ASC, start_date DESC';

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const totalCount = database.prepare(countQuery).get(params) as { count: number };

    // Apply pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = database.prepare(query);
    const rows = stmt.all(params) as any[];

    const educations = rows.map(row => ({
      ...row,
      description: JSON.parse(row.description || '[]'),
      achievements: JSON.parse(row.achievements || '[]'),
      courses: JSON.parse(row.courses || '[]')
    }));

    return {
      educations,
      totalCount: totalCount.count,
      totalPages: Math.ceil(totalCount.count / limit)
    };
  },

  getById: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM educations WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      ...row,
      description: JSON.parse(row.description || '[]'),
      achievements: JSON.parse(row.achievements || '[]'),
      courses: JSON.parse(row.courses || '[]')
    };
  },

  create: (education: {
    degree: string;
    institution: string;
    startDate: string;
    endDate?: string;
    location?: string;
    grade?: string;
    description: string[];
    achievements: string[];
    courses: string[];
    institutionUrl?: string;
    orderIndex?: number;
  }) => {
    const database = getDatabase();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const stmt = database.prepare(`
      INSERT INTO educations (
        id, degree, institution, start_date, end_date, location, grade,
        description, achievements, courses, institution_url, order_index
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

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

    if (result.changes > 0) {
      return educationOperations.getById(id);
    }
    
    return null;
  },

  update: (id: string, updates: Partial<{
    degree: string;
    institution: string;
    startDate: string;
    endDate: string;
    location: string;
    grade: string;
    description: string[];
    achievements: string[];
    courses: string[];
    institutionUrl: string;
    orderIndex: number;
  }>) => {
    const database = getDatabase();
    
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'description' || key === 'achievements' || key === 'courses') {
          fields.push(`${key} = ?`);
          values.push(JSON.stringify(value));
        } else if (key === 'startDate') {
          fields.push('start_date = ?');
          values.push(value);
        } else if (key === 'endDate') {
          fields.push('end_date = ?');
          values.push(value);
        } else if (key === 'institutionUrl') {
          fields.push('institution_url = ?');
          values.push(value);
        } else if (key === 'orderIndex') {
          fields.push('order_index = ?');
          values.push(value);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    if (fields.length === 0) return null;

    fields.push('updated_at = datetime(\'now\')');
    
    const stmt = database.prepare(`
      UPDATE educations 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    values.push(id);
    const result = stmt.run(...values);
    
    if (result.changes > 0) {
      return educationOperations.getById(id);
    }
    
    return null;
  },

  delete: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('DELETE FROM educations WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  }
};

// Personal info operations
export const personalInfoOperations = {
  get: () => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM personal_info WHERE id = ?');
    const row = stmt.get('main') as any;

    if (!row) return null;

    return {
      ...row,
      socialLinks: JSON.parse(row.social_links || '{}')
    };
  },

  createOrUpdate: (personalInfo: {
    name: string;
    title: string;
    bio: string;
    email: string;
    phone?: string;
    location: string;
    profileImage?: string;
    resumeUrl?: string;
    socialLinks: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      instagram?: string;
      youtube?: string;
      website?: string;
    };
  }) => {
    const database = getDatabase();
    
    // Check if record exists
    const existing = personalInfoOperations.get();
    
    if (existing) {
      // Update existing record
      const stmt = database.prepare(`
        UPDATE personal_info 
        SET name = ?, title = ?, bio = ?, email = ?, phone = ?, location = ?,
            profile_image = ?, resume_url = ?, social_links = ?, updated_at = datetime('now')
        WHERE id = 'main'
      `);
      
      const result = stmt.run(
        personalInfo.name,
        personalInfo.title,
        personalInfo.bio,
        personalInfo.email,
        personalInfo.phone || null,
        personalInfo.location,
        personalInfo.profileImage || null,
        personalInfo.resumeUrl || null,
        JSON.stringify(personalInfo.socialLinks)
      );
      
      return result.changes > 0 ? personalInfoOperations.get() : null;
    } else {
      // Create new record
      const stmt = database.prepare(`
        INSERT INTO personal_info (
          id, name, title, bio, email, phone, location,
          profile_image, resume_url, social_links
        ) VALUES ('main', ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      
      const result = stmt.run(
        personalInfo.name,
        personalInfo.title,
        personalInfo.bio,
        personalInfo.email,
        personalInfo.phone || null,
        personalInfo.location,
        personalInfo.profileImage || null,
        personalInfo.resumeUrl || null,
        JSON.stringify(personalInfo.socialLinks)
      );
      
      return result.changes > 0 ? personalInfoOperations.get() : null;
    }
  }
};

// Blog operations
export const blogOperations = {
  getAll: (filters: {
    page?: number;
    limit?: number;
    published?: boolean;
    featured?: boolean;
    search?: string;
    tag?: string;
  } = {}) => {
    const database = getDatabase();
    const {
      page = 1,
      limit = 10,
      published,
      featured,
      search,
      tag
    } = filters;

    let query = 'SELECT * FROM blogs WHERE 1=1';
    const params: any[] = [];

    if (published !== undefined) {
      query += ' AND published = ?';
      params.push(published ? 1 : 0);
    }

    if (featured !== undefined) {
      query += ' AND featured = ?';
      params.push(featured ? 1 : 0);
    }

    if (search) {
      query += ' AND (title LIKE ? OR excerpt LIKE ? OR content LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }

    if (tag) {
      query += ' AND tags LIKE ?';
      params.push(`%${tag}%`);
    }

    query += ' ORDER BY created_at DESC';

    // Get total count for pagination
    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as count');
    const totalCount = database.prepare(countQuery).get(params) as { count: number };

    // Apply pagination
    const offset = (page - 1) * limit;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const stmt = database.prepare(query);
    const rows = stmt.all(params) as any[];

    const blogs = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      published: Boolean(row.published),
      featured: Boolean(row.featured)
    }));

    return {
      blogs,
      totalCount: totalCount.count,
      totalPages: Math.ceil(totalCount.count / limit)
    };
  },

  getById: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM blogs WHERE id = ?');
    const row = stmt.get(id) as any;

    if (!row) return null;

    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      published: Boolean(row.published),
      featured: Boolean(row.featured),
      likes_count: typeof row.likes_count === 'number' ? row.likes_count : 0,
      dislikes_count: typeof row.dislikes_count === 'number' ? row.dislikes_count : 0
    };
  },

  getBySlug: (slug: string) => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM blogs WHERE slug = ?');
    const row = stmt.get(slug) as any;

    if (!row) return null;

    return {
      ...row,
      tags: JSON.parse(row.tags || '[]'),
      published: Boolean(row.published),
      featured: Boolean(row.featured),
      likes_count: typeof row.likes_count === 'number' ? row.likes_count : 0,
      dislikes_count: typeof row.dislikes_count === 'number' ? row.dislikes_count : 0
    };
  },

  create: (blog: {
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    tags: string[];
    imageUrl?: string;
    published: boolean;
    featured: boolean;
    readTime: number;
  }) => {
    const database = getDatabase();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    const stmt = database.prepare(`
      INSERT INTO blogs (
        id, title, content, excerpt, slug, tags, image_url,
        published, featured, read_time, likes_count, dislikes_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
    `);

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

    if (result.changes > 0) {
      return blogOperations.getById(id);
    }
    
    return null;
  },

  update: (id: string, updates: Partial<{
    title: string;
    content: string;
    excerpt: string;
    slug: string;
    tags: string[];
    imageUrl: string;
    published: boolean;
    featured: boolean;
    readTime: number;
  }>) => {
    const database = getDatabase();
    
    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'tags') {
          fields.push('tags = ?');
          values.push(JSON.stringify(value));
        } else if (key === 'imageUrl') {
          fields.push('image_url = ?');
          values.push(value);
        } else if (key === 'readTime') {
          fields.push('read_time = ?');
          values.push(value);
        } else if (key === 'published' || key === 'featured') {
          fields.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });

    if (fields.length === 0) return null;

    fields.push('updated_at = datetime(\'now\')');
    
    const stmt = database.prepare(`
      UPDATE blogs 
      SET ${fields.join(', ')}
      WHERE id = ?
    `);
    
    values.push(id);
    const result = stmt.run(...values);
    
    if (result.changes > 0) {
      return blogOperations.getById(id);
    }
    
    return null;
  },

  delete: (id: string) => {
    const database = getDatabase();
    const stmt = database.prepare('DELETE FROM blogs WHERE id = ?');
    const result = stmt.run(id);
    return result.changes > 0;
  },
  
  getAllTags: () => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT tags FROM blogs WHERE published = 1');
    const rows = stmt.all() as { tags: string }[];
    
    const allTags = new Set<string>();
    rows.forEach(row => {
      const tags = JSON.parse(row.tags || '[]') as string[];
      tags.forEach(tag => allTags.add(tag));
    });
    
    return Array.from(allTags).sort();
  },

  // Increment blog reactions
  incrementReaction: (id: string, type: 'like' | 'dislike') => {
    const database = getDatabase();
    const column = type === 'like' ? 'likes_count' : 'dislikes_count';
    const stmt = database.prepare(`UPDATE blogs SET ${column} = ${column} + 1, updated_at = datetime('now') WHERE id = ?`);
    const result = stmt.run(id);
    if (result.changes > 0) {
      return blogOperations.getById(id);
    }
    return null;
  }
};

// Comment operations
export const commentOperations = {
  getForBlog: (blogId: string, options: { page?: number; limit?: number } = {}) => {
    const database = getDatabase();
    const { page = 1, limit = 50 } = options;
    const offset = (page - 1) * limit;

    const countStmt = database.prepare('SELECT COUNT(*) as count FROM comments WHERE blog_id = ?');
    const totalCount = countStmt.get(blogId) as { count: number };

    const stmt = database.prepare('SELECT * FROM comments WHERE blog_id = ? ORDER BY created_at ASC LIMIT ? OFFSET ?');
    const rows = stmt.all(blogId, limit, offset) as any[];

    return {
      comments: rows,
      totalCount: totalCount.count,
      totalPages: Math.ceil(totalCount.count / limit)
    };
  },

  create: (comment: { blogId: string; author?: string; content: string; parentId?: string; userId?: string }) => {
    const database = getDatabase();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const stmt = database.prepare(`
      INSERT INTO comments (id, blog_id, parent_id, author, content, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      id,
      comment.blogId,
      comment.parentId || null,
      comment.author || null,
      comment.content,
      comment.userId || null
    );
    if (result.changes > 0) {
      const getStmt = database.prepare('SELECT * FROM comments WHERE id = ?');
      return getStmt.get(id) as any;
    }
    return null;
  },

  incrementReaction: (commentId: string, type: 'like' | 'dislike') => {
    const database = getDatabase();
    const column = type === 'like' ? 'likes' : 'dislikes';
    const stmt = database.prepare(`UPDATE comments SET ${column} = ${column} + 1, updated_at = datetime('now') WHERE id = ?`);
    const result = stmt.run(commentId);
    if (result.changes > 0) {
      const getStmt = database.prepare('SELECT * FROM comments WHERE id = ?');
      return getStmt.get(commentId) as any;
    }
    return null;
  }
};

// User operations
export const userOperations = {
  getByEmail: (email: string) => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email) as any;
  },
  getByVerificationToken: (token: string) => {
    const database = getDatabase();
    const stmt = database.prepare('SELECT * FROM users WHERE verification_token = ?');
    return stmt.get(token) as any;
  },
  create: (user: { email: string; username: string; passwordHash: string; mobile?: string; verificationToken: string }) => {
    const database = getDatabase();
    const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const stmt = database.prepare(`
      INSERT INTO users (id, email, username, password_hash, mobile, email_verified, verification_token)
      VALUES (?, ?, ?, ?, ?, 0, ?)
    `);
    const result = stmt.run(id, user.email, user.username, user.passwordHash, user.mobile || null, user.verificationToken);
    if (result.changes > 0) {
      const getStmt = database.prepare('SELECT * FROM users WHERE id = ?');
      return getStmt.get(id) as any;
    }
    return null;
  },
  verifyEmailByToken: (token: string) => {
    const database = getDatabase();
    const stmt = database.prepare(`UPDATE users SET email_verified = 1, verification_token = NULL, updated_at = datetime('now') WHERE verification_token = ?`);
    const result = stmt.run(token);
    return result.changes > 0;
  }
};

// Utility function to close database connection
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

// Initialize database on module load
export { getDatabase };
