'use client';

import { useState, useEffect } from 'react';
import { Education, CreateEducation, UpdateEducation } from '@/types/portfolio';
import { XMarkIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';

interface EducationFormProps {
  education?: Education;
  onSubmit: (data: CreateEducation | UpdateEducation) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function EducationForm({ 
  education, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: EducationFormProps) {
  const [formData, setFormData] = useState<CreateEducation>({
    degree: '',
    institution: '',
    startDate: '',
    endDate: '',
    location: '',
    grade: '',
    description: [''],
    achievements: [''],
    courses: [''],
    institutionUrl: '',
    orderIndex: 0
  });

  useEffect(() => {
    if (education) {
      setFormData({
        degree: education.degree,
        institution: education.institution,
        startDate: education.startDate,
        endDate: education.endDate || '',
        location: education.location || '',
        grade: education.grade || '',
        description: education.description.length > 0 ? education.description : [''],
        achievements: education.achievements.length > 0 ? education.achievements : [''],
        courses: education.courses.length > 0 ? education.courses : [''],
        institutionUrl: education.institutionUrl || '',
        orderIndex: education.orderIndex
      });
    }
  }, [education]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out empty strings from arrays
    const cleanedData = {
      ...formData,
      description: formData.description.filter(item => item.trim() !== ''),
      achievements: formData.achievements.filter(item => item.trim() !== ''),
      courses: formData.courses.filter(item => item.trim() !== '')
    };
    
    onSubmit(cleanedData);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayInputChange = (
    field: 'description' | 'achievements' | 'courses',
    index: number,
    value: string
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'description' | 'achievements' | 'courses') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'description' | 'achievements' | 'courses', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const renderArrayField = (
    field: 'description' | 'achievements' | 'courses',
    label: string,
    placeholder: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label} *
      </label>
      {formData[field].map((item, index) => (
        <div key={index} className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleArrayInputChange(field, index, e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder={placeholder}
            disabled={isLoading}
          />
          {formData[field].length > 1 && (
            <button
              type="button"
              onClick={() => removeArrayItem(field, index)}
              className="p-2 text-red-600 hover:text-red-800 transition-colors"
              disabled={isLoading}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <button
        type="button"
        onClick={() => addArrayItem(field)}
        className="inline-flex items-center px-3 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-500 transition-colors"
        disabled={isLoading}
      >
        <PlusIcon className="h-4 w-4 mr-1" />
        Add {label.slice(0, -1)}
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {education ? 'Edit Education Record' : 'Add New Education Record'}
            </h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              disabled={isLoading}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Degree */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Degree *
                  </label>
                  <input
                    type="text"
                    name="degree"
                    value={formData.degree}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    placeholder="e.g. B.S in Data Science"
                    disabled={isLoading}
                  />
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institution *
                  </label>
                  <input
                    type="text"
                    name="institution"
                    value={formData.institution}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    placeholder="e.g. Indian Institute of Technology Madras"
                    disabled={isLoading}
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="text"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                      placeholder="e.g. 2022"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      End Date
                    </label>
                    <input
                      type="text"
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g. 2026 (leave empty if current)"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Location and Grade */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g. Chennai, India"
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Grade/GPA
                    </label>
                    <input
                      type="text"
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="e.g. 8.10 GPA, 86.2%"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {/* Institution URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Institution URL
                  </label>
                  <input
                    type="url"
                    name="institutionUrl"
                    value={formData.institutionUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://www.institution.edu"
                    disabled={isLoading}
                  />
                </div>

                {/* Order Index */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="orderIndex"
                    value={formData.orderIndex}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0"
                    min="0"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Lower numbers appear first (0 = highest priority)
                  </p>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {renderArrayField('description', 'Description', 'e.g. Pursuing Bachelor of Science in Data Science')}
                {renderArrayField('achievements', 'Achievements', 'e.g. District Topper')}
                {renderArrayField('courses', 'Key Courses', 'e.g. Machine Learning')}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {education ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  education ? 'Update Education' : 'Create Education'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}