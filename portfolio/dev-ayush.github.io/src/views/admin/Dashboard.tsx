import React from 'react';
import Link from 'next/link';
import { useAdminData } from '../../contexts/AdminDataContext';
import { 
  FolderIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BookOpenIcon,
  DocumentTextIcon,
  PlusIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'indigo';
  link: string;
  showLink?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, link, showLink }) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/50',
      icon: 'text-blue-600 dark:text-blue-400',
      text: 'text-blue-600 dark:text-blue-400'
    },
    green: {
      bg: 'bg-green-50 dark:bg-green-900/50',
      icon: 'text-green-600 dark:text-green-400',
      text: 'text-green-600 dark:text-green-400'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/50',
      icon: 'text-purple-600 dark:text-purple-400',
      text: 'text-purple-600 dark:text-purple-400'
    },
    yellow: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/50',
      icon: 'text-yellow-600 dark:text-yellow-400',
      text: 'text-yellow-600 dark:text-yellow-400'
    },
    red: {
      bg: 'bg-red-50 dark:bg-red-900/50',
      icon: 'text-red-600 dark:text-red-400',
      text: 'text-red-600 dark:text-red-400'
    },
    indigo: {
      bg: 'bg-indigo-50 dark:bg-indigo-900/50',
      icon: 'text-indigo-600 dark:text-indigo-400',
      text: 'text-indigo-600 dark:text-indigo-400'
    }
  };

  const classes = colorClasses[color];

  return (
    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <div className="flex items-center">
          <div className={`flex-shrink-0 p-3 rounded-lg ${classes.bg}`}>
            <Icon className={`h-6 w-6 ${classes.icon}`} />
          </div>
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-semibold text-gray-900 dark:text-white">{value}</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-between">
          <Link
            href={link}
            className={`inline-flex items-center text-sm font-medium ${classes.text} hover:underline`}
          >
            <PlusIcon className="h-4 w-4 mr-1" />
            Add New
          </Link>
          {showLink && (
            <Link
              href={showLink}
              className={`inline-flex items-center text-sm font-medium ${classes.text} hover:underline`}
            >
              <EyeIcon className="h-4 w-4 mr-1" />
              View All
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const { state, getStats } = useAdminData();
  const stats = getStats();

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects,
      icon: FolderIcon,
      color: 'blue' as const,
      link: '/admin/projects/new',
      showLink: '/admin/projects'
    },
    {
      title: 'Testimonials',
      value: stats.totalTestimonials,
      icon: UserGroupIcon,
      color: 'green' as const,
      link: '/admin/testimonials/new',
      showLink: '/admin/testimonials'
    },
    {
      title: 'Skills',
      value: stats.totalSkills,
      icon: AcademicCapIcon,
      color: 'purple' as const,
      link: '/admin/skills/new',
      showLink: '/admin/skills'
    },
    {
      title: 'Experience',
      value: stats.totalExperience,
      icon: BriefcaseIcon,
      color: 'yellow' as const,
      link: '/admin/experience/new',
      showLink: '/admin/experience'
    },
    {
      title: 'Education',
      value: stats.totalEducation,
      icon: BookOpenIcon,
      color: 'indigo' as const,
      link: '/admin/education/new',
      showLink: '/admin/education'
    },
  ];

  const recentItems = [
    ...state.projects.slice(-3).map(item => ({
      id: item.id,
      title: item.title,
      type: 'Project',
      date: item.updatedAt,
      link: `/admin/projects/${item.id}`
    })),
    ...state.testimonials.slice(-2).map(item => ({
      id: item.id,
      title: `${item.name} - ${item.company}`,
      type: 'Testimonial',
      date: item.updatedAt,
      link: `/admin/testimonials/${item.id}`
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Welcome to your admin dashboard. Manage your portfolio content from here.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            icon={card.icon}
            color={card.color}
            link={card.link}
            showLink={card.showLink}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Activity</h3>
          </div>
          <div className="p-6">
            {recentItems.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-gray-400 dark:text-gray-500 mb-2">
                  <DocumentTextIcon className="h-8 w-8 mx-auto" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {item.title}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {item.type} • {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="ml-4">
                      <Link
                        href={item.link}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-300 text-sm font-medium"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              <Link
                href="/admin/projects/new"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-blue-50 dark:bg-blue-900/50 p-2 rounded-md">
                  <FolderIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Add New Project</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create a new portfolio project</p>
                </div>
              </Link>

              <Link
                href="/admin/testimonials/new"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-green-50 dark:bg-green-900/50 p-2 rounded-md">
                  <UserGroupIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Add Testimonial</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Add client testimonial</p>
                </div>
              </Link>

              <Link
                href="/admin/blogs/new"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-purple-50 dark:bg-purple-900/50 p-2 rounded-md">
                  <DocumentTextIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Write Blog Post</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create new blog content</p>
                </div>
              </Link>

              <Link
                href="/admin/analytics"
                className="flex items-center p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="bg-yellow-50 dark:bg-yellow-900/50 p-2 rounded-md">
                  <DocumentTextIcon className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">View Analytics</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Check site performance</p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Status</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                  ✅ Data Storage
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  LocalStorage Active
                </div>
              </div>
              <div className="text-center">
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                  ✅ Admin Access
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Authentication Working
                </div>
              </div>
              <div className="text-center">
                <div className="text-green-600 dark:text-green-400 text-sm font-medium">
                  ✅ Content Management
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  All Systems Operational
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
