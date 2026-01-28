export interface Project {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  tags: string[];
  icons: string[];
  imageUrl: string;
  githubLink: string;
  demoLink: string;
  show: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  imageUrl?: string;
  linkedinUrl?: string;
  show: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number; // 1-100
  icon: string;
  show: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  technologies: string[];
  achievements: string[];
  show: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
  achievements?: string[];
  show: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  imageUrl: string;
  tags: string[];
  publishedAt: string;
  published: boolean;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUser {
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
}

export interface AdminStats {
  totalProjects: number;
  visibleProjects: number;
  totalTestimonials: number;
  totalSkills: number;
  totalExperience: number;
  totalBlogs: number;
  publishedBlogs: number;
}

// Form types
export type ProjectFormData = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;
export type TestimonialFormData = Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>;
export type SkillFormData = Omit<Skill, 'id' | 'createdAt' | 'updatedAt'>;
export type ExperienceFormData = Omit<Experience, 'id' | 'createdAt' | 'updatedAt'>;
export type EducationFormData = Omit<Education, 'id' | 'createdAt' | 'updatedAt'>;
export type BlogFormData = Omit<Blog, 'id' | 'createdAt' | 'updatedAt'>;

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
