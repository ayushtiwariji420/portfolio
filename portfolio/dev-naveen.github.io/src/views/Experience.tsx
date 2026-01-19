import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBriefcase, FaGraduationCap } from 'react-icons/fa';
import { ExternalLink, MapPin, Calendar, Code } from 'lucide-react';

interface DatabaseExperience {
    id: string;
    company: string;
    position: string;
    description: string;
    responsibilities: string[];
    technologies: string[];
    startDate: string;
    endDate?: string;
    companyUrl?: string;
    location: string;
    employmentType: string;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
}

interface Experience {
    id: string;
    title: string;
    company: string;
    period: string;
    description: string[];
    type: 'work' | 'education';
    technologies?: string[];
    location?: string;
    companyUrl?: string;
    employmentType?: string;
}

const Experience: React.FC = () => {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fallback experiences (from the original hardcoded data)
    const fallbackExperiences: Experience[] = [
        {
            id: 'fallback-1',
            title: 'Sr. AI/ML engineer',
            company: 'Steve\'s AI LAB',
            period: 'Jun 2022 - Present',
            description: [
                'Developed and deployed over 10 AI/ML-driven software applications using frameworks such as SageMaker and FastAPI',
                'Incorporated MLOps practices for streamlined deployment, monitoring, and scalability on AWS and Azure',
                'Led a team of 20 developers, coordinating project tasks and ensuring efficient collaboration',
                'Integrated 5+ machine learning models into production systems and optimized performance',
                'Mentored junior engineers to foster collaboration and technical growth'
            ],
            type: 'work'
        },
        {
            id: 'fallback-2',
            title: 'Operations Manager',
            company: '7 Frames',
            period: '2019 - 2021',
            description: [
                'Managed a team of 10 operations staff',
                'Provide Technical training and support to the team',
                'Collaborated with CEO/CTO to set up the operations department',
            ],
            type: 'work'
        }
    ];

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/experiences');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch experiences');
                }
                
                const data = await response.json();
                const databaseExperiences = data.experiences || [];
                
                // Convert database experiences to display format
                const convertedExperiences: Experience[] = databaseExperiences.map((exp: DatabaseExperience) => ({
                    id: exp.id,
                    title: exp.position,
                    company: exp.company,
                    period: formatPeriod(exp.startDate, exp.endDate),
                    description: exp.responsibilities.length > 0 ? exp.responsibilities : [exp.description],
                    type: 'work', // All experiences are work for now, could be enhanced
                    technologies: exp.technologies,
                    location: exp.location,
                    companyUrl: exp.companyUrl,
                    employmentType: exp.employmentType
                }));
                
                // If we have database experiences, use them, otherwise use fallback
                if (convertedExperiences.length > 0) {
                    setExperiences(convertedExperiences);
                } else {
                    setExperiences(fallbackExperiences);
                }
                
            } catch (error) {
                console.error('Error fetching experiences from API, falling back to static data:', error);
                // Fallback to static experiences data
                setExperiences(fallbackExperiences);
                setError(null); // Clear error since we have fallback data
            } finally {
                setLoading(false);
            }
        };

        fetchExperiences();
    }, []);

    const formatPeriod = (startDate: string, endDate?: string) => {
        const formatDate = (dateString: string) => {
            try {
                return new Date(dateString).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short'
                });
            } catch {
                return dateString;
            }
        };

        const start = formatDate(startDate);
        const end = endDate ? formatDate(endDate) : 'Present';
        return `${start} - ${end}`;
    };

    const formatEmploymentType = (type?: string) => {
        if (!type) return '';
        return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };

    if (loading) {
        return (
            <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <p className="text-red-500 dark:text-red-400 text-lg mb-4">{error}</p>
                        <button 
                            onClick={() => window.location.reload()} 
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                        >
                            Try Again
                        </button>
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
                    Experience & Education
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12"
                >
                    My professional journey
                </motion.p>

                <div className="relative">
                    <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gray-200 dark:bg-gray-700"></div>
                    
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`relative mb-12 ${index % 2 === 0 ? 'ml-0' : 'ml-auto'} w-full md:w-1/2`}
                        >
                            <div className={`relative ${index % 2 === 0 ? 'md:ml-8' : 'md:mr-8'}`}>
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg">
                                    {exp.type === 'work' ? (
                                        <FaBriefcase className="text-2xl text-purple-600" />
                                    ) : (
                                        <FaGraduationCap className="text-2xl text-pink-600" />
                                    )}
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {exp.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mb-2">
                                                <h4 className="text-lg text-purple-600 dark:text-purple-400 font-medium">
                                                    {exp.company}
                                                </h4>
                                                {exp.companyUrl && (
                                                    <a
                                                        href={exp.companyUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-purple-600 transition-colors"
                                                    >
                                                        <ExternalLink size={14} />
                                                    </a>
                                                )}
                                            </div>
                                            <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                <div className="flex items-center gap-1">
                                                    <Calendar size={14} />
                                                    <span>{exp.period}</span>
                                                </div>
                                                {exp.location && (
                                                    <div className="flex items-center gap-1">
                                                        <MapPin size={14} />
                                                        <span>{exp.location}</span>
                                                    </div>
                                                )}
                                                {exp.employmentType && (
                                                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded-full text-xs">
                                                        {formatEmploymentType(exp.employmentType)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300 mb-4">
                                        {exp.description.map((item, i) => (
                                            <li key={i}>{item}</li>
                                        ))}
                                    </ul>
                                    {exp.technologies && exp.technologies.length > 0 && (
                                        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                            <div className="flex items-center gap-2 mb-3">
                                                <Code size={16} className="text-gray-500 dark:text-gray-400" />
                                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    Technologies:
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {exp.technologies.map((tech, techIndex) => (
                                                    <span
                                                        key={techIndex}
                                                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Experience;
