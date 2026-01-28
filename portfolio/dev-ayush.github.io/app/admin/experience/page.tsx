'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ExperienceForm from '@/components/admin/ExperienceForm';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  BriefcaseIcon,
  CalendarIcon,
  MapPinIcon,
  BuildingOffice2Icon,
  ArrowTopRightOnSquareIcon
} from '@heroicons/react/24/outline';

interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  responsibilities: string[];
  technologies: string[];
  start_date: string;
  end_date?: string;
  company_url?: string;
  location: string;
  employment_type: string;
  order_index: number;
  created_at: string;
  updated_at: string;
}

interface ExperienceFormData {
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
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/admin/experiences?${params}`);
      const data = await response.json();

      if (data.success) {
        setExperiences(data.data);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching experiences:', error);
      showToast('Failed to fetch experiences', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPeriod = (startDate: string, endDate?: string) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      });
    };

    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  const formatEmploymentType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCreate = () => {
    setEditingExperience(null);
    setShowForm(true);
  };

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingExperience(null);
  };

  const handleSubmitExperience = async (data: ExperienceFormData) => {
    setIsSubmitting(true);
    
    try {
      if (editingExperience) {
        // Update existing experience
        const response = await fetch(`/api/admin/experiences/${editingExperience.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to update experience');
        
        showToast('Experience updated successfully!', 'success');
      } else {
        // Create new experience
        const response = await fetch('/api/admin/experiences', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to create experience');
        
        showToast('Experience created successfully!', 'success');
      }
      
      handleCloseForm();
      fetchExperiences(); // Refresh the list
    } catch (error) {
      console.error('Error submitting experience:', error);
      showToast(editingExperience ? 'Failed to update experience' : 'Failed to create experience', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteExperience = async (experience: Experience) => {
    if (!confirm(`Are you sure you want to delete the experience at "${experience.company}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/experiences/${experience.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete experience');
      
      showToast('Experience deleted successfully!', 'success');
      fetchExperiences(); // Refresh the list
    } catch (error) {
      console.error('Error deleting experience:', error);
      showToast('Failed to delete experience', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Experiences</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your work experience and education history.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Experience
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="max-w-md">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Experiences
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={handleSearch}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search by company, position, or description..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Experiences List */}
      <div className="space-y-6">
        {experiences.map((experience) => (
          <motion.div
            key={experience.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <BriefcaseIcon className="h-6 w-6 text-purple-600" />
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {experience.position}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <BuildingOffice2Icon className="h-5 w-5 text-gray-500" />
                    <h4 className="text-lg text-purple-600 dark:text-purple-400 font-medium">
                      {experience.company}
                    </h4>
                    {experience.company_url && (
                      <a
                        href={experience.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-purple-600 transition-colors"
                      >
                        <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{formatPeriod(experience.start_date, experience.end_date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-4 w-4" />
                      <span>{experience.location}</span>
                    </div>
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                      {formatEmploymentType(experience.employment_type)}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1 ml-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(experience)}
                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-md transition-colors"
                    title="Edit Experience"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteExperience(experience)}
                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                    title="Delete Experience"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {experience.description}
              </p>

              {experience.responsibilities.length > 0 && (
                <div className="mb-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Key Responsibilities:
                  </h5>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {experience.responsibilities.map((responsibility, index) => (
                      <li key={index}>{responsibility}</li>
                    ))}
                  </ul>
                </div>
              )}

              {experience.technologies.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Technologies:
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex justify-between">
                  <span>Order: {experience.order_index}</span>
                  <span>Last updated: {formatDate(experience.updated_at)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {experiences.length === 0 && (
        <div className="text-center py-12">
          <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No experiences found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? 'Try adjusting your search terms.'
              : 'Get started by adding your first experience.'}
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Experience
            </button>
          </div>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing page <span className="font-medium">{currentPage}</span> of{' '}
                <span className="font-medium">{totalPages}</span>
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Experience Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <ExperienceForm
                initialData={editingExperience ? {
                  company: editingExperience.company,
                  position: editingExperience.position,
                  description: editingExperience.description,
                  responsibilities: editingExperience.responsibilities,
                  technologies: editingExperience.technologies,
                  startDate: editingExperience.start_date,
                  endDate: editingExperience.end_date,
                  companyUrl: editingExperience.company_url,
                  location: editingExperience.location,
                  employmentType: editingExperience.employment_type,
                  orderIndex: editingExperience.order_index
                } : undefined}
                onSubmit={handleSubmitExperience}
                onCancel={handleCloseForm}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-md shadow-lg ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}