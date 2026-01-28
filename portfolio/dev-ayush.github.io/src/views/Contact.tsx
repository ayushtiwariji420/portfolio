import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaLinkedin, FaGithub } from 'react-icons/fa';
import { SiGmail } from 'react-icons/si';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '../config/emailjs';
import { PersonalInfo, ApiResponse } from '@/types/portfolio';

const Contact: React.FC = () => {
    const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
    const [loading, setLoading] = useState(true);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    useEffect(() => {
        fetchPersonalInfo();
    }, []);

    const fetchPersonalInfo = async () => {
        try {
            const response = await fetch('/api/personal-info');
            const data: ApiResponse<PersonalInfo> = await response.json();
            
            if (data.success && data.data) {
                setPersonalInfo(data.data);
            }
        } catch (error) {
            console.error('Error fetching personal info:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitError('');

        try {
            // Send to our API endpoint which stores in database
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    message: formData.message,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to send message');
            }

            // Optionally also send email via EmailJS
            try {
                await emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    {
                        from_name: formData.name,
                        from_email: formData.email,
                        subject: formData.subject,
                        message: formData.message,
                        to_name: personalInfo?.name || 'Naveen Patidar',
                        reply_to: formData.email,
                    },
                    EMAILJS_CONFIG.PUBLIC_KEY
                );
            } catch (emailError) {
                console.warn('Email sending failed, but message was stored in database:', emailError);
                // Don't fail the whole submission if email fails
            }

            setSubmitSuccess(true);
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to send message. Please try again later.');
            console.error('Error submitting contact form:', error);
        } finally {
            setIsSubmitting(false);
        }
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
                    Get in Touch
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12"
                >
                    Let&apos;s discuss your project or just say hello!
                </motion.p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-8"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Contact Information
                            </h3>
                            <div className="space-y-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FaEnvelope className="text-2xl text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Email</h4>
                                        <a 
                                            href={`mailto:${personalInfo?.email || 'your.email@example.com'}`} 
                                            className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            {personalInfo?.email || 'your.email@example.com'}
                                        </a>
                                    </div>
                                </div>
                                {personalInfo?.phone && (
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <FaPhone className="text-2xl text-purple-600" />
                                        </div>
                                        <div className="ml-4">
                                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Phone</h4>
                                            <a 
                                                href={`tel:${personalInfo.phone}`} 
                                                className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                            >
                                                {personalInfo.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <FaMapMarkerAlt className="text-2xl text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Location</h4>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {personalInfo?.location || 'Your City, Country'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    Connect with me
                                </h4>
                                <div className="flex space-x-4">
                                    {personalInfo?.socialLinks?.linkedin && (
                                        <a
                                            href={personalInfo.socialLinks.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            <FaLinkedin />
                                        </a>
                                    )}
                                    {personalInfo?.socialLinks?.github && (
                                        <a
                                            href={personalInfo.socialLinks.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            <FaGithub />
                                        </a>
                                    )}
                                    <a
                                        href={`mailto:${personalInfo?.email || 'your.email@example.com'}`}
                                        className="text-2xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                    >
                                        <SiGmail />
                                    </a>
                                    {personalInfo?.socialLinks?.twitter && (
                                        <a
                                            href={personalInfo.socialLinks.twitter}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                            </svg>
                                        </a>
                                    )}
                                    {personalInfo?.socialLinks?.youtube && (
                                        <a
                                            href={personalInfo.socialLinks.youtube}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                                            </svg>
                                        </a>
                                    )}
                                    {personalInfo?.socialLinks?.instagram && (
                                        <a
                                            href={personalInfo.socialLinks.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.618 5.367 11.986 11.988 11.986C18.635 23.973 24 18.605 24 11.987 24 5.367 18.635.001 12.017.001zm5.17 7.598L15.31 19.102c-.316 1.755-1.043 2.49-2.798 2.806l-11.49 1.876c-1.755.316-2.49-1.043-2.806-2.798L-3.66 8.696c-.316-1.755 1.043-2.49 2.798-2.806L10.627 4.014c1.755-.316 2.49 1.043 2.806 2.798l1.876 11.49z"/>
                                            </svg>
                                        </a>
                                    )}
                                    {personalInfo?.socialLinks?.website && (
                                        <a
                                            href={personalInfo.socialLinks.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xl text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                                        >
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                Send me a message
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="input w-full"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="input w-full"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="input w-full"
                                        placeholder="Subject of your message"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Message
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        className="input w-full"
                                        placeholder="Your message"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="btn btn-primary w-full"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                                {submitSuccess && (
                                    <div className="text-green-600 dark:text-green-400 text-center">
                                        Message sent successfully!
                                    </div>
                                )}
                                {submitError && (
                                    <div className="text-red-600 dark:text-red-400 text-center">
                                        {submitError}
                                    </div>
                                )}
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Contact; 