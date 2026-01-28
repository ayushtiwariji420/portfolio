import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { 
  Project, 
  Testimonial, 
  Skill, 
  Experience, 
  Education, 
  Blog,
  AdminStats,
  ProjectFormData,
  TestimonialFormData,
  SkillFormData,
  ExperienceFormData,
  EducationFormData,
  BlogFormData
} from '../types/admin.types';

interface AdminDataState {
  projects: Project[];
  testimonials: Testimonial[];
  skills: Skill[];
  experiences: Experience[];
  education: Education[];
  blogs: Blog[];
  loading: boolean;
  error: string | null;
}

type AdminDataAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_PROJECTS'; payload: Project[] }
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'SET_TESTIMONIALS'; payload: Testimonial[] }
  | { type: 'ADD_TESTIMONIAL'; payload: Testimonial }
  | { type: 'UPDATE_TESTIMONIAL'; payload: Testimonial }
  | { type: 'DELETE_TESTIMONIAL'; payload: string }
  | { type: 'SET_SKILLS'; payload: Skill[] }
  | { type: 'ADD_SKILL'; payload: Skill }
  | { type: 'UPDATE_SKILL'; payload: Skill }
  | { type: 'DELETE_SKILL'; payload: string }
  | { type: 'SET_EXPERIENCES'; payload: Experience[] }
  | { type: 'ADD_EXPERIENCE'; payload: Experience }
  | { type: 'UPDATE_EXPERIENCE'; payload: Experience }
  | { type: 'DELETE_EXPERIENCE'; payload: string }
  | { type: 'SET_EDUCATION'; payload: Education[] }
  | { type: 'ADD_EDUCATION'; payload: Education }
  | { type: 'UPDATE_EDUCATION'; payload: Education }
  | { type: 'DELETE_EDUCATION'; payload: string }
  | { type: 'SET_BLOGS'; payload: Blog[] }
  | { type: 'ADD_BLOG'; payload: Blog }
  | { type: 'UPDATE_BLOG'; payload: Blog }
  | { type: 'DELETE_BLOG'; payload: string };

interface AdminDataContextType {
  state: AdminDataState;
  // Projects
  createProject: (project: ProjectFormData) => Promise<void>;
  updateProject: (id: string, project: Partial<ProjectFormData>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  getProject: (id: string) => Project | undefined;
  // Testimonials
  createTestimonial: (testimonial: TestimonialFormData) => Promise<void>;
  updateTestimonial: (id: string, testimonial: Partial<TestimonialFormData>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  getTestimonial: (id: string) => Testimonial | undefined;
  // Skills
  createSkill: (skill: SkillFormData) => Promise<void>;
  updateSkill: (id: string, skill: Partial<SkillFormData>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  getSkill: (id: string) => Skill | undefined;
  // Experience
  createExperience: (experience: ExperienceFormData) => Promise<void>;
  updateExperience: (id: string, experience: Partial<ExperienceFormData>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  getExperience: (id: string) => Experience | undefined;
  // Education
  createEducation: (education: EducationFormData) => Promise<void>;
  updateEducation: (id: string, education: Partial<EducationFormData>) => Promise<void>;
  deleteEducation: (id: string) => Promise<void>;
  getEducation: (id: string) => Education | undefined;
  // Blogs
  createBlog: (blog: BlogFormData) => Promise<void>;
  updateBlog: (id: string, blog: Partial<BlogFormData>) => Promise<void>;
  deleteBlog: (id: string) => Promise<void>;
  getBlog: (id: string) => Blog | undefined;
  // Stats
  getStats: () => AdminStats;
}

const AdminDataContext = createContext<AdminDataContextType | undefined>(undefined);

const initialState: AdminDataState = {
  projects: [],
  testimonials: [],
  skills: [],
  experiences: [],
  education: [],
  blogs: [],
  loading: false,
  error: null,
};

function adminDataReducer(state: AdminDataState, action: AdminDataAction): AdminDataState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_PROJECTS':
      return { ...state, projects: action.payload };
    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.payload] };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload)
      };
    case 'SET_TESTIMONIALS':
      return { ...state, testimonials: action.payload };
    case 'ADD_TESTIMONIAL':
      return { ...state, testimonials: [...state.testimonials, action.payload] };
    case 'UPDATE_TESTIMONIAL':
      return {
        ...state,
        testimonials: state.testimonials.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'DELETE_TESTIMONIAL':
      return {
        ...state,
        testimonials: state.testimonials.filter(t => t.id !== action.payload)
      };
    case 'SET_SKILLS':
      return { ...state, skills: action.payload };
    case 'ADD_SKILL':
      return { ...state, skills: [...state.skills, action.payload] };
    case 'UPDATE_SKILL':
      return {
        ...state,
        skills: state.skills.map(s => s.id === action.payload.id ? action.payload : s)
      };
    case 'DELETE_SKILL':
      return {
        ...state,
        skills: state.skills.filter(s => s.id !== action.payload)
      };
    case 'SET_EXPERIENCES':
      return { ...state, experiences: action.payload };
    case 'ADD_EXPERIENCE':
      return { ...state, experiences: [...state.experiences, action.payload] };
    case 'UPDATE_EXPERIENCE':
      return {
        ...state,
        experiences: state.experiences.map(e => e.id === action.payload.id ? action.payload : e)
      };
    case 'DELETE_EXPERIENCE':
      return {
        ...state,
        experiences: state.experiences.filter(e => e.id !== action.payload)
      };
    case 'SET_EDUCATION':
      return { ...state, education: action.payload };
    case 'ADD_EDUCATION':
      return { ...state, education: [...state.education, action.payload] };
    case 'UPDATE_EDUCATION':
      return {
        ...state,
        education: state.education.map(e => e.id === action.payload.id ? action.payload : e)
      };
    case 'DELETE_EDUCATION':
      return {
        ...state,
        education: state.education.filter(e => e.id !== action.payload)
      };
    case 'SET_BLOGS':
      return { ...state, blogs: action.payload };
    case 'ADD_BLOG':
      return { ...state, blogs: [...state.blogs, action.payload] };
    case 'UPDATE_BLOG':
      return {
        ...state,
        blogs: state.blogs.map(b => b.id === action.payload.id ? action.payload : b)
      };
    case 'DELETE_BLOG':
      return {
        ...state,
        blogs: state.blogs.filter(b => b.id !== action.payload)
      };
    default:
      return state;
  }
}

