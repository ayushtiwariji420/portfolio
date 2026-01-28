import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { coreSkills, additionalSkills } from '../lib/skillData';
import IconRenderer from '../components/IconRenderer';
import { IconType } from 'react-icons';

interface DatabaseSkill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  iconUrl?: string;
  iconName?: string;
  iconLibrary?: string;
  iconEmoji?: string;
  iconType?: 'react' | 'url' | 'emoji';
  orderIndex: number;
}

interface Skill {
  id: string;
  name: string;
  level: number;
  iconName?: string;
  iconLibrary?: string;
  iconUrl?: string;
  iconEmoji?: string;
  iconType?: 'react' | 'url' | 'emoji';
  icon?: IconType; // For legacy static skills
  color: string;
  category: string;
}


// Color mapping based on category
const getCategoryColor = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'frontend': return 'from-blue-500 to-blue-700';
    case 'backend': return 'from-green-500 to-green-700';
    case 'database': return 'from-purple-500 to-purple-700';
    case 'cloud': return 'from-orange-500 to-orange-700';
    case 'ai-ml': return 'from-pink-500 to-pink-700';
    case 'tools': return 'from-gray-500 to-gray-700';
    default: return 'from-indigo-500 to-indigo-700';
  }
};

const Skills: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [additionalSkillsList] = useState<string[]>(additionalSkills);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch skills from API with fallback to static data
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch('/api/skills');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch skills');
                }
                
                const data = await response.json();
                const databaseSkills = data.skills || [];
                
                // Convert database skills to display format
                const convertedSkills: Skill[] = databaseSkills.map((skill: DatabaseSkill) => ({
                    id: skill.id,
                    name: skill.name,
                    level: (skill.proficiency / 5) * 100, // Convert 1-5 scale to percentage
                    iconName: skill.iconName,
                    iconLibrary: skill.iconLibrary,
                    iconUrl: skill.iconUrl,
                    iconEmoji: skill.iconEmoji,
                    iconType: skill.iconType || 'react',
                    color: getCategoryColor(skill.category),
                    category: skill.category
                }));
                
                // If we have database skills, use them, otherwise use static data
                if (convertedSkills.length > 0) {
                    setSkills(convertedSkills);
                } else {
                    // Convert static skills to new format
                    const staticSkills: Skill[] = coreSkills.map((skill, index) => ({
                        id: `static-${index}`,
                        name: skill.name,
                        level: skill.level,
                        iconName: undefined,
                        iconLibrary: undefined,
                        icon: skill.icon, // Keep legacy icon for fallback
                        color: skill.color,
                        category: 'frontend' // Add default category
                    }));
                    setSkills(staticSkills);
                }
                
            } catch (error) {
                console.error('Error fetching skills from API, falling back to static data:', error);
                // Fallback to static skills data
                const staticSkills: Skill[] = coreSkills.map((skill, index) => ({
                    id: `static-${index}`,
                    name: skill.name,
                    level: skill.level,
                    iconName: undefined,
                    iconLibrary: undefined,
                    icon: skill.icon, // Keep legacy icon for fallback
                    color: skill.color,
                    category: 'frontend' // Add default category
                }));
                setSkills(staticSkills);
                setError(null); // Clear error since we have fallback data
            } finally {
                setLoading(false);
            }
        };

        fetchSkills();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
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
            <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
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
        <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <motion.h2 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 leading-tight pb-1"
                >
                    My Skills
                </motion.h2>
                


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {skills.map((skill, index) => {
                        return (
                            <motion.div
                                key={skill.id || skill.name}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
                            >
                                <div className="flex items-center mb-6">
                                    <div className={`p-3 rounded-lg bg-gradient-to-r ${skill.color} mr-4`}>
                                        {(skill.iconName && skill.iconLibrary) || skill.iconUrl || skill.iconEmoji ? (
                                            <IconRenderer 
                                                iconType={skill.iconType || 'react'}
                                                iconName={skill.iconName} 
                                                iconLibrary={skill.iconLibrary} 
                                                iconUrl={skill.iconUrl}
                                                iconEmoji={skill.iconEmoji}
                                                size={32}
                                                className="text-white" 
                                            />
                                        ) : skill.icon ? (
                                            <skill.icon className="text-2xl text-white" />
                                        ) : (
                                            <div className="w-8 h-8 bg-white/20 rounded flex items-center justify-center">
                                                <span className="text-white text-sm font-bold">?</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                        {skill.name}
                                    </h3>
                                </div>
                                <div className="space-y-2">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${skill.level}%` }}
                                            transition={{ duration: 1, delay: index * 0.1 }}
                                            className={`h-3 rounded-full bg-gradient-to-r ${skill.color}`}
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">Beginner</span>
                                        <span className="text-gray-500 dark:text-gray-400">{skill.level}%</span>
                                        <span className="text-gray-500 dark:text-gray-400">Expert</span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
                        Additional Skills & Technologies
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {additionalSkillsList.map((skill) => (
                            <motion.span
                                key={skill}
                                whileHover={{ scale: 1.05 }}
                                className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm shadow-md hover:shadow-lg transition-shadow duration-300"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Skills;
