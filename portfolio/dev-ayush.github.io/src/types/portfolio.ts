export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  technologies: string[];
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: 'web' | 'mobile' | 'desktop' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: 'frontend' | 'backend' | 'database' | 'tools' | 'other';
  proficiency: 1 | 2 | 3 | 4 | 5; // 1-5 scale
  iconUrl?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  startDate: string;
  endDate?: string; // null means current job
  companyUrl?: string;
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
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
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  tags: string[];
  imageUrl?: string;
  published: boolean;
  featured: boolean;
  readTime: number; // in minutes
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  position: string;
  company: string;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
  imageUrl?: string;
  linkedinUrl?: string;
  featured: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface PersonalInfo {
  id: string;
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
  updatedAt: string;
}

export interface Settings {
  id: string;
  siteName: string;
  siteDescription: string;
  siteKeywords: string[];
  contactEmail: string;
  analyticsId?: string;
  maintenanceMode: boolean;
  theme: 'light' | 'dark' | 'auto';
  updatedAt: string;
}

// Form types for creating/updating
export type CreateProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateProject = Partial<CreateProject>;

export type CreateSkill = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateSkill = Partial<CreateSkill>;

export type CreateExperience = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateExperience = Partial<CreateExperience>;

export type CreateEducation = Omit<Education, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateEducation = Partial<CreateEducation>;

export type CreateBlog = Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateBlog = Partial<CreateBlog>;

export type CreateTestimonial = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateTestimonial = Partial<CreateTestimonial>;

export type UpdatePersonalInfo = Partial<Omit<PersonalInfo, 'id'>>;
export type UpdateSettings = Partial<Omit<Settings, 'id'>>;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Admin auth types
export interface AdminUser {
  username: string;
  role: 'admin';
}

export interface LoginCredentials {
  username: string;
  password: string;
}