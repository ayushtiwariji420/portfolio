'use client'

import React, { useState, useEffect } from 'react'
import { useTheme } from '@/contexts/ThemeProvider'
import { SessionProvider } from 'next-auth/react'
import Sidebar from './Sidebar'
import ChatWidget from './ChatWidget'
import StatisticsSection from './StatisticsSection'

interface AppWrapperProps {
  children: React.ReactNode
}

export default function AppWrapper({ children }: AppWrapperProps) {
  const { theme, setTheme } = useTheme()
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false)
      } else {
        setIsSidebarOpen(true)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleDarkMode = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        isDarkMode={theme === 'dark'} 
        toggleDarkMode={toggleDarkMode} 
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'md:ml-80' : 'md:ml-20'}`}>
        <SessionProvider>
          <div className="min-h-screen">
            {children}
          </div>
          <StatisticsSection isSidebarOpen={isSidebarOpen} />
          <footer className="bg-white dark:bg-gray-800 py-6 sm:py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                <p>© {new Date().getFullYear()} Naveen Patidar. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </SessionProvider>
      </main>
      <ChatWidget />
    </div>
  )
}
