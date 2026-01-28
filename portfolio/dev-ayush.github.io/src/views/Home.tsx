'use client'

import React, { useState, useEffect } from 'react'
import { AiFillGithub, AiFillLinkedin, AiOutlineMail, AiOutlineDownload } from 'react-icons/ai'
import { FaCalendarAlt, FaStar, FaExternalLinkAlt, FaGithub, FaBrain, FaCloud, FaDatabase, FaCode } from 'react-icons/fa'
import { SiPython, SiTensorflow, SiPytorch, SiScikitlearn } from 'react-icons/si'
import { motion, useAnimation, AnimatePresence, Variants } from 'framer-motion'
import { projects } from '../lib/projectData'
import { useInView } from 'react-intersection-observer'
import { Testimonial, ApiResponse, PersonalInfo } from '@/types/portfolio'


// Specialities data with professional icons
const specialities = [
    {
        title: "AI/ML Development",
        description: "Building intelligent systems and machine learning models for real-world applications",
        icon: <FaBrain className="text-4xl text-purple-600 dark:text-purple-400" />,
        technologies: [<SiTensorflow key="tf" />, <SiPytorch key="pt" />, <SiScikitlearn key="sk" />]
    },
    {
        title: "Python Development",
        description: "Creating robust and scalable Python applications with modern frameworks",
        icon: <SiPython className="text-4xl text-purple-600 dark:text-purple-400" />,
        technologies: [<FaCode key="code" />]
    },
    {
        title: "Cloud Solutions",
        description: "Deploying and managing applications on AWS, Azure, and Google Cloud",
        icon: <FaCloud className="text-4xl text-purple-600 dark:text-purple-400" />,
        technologies: []
    },
    {
        title: "Data Engineering",
        description: "Designing and implementing data pipelines and ETL processes",
        icon: <FaDatabase className="text-4xl text-purple-600 dark:text-purple-400" />,
        technologies: []
    }
];

