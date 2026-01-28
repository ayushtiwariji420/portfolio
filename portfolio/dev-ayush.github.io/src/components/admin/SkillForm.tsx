'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface SkillFormProps {
  onSubmit: (skillData: SkillFormData) => void
  onCancel: () => void
  initialData?: SkillFormData
  isLoading?: boolean
}

export interface SkillFormData {
  name: string
  category: string
  proficiency: number
  iconUrl?: string
  orderIndex?: number
}

const SKILL_CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'cloud', label: 'Cloud & DevOps' },
  { value: 'ai-ml', label: 'AI/ML' },
  { value: 'tools', label: 'Tools & Technologies' },
  { value: 'other', label: 'Other' }
]

const SkillForm: React.FC<SkillFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  isLoading = false
}) => {
  const [formData, setFormData] = useState<SkillFormData>({
    name: initialData?.name || '',
    category: initialData?.category || 'frontend',
    proficiency: initialData?.proficiency || 1,
    iconUrl: initialData?.iconUrl || '',
    orderIndex: initialData?.orderIndex || 0
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Skill name is required'
    }

    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    if (formData.proficiency < 1 || formData.proficiency > 5) {
      newErrors.proficiency = 'Proficiency must be between 1 and 5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: keyof SkillFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {initialData ? 'Edit Skill' : 'Add New Skill'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Skill Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Skill Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g., React, Python, AWS"
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            disabled={isLoading}
          >
            {SKILL_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-500">{errors.category}</p>
          )}
        </div>

        {/* Proficiency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Proficiency Level (1-5) *
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="5"
              value={formData.proficiency}
              onChange={(e) => handleInputChange('proficiency', parseInt(e.target.value))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              disabled={isLoading}
            />
            <span className="text-lg font-semibold text-gray-900 dark:text-white min-w-[2rem] text-center">
              {formData.proficiency}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>Beginner</span>
            <span>Expert</span>
          </div>
          {errors.proficiency && (
            <p className="mt-1 text-sm text-red-500">{errors.proficiency}</p>
          )}
        </div>

        {/* Icon URL */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Icon URL (optional)
          </label>
          <input
            type="url"
            value={formData.iconUrl}
            onChange={(e) => handleInputChange('iconUrl', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            placeholder="https://example.com/icon.svg"
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
            value={formData.orderIndex}
            onChange={(e) => handleInputChange('orderIndex', parseInt(e.target.value) || 0)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
            placeholder="0"
            min="0"
            disabled={isLoading}
          />
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lower numbers appear first
          </p>
        </div>

        {/* Actions */}
        <div className="flex space-x-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Saving...' : (initialData ? 'Update Skill' : 'Add Skill')}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default SkillForm