// Utility functions
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const saveToLocalStorage = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const loadFromLocalStorage = (key: string, defaultValue: any = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return defaultValue;
  }
};

export function AdminDataProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(adminDataReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadData = () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        
        const projects = loadFromLocalStorage('admin-projects', []);
        const testimonials = loadFromLocalStorage('admin-testimonials', []);
        const skills = loadFromLocalStorage('admin-skills', []);
        const experiences = loadFromLocalStorage('admin-experiences', []);
        const education = loadFromLocalStorage('admin-education', []);
        const blogs = loadFromLocalStorage('admin-blogs', []);

        dispatch({ type: 'SET_PROJECTS', payload: projects });
        dispatch({ type: 'SET_TESTIMONIALS', payload: testimonials });
        dispatch({ type: 'SET_SKILLS', payload: skills });
        dispatch({ type: 'SET_EXPERIENCES', payload: experiences });
        dispatch({ type: 'SET_EDUCATION', payload: education });
        dispatch({ type: 'SET_BLOGS', payload: blogs });
      } catch (error) {
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadData();
  }, []);

  // Project operations
  const createProject = async (projectData: ProjectFormData) => {
    try {
      const now = new Date().toISOString();
      const project: Project = {
        ...projectData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      dispatch({ type: 'ADD_PROJECT', payload: project });
      const updatedProjects = [...state.projects, project];
      saveToLocalStorage('admin-projects', updatedProjects);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create project' });
      throw error;
    }
  };

  const updateProject = async (id: string, projectData: Partial<ProjectFormData>) => {
    try {
      const existingProject = state.projects.find(p => p.id === id);
      if (!existingProject) throw new Error('Project not found');

      const updatedProject: Project = {
        ...existingProject,
        ...projectData,
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
      const updatedProjects = state.projects.map(p => p.id === id ? updatedProject : p);
      saveToLocalStorage('admin-projects', updatedProjects);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update project' });
      throw error;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_PROJECT', payload: id });
      const updatedProjects = state.projects.filter(p => p.id !== id);
      saveToLocalStorage('admin-projects', updatedProjects);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete project' });
      throw error;
    }
  };

  const getProject = (id: string) => state.projects.find(p => p.id === id);

  // Testimonial operations
  const createTestimonial = async (testimonialData: TestimonialFormData) => {
    try {
      const now = new Date().toISOString();
      const testimonial: Testimonial = {
        ...testimonialData,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
      };
      
      dispatch({ type: 'ADD_TESTIMONIAL', payload: testimonial });
      const updatedTestimonials = [...state.testimonials, testimonial];
      saveToLocalStorage('admin-testimonials', updatedTestimonials);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create testimonial' });
      throw error;
    }
  };

  const updateTestimonial = async (id: string, testimonialData: Partial<TestimonialFormData>) => {
    try {
      const existingTestimonial = state.testimonials.find(t => t.id === id);
      if (!existingTestimonial) throw new Error('Testimonial not found');

      const updatedTestimonial: Testimonial = {
        ...existingTestimonial,
        ...testimonialData,
        updatedAt: new Date().toISOString(),
      };

      dispatch({ type: 'UPDATE_TESTIMONIAL', payload: updatedTestimonial });
      const updatedTestimonials = state.testimonials.map(t => t.id === id ? updatedTestimonial : t);
      saveToLocalStorage('admin-testimonials', updatedTestimonials);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update testimonial' });
      throw error;
    }
  };

  const deleteTestimonial = async (id: string) => {
    try {
      dispatch({ type: 'DELETE_TESTIMONIAL', payload: id });
      const updatedTestimonials = state.testimonials.filter(t => t.id !== id);
      saveToLocalStorage('admin-testimonials', updatedTestimonials);
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete testimonial' });
      throw error;
    }
  };

  const getTestimonial = (id: string) => state.testimonials.find(t => t.id === id);

  // Placeholder functions for other entities (Skills, Experience, Education, Blogs)
  // You can implement these similarly to projects and testimonials
  const createSkill = async (skillData: SkillFormData) => {
    // Similar implementation as createProject
    console.log('createSkill:', skillData);
  };

  const updateSkill = async (id: string, skillData: Partial<SkillFormData>) => {
    console.log('updateSkill:', id, skillData);
  };

  const deleteSkill = async (id: string) => {
    console.log('deleteSkill:', id);
  };

  const getSkill = (id: string) => state.skills.find(s => s.id === id);

  // Similar placeholder functions for Experience, Education, and Blogs
  const createExperience = async (experienceData: ExperienceFormData) => {
    console.log('createExperience:', experienceData);
  };

  const updateExperience = async (id: string, experienceData: Partial<ExperienceFormData>) => {
    console.log('updateExperience:', id, experienceData);
  };

  const deleteExperience = async (id: string) => {
    console.log('deleteExperience:', id);
  };

  const getExperience = (id: string) => state.experiences.find(e => e.id === id);

  const createEducation = async (educationData: EducationFormData) => {
    console.log('createEducation:', educationData);
  };

  const updateEducation = async (id: string, educationData: Partial<EducationFormData>) => {
    console.log('updateEducation:', id, educationData);
  };

  const deleteEducation = async (id: string) => {
    console.log('deleteEducation:', id);
  };

  const getEducation = (id: string) => state.education.find(e => e.id === id);

  const createBlog = async (blogData: BlogFormData) => {
    console.log('createBlog:', blogData);
  };

  const updateBlog = async (id: string, blogData: Partial<BlogFormData>) => {
    console.log('updateBlog:', id, blogData);
  };

  const deleteBlog = async (id: string) => {
    console.log('deleteBlog:', id);
  };

  const getBlog = (id: string) => state.blogs.find(b => b.id === id);

  const getStats = (): AdminStats => {
    return {
      totalProjects: state.projects.length,
      visibleProjects: state.projects.filter(p => p.show).length,
      totalTestimonials: state.testimonials.length,
      totalSkills: state.skills.length,
      totalExperience: state.experiences.length,
      totalBlogs: state.blogs.length,
      publishedBlogs: state.blogs.filter(b => b.published).length,
    };
  };

  const contextValue: AdminDataContextType = {
    state,
    createProject,
    updateProject,
    deleteProject,
    getProject,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    getTestimonial,
    createSkill,
    updateSkill,
    deleteSkill,
    getSkill,
    createExperience,
    updateExperience,
    deleteExperience,
    getExperience,
    createEducation,
    updateEducation,
    deleteEducation,
    getEducation,
    createBlog,
    updateBlog,
    deleteBlog,
    getBlog,
    getStats,
  };

  return (
    <AdminDataContext.Provider value={contextValue}>
      {children}
    </AdminDataContext.Provider>
  );
}

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (context === undefined) {
    throw new Error('useAdminData must be used within an AdminDataProvider');
  }
  return context;
};