const Home = () => {
    const topProjects = projects.slice(0, 3);
    const [expandedProjects, setExpandedProjects] = useState<number[]>([]);
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [testimonialsLoading, setTestimonialsLoading] = useState(true);
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
    const [personalLoading, setPersonalLoading] = useState(true);
    
    // Control animations
    const heroControls = useAnimation();
    const specialitiesControls = useAnimation();
    const projectsControls = useAnimation();
    const testimonialsControls = useAnimation();
    
    // Intersection observers
    const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [specialitiesRef, specialitiesInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [projectsRef, projectsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.1 });
    
    // Fetch testimonials
    const fetchTestimonials = async () => {
        try {
            setTestimonialsLoading(true);
            const response = await fetch('/api/testimonials?limit=6');
            const data: ApiResponse<Testimonial[]> = await response.json();
            
            if (data.success && data.data) {
                setTestimonials(data.data);
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setTestimonialsLoading(false);
        }
    };

    // Fetch personal info
    const fetchPersonalInfo = async () => {
        try {
            setPersonalLoading(true);
            const response = await fetch('/api/personal-info');
            const data: ApiResponse<PersonalInfo> = await response.json();
            if (data.success && data.data) {
                setPersonalInfo(data.data);
            }
        } catch (error) {
            console.error('Error fetching personal info:', error);
        } finally {
            setPersonalLoading(false);
        }
    };

    useEffect(() => {
        fetchTestimonials();
        fetchPersonalInfo();
    }, []);
    useEffect(() => {
        if (heroInView) heroControls.start('visible');
        if (specialitiesInView) specialitiesControls.start('visible');
        if (projectsInView) projectsControls.start('visible');
        if (testimonialsInView) testimonialsControls.start('visible');
    }, [heroInView, specialitiesInView, projectsInView, testimonialsInView, heroControls, specialitiesControls, projectsControls, testimonialsControls]);

    const toggleProjectDescription = (index: number) => {
        setExpandedProjects(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    // Shared animation variants
    const fadeInUpVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { 
                duration: 0.6, 
                ease: [0.6, -0.05, 0.01, 0.99]
            }
        }
    };
    
    const staggerChildrenVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };
    
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 }
        }
    };
    
    // Hero section specific animations
    const profileImgVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        }
    };
    
    const glowVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: [0, 0.5, 0.7, 0.5, 0.7, 0.5],
            transition: {
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse" as const
            }
        }
    };
    
    const nameVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.8,
                delay: 0.5
            }
        }
    };
    
    const handWaveVariants = {
        hidden: { opacity: 0, rotate: -45, x: -20 },
        visible: {
            opacity: 1,
            rotate: 0,
            x: 0,
            transition: {
                duration: 0.5,
                delay: 0.8
            }
        },
        wave: {
            rotate: [0, 15, -8, 15, -5, 0],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2
            }
        }
    };
    
    const titleGroupVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 1.0
            }
        }
    };
    
    const titleItemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: { duration: 0.5 }
        }
    };
    
    const socialButtonsVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 1.5
            }
        }
    };
    
    const buttonVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.4 }
        },
        hover: {
            y: -5,
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: { duration: 0.2 }
        }
    };

    // Specialities card animations
    const specialityCardVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.6,
                delay: custom * 0.1 
            }
        }),
        hover: {
            y: -10,
            scale: 1.05,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
            }
        }
    };
    
    const iconAnimationVariants = {
        hover: {
            scale: 1.2,
            rotate: [0, -10, 10, -10, 0],
            transition: { 
                duration: 0.5
            }
        }
    };

    // Projects card animations
    const projectCardVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.6,
                delay: custom * 0.15 
            }
        }),
        hover: {
            y: -10,
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
            }
        }
    };
    
    const projectImageVariants = {
        hover: {
            scale: 1.15,
            transition: { duration: 0.5 }
        }
    };
    
    const projectOverlayVariants = {
        hidden: { opacity: 0 },
        hover: {
            opacity: 1,
            transition: { duration: 0.3 }
        }
    };

    // Testimonials card animations
    const testimonialCardVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: (custom: number) => ({
            opacity: 1,
            y: 0,
            transition: { 
                duration: 0.6,
                delay: custom * 0.15 
            }
        }),
        hover: {
            y: -10,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: { 
                type: "spring", 
                stiffness: 300, 
                damping: 20 
            }
        }
    };
    
    const ratingStarsVariants = {
        hidden: { opacity: 0, scale: 0 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };
    
    const starVariants = {
        hidden: { opacity: 0, scale: 0, rotate: -180 },
        visible: {
            opacity: 1,
            scale: 1,
            rotate: 0,
            transition: { 
                type: "spring",
                stiffness: 260,
                damping: 20
            }
        }
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-gray-800 overflow-hidden'>
            {/* Enhanced animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {/* Light mode optimized blobs */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
                <div className="absolute top-40 -right-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-15 dark:opacity-10 animate-blob animation-delay-2000"></div>
                <div className="absolute bottom-40 left-20 w-80 h-80 bg-gradient-to-r from-indigo-400 to-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
            </div>

            <div className='flex flex-col items-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative'>
                {/* Hero Section */}
                <motion.div
                    ref={heroRef}
                    initial="hidden"
                    animate={heroControls}
                    variants={fadeInUpVariants}
                    className='flex flex-col items-center max-w-4xl mx-auto relative z-10 min-h-[80vh] sm:min-h-[90vh] justify-center mb-16 sm:mb-32'
                >
                    <motion.div 
                        className='relative mb-6 sm:mb-8 group'
                        variants={profileImgVariants}
                    >
                        {personalLoading ? (
                            // Loading skeleton for profile image
                            <div className='relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl'>
                                <div className='w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse'></div>
                            </div>
                        ) : (
                            <>
                                <motion.div 
                                    className='absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-70 group-hover:opacity-90 transition duration-1000'
                                    variants={glowVariants}
                                    animate="visible"
                                ></motion.div>
                                
                                <motion.div
                                    className='relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl'
                                >
                                    <img
                                        src={personalInfo?.profileImage || './ayush1.png'}
                                        alt={'Ayush Tiwari' || 'Profile'}
                                        className='w-full h-full object-cover'
                                    />
                                </motion.div>
                            </>
                        )}
                    </motion.div>

                    <motion.div
                        variants={nameVariants}
                        className='relative'
                    >
                        <motion.h1 
                            className='text-4xl sm:text-6xl md:text-7xl font-bold text-center mb-2'
                        >
                            <motion.span className="inline-flex items-center relative"
                                style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text',
                                    filter: 'drop-shadow(0 2px 4px rgba(102, 126, 234, 0.3))',
                                }}>
                                Hi, I&apos;m 
                                <motion.span
                                    variants={handWaveVariants}
                                    animate={["visible", "wave"]}
                                    className="inline-block ml-2 sm:ml-4 text-4xl sm:text-6xl z-20"
                                    style={{ WebkitTextFillColor: 'initial' }}
                                >
                                    👋
                                </motion.span>
                                {/* Light mode glow effect */}
                                <motion.span 
                                    className="absolute -inset-2 bg-gradient-to-r from-blue-400/20 to-purple-400/20 dark:from-purple-400/30 dark:to-pink-400/30 blur-lg rounded-lg"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ 
                                        opacity: [0.3, 0.6, 0.3],
                                        scale: [0.9, 1.1, 0.9],
                                        transition: { 
                                            duration: 3,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                        }
                                    }}
                                ></motion.span>
                            </motion.span>
                        </motion.h1>
                        
                        <motion.div
                            className='text-4xl sm:text-6xl md:text-7xl font-bold text-center mb-4 sm:mb-6 relative'
                            initial={{ opacity: 0 }}
                            animate={{ 
                                opacity: 1,
                                transition: { delay: 0.7, duration: 0.8 }
                            }}
                        >
                            {personalLoading ? (
                                // Loading skeleton for name
                                <div className="flex justify-center">
                                    <div className="h-16 sm:h-20 md:h-24 w-80 sm:w-96 md:w-[28rem] bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"></div>
                                </div>
                            ) : (
                                <span className="relative inline-block"
                                    style={{
                                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        filter: 'drop-shadow(0 4px 8px rgba(79, 70, 229, 0.25))',
                                        textShadow: '0 0 30px rgba(124, 58, 237, 0.5)',
                                    }}>
                                    {/* {personalInfo?.name || 'Loading...'} */}
                                    {'Ayush Tiwari' || 'Loading...'}
                                    {/* Enhanced glow effect for light mode */}
                                    <motion.span 
                                        className="absolute -inset-2 bg-gradient-to-r from-indigo-400/25 to-pink-400/25 dark:from-purple-400/40 dark:to-pink-400/40 blur-xl rounded-lg"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ 
                                            opacity: [0.4, 0.7, 0.4],
                                            scale: [0.95, 1.05, 0.95],
                                            transition: { 
                                                delay: 0.8,
                                                duration: 2.5,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }
                                        }}
                                    ></motion.span>
                                    {/* Additional subtle shine effect */}
                                    <motion.span 
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                        initial={{ x: '-100%', opacity: 0 }}
                                        animate={{ 
                                            x: '100%',
                                            opacity: [0, 1, 0],
                                            transition: { 
                                                delay: 1.5,
                                                duration: 1.5,
                                                repeat: Infinity,
                                                repeatDelay: 3
                                            }
                                        }}
                                        style={{ transform: 'skewX(-20deg)' }}
                                    ></motion.span>
                                </span>
                            )}
                        </motion.div>
                    </motion.div>

                    <motion.div
                        variants={titleGroupVariants}
                        className='text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 text-center mb-8 sm:mb-12 max-w-2xl flex flex-wrap justify-center'
                    >
                        {personalLoading ? (
                            // Loading skeleton for titles
                            <div className="flex flex-wrap justify-center gap-2">
                                {[...Array(2)].map((_, index) => (
                                    <div key={index} className="h-8 w-32 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse"></div>
                                ))}
                            </div>
                        ) : personalInfo?.title ? (
                            <motion.span variants={titleItemVariants} className="py-2 px-4 m-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 dark:border-gray-600/50 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
                                {personalInfo.title}
                            </motion.span>
                        ) : (
                            <>
                                <motion.span variants={titleItemVariants} className="py-2 px-4 m-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 dark:border-gray-600/50 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
                                    AI/ML Engineer
                                </motion.span>
                                <motion.span variants={titleItemVariants} className="py-2 px-4 m-1 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-full shadow-lg border border-gray-200/50 dark:border-gray-600/50 text-sm sm:text-base font-medium text-gray-700 dark:text-gray-200">
                                    Python Developer
                                </motion.span>
                            </>
                        )}
                    </motion.div>

                    <motion.div
                        variants={socialButtonsVariants}
                        className='flex flex-wrap justify-center gap-2 sm:gap-4 max-w-2xl'
                    >
                        {personalLoading ? (
                            // Loading skeleton for social buttons
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
                                {[...Array(5)].map((_, index) => (
                                    <div key={index} className="h-10 sm:h-12 w-24 sm:w-28 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-full animate-pulse"></div>
                                ))}
                            </div>
                        ) : (
                            <>
                                <motion.a
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap={{ scale: 0.95 }}
                                    href={'https://github.com/ayushtiwariji420'|| 'https://github.com/'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 hover:from-indigo-100 hover:via-indigo-50 hover:to-purple-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-indigo-800 dark:hover:text-purple-300 transition-all duration-300 shadow-lg hover:shadow-2xl border-2 border-gray-200/80 dark:border-gray-600 text-sm sm:text-base backdrop-blur-sm font-medium"
                                >
                                    <AiFillGithub className="mr-2 text-lg sm:text-xl" />
                                    <span>GitHub</span>
                                </motion.a>
                                <motion.a
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap={{ scale: 0.95 }}
                                    href={'https://www.linkedin.com/in/ayush-tiwari-b5799a229/' || 'https://linkedin.com/'}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 hover:from-blue-100 hover:via-blue-50 hover:to-indigo-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-blue-800 dark:hover:text-blue-300 transition-all duration-300 shadow-lg hover:shadow-2xl border-2 border-gray-200/80 dark:border-gray-600 text-sm sm:text-base backdrop-blur-sm font-medium"
                                >
                                    <AiFillLinkedin className="mr-2 text-lg sm:text-xl" />
                                    <span>LinkedIn</span>
                                </motion.a>
                                <motion.a
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap={{ scale: 0.95 }}
                                    // href={`mailto:${personalInfo?.email || 'your.email@example.com'}`}
                                    href={`mailto:${'ayushtiwariji420@gmail.com' || 'your.email@example.com'}`}
                                    className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 hover:from-emerald-100 hover:via-emerald-50 hover:to-green-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-emerald-800 dark:hover:text-emerald-300 transition-all duration-300 shadow-lg hover:shadow-2xl border-2 border-gray-200/80 dark:border-gray-600 text-sm sm:text-base backdrop-blur-sm font-medium"
                                >
                                    <AiOutlineMail className="mr-2 text-lg sm:text-xl" />
                                    <span>Contact</span>
                                </motion.a>
                                <motion.a
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap={{ scale: 0.95 }}
                                    href={'/Ayushresume.pdf' || '/resume.pdf'}
                                    download
                                    className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 hover:from-orange-100 hover:via-orange-50 hover:to-amber-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-orange-800 dark:hover:text-orange-300 transition-all duration-300 shadow-lg hover:shadow-2xl border-2 border-gray-200/80 dark:border-gray-600 text-sm sm:text-base backdrop-blur-sm font-medium"
                                >
                                    <AiOutlineDownload className="mr-2 text-lg sm:text-xl" />
                                    <span>Resume</span>
                                </motion.a>
                                <motion.a
                                    variants={buttonVariants}
                                    whileHover="hover"
                                    whileTap={{ scale: 0.95 }}
                                    href="https://calendly.com/ayushtiwariji420/30min"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center px-4 sm:px-6 py-2 sm:py-3 rounded-full bg-gradient-to-r from-white via-gray-50 to-white dark:from-gray-800 dark:to-gray-700 text-gray-800 dark:text-gray-200 hover:from-violet-100 hover:via-violet-50 hover:to-purple-100 dark:hover:from-gray-700 dark:hover:to-gray-600 hover:text-violet-800 dark:hover:text-violet-300 transition-all duration-300 shadow-lg hover:shadow-2xl border-2 border-gray-200/80 dark:border-gray-600 text-sm sm:text-base backdrop-blur-sm font-medium"
                                >
                                    <FaCalendarAlt className="mr-2 text-lg sm:text-xl" />
                                    <span>Schedule</span>
                                </motion.a>
                            </>
                        )}
                    </motion.div>
                </motion.div>

                {/* Specialities Section */}
                <motion.section
                    ref={specialitiesRef}
                    initial="hidden"
                    animate={specialitiesControls}
                    variants={staggerChildrenVariants}
                    className="w-full max-w-7xl mx-auto mb-16 sm:mb-32"
                >
                    <motion.h2 
                        variants={itemVariants}
                        className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-16 relative inline-block mx-auto"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 drop-shadow-sm">
                            My Specialities
                        </span>
                        <motion.span 
                            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-sm"
                            initial={{ width: 0 }}
                            whileInView={{ 
                                width: "100%",
                                transition: { duration: 0.8, delay: 0.3 }
                            }}
                            viewport={{ once: true }}
                        ></motion.span>
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
                        {specialities.map((speciality, index) => (
                            <motion.div
                                key={speciality.title}
                                custom={index}
                                variants={specialityCardVariants}
                                whileHover="hover"
                                className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-gray-200/50 dark:border-gray-700 flex flex-col items-center text-center transition-all duration-300"
                            >
                                <motion.div 
                                    className="mb-6 sm:mb-8 text-4xl sm:text-6xl rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 text-purple-700 dark:text-purple-400 shadow-inner"
                                    variants={iconAnimationVariants}
                                    whileHover="hover"
                                >
                                    {speciality.icon}
                                </motion.div>
                                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-800 dark:text-gray-100">{speciality.title}</h3>
                                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 sm:mb-6 leading-relaxed">{speciality.description}</p>
                                {speciality.technologies.length > 0 && (
                                    <div className="flex gap-4 text-xl sm:text-2xl text-gray-600 dark:text-gray-400 mt-auto">
                                        {speciality.technologies.map((tech, i) => (
                                            <motion.span 
                                                key={i}
                                                whileHover={{ 
                                                    scale: 1.3, 
                                                    color: "#8B5CF6",
                                                    transition: { duration: 0.2 } 
                                                }}
                                            >
                                                {tech}
                                            </motion.span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Featured Projects Section */}
                <motion.section
                    ref={projectsRef}
                    initial="hidden"
                    animate={projectsControls}
                    variants={staggerChildrenVariants}
                    className="w-full max-w-7xl mx-auto mb-16 sm:mb-32"
                >
                    <motion.h2 
                        variants={itemVariants}
                        className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-16 relative inline-block mx-auto"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 drop-shadow-sm">
                            Featured Projects
                        </span>
                        <motion.span 
                            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-sm"
                            initial={{ width: 0 }}
                            whileInView={{ 
                                width: "100%",
                                transition: { duration: 0.8, delay: 0.3 }
                            }}
                            viewport={{ once: true }}
                        ></motion.span>
                    </motion.h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {topProjects.map((project, index) => (
                            <motion.div
                                key={project.title}
                                custom={index}
                                variants={projectCardVariants}
                                whileHover="hover"
                                className="group bg-white/85 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl border-2 border-gray-200/60 dark:border-gray-700 h-[450px] sm:h-[500px] flex flex-col transition-all duration-300"
                            >
                                <div className="relative h-40 sm:h-48 overflow-hidden">
                                    <motion.img
                                        variants={projectImageVariants}
                                        whileHover="hover"
                                        src={project.imageUrl}
                                        alt={project.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <motion.div 
                                        variants={projectOverlayVariants}
                                        initial="hidden"
                                        whileHover="hover"
                                        className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end p-4"
                                    >
                                        <div className="w-full flex justify-between items-center">
                                            <motion.a
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                href={project.githubLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white hover:text-purple-400 transition-colors p-2"
                                            >
                                                <FaGithub className="text-xl sm:text-2xl" />
                                            </motion.a>
                                            <motion.a
                                                whileHover={{ scale: 1.2 }}
                                                whileTap={{ scale: 0.9 }}
                                                href={project.demoLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white hover:text-purple-400 transition-colors p-2"
                                            >
                                                <FaExternalLinkAlt className="text-xl sm:text-2xl" />
                                            </motion.a>
                                        </div>
                                    </motion.div>
                                </div>
                                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                                    <h3 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                        {project.title}
                                    </h3>
                                    <div className="flex-grow">
                                        <AnimatePresence>
                                            {expandedProjects.includes(index) ? (
                                                <motion.p 
                                                    key="expanded"
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4"
                                                >
                                                    {project.description}
                                                </motion.p>
                                            ) : (
                                                <motion.p 
                                                    key="collapsed"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4"
                                                >
                                                    {project.description.slice(0, 100)}...
                                                </motion.p>
                                            )}
                                        </AnimatePresence>
                                        
                                        {project.description.length > 100 && (
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => toggleProjectDescription(index)}
                                                className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-all duration-300 text-xs sm:text-sm font-medium mt-2"
                                            >
                                                {expandedProjects.includes(index) ? 'Show Less' : 'Read More'}
                                            </motion.button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-4">
                                        {project.tags.map((tag) => (
                                            <motion.span
                                                key={tag}
                                                whileHover={{ 
                                                    scale: 1.1,
                                                    backgroundColor: "rgba(139, 92, 246, 0.3)",
                                                    transition: { duration: 0.2 }
                                                }}
                                                className="px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs sm:text-sm"
                                            >
                                                {tag}
                                            </motion.span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Testimonials Section */}
                <motion.section
                    ref={testimonialsRef}
                    initial="hidden"
                    animate={testimonialsControls}
                    variants={staggerChildrenVariants}
                    className="w-full max-w-7xl mx-auto mb-16 sm:mb-32"
                >
                    <motion.h2 
                        variants={itemVariants}
                        className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-16 relative inline-block mx-auto"
                    >
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-700 via-indigo-600 to-pink-600 drop-shadow-sm">
                            Client Testimonials
                        </span>
                        <motion.span 
                            className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full shadow-sm"
                            initial={{ width: 0 }}
                            whileInView={{ 
                                width: "100%",
                                transition: { duration: 0.8, delay: 0.3 }
                            }}
                            viewport={{ once: true }}
                        ></motion.span>
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                        {testimonialsLoading ? (
                            // Loading skeleton
                            [...Array(3)].map((_, index) => (
                                <div key={index} className="bg-white/80 dark:bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl border-2 border-gray-200/60 dark:border-gray-700 animate-pulse">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 mr-4 sm:mr-5"></div>
                                        <div>
                                            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg w-28 mb-2"></div>
                                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg w-36"></div>
                                        </div>
                                    </div>
                                    <div className="flex mb-4 sm:mb-6 space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-5 h-5 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-sm"></div>
                                        ))}
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg w-full"></div>
                                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg w-4/5"></div>
                                        <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-lg w-3/5"></div>
                                    </div>
                                </div>
                            ))
                        ) : testimonials.length > 0 ? (
                            testimonials.map((testimonial, index) => (
                                <motion.div
                                    key={testimonial.id}
                                    custom={index}
                                    variants={testimonialCardVariants}
                                    whileHover="hover"
                                    className="bg-white/85 dark:bg-gray-800/50 backdrop-blur-md p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl border-2 border-gray-200/60 dark:border-gray-700 transition-all duration-300"
                                >
                                    <div className="flex items-center mb-4">
                                        {testimonial.imageUrl ? (
                                            <img
                                                src={testimonial.imageUrl}
                                                alt={testimonial.name}
                                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 object-cover"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mr-3 sm:mr-4 bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                                                <span className="text-white font-semibold text-sm sm:text-base">
                                                    {testimonial.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                        )}
                                        <div>
                                            <h3 className="font-semibold text-base sm:text-lg">{testimonial.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                                                {testimonial.position} at {testimonial.company}
                                            </p>
                                        </div>
                                    </div>
                                    <motion.div
                                        variants={ratingStarsVariants}
                                        className="flex mb-3 sm:mb-4"
                                    >
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <motion.span
                                                key={i}
                                                variants={starVariants}
                                                className="text-yellow-400"
                                            >
                                                <FaStar className="text-sm sm:text-base" />
                                            </motion.span>
                                        ))}
                                    </motion.div>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 italic">
                                        &ldquo;{testimonial.content}&rdquo;
                                    </p>
                                </motion.div>
                            ))
                        ) : (
                            // Empty state
                            <div className="col-span-full text-center py-12">
                                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No testimonials available yet.</p>
                                <p className="text-gray-400 dark:text-gray-500 text-sm">Check back later for client testimonials!</p>
                            </div>
                        )}
                    </div>
                </motion.section>
            </div>
        </div>
    );
};

export default Home;