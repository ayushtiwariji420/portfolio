import { Pool, PoolClient } from 'pg';

// Database connection pool
let pool: Pool | null = null;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set. Add it to your .env file.');
    }
    pool = new Pool({
      connectionString,
      ssl: {
        rejectUnauthorized: false
      },
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 15000,
    });
    
    console.log('PostgreSQL pool initialized');
  }
  return pool;
}

// Helper function to get a client from the pool
async function getClient(): Promise<PoolClient> {
  const poolInstance = getPool();
  return await poolInstance.connect();
}

// Project operations
export const projectOperations = {
  getAll: async (filters: {
    page?: number;
    limit?: number;
    category?: string;
    featured?: boolean;
    search?: string;
  } = {}) => {
    const client = await getClient();
    
    try {
      const {
        page = 1,
        limit = 10,
        category,
        featured,
        search
      } = filters;

      let query = 'SELECT * FROM projects WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (category) {
        query += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (featured !== undefined) {
        query += ` AND featured = $${paramIndex}`;
        params.push(featured);
        paramIndex++;
      }

      if (search) {
        query += ` AND (title ILIKE $${paramIndex} OR description ILIKE $${paramIndex+1} OR technologies::text ILIKE $${paramIndex+2})`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
        paramIndex += 3;
      }

      query += ' ORDER BY created_at DESC';

      // Get total count for pagination (strip ORDER BY for COUNT)
      const countQuery = query
        .replace('SELECT *', 'SELECT COUNT(*) as count')
        .replace(/ORDER BY[\s\S]*$/i, '');
      const totalCountResult = await client.query(countQuery, params);
      const totalCount = parseInt(totalCountResult.rows[0].count);

      // Apply pagination
      const offset = (page - 1) * limit;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex+1}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      const projects = result.rows.map(row => ({
        ...row,
        technologies: row.technologies,
        featured: Boolean(row.featured)
      }));

      return {
        projects,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      };
    } finally {
      client.release();
    }
  },

  getById: async (id: string) => {
    const client = await getClient();
    
    try {
      const result = await client.query('SELECT * FROM projects WHERE id = $1', [id]);
      
      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        ...row,
        technologies: row.technologies,
        featured: Boolean(row.featured)
      };
    } finally {
      client.release();
    }
  },

  create: async (project: {
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
    const client = await getClient();
    
    try {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      const result = await client.query(`
        INSERT INTO projects (
          id, title, description, long_description, technologies, 
          image_url, live_url, github_url, featured, category
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        id,
        project.title,
        project.description,
        project.longDescription || null,
        JSON.stringify(project.technologies),
        project.imageUrl || null,
        project.liveUrl || null,
        project.githubUrl || null,
        project.featured,
        project.category
      ]);

      if (result.rows.length > 0) {
        return projectOperations.getById(id);
      }
      
      return null;
    } finally {
      client.release();
    }
  },

  update: async (id: string, updates: Partial<{
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
    const client = await getClient();
    
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'technologies') {
            fields.push(`technologies = $${paramIndex}`);
            values.push(JSON.stringify(value));
          } else if (key === 'longDescription') {
            fields.push(`long_description = $${paramIndex}`);
            values.push(value);
          } else if (key === 'imageUrl') {
            fields.push(`image_url = $${paramIndex}`);
            values.push(value);
          } else if (key === 'liveUrl') {
            fields.push(`live_url = $${paramIndex}`);
            values.push(value);
          } else if (key === 'githubUrl') {
            fields.push(`github_url = $${paramIndex}`);
            values.push(value);
          } else if (key === 'featured') {
            fields.push(`featured = $${paramIndex}`);
            values.push(value);
          } else {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
          }
          paramIndex++;
        }
      });

      if (fields.length === 0) return null;

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      
      values.push(id);
      const result = await client.query(`
        UPDATE projects 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);
      
      if (result.rows.length > 0) {
        return projectOperations.getById(id);
      }
      
      return null;
    } finally {
      client.release();
    }
  },

  delete: async (id: string) => {
    const client = await getClient();
    
    try {
      const result = await client.query('DELETE FROM projects WHERE id = $1', [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } finally {
      client.release();
    }
  }
};

// Experience operations
export const experienceOperations = {
  getAll: async (filters: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    const client = await getClient();
    
    try {
      const {
        page = 1,
        limit = 50,
        search
      } = filters;

      let query = 'SELECT * FROM experiences WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (search) {
        query += ` AND (company ILIKE $${paramIndex} OR position ILIKE $${paramIndex+1} OR description ILIKE $${paramIndex+2})`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
        paramIndex += 3;
      }

      query += ' ORDER BY order_index ASC, start_date DESC';

      // Get total count (strip ORDER BY for COUNT)
      const countQuery = query
        .replace('SELECT *', 'SELECT COUNT(*) as count')
        .replace(/ORDER BY[\s\S]*$/i, '');
      const totalCountResult = await client.query(countQuery, params);
      const totalCount = parseInt(totalCountResult.rows[0].count);

      // Apply pagination
      const offset = (page - 1) * limit;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex+1}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      const experiences = result.rows.map(row => ({
        ...row,
        responsibilities: row.responsibilities,
        technologies: row.technologies
      }));

      return {
        experiences,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      };
    } finally {
      client.release();
    }
  },

  getById: async (id: string) => {
    const client = await getClient();
    
    try {
      const result = await client.query('SELECT * FROM experiences WHERE id = $1', [id]);
      
      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        ...row,
        responsibilities: row.responsibilities,
        technologies: row.technologies
      };
    } finally {
      client.release();
    }
  },

  create: async (experience: {
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
    const client = await getClient();
    
    try {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      const result = await client.query(`
        INSERT INTO experiences (
          id, company, position, description, responsibilities, technologies,
          start_date, end_date, company_url, location, employment_type, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
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
      ]);

      if (result.rows.length > 0) {
        return experienceOperations.getById(id);
      }
      
      return null;
    } finally {
      client.release();
    }
  },

  update: async (id: string, updates: Partial<{
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
    const client = await getClient();
    
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'responsibilities' || key === 'technologies') {
            fields.push(`${key} = $${paramIndex}`);
            values.push(JSON.stringify(value));
          } else if (key === 'startDate') {
            fields.push(`start_date = $${paramIndex}`);
            values.push(value);
          } else if (key === 'endDate') {
            fields.push(`end_date = $${paramIndex}`);
            values.push(value);
          } else if (key === 'companyUrl') {
            fields.push(`company_url = $${paramIndex}`);
            values.push(value);
          } else if (key === 'employmentType') {
            fields.push(`employment_type = $${paramIndex}`);
            values.push(value);
          } else if (key === 'orderIndex') {
            fields.push(`order_index = $${paramIndex}`);
            values.push(value);
          } else {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
          }
          paramIndex++;
        }
      });

      if (fields.length === 0) return null;

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      
      values.push(id);
      const result = await client.query(`
        UPDATE experiences 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);
      
      if (result.rows.length > 0) {
        return experienceOperations.getById(id);
      }
      
      return null;
    } finally {
      client.release();
    }
  },

  delete: async (id: string) => {
    const client = await getClient();
    
    try {
      const result = await client.query('DELETE FROM experiences WHERE id = $1', [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } finally {
      client.release();
    }
  }
};

// Skills operations
export const skillOperations = {
  getAll: async (filters: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
  } = {}) => {
    const client = await getClient();
    
    try {
      const {
        page = 1,
        limit = 50,
        category,
        search
      } = filters;

      let query = 'SELECT * FROM skills WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (category) {
        query += ` AND category = $${paramIndex}`;
        params.push(category);
        paramIndex++;
      }

      if (search) {
        query += ` AND name ILIKE $${paramIndex}`;
        params.push(`%${search}%`);
        paramIndex++;
      }

      query += ' ORDER BY order_index ASC';

      // Get total count (strip ORDER BY for COUNT)
      const countQuery = query
        .replace('SELECT *', 'SELECT COUNT(*) as count')
        .replace(/ORDER BY[\s\S]*$/i, '');
      const totalCountResult = await client.query(countQuery, params);
      const totalCount = parseInt(totalCountResult.rows[0].count);

      // Apply pagination
      const offset = (page - 1) * limit;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex+1}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      return {
        skills: result.rows,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      };
    } finally {
      client.release();
    }
  },

  getById: async (id: string) => {
    const client = await getClient();
    
    try {
      const result = await client.query('SELECT * FROM skills WHERE id = $1', [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  },

  create: async (skill: {
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
    const client = await getClient();
    
    try {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      const result = await client.query(`
        INSERT INTO skills (
          id, name, category, proficiency, icon_url, icon_name, icon_library, icon_emoji, icon_type, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
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
      ]);

      if (result.rows.length > 0) {
        return skillOperations.getById(id);
      }
      
      return null;
    } finally {
      client.release();
    }
  },

  update: async (id: string, updates: Partial<{
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
    const client = await getClient();
    
    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'iconUrl') {
            fields.push(`icon_url = $${paramIndex}`);
            values.push(value);
          } else if (key === 'iconName') {
            fields.push(`icon_name = $${paramIndex}`);
            values.push(value);
          } else if (key === 'iconLibrary') {
            fields.push(`icon_library = $${paramIndex}`);
            values.push(value);
          } else if (key === 'iconEmoji') {
            fields.push(`icon_emoji = $${paramIndex}`);
            values.push(value);
          } else if (key === 'iconType') {
            fields.push(`icon_type = $${paramIndex}`);
            values.push(value);
          } else if (key === 'orderIndex') {
            fields.push(`order_index = $${paramIndex}`);
            values.push(value);
          } else {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
          }
          paramIndex++;
        }
      });

      if (fields.length === 0) return null;

      fields.push(`updated_at = CURRENT_TIMESTAMP`);
      
      values.push(id);
      const result = await client.query(`
        UPDATE skills 
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);
      
      if (result.rows.length > 0) {
        return skillOperations.getById(id);
      }
      
      return null;
    } finally {
      client.release();
    }
  },

  delete: async (id: string) => {
    const client = await getClient();
    
    try {
      const result = await client.query('DELETE FROM skills WHERE id = $1', [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } finally {
      client.release();
    }
  }
};

// Blog operations
export const blogOperations = {
  getAll: async (filters: {
    page?: number;
    limit?: number;
    published?: boolean;
    featured?: boolean;
    search?: string;
    tag?: string;
  } = {}) => {
    const client = await getClient();

    try {
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
      let paramIndex = 1;

      if (published !== undefined) {
        query += ` AND published = $${paramIndex}`;
        params.push(published);
        paramIndex++;
      }

      if (featured !== undefined) {
        query += ` AND featured = $${paramIndex}`;
        params.push(featured);
        paramIndex++;
      }

      if (search) {
        query += ` AND (title ILIKE $${paramIndex} OR excerpt ILIKE $${paramIndex+1} OR content ILIKE $${paramIndex+2})`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
        paramIndex += 3;
      }

      if (tag) {
        // Simple substring search on tags JSON text to mirror SQLite LIKE behavior
        query += ` AND tags::text ILIKE $${paramIndex}`;
        params.push(`%${tag}%`);
        paramIndex++;
      }

      query += ' ORDER BY created_at DESC';

      // Get total count for pagination (strip ORDER BY for COUNT)
      const countQuery = query
        .replace('SELECT *', 'SELECT COUNT(*) as count')
        .replace(/ORDER BY[\s\S]*$/i, '');
      const totalCountResult = await client.query(countQuery, params);
      const totalCount = parseInt(totalCountResult.rows[0].count);

      // Apply pagination
      const offset = (page - 1) * limit;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex+1}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      const blogs = result.rows.map(row => ({
        ...row,
        tags: row.tags,
        published: Boolean(row.published),
        featured: Boolean(row.featured),
        likes_count: typeof row.likes_count === 'number' ? row.likes_count : 0,
        dislikes_count: typeof row.dislikes_count === 'number' ? row.dislikes_count : 0
      }));

      return {
        blogs,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      };
    } finally {
      client.release();
    }
  },

  getById: async (id: string) => {
    const client = await getClient();

    try {
      const result = await client.query('SELECT * FROM blogs WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        ...row,
        tags: row.tags,
        published: Boolean(row.published),
        featured: Boolean(row.featured),
        likes_count: typeof row.likes_count === 'number' ? row.likes_count : 0,
        dislikes_count: typeof row.dislikes_count === 'number' ? row.dislikes_count : 0
      };
    } finally {
      client.release();
    }
  },

  getBySlug: async (slug: string) => {
    const client = await getClient();

    try {
      const result = await client.query('SELECT * FROM blogs WHERE slug = $1', [slug]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        ...row,
        tags: row.tags,
        published: Boolean(row.published),
        featured: Boolean(row.featured),
        likes_count: typeof row.likes_count === 'number' ? row.likes_count : 0,
        dislikes_count: typeof row.dislikes_count === 'number' ? row.dislikes_count : 0
      };
    } finally {
      client.release();
    }
  },

  create: async (blog: {
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
    const client = await getClient();

    try {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);

      const result = await client.query(`
        INSERT INTO blogs (
          id, title, content, excerpt, slug, tags, image_url,
          published, featured, read_time, likes_count, dislikes_count
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 0, 0)
        RETURNING *
      `, [
        id,
        blog.title,
        blog.content,
        blog.excerpt,
        blog.slug,
        JSON.stringify(blog.tags),
        blog.imageUrl || null,
        blog.published,
        blog.featured,
        blog.readTime
      ]);

      if (result.rows.length > 0) {
        return blogOperations.getById(id);
      }

      return null;
    } finally {
      client.release();
    }
  },

  update: async (id: string, updates: Partial<{
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
    const client = await getClient();

    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'tags') {
            fields.push(`tags = $${paramIndex}`);
            values.push(JSON.stringify(value));
          } else if (key === 'imageUrl') {
            fields.push(`image_url = $${paramIndex}`);
            values.push(value);
          } else if (key === 'readTime') {
            fields.push(`read_time = $${paramIndex}`);
            values.push(value);
          } else if (key === 'published' || key === 'featured') {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
          } else {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
          }
          paramIndex++;
        }
      });

      if (fields.length === 0) return null;

      fields.push('updated_at = CURRENT_TIMESTAMP');

      values.push(id);
      const result = await client.query(`
        UPDATE blogs
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);

      if (result.rows.length > 0) {
        return blogOperations.getById(id);
      }

      return null;
    } finally {
      client.release();
    }
  },

  delete: async (id: string) => {
    const client = await getClient();

    try {
      const result = await client.query('DELETE FROM blogs WHERE id = $1', [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } finally {
      client.release();
    }
  },

  getAllTags: async () => {
    const client = await getClient();

    try {
      const result = await client.query(
        `SELECT DISTINCT jsonb_array_elements_text(tags) AS tag FROM blogs WHERE published = true`
      );
      return result.rows.map(r => r.tag).sort();
    } finally {
      client.release();
    }
  },

  incrementReaction: async (id: string, type: 'like' | 'dislike') => {
    const client = await getClient();

    try {
      const column = type === 'like' ? 'likes_count' : 'dislikes_count';
      const result = await client.query(
        `UPDATE blogs SET ${column} = ${column} + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      if (result.rows.length > 0) {
        return blogOperations.getById(id);
      }
      return null;
    } finally {
      client.release();
    }
  }
};

// Comment operations
export const commentOperations = {
  getForBlog: async (blogId: string, options: { page?: number; limit?: number } = {}) => {
    const client = await getClient();

    try {
      const { page = 1, limit = 50 } = options;
      const offset = (page - 1) * limit;

      const countResult = await client.query('SELECT COUNT(*) as count FROM comments WHERE blog_id = $1', [blogId]);
      const totalCount = parseInt(countResult.rows[0].count);

      const result = await client.query(
        'SELECT * FROM comments WHERE blog_id = $1 ORDER BY created_at ASC LIMIT $2 OFFSET $3',
        [blogId, limit, offset]
      );

      return {
        comments: result.rows,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      };
    } finally {
      client.release();
    }
  },

  create: async (comment: { blogId: string; author?: string; content: string; parentId?: string; userId?: string }) => {
    const client = await getClient();

    try {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const result = await client.query(
        `INSERT INTO comments (id, blog_id, parent_id, author, content, user_id)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [id, comment.blogId, comment.parentId || null, comment.author || null, comment.content, comment.userId || null]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  },

  incrementReaction: async (commentId: string, type: 'like' | 'dislike') => {
    const client = await getClient();

    try {
      const column = type === 'like' ? 'likes' : 'dislikes';
      const result = await client.query(
        `UPDATE comments SET ${column} = ${column} + 1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [commentId]
      );
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  }
};

// Testimonial operations
export const testimonialOperations = {
  getAll: async (filters: {
    page?: number;
    limit?: number;
    featured?: boolean;
    search?: string;
  } = {}) => {
    const client = await getClient();

    try {
      const {
        page = 1,
        limit = 10,
        featured,
        search
      } = filters;

      let query = 'SELECT * FROM testimonials WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (featured !== undefined) {
        query += ` AND featured = $${paramIndex}`;
        params.push(featured);
        paramIndex++;
      }

      if (search) {
        query += ` AND (name ILIKE $${paramIndex} OR company ILIKE $${paramIndex+1} OR content ILIKE $${paramIndex+2})`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
        paramIndex += 3;
      }

      query += ' ORDER BY order_index ASC, created_at DESC';

      const countQuery = query
        .replace('SELECT *', 'SELECT COUNT(*) as count')
        .replace(/ORDER BY[\s\S]*$/i, '');
      const totalCountResult = await client.query(countQuery, params);
      const totalCount = parseInt(totalCountResult.rows[0].count);

      const offset = (page - 1) * limit;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex+1}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      return {
        testimonials: result.rows,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      };
    } finally {
      client.release();
    }
  },

  getById: async (id: string) => {
    const client = await getClient();

    try {
      const result = await client.query('SELECT * FROM testimonials WHERE id = $1', [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  },

  create: async (testimonial: {
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
    const client = await getClient();

    try {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const result = await client.query(`
        INSERT INTO testimonials (
          id, name, position, company, content, rating, image_url,
          linkedin_url, featured, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `, [
        id,
        testimonial.name,
        testimonial.position,
        testimonial.company,
        testimonial.content,
        testimonial.rating,
        testimonial.imageUrl || null,
        testimonial.linkedinUrl || null,
        testimonial.featured,
        testimonial.orderIndex || 0
      ]);

      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  },

  update: async (id: string, updates: Partial<{
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
    const client = await getClient();

    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'imageUrl') {
            fields.push(`image_url = $${paramIndex}`);
            values.push(value);
          } else if (key === 'linkedinUrl') {
            fields.push(`linkedin_url = $${paramIndex}`);
            values.push(value);
          } else if (key === 'featured') {
            fields.push(`featured = $${paramIndex}`);
            values.push(value);
          } else if (key === 'orderIndex') {
            fields.push(`order_index = $${paramIndex}`);
            values.push(value);
          } else {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
          }
          paramIndex++;
        }
      });

      if (fields.length === 0) return null;

      fields.push('updated_at = CURRENT_TIMESTAMP');

      values.push(id);
      const result = await client.query(`
        UPDATE testimonials
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);

      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  },

  delete: async (id: string) => {
    const client = await getClient();

    try {
      const result = await client.query('DELETE FROM testimonials WHERE id = $1', [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } finally {
      client.release();
    }
  }
};

// Education operations
export const educationOperations = {
  getAll: async (filters: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}) => {
    const client = await getClient();

    try {
      const {
        page = 1,
        limit = 50,
        search
      } = filters;

      let query = 'SELECT * FROM educations WHERE 1=1';
      const params: any[] = [];
      let paramIndex = 1;

      if (search) {
        query += ` AND (degree ILIKE $${paramIndex} OR institution ILIKE $${paramIndex+1} OR description::text ILIKE $${paramIndex+2})`;
        const searchPattern = `%${search}%`;
        params.push(searchPattern, searchPattern, searchPattern);
        paramIndex += 3;
      }

      query += ' ORDER BY order_index ASC, start_date DESC';

      const countQuery = query
        .replace('SELECT *', 'SELECT COUNT(*) as count')
        .replace(/ORDER BY[\s\S]*$/i, '');
      const totalCountResult = await client.query(countQuery, params);
      const totalCount = parseInt(totalCountResult.rows[0].count);

      const offset = (page - 1) * limit;
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex+1}`;
      params.push(limit, offset);

      const result = await client.query(query, params);

      const educations = result.rows.map(row => ({
        ...row,
        description: row.description,
        achievements: row.achievements,
        courses: row.courses
      }));

      return {
        educations,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      };
    } finally {
      client.release();
    }
  },

  getById: async (id: string) => {
    const client = await getClient();

    try {
      const result = await client.query('SELECT * FROM educations WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        ...row,
        description: row.description,
        achievements: row.achievements,
        courses: row.courses
      };
    } finally {
      client.release();
    }
  },

  create: async (education: {
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
    const client = await getClient();

    try {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);

      const result = await client.query(`
        INSERT INTO educations (
          id, degree, institution, start_date, end_date, location, grade,
          description, achievements, courses, institution_url, order_index
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
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
      ]);

      if (result.rows.length > 0) {
        return educationOperations.getById(id);
      }

      return null;
    } finally {
      client.release();
    }
  },

  update: async (id: string, updates: Partial<{
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
    const client = await getClient();

    try {
      const fields: string[] = [];
      const values: any[] = [];
      let paramIndex = 1;

      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          if (key === 'description' || key === 'achievements' || key === 'courses') {
            fields.push(`${key} = $${paramIndex}`);
            values.push(JSON.stringify(value));
          } else if (key === 'startDate') {
            fields.push(`start_date = $${paramIndex}`);
            values.push(value);
          } else if (key === 'endDate') {
            fields.push(`end_date = $${paramIndex}`);
            values.push(value);
          } else if (key === 'institutionUrl') {
            fields.push(`institution_url = $${paramIndex}`);
            values.push(value);
          } else if (key === 'orderIndex') {
            fields.push(`order_index = $${paramIndex}`);
            values.push(value);
          } else {
            fields.push(`${key} = $${paramIndex}`);
            values.push(value);
          }
          paramIndex++;
        }
      });

      if (fields.length === 0) return null;

      fields.push('updated_at = CURRENT_TIMESTAMP');

      values.push(id);
      const result = await client.query(`
        UPDATE educations
        SET ${fields.join(', ')}
        WHERE id = $${paramIndex}
        RETURNING *
      `, values);

      if (result.rows.length > 0) {
        return educationOperations.getById(id);
      }

      return null;
    } finally {
      client.release();
    }
  },

  delete: async (id: string) => {
    const client = await getClient();

    try {
      const result = await client.query('DELETE FROM educations WHERE id = $1', [id]);
      return result.rowCount ? result.rowCount > 0 : false;
    } finally {
      client.release();
    }
  }
};

// Personal info operations
export const personalInfoOperations = {
  get: async () => {
    const client = await getClient();

    try {
      const result = await client.query('SELECT * FROM personal_info WHERE id = $1', ['main']);
      console.log(result,"This is result");
      
      if (result.rows.length === 0) return null;
      const row = result.rows[0];
      return {
        ...row,
        socialLinks: row.social_links
      };
    } finally {
      client.release();
    }
  },

  createOrUpdate: async (personalInfo: {
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
    const client = await getClient();

    try {
      await client.query(`
        INSERT INTO personal_info (
          id, name, title, bio, email, phone, location,
          profile_image, resume_url, social_links, updated_at
        ) VALUES ('main', $1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP)
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
          updated_at = CURRENT_TIMESTAMP
      `, [
        personalInfo.name,
        personalInfo.title,
        personalInfo.bio,
        personalInfo.email,
        personalInfo.phone || null,
        personalInfo.location,
        personalInfo.profileImage || null,
        personalInfo.resumeUrl || null,
        JSON.stringify(personalInfo.socialLinks)
      ]);

      return personalInfoOperations.get();
    } finally {
      client.release();
    }
  }
};

// User operations
export const userOperations = {
  getByEmail: async (email: string) => {
    const client = await getClient();

    try {
      const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  },

  getByVerificationToken: async (token: string) => {
    const client = await getClient();

    try {
      const result = await client.query('SELECT * FROM users WHERE verification_token = $1', [token]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  },

  create: async (user: { email: string; username: string; passwordHash: string; mobile?: string; verificationToken: string }) => {
    const client = await getClient();

    try {
      const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
      const result = await client.query(`
        INSERT INTO users (id, email, username, password_hash, mobile, email_verified, verification_token)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `, [
        id,
        user.email,
        user.username,
        user.passwordHash,
        user.mobile || null,
        false,
        user.verificationToken
      ]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
      client.release();
    }
  },

  verifyEmailByToken: async (token: string) => {
    const client = await getClient();

    try {
      const result = await client.query(
        `UPDATE users SET email_verified = true, verification_token = NULL, updated_at = CURRENT_TIMESTAMP WHERE verification_token = $1`,
        [token]
      );
      return result.rowCount ? result.rowCount > 0 : false;
    } finally {
      client.release();
    }
  }
};

// Contact message operations
export const contactOperations = {
  create: async (data: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => {
    const client = await getClient();

    try {
      const id = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const result = await client.query(
        `INSERT INTO contact_messages (id, name, email, subject, message, status, is_read, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
         RETURNING *`,
        [id, data.name, data.email, data.subject || null, data.message, 'unread', false]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  getAll: async (filters: {
    page?: number;
    limit?: number;
    status?: string;
    isRead?: boolean;
  } = {}) => {
    const client = await getClient();

    try {
      const {
        page = 1,
        limit = 10,
        status,
        isRead
      } = filters;

      const offset = (page - 1) * limit;
      let whereClause = '';
      const params: any[] = [];
      let paramIndex = 1;

      if (status) {
        whereClause += ` WHERE status = $${paramIndex}`;
        params.push(status);
        paramIndex++;
      }

      if (isRead !== undefined) {
        whereClause += whereClause ? ` AND is_read = $${paramIndex}` : ` WHERE is_read = $${paramIndex}`;
        params.push(isRead);
        paramIndex++;
      }

      const result = await client.query(
        `SELECT * FROM contact_messages${whereClause} ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        [...params, limit, offset]
      );

      const countResult = await client.query(
        `SELECT COUNT(*) as total FROM contact_messages${whereClause}`,
        params
      );

      return {
        messages: result.rows,
        total: parseInt(countResult.rows[0].total),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].total) / limit)
      };
    } finally {
      client.release();
    }
  },

  getById: async (id: string) => {
    const client = await getClient();

    try {
      const result = await client.query(
        'SELECT * FROM contact_messages WHERE id = $1',
        [id]
      );
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  },

  markAsRead: async (id: string) => {
    const client = await getClient();

    try {
      const result = await client.query(
        `UPDATE contact_messages SET is_read = true, status = 'read', updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  updateStatus: async (id: string, status: string) => {
    const client = await getClient();

    try {
      const result = await client.query(
        `UPDATE contact_messages SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
        [status, id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  },

  delete: async (id: string) => {
    const client = await getClient();

    try {
      const result = await client.query(
        'DELETE FROM contact_messages WHERE id = $1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } finally {
      client.release();
    }
  }
};
