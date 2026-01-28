'use client';

import { useState, useEffect } from 'react';
import { Testimonial, PaginatedResponse, CreateTestimonial, UpdateTestimonial } from '@/types/portfolio';
import TestimonialForm from '@/components/admin/TestimonialForm';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftEllipsisIcon,
  UserIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const filters = [
    { value: '', label: 'All Testimonials' },
    { value: 'featured', label: 'Featured Only' },
  ];

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
      });

      if (searchTerm) params.set('search', searchTerm);
      if (selectedFilter === 'featured') params.set('featured', 'true');

      const response = await fetch(`/api/admin/testimonials?${params}`);
      const data: PaginatedResponse<Testimonial> = await response.json();

      if (data.success) {
        setTestimonials(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [currentPage, searchTerm, selectedFilter]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFilter(e.target.value);
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const handleCreate = () => {
    setEditingTestimonial(null);
    setShowForm(true);
  };

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTestimonial(null);
  };

  const handleSubmitTestimonial = async (data: CreateTestimonial | UpdateTestimonial) => {
    setIsSubmitting(true);
    
    try {
      if (editingTestimonial) {
        // Update existing testimonial
        const response = await fetch(`/api/admin/testimonials/${editingTestimonial.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to update testimonial');
        
        showToast('Testimonial updated successfully!', 'success');
      } else {
        // Create new testimonial
        const response = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) throw new Error('Failed to create testimonial');
        
        showToast('Testimonial created successfully!', 'success');
      }
      
      handleCloseForm();
      fetchTestimonials(); // Refresh the list
    } catch (error) {
      console.error('Error submitting testimonial:', error);
      showToast(editingTestimonial ? 'Failed to update testimonial' : 'Failed to create testimonial', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTestimonial = async (testimonial: Testimonial) => {
    if (!confirm(`Are you sure you want to delete the testimonial from "${testimonial.name}"?`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/admin/testimonials/${testimonial.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete testimonial');
      
      showToast('Testimonial deleted successfully!', 'success');
      fetchTestimonials(); // Refresh the list
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showToast('Failed to delete testimonial', 'error');
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage client testimonials and reviews for your portfolio.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={handleCreate}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            New Testimonial
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg mb-6">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Testimonials
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
                  placeholder="Search by name, company, or content..."
                />
              </div>
            </div>

            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter
              </label>
              <select
                id="filter"
                value={selectedFilter}
                onChange={handleFilterChange}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                {filters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {testimonials.map((testimonial) => (
          <div
            key={testimonial.id}
            className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-200"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {testimonial.imageUrl ? (
                    <img
                      className="w-12 h-12 rounded-full object-cover"
                      src={testimonial.imageUrl}
                      alt={testimonial.name}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                      <UserIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {testimonial.position} at {testimonial.company}
                    </p>
                  </div>
                </div>
                {testimonial.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300">
                    Featured
                  </span>
                )}
              </div>

              <div className="mb-4">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.rating}/5
                </span>
              </div>

              <blockquote className="text-gray-600 dark:text-gray-300 mb-4">
                <ChatBubbleLeftEllipsisIcon className="h-4 w-4 text-gray-400 mb-2" />
                <p className="italic line-clamp-4">"{testimonial.content}"</p>
              </blockquote>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span>{formatDate(testimonial.createdAt)}</span>
                {testimonial.linkedinUrl && (
                  <a
                    href={testimonial.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-500"
                  >
                    LinkedIn
                  </a>
                )}
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => handleEdit(testimonial)}
                  className="p-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 transition-colors"
                  title="Edit Testimonial"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDeleteTestimonial(testimonial)}
                  className="p-2 text-red-600 dark:text-red-400 hover:text-red-500 transition-colors"
                  title="Delete Testimonial"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {testimonials.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <ChatBubbleLeftEllipsisIcon className="h-12 w-12" />
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No testimonials found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || selectedFilter
              ? 'Try adjusting your filters or search terms.'
              : 'Get started by adding your first testimonial.'}
          </p>
          <div className="mt-6">
            <button
              onClick={handleCreate}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              New Testimonial
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

      {/* Testimonial Form Modal */}
      {showForm && (
        <TestimonialForm
          testimonial={editingTestimonial || undefined}
          onSubmit={handleSubmitTestimonial}
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