'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  HomeIcon,
  FolderIcon,
  CogIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  StarIcon,
  AcademicCapIcon,
  BriefcaseIcon,
  Bars3Icon,
  XMarkIcon,
  ArrowRightOnRectangleIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

interface SidebarItem {
  name: string;
  href: string;
  icon: any;
  current?: boolean;
}

const navigation: SidebarItem[] = [
  { name: 'Dashboard', href: '/admin', icon: HomeIcon },
  { name: 'Projects', href: '/admin/projects', icon: FolderIcon },
  { name: 'Skills', href: '/admin/skills', icon: AcademicCapIcon },
  { name: 'Experience', href: '/admin/experience', icon: BriefcaseIcon },
  { name: 'Education', href: '/admin/education', icon: AcademicCapIcon },
  { name: 'Testimonials', href: '/admin/testimonials', icon: StarIcon },
  { name: 'Contact Messages', href: '/admin/contact-messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Profile', href: '/admin/profile', icon: UserIcon },
  { name: 'Settings', href: '/admin/settings', icon: CogIcon },
];

interface AdminSidebarProps {
  children: React.ReactNode;
}

export default function AdminSidebar({ children }: AdminSidebarProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    window.location.href = '/admin/login';
  };

  const currentNavigation = navigation.map(item => ({
    ...item,
    current: pathname === item.href || pathname.startsWith(item.href + '/')
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 flex lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" />
          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-white dark:bg-gray-800 pt-5 pb-4">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <XMarkIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <SidebarContent navigation={currentNavigation} onLogout={handleLogout} />
          </div>
        </div>
      )}

      {/* Static sidebar for desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white dark:bg-gray-800 px-6 pb-4 shadow-xl">
          <SidebarContent navigation={currentNavigation} onLogout={handleLogout} />
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-200 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 lg:hidden" />

          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Admin Panel
              </h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarContent({ 
  navigation, 
  onLogout 
}: { 
  navigation: SidebarItem[]; 
  onLogout: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center">
        <Link href="/admin" className="flex items-center">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
            <span className="text-white font-bold text-sm">PK</span>
          </div>
          <span className="ml-3 text-xl font-bold text-gray-900 dark:text-white">
            Admin
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-all duration-200 ${
                      item.current
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                        : 'text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    <item.icon
                      className={`h-6 w-6 shrink-0 ${
                        item.current ? 'text-white' : 'text-gray-400 group-hover:text-purple-600'
                      }`}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Bottom section */}
          <li className="mt-auto">
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <Link
                href="/"
                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200"
                target="_blank"
              >
                <svg className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
                View Portfolio
              </Link>
              
              <button
                onClick={onLogout}
                className="group flex w-full gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <ArrowRightOnRectangleIcon className="h-6 w-6 shrink-0" />
                Sign Out
              </button>
            </div>
          </li>
        </ul>
      </nav>
    </>
  );
}