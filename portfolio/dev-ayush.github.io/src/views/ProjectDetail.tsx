import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ExternalLink, Github, Calendar, Tag, Globe } from 'lucide-react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

interface ProjectDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  imageUrl: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  category: string;
  startDate: string;
  endDate: string;
  tags: string[];
  icons: string[];
  show: boolean;
  demoLink?: string;
  githubLink?: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectDetailProps {
  projectId: string;
}

const ProjectDetailView: React.FC<ProjectDetailProps> = ({ projectId }) => {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/projects/${projectId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Project not found');
          }
          throw new Error('Failed to fetch project');
        }
        
        const data = await response.json();
        
        if (data.success) {
          setProject(data.project);
        } else {
          throw new Error(data.error || 'Failed to fetch project');
        }
      } catch (error) {
        console.error('Error fetching project:', error);
        setError(error instanceof Error ? error.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      fetchProject();
    }
  }, [projectId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  const handleGoBack = () => {
    router.push('/projects');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-red-500 dark:text-red-400 text-lg mb-4">
              {error || 'Project not found'}
            </p>
            <button 
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft size={16} />
              Back to Projects
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleGoBack}
          className="inline-flex items-center gap-2 mb-8 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Projects
        </motion.button>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden mb-8"
        >
          {/* Hero Image */}
          <div className="relative h-64 md:h-80 overflow-hidden">
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            
            {/* Featured Badge */}
            {project.featured && (
              <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                Featured
              </div>
            )}
          </div>

          <div className="p-8">
            {/* Title and Icons */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {project.title}
                </h1>
                
                {/* Tech Stack Icons */}
                <div className="flex items-center gap-3 mb-4">
                  {project.icons && project.icons.length > 0 ? (
                    project.icons.map((icon, index) => (
                      <div
                        key={index}
                        className="text-3xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                      >
                        <Icon icon={icon} />
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      No technology icons available
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-800 dark:bg-gray-700 text-white rounded-lg hover:bg-gray-900 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Github size={16} />
                    GitHub
                  </a>
                )}
              </div>
            </div>

            {/* Short Description */}
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              {project.description}
            </p>

            {/* Project Metadata */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Calendar size={16} />
                <div>
                  <p className="text-sm font-medium">Timeline</p>
                  <p className="text-sm">
                    {formatDate(project.startDate)} - {formatDate(project.endDate)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Tag size={16} />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm capitalize">{project.category}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                <Globe size={16} />
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <p className="text-sm">{project.show ? 'Active' : 'Inactive'}</p>
                </div>
              </div>
            </div>

            {/* Technologies */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Technologies Used
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies && project.technologies.length > 0 ? (
                  project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-sm bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded-full"
                    >
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    No technologies specified
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Detailed Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            About This Project
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {project.longDescription ? (
              <div className="whitespace-pre-wrap text-gray-600 dark:text-gray-300 leading-relaxed">
                {project.longDescription}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                No detailed description available for this project.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectDetailView;