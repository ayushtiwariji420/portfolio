import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAdminAuth } from '../../contexts/AdminAuthContext';
import { 
  HomeIcon,
  FolderIcon,
  UserGroupIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  BookOpenIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Projects', href: '/admin/projects', icon: FolderIcon },
  { name: 'Testimonials', href: '/admin/testimonials', icon: UserGroupIcon },
  { name: 'Skills', href: '/admin/skills', icon: AcademicCapIcon },
  { name: 'Experience', href: '/admin/experience', icon: BriefcaseIcon },
  { name: 'Education', href: '/admin/education', icon: BookOpenIcon },
  { name: 'Blogs', href: '/admin/blogs', icon: DocumentTextIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export function AdminLayout({ children }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAdminAuth();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 flex z-40 lg:hidden ${sidebarOpen ? '' : 'pointer-events-none'}`}>
        <div className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0'}`} onClick={() => setSidebarOpen(false)} />
        
        <div className={`relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-white dark:bg-gray-800 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sr-only">Close sidebar</span>
              <XMarkIcon className="h-6 w-6 text-white" />
            </button>
          </div>
          
          <div className="flex-shrink-0 flex items-center px-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h2>
          </div>
          
          <nav className="mt-5 flex-shrink-0 h-full divide-y divide-gray-200 dark:divide-gray-700 overflow-y-auto">
            <div className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="pt-6 pb-3">
              <div className="px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                >
                  <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <div className="flex items-center flex-shrink-0 px-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Admin Panel</h2>
          </div>
          
          <nav className="mt-5 flex-1 flex flex-col divide-y divide-gray-200 dark:divide-gray-700">
            <div className="px-2 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive(item.href)
                      ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-900 dark:text-purple-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </div>
            
            <div className="pt-6 pb-3">
              <div className="px-2 space-y-1">
                <button
                  onClick={handleLogout}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left"
                >
                  <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </div>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col flex-1">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 lg:border-none">
          <button
            type="button"
            className="px-4 border-r border-gray-200 dark:border-gray-700 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div className="flex-1 px-4 flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {navigation.find(item => isActive(item.href))?.name || 'Admin'}
              </h1>
            </div>
            
            <div className="ml-4 flex items-center lg:ml-6">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-4">
                Welcome, Admin
              </span>
              <button
                onClick={handleLogout}
                className="hidden lg:block text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <ArrowLeftOnRectangleIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1">
          <div className="py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
