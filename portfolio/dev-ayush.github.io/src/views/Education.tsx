import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaGraduationCap, FaAward, FaBook } from 'react-icons/fa';
import { Education, ApiResponse } from '@/types/portfolio';

const EducationComponent: React.FC = () => {
    const [educations, setEducations] = useState<Education[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEducations();
    }, []);

    const fetchEducations = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/education');
            const data: ApiResponse<Education[]> = await response.json();
            
            if (data.success && data.data) {
                setEducations(data.data);
            }
        } catch (error) {
            console.error('Error fetching education records:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateRange = (startDate: string, endDate?: string) => {
        const start = startDate;
        const end = endDate || 'Present';
        return `${start} - ${end}`;
    };

    if (loading) {
        return (
            <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600"
                >
                    Education
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12"
                >
                    My academic journey
                </motion.p>

                {educations.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="text-center py-12"
                    >
                        <FaGraduationCap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No education records found</h3>
                        <p className="text-gray-600 dark:text-gray-400">Education information will be displayed here once available.</p>
                    </motion.div>
                ) : (
                    <div className="space-y-12">
                        {educations.map((edu, index) => (
                            <motion.div
                                key={edu.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                                className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-center mb-6">
                                        <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mr-6">
                                            <FaGraduationCap className="text-3xl text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {edu.degree}
                                            </h3>
                                            <h4 className="text-lg text-purple-600 dark:text-purple-400">
                                                {edu.institutionUrl ? (
                                                    <a
                                                        href={edu.institutionUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="hover:underline"
                                                    >
                                                        {edu.institution}
                                                    </a>
                                                ) : (
                                                    edu.institution
                                                )}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-300">
                                                {formatDateRange(edu.startDate, edu.endDate)}
                                            </p>
                                            {edu.location && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {edu.location}
                                                </p>
                                            )}
                                            {edu.grade && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    Grade: {edu.grade}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                <FaBook className="mr-2 text-purple-600" />
                                                Description
                                            </h5>
                                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                                {edu.description.map((item, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                <FaAward className="mr-2 text-pink-600" />
                                                Achievements
                                            </h5>
                                            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                                                {edu.achievements.map((item, i) => (
                                                    <li key={i} className="flex items-start">
                                                        <span className="mr-2">•</span>
                                                        {item}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        <div>
                                            <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 flex items-center">
                                                <FaBook className="mr-2 text-blue-600" />
                                                Key Courses
                                            </h5>
                                            <div className="flex flex-wrap gap-2">
                                                {edu.courses.map((course, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                                                    >
                                                        {course}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default EducationComponent;
