'use client';

import { useState, useEffect } from 'react';
import { Education, PaginatedResponse, CreateEducation, UpdateEducation } from '@/types/portfolio';
import EducationForm from '@/components/admin/EducationForm';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AcademicCapIcon,
  CalendarIcon,
  MapPinIcon,
  GlobeAltIcon,
  StarIcon
} from '@heroicons/react/24/outline';

export default function EducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchEducations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (searchTerm) params.set('search', searchTerm);

      const response = await fetch(`/api/admin/education?${params}`);
      const data: PaginatedResponse<Education> = await response.json();

      if (data.success) {
        setEducations(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching education records:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducations();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present';
    return dateString;
  };

  const formatDateRange = (startDate: string, endDate?: string) => {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Present';
    return `${start} - ${end}`;
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCreate = () => {
    setEditingEducation(null);
    setShowForm(true);
  };

  const handleEdit = (education: Education) => {
    setEditingEducation(education);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEducation(null);
  };

  const handleSubmitEducation = async (data: CreateEducation | UpdateEducation) => {
    setIsSubmitting(true);
    
    try {
      if (editingEducation) {
        // Update existing education record
        const response = await fetch(`/api/admin/education/${editingEducation.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to update education record');
        
        showToast('Education record updated successfully!', 'success');
      } else {
        // Create new education record
        const response = await fetch('/api/admin/education', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to create education record');
        
        showToast('Education record created successfully!', 'success');
      }
      
      handleCloseForm();
      fetchEducations(); // Refresh the list
    } catch (error) {
      console.error('Error submitting education record:', error);
      showToast(editingEducation ? 'Failed to update education record' : 'Failed to create education record', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEducation = async (education: Education) => {
    if (!confirm(`Are you sure you want to delete "${education.degree} at ${education.institution}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/education/${education.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete education record');
      
      showToast('Education record deleted successfully!', 'success');
      fetchEducations(); // Refresh the list
    } catch (error) {
      console.error('Error deleting education record:', error);
      showToast('Failed to delete education record', 'error');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Education</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your education records, add new qualifications, and update existing records.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Education Record
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="p-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Search Education Records
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
                placeholder="Search by degree, institution, or description..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Education Cards */}
      <div className="space-y-6">
        {educations.map((education) => (
          <div
            key={education.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center flex-shrink-0">
                    <AcademicCapIcon className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {education.degree}
                    </h3>
                    <div className="flex items-center text-purple-600 dark:text-purple-400 mb-1">
                      <GlobeAltIcon className="h-4 w-4 mr-1" />
                      {education.institutionUrl ? (
                        <a
                          href={education.institutionUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {education.institution}
                        </a>
                      ) : (
                        <span>{education.institution}</span>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-4">
                      <div className="flex items-center">
                        <CalendarIcon className="h-4 w-4 mr-1" />
                        {formatDateRange(education.startDate, education.endDate)}
                      </div>
                      {education.location && (
                        <div className="flex items-center">
                          <MapPinIcon className="h-4 w-4 mr-1" />
                          {education.location}
                        </div>
                      )}
                      {education.grade && (
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 mr-1" />
                          {education.grade}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(education)}
                    className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                    title="Edit Education Record"
                  >
                    <PencilIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteEducation(education)}
                    className="p-2 text-red-600 dark:text-red-400 hover:text-red-500 transition-colors"
                    title="Delete Education Record"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                {/* Description */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {education.description.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Achievements */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Achievements</h4>
                  <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                    {education.achievements.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Courses */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">Key Courses</h4>
                  <div className="flex flex-wrap gap-1">
                    {education.courses.slice(0, 6).map((course, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {course}
                      </span>
                    ))}
                    {education.courses.length > 6 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{education.courses.length - 6} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {educations.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <AcademicCapIcon className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No education records found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm
              ? 'Try adjusting your search terms.'
              : 'Get started by adding your first education record.'}
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Education Record
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
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Education Form Modal */}
      {showForm && (
        <EducationForm
          education={editingEducation || undefined}
          onSubmit={handleSubmitEducation}
          onCancel={handleCloseForm}
          isLoading={isSubmitting}
        />
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