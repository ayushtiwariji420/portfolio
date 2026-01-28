'use client'

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    FaHome, 
    FaProjectDiagram, 
    FaCode, 
    FaBriefcase, 
    FaGraduationCap, 
    FaEnvelope, 
    FaBlog,
    FaMoon,
    FaSun,
    FaBars,
    FaTimes
} from 'react-icons/fa';

interface SidebarProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isDarkMode, toggleDarkMode, isOpen, toggleSidebar }) => {
    const [isMobile, setIsMobile] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const navItems = [
        { name: 'Home', path: '/', icon: FaHome },
        { name: 'Projects', path: '/projects', icon: FaProjectDiagram },
        { name: 'Skills', path: '/skills', icon: FaCode },
        { name: 'Experience', path: '/experience', icon: FaBriefcase },
        { name: 'Education', path: '/education', icon: FaGraduationCap },
        { name: 'Contact', path: '/contact', icon: FaEnvelope }
    ];

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={toggleSidebar}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg"
            >
                {isOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
            </button>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobile && isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-black z-30 md:hidden"
                        onClick={toggleSidebar}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={{
                    width: isMobile ? (isOpen ? '280px' : '0') : (isOpen ? '250px' : '80px'),
                    left: isMobile ? (isOpen ? '0' : '-280px') : '0'
                }}
                transition={{ duration: 0.3 }}
                className={`fixed top-0 h-screen bg-white dark:bg-gray-800 shadow-lg z-40 overflow-hidden ${
                    isMobile ? 'w-[280px]' : ''
                }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo and Toggle */}
                    <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                        {isOpen && (
                            <Link href="/" className="text-xl font-bold text-purple-600">
                                Ayush Tiwari
                            </Link>
                        )}
                        {!isMobile && (
                            <button
                                onClick={toggleSidebar}
                                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <svg
                                    className="w-6 h-6 text-gray-600 dark:text-gray-300"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    {isOpen ? (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                                        />
                                    ) : (
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                                        />
                                    )}
                                </svg>
                            </button>
                        )}
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.path}
                                    onClick={() => isMobile && toggleSidebar()}
                                    className={`flex items-center p-3 rounded-lg transition-colors ${
                                        isActive
                                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }`}
                                >
                                    <Icon className="w-6 h-6 flex-shrink-0" />
                                    {isOpen && (
                                        <span className="ml-3 whitespace-nowrap">{item.name}</span>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Theme Toggle */}
                    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={toggleDarkMode}
                            className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                                isDarkMode
                                    ? 'bg-gray-700 text-yellow-400'
                                    : 'bg-gray-100 text-gray-700'
                            }`}
                        >
                            {isDarkMode ? <FaSun className="w-6 h-6" /> : <FaMoon className="w-6 h-6" />}
                            {isOpen && (
                                <span className="ml-3">
                                    {isDarkMode ? 'Light Mode' : 'Dark Mode'}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default React.memo(Sidebar);
