'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  ChartBarIcon, 
  FolderIcon, 
  AcademicCapIcon, 
  BriefcaseIcon,
  DocumentTextIcon,
  StarIcon,
  EyeIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

interface DashboardStats {
  projects: number;
  skills: number;
  experience: number;
  views: number;
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    skills: 0,
    experience: 0,
    views: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('admin_auth_token');
    if (token === 'authenticated') {
      setIsAuthenticated(true);
      fetchDashboardData();
    } else {
      // Redirect to login
      window.location.href = '/admin/login';
    }
    setIsLoading(false);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch projects count
      const projectsResponse = await fetch('/api/admin/projects?limit=1');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setStats(prev => ({ ...prev, projects: projectsData.pagination?.total || 0 }));
      }
      
      // Set default values for other stats (you can implement these APIs later)
      setStats(prev => ({
        ...prev,
        skills: 25,
        experience: 4,
        views: 1247
      }));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_auth_token');
    window.location.href = '/admin/login';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect to login
  }

  const quickActions = [
    {
      title: 'Add Project',
      description: 'Create a new project',
      icon: FolderIcon,
      href: '/admin/projects',
      color: 'from-purple-500 to-pink-500',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      title: 'Manage Skills',
      description: 'Update your skills',
      icon: AcademicCapIcon,
      href: '/admin/skills',
      color: 'from-blue-500 to-cyan-500',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      title: 'Write Blog',
      description: 'Create new blog post',
      icon: DocumentTextIcon,
      href: '/admin/blogs',
      color: 'from-green-500 to-emerald-500',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      title: 'View Analytics',
      description: 'Check your stats',
      icon: ChartBarIcon,
      href: '/admin/analytics',
      color: 'from-orange-500 to-red-500',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  const statsCards = [
    {
      title: 'Projects',
      value: stats.projects,
      change: '+2 this month',
      icon: FolderIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Skills',
      value: stats.skills,
      change: '+3 this month',
      icon: AcademicCapIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Experience',
      value: `${stats.experience} years`,
      change: 'Growing strong',
      icon: BriefcaseIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Portfolio Views',
      value: stats.views.toLocaleString(),
      change: '+12% this week',
      icon: EyeIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome back, Ayush Tiwari! 👋</h1>
            <p className="text-purple-100 text-lg mb-4">
              Here's what's happening with your portfolio today.
            </p>
            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                View Portfolio
              </Link>
              <Link
                href="/admin/projects"
                className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg hover:bg-white/30 transition-colors"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Project
              </Link>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-white/10 rounded-full"></div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
          <p className="text-gray-600 mt-1">Manage your portfolio content</p>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              // Extract colors from the gradient string properly
              const gradientMatch = action.color.match(/from-(\w+-\d+)\s+to-(\w+-\d+)/);
              const fromColor = gradientMatch ? gradientMatch[1] : 'purple-500';
              const toColor = gradientMatch ? gradientMatch[2] : 'pink-500';
              
              return (
                <Link
                  key={index}
                  href={action.href}
                  className={`group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${action.color} hover:scale-[1.02] transition-all duration-200`}
                >
                <div className="relative z-10">
                  <div className={`w-12 h-12 ${action.iconBg} rounded-lg flex items-center justify-center mb-4`}>
                    <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">{action.title}</h3>
                  <p className="text-white/80 text-sm">{action.description}</p>
                </div>
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-16 h-16 bg-white/10 rounded-full"></div>
              </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Portfolio projects are now live with database</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Admin panel redesigned with modern UI</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">SQLite database integration completed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Portfolio Health</h2>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Projects Completion</span>
                <span className="text-sm font-medium text-gray-900">85%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profile Completion</span>
                <span className="text-sm font-medium text-gray-900">90%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
