import React, { useState } from 'react';
import Link from 'next/link';
import { useAdminData } from '../../contexts/AdminDataContext';
import { useConfirmDialog } from '../../components/admin/ConfirmDialog';
import { DataTable, Column } from '../../components/admin/DataTable';
import { Project } from '../../types/admin.types';
import { 
  PlusIcon, 
  EyeIcon, 
  LinkIcon,
  CalendarIcon 
} from '@heroicons/react/24/outline';

export default function AdminProjects() {
  const { state, deleteProject } = useAdminData();
  const { showConfirmDialog, ConfirmDialog } = useConfirmDialog();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handleDeleteProject = (project: Project) => {
    showConfirmDialog({
      title: 'Delete Project',
      message: `Are you sure you want to delete "${project.title}"? This action cannot be undone.`,
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        await deleteProject(project.id);
      },
    });
  };

  const columns: Column<Project>[] = [
    {
      key: 'imageUrl',
      header: 'Image',
      width: '80px',
      render: (value: string, item: Project) => (
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          {value ? (
            <img 
              src={value} 
              alt={item.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (value: string, item: Project) => (
        <div>
          <div className="font-medium text-gray-900 dark:text-white">{value}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
            {item.description}
          </div>
        </div>
      )
    },
    {
      key: 'tags',
      header: 'Technologies',
      render: (value: string[]) => (
        <div className="flex flex-wrap gap-1">
          {value.slice(0, 3).map((tag, index) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full"
            >
              {tag}
            </span>
          ))}
          {value.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{value.length - 3} more
            </span>
          )}
        </div>
      )
    },
    {
      key: 'startDate',
      header: 'Duration',
      render: (startDate: string, item: Project) => (
        <div className="text-sm">
          <div className="flex items-center text-gray-900 dark:text-white">
            <CalendarIcon className="h-4 w-4 mr-1 text-gray-400" />
            {new Date(startDate).toLocaleDateString()}
          </div>
          <div className="text-gray-500 dark:text-gray-400">
            to {new Date(item.endDate).toLocaleDateString()}
          </div>
        </div>
      )
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
      key: 'githubLink',
      header: 'Links',
      render: (githubLink: string, item: Project) => (
        <div className="flex space-x-2">
          {githubLink && (
            <a 
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              title="GitHub"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
            </a>
          )}
          {item.demoLink && (
            <a 
              href={item.demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              title="Demo"
            >
              <LinkIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      )
    }
  ];

  const handleEdit = (project: Project) => {
    // Navigate to edit page
    window.location.href = `/admin/projects/${project.id}/edit`;
  };

  const handleView = (project: Project) => {
    // Navigate to view page
    window.location.href = `/admin/projects/${project.id}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your portfolio projects. Add, edit, or remove projects from your portfolio.
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-blue-50 dark:bg-blue-900/50 p-3 rounded-lg">
                  <svg className="h-6 w-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Projects</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{state.projects.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="bg-green-50 dark:bg-green-900/50 p-3 rounded-lg">
                  <EyeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Visible</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {state.projects.filter(p => p.show).length}
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
                  <svg className="h-6 w-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Hidden</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                  {state.projects.filter(p => !p.show).length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <DataTable
        data={state.projects}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDeleteProject}
        onView={handleView}
        loading={state.loading}
        pagination={{
          pageSize,
          currentPage,
          onPageChange: setCurrentPage
        }}
        emptyMessage="No projects found. Create your first project to get started."
      />

      <ConfirmDialog />
    </div>
  );
}
