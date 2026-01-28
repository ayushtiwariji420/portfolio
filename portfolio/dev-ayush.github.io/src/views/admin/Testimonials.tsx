import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminData } from '../../contexts/AdminDataContext';
import { useConfirmDialog } from '../../components/admin/ConfirmDialog';
import { DataTable, Column } from '../../components/admin/DataTable';
import { Testimonial } from '../../types/admin.types';
import { 
  PlusIcon, 
  StarIcon,
  BuildingOfficeIcon,
  UserIcon 
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

export default function AdminTestimonials() {
  const { state, deleteTestimonial } = useAdminData();
  const { showConfirmDialog, ConfirmDialog } = useConfirmDialog();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleDeleteTestimonial = (testimonial: Testimonial) => {
    showConfirmDialog({
      title: 'Delete Testimonial',
      message: `Are you sure you want to delete testimonial from "${testimonial.name}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        await deleteTestimonial(testimonial.id);
      },
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          star <= rating ? (
            <StarIconSolid key={star} className="h-4 w-4 text-yellow-400" />
          ) : (
            <StarIcon key={star} className="h-4 w-4 text-gray-300 dark:text-gray-600" />
          )
        ))}
        <span className="ml-1 text-sm text-gray-600 dark:text-gray-400">({rating})</span>
      </div>
    );
  };

  const columns: Column<Testimonial>[] = [
    {
      key: 'imageUrl',
      header: 'Photo',
      width: '80px',
      render: (value: string, item: Testimonial) => (
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          {value ? (
            <img 
              src={value} 
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <UserIcon className="w-6 h-6" />
            </div>
          )}
        </div>
      )
    },
    {
      key: 'name',
      header: 'Person',
      sortable: true,
      render: (name: string, item: Testimonial) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {item.role}
          </div>
        </div>
      )
    },
    {
      key: 'company',
      header: 'Company',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center">
          <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2" />
          <span className="text-gray-900 dark:text-white">{value}</span>
        </div>
      )
    },
    {
      key: 'content',
      header: 'Testimonial',
      render: (value: string) => (
        <div className="max-w-xs">
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            "{value}"
          </p>
        </div>
      )
    },
    {
      key: 'rating',
      header: 'Rating',
      sortable: true,
      render: (value: number) => renderStars(value)
    },
    {
      key: 'show',
      header: 'Status',
      sortable: true,
      render: (value: boolean) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          value 
            ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100'
        }`}>
          {value ? 'Visible' : 'Hidden'}
        </span>
      )
    },
    {
      key: 'linkedinUrl',
      header: 'LinkedIn',
      render: (value: string) => (
        value ? (
          <a 
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            title="LinkedIn Profile"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          </a>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">-</span>
        )
      )
    }
  ];

  const handleEdit = (testimonial: Testimonial) => {
    // Navigate to edit page
    window.location.href = `/admin/testimonials/${testimonial.id}/edit`;
  };

  const handleView = (testimonial: Testimonial) => {
    // Navigate to view page
    window.location.href = `/admin/testimonials/${testimonial.id}`;
  };

  const averageRating = state.testimonials.length > 0 
    ? (state.testimonials.reduce((sum, t) => sum + t.rating, 0) / state.testimonials.length).toFixed(1)
    : '0.0';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Testimonials</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage client testimonials and reviews. Add, edit, or remove testimonials from your portfolio.
          </p>
        </div>
        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Testimonial
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-lg">
                  <UserIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Testimonials</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{state.testimonials.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-50 dark:bg-green-900/50 p-3 rounded-lg">
                  <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Visible</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {state.testimonials.filter(t => t.show).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-yellow-50 dark:bg-yellow-900/50 p-3 rounded-lg">
                  <StarIcon className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <div className="flex items-center">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white mr-2">{averageRating}</p>
                  <StarIconSolid className="h-5 w-5 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-purple-50 dark:bg-purple-900/50 p-3 rounded-lg">
                  <BuildingOfficeIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Companies</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {new Set(state.testimonials.map(t => t.company)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Table */}
      <DataTable
        data={state.testimonials}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDeleteTestimonial}
        onView={handleView}
        loading={state.loading}
        pagination={{
          pageSize,
          currentPage,
          onPageChange: setCurrentPage
        }}
        emptyMessage="No testimonials found. Add your first testimonial to get started."
      />

      <ConfirmDialog />
    </div>
  );
}
