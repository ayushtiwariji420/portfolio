import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, X, Calendar, MapPin, Building, User, FileText, Code, Link } from 'lucide-react';

interface ExperienceFormData {
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
}

interface ExperienceFormProps {
  onSubmit: (data: ExperienceFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Partial<ExperienceFormData>;
  isLoading: boolean;
}

const EMPLOYMENT_TYPES = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'remote', label: 'Remote' },
  { value: 'hybrid', label: 'Hybrid' }
];

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading
}) => {
  const [formData, setFormData] = useState<ExperienceFormData>({
    company: initialData?.company || '',
    position: initialData?.position || '',
    description: initialData?.description || '',
    responsibilities: initialData?.responsibilities || [],
    technologies: initialData?.technologies || [],
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
    companyUrl: initialData?.companyUrl || '',
    location: initialData?.location || '',
    employmentType: initialData?.employmentType || 'full-time',
    orderIndex: initialData?.orderIndex || 0
  });

  const [newResponsibility, setNewResponsibility] = useState('');
  const [newTechnology, setNewTechnology] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty responsibilities and technologies
    const cleanedFormData = {
      ...formData,
      responsibilities: formData.responsibilities.filter(r => r.trim() !== ''),
      technologies: formData.technologies.filter(t => t.trim() !== ''),
      endDate: formData.endDate || undefined,
      companyUrl: formData.companyUrl || undefined,
    };
    
    await onSubmit(cleanedFormData);
  };

  const addResponsibility = () => {
    if (newResponsibility.trim()) {
      setFormData(prev => ({
        ...prev,
        responsibilities: [...prev.responsibilities, newResponsibility.trim()]
      }));
      setNewResponsibility('');
    }
  };

  const removeResponsibility = (index: number) => {
    setFormData(prev => ({
      ...prev,
      responsibilities: prev.responsibilities.filter((_, i) => i !== index)
    }));
  };

  const addTechnology = () => {
    if (newTechnology.trim()) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (index: number) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {initialData ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {initialData ? 'Update the experience information below.' : 'Fill in the details for the new experience.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company and Position */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Building size={16} />
                  Company *
                </label>
                <input
                  type="text"
                  required
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Google, Microsoft, Startup Inc."
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <User size={16} />
                  Position *
                </label>
                <input
                  type="text"
                  required
                  value={formData.position}
                  onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., Senior Software Engineer, Product Manager"
                />
              </div>
            </div>

            {/* Location and Employment Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin size={16} />
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., New York, NY / Remote / London, UK"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <FileText size={16} />
                  Employment Type *
                </label>
                <select
                  required
                  value={formData.employmentType}
                  onChange={(e) => setFormData(prev => ({ ...prev, employmentType: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                >
                  {EMPLOYMENT_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar size={16} />
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Calendar size={16} />
                  End Date (Leave empty if current)
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Company URL */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Link size={16} />
                Company Website
              </label>
              <input
                type="url"
                value={formData.companyUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, companyUrl: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://company.com"
              />
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText size={16} />
                Job Description *
              </label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="Brief overview of your role and the company..."
              />
            </div>

            {/* Responsibilities */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <FileText size={16} />
                Key Responsibilities
              </label>
              <div className="space-y-2 mb-3">
                {formData.responsibilities.map((responsibility, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-gray-500 dark:text-gray-400">•</span>
                    <span className="flex-1 text-gray-700 dark:text-gray-300">{responsibility}</span>
                    <button
                      type="button"
                      onClick={() => removeResponsibility(index)}
                      className="p-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newResponsibility}
                  onChange={(e) => setNewResponsibility(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addResponsibility())}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add a responsibility..."
                />
                <button
                  type="button"
                  onClick={addResponsibility}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Code size={16} />
                Technologies Used
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-200 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="text-purple-500 hover:text-purple-700 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Add a technology..."
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Order Index */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Order Index
              </label>
              <input
                type="number"
                min="0"
                value={formData.orderIndex}
                onChange={(e) => setFormData(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 0 }))}
                className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Lower numbers will appear first in the experience list.
              </p>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                {isLoading ? 'Saving...' : (initialData ? 'Update Experience' : 'Add Experience')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExperienceForm;