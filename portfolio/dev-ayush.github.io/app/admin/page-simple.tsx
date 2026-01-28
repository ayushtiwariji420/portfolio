'use client';

import { useEffect, useState } from 'react';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProject, setShowAddProject] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    technologies: '',
    liveUrl: '',
    githubUrl: '',
    category: 'web',
    featured: false
  });

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('admin_auth_token');
    if (token === 'authenticated') {
      setIsAuthenticated(true);
    } else {
      // Redirect to login
      window.location.href = '/admin/login';
    }
    setIsLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    window.location.href = '/admin/login';
  };

  const handleAddProject = () => {
    setShowAddProject(true);
  };

  const handleCloseModal = () => {
    setShowAddProject(false);
    setProjectForm({
      title: '',
      description: '',
      technologies: '',
      liveUrl: '',
      githubUrl: '',
      category: 'web',
      featured: false
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    const name = target.name;
    
    setProjectForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Create new project object
    const newProject = {
      id: Date.now().toString(),
      ...projectForm,
      technologies: projectForm.technologies.split(',').map(tech => tech.trim()),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Get existing projects from localStorage
    const existingProjects = JSON.parse(localStorage.getItem('admin_projects') || '[]');
    
    // Add new project
    const updatedProjects = [...existingProjects, newProject];
    
    // Save to localStorage
    localStorage.setItem('admin_projects', JSON.stringify(updatedProjects));
    
    // Update state
    setProjects(updatedProjects);
    
    // Close modal
    handleCloseModal();
    
    // Show success message
    alert('Project added successfully!');
  };

  // Load projects on component mount
  useEffect(() => {
    const savedProjects = JSON.parse(localStorage.getItem('admin_projects') || '[]');
    setProjects(savedProjects);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Admin Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
          <p className="text-purple-100">Here's your portfolio dashboard.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-3xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <span className="text-2xl">📁</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Skills</p>
                <p className="text-3xl font-bold text-gray-900">25</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <span className="text-2xl">🎓</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Experience</p>
                <p className="text-3xl font-bold text-gray-900">4</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <span className="text-2xl">💼</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Views</p>
                <p className="text-3xl font-bold text-gray-900">1,247</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <span className="text-2xl">👁️</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {projects.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Projects</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-gray-900">{project.title}</h4>
                    {project.featured && (
                      <span className="text-yellow-500 text-sm">⭐</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                  <div className="mb-3">
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.slice(0, 3).map((tech: string, index: number) => (
                        <span key={index} className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 3 && (
                        <span className="text-xs text-gray-500">+{project.technologies.length - 3} more</span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 capitalize">{project.category}</span>
                    <div className="flex space-x-2">
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800 text-sm">Live</a>
                      )}
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800 text-sm">Code</a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button 
              onClick={handleAddProject}
              className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <span className="text-2xl mr-3">➕</span>
              <span className="font-medium text-gray-900">Add Project</span>
            </button>
            <button className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <span className="text-2xl mr-3">📝</span>
              <span className="font-medium text-gray-900">Write Blog</span>
            </button>
            <button className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
              <span className="text-2xl mr-3">⭐</span>
              <span className="font-medium text-gray-900">Add Skill</span>
            </button>
            <button className="flex items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
              <span className="text-2xl mr-3">👤</span>
              <span className="font-medium text-gray-900">Update Profile</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Project</h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmitProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={projectForm.title}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    placeholder="Enter project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={projectForm.description}
                    onChange={handleFormChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    placeholder="Enter project description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Technologies *
                  </label>
                  <input
                    type="text"
                    name="technologies"
                    value={projectForm.technologies}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    placeholder="React, Node.js, MongoDB (comma-separated)"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Live URL
                    </label>
                    <input
                      type="url"
                      name="liveUrl"
                      value={projectForm.liveUrl}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="https://your-project.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      name="githubUrl"
                      value={projectForm.githubUrl}
                      onChange={handleFormChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    value={projectForm.category}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="web">Web Application</option>
                    <option value="mobile">Mobile App</option>
                    <option value="desktop">Desktop App</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={projectForm.featured}
                    onChange={handleFormChange}
                    className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Featured Project
                  </label>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    Add Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
