'use client';

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, X, Building, MapPin, Calendar, User, ExternalLink, Code } from 'lucide-react'
import IconRenderer from '@/components/IconRenderer'
import ExperienceForm from '@/components/admin/ExperienceForm'

// Import all React Icons libraries
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import * as BiIcons from 'react-icons/bi'
import * as BsIcons from 'react-icons/bs'
import * as CgIcons from 'react-icons/cg'
import * as DiIcons from 'react-icons/di'
import * as FcIcons from 'react-icons/fc'
import * as FiIcons from 'react-icons/fi'
import * as GoIcons from 'react-icons/go'
import * as GrIcons from 'react-icons/gr'
import * as HiIcons from 'react-icons/hi'
import * as Hi2Icons from 'react-icons/hi2'
import * as ImIcons from 'react-icons/im'
import * as IoIcons from 'react-icons/io'
import * as Io5Icons from 'react-icons/io5'
import * as MdIcons from 'react-icons/md'
import * as RiIcons from 'react-icons/ri'
import * as SiIcons from 'react-icons/si'
import * as TbIcons from 'react-icons/tb'
import * as TiIcons from 'react-icons/ti'
import * as VscIcons from 'react-icons/vsc'

interface Skill {
  id: string
  name: string
  category: string
  proficiency: number
  iconName?: string
  iconLibrary?: string
  iconUrl?: string
  iconEmoji?: string
  iconType?: 'react' | 'url' | 'emoji'
  orderIndex: number
  createdAt: string
  updatedAt: string
}

interface IconData {
  name: string
  library: string
  component: React.ComponentType<any>
  searchText: string
}

interface SkillFormData {
  name: string
  category: string
  proficiency: number
  iconName?: string
  iconLibrary?: string
  iconUrl?: string
  iconEmoji?: string
  iconType: 'react' | 'url' | 'emoji'
  orderIndex: number
}

interface Experience {
  id: string
  company: string
  position: string
  description: string
  responsibilities: string[]
  technologies: string[]
  start_date: string
  end_date?: string
  company_url?: string
  location: string
  employment_type: string
  order_index: number
  created_at: string
  updated_at: string
}

interface ExperienceFormData {
  company: string
  position: string
  description: string
  responsibilities: string[]
  technologies: string[]
  startDate: string
  endDate?: string
  companyUrl?: string
  location: string
  employmentType: string
  orderIndex: number
}

const SKILL_CATEGORIES = [
  { value: '', label: 'All Categories' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'cloud', label: 'Cloud & DevOps' },
  { value: 'ai-ml', label: 'AI/ML' },
  { value: 'tools', label: 'Tools & Technologies' },
  { value: 'other', label: 'Other' }
]

// Enhanced Icon Selector Component
const IconSelector: React.FC<{
  iconType: 'react' | 'url' | 'emoji'
  iconName?: string
  iconLibrary?: string
  iconUrl?: string
  iconEmoji?: string
  onIconChange: (iconData: { iconType: 'react' | 'url' | 'emoji', iconName?: string, iconLibrary?: string, iconUrl?: string, iconEmoji?: string }) => void
  className?: string
}> = ({ iconType, iconName, iconLibrary, iconUrl, iconEmoji, onIconChange, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTab, setSelectedTab] = useState<'react' | 'url' | 'emoji'>(iconType)
  const [tempIconUrl, setTempIconUrl] = useState(iconUrl || '')
  const [tempIconEmoji, setTempIconEmoji] = useState(iconEmoji || '')

  // Combine all icon libraries
  const allIcons = useMemo(() => {
    const iconLibraries = {
      'fa': FaIcons,
      'ai': AiIcons,
      'bi': BiIcons,
      'bs': BsIcons,
      'cg': CgIcons,
      'di': DiIcons,
      'fc': FcIcons,
      'fi': FiIcons,
      'go': GoIcons,
      'gr': GrIcons,
      'hi': HiIcons,
      'hi2': Hi2Icons,
      'im': ImIcons,
      'io': IoIcons,
      'io5': Io5Icons,
      'md': MdIcons,
      'ri': RiIcons,
      'si': SiIcons,
      'tb': TbIcons,
      'ti': TiIcons,
      'vsc': VscIcons,
    }

    const icons: IconData[] = []
    
    Object.entries(iconLibraries).forEach(([libraryKey, library]) => {
      Object.entries(library).forEach(([iconName, IconComponent]) => {
        if (typeof IconComponent === 'function' && iconName !== 'IconBase') {
          icons.push({
            name: iconName,
            library: libraryKey,
            component: IconComponent,
            searchText: `${iconName} ${libraryKey}`.toLowerCase(),
          })
        }
      })
    })

    return icons
  }, [])

  // Filter icons based on search term
  const filteredIcons = useMemo(() => {
    if (!searchTerm.trim()) return allIcons.slice(0, 50)
    
    return allIcons
      .filter(icon => 
        icon.searchText.includes(searchTerm.toLowerCase())
      )
      .slice(0, 100)
  }, [allIcons, searchTerm])

  const handleReactIconSelect = (icon: IconData) => {
    onIconChange({
      iconType: 'react',
      iconName: icon.name,
      iconLibrary: icon.library,
      iconUrl: undefined,
      iconEmoji: undefined
    })
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleUrlSubmit = () => {
    if (tempIconUrl.trim()) {
      onIconChange({
        iconType: 'url',
        iconUrl: tempIconUrl.trim(),
        iconName: undefined,
        iconLibrary: undefined,
        iconEmoji: undefined
      })
      setIsOpen(false)
    }
  }

  const handleEmojiSubmit = () => {
    if (tempIconEmoji.trim()) {
      onIconChange({
        iconType: 'emoji',
        iconEmoji: tempIconEmoji.trim(),
        iconName: undefined,
        iconLibrary: undefined,
        iconUrl: undefined
      })
      setIsOpen(false)
    }
  }

  const clearSelection = () => {
    onIconChange({
      iconType: 'react',
      iconName: undefined,
      iconLibrary: undefined,
      iconUrl: undefined,
      iconEmoji: undefined
    })
  }

  const getDisplayText = () => {
    if (iconType === 'react' && iconName && iconLibrary) {
      return `${iconName} (${iconLibrary})`
    }
    if (iconType === 'url' && iconUrl) {
      return `Image: ${iconUrl.length > 30 ? iconUrl.substring(0, 30) + '...' : iconUrl}`
    }
    if (iconType === 'emoji' && iconEmoji) {
      return `Emoji: ${iconEmoji}`
    }
    return 'Select an icon...'
  }

  const hasIcon = () => {
    return (iconType === 'react' && iconName && iconLibrary) ||
           (iconType === 'url' && iconUrl) ||
           (iconType === 'emoji' && iconEmoji)
  }

  return (
    <div className={`relative ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Icon
      </label>
      
      {/* Selected Icon Display */}
      {hasIcon() && (
        <div className="mb-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 flex items-center justify-center">
                {iconType === 'react' && iconName && iconLibrary && (
                  (() => {
                    const iconLibraries = {
                      'fa': FaIcons, 'ai': AiIcons, 'bi': BiIcons, 'bs': BsIcons, 'cg': CgIcons,
                      'di': DiIcons, 'fc': FcIcons, 'fi': FiIcons, 'go': GoIcons, 'gr': GrIcons,
                      'hi': HiIcons, 'hi2': Hi2Icons, 'im': ImIcons, 'io': IoIcons, 'io5': Io5Icons,
                      'md': MdIcons, 'ri': RiIcons, 'si': SiIcons, 'tb': TbIcons, 'ti': TiIcons, 'vsc': VscIcons
                    } as any
                    const library = iconLibraries[iconLibrary]
                    const IconComponent = library?.[iconName]
                    return IconComponent ? <IconComponent size={24} className="text-purple-600 dark:text-purple-400" /> : null
                  })()
                )}
                {iconType === 'url' && iconUrl && (
                  <img src={iconUrl} alt="icon" className="w-6 h-6 object-contain" />
                )}
                {iconType === 'emoji' && iconEmoji && (
                  <span className="text-lg">{iconEmoji}</span>
                )}
              </div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white text-sm">{getDisplayText()}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 capitalize">{iconType} icon</p>
              </div>
            </div>
            <button
              onClick={clearSelection}
              className="p-1 hover:bg-purple-100 dark:hover:bg-purple-800 rounded"
              title="Clear selection"
              type="button"
            >
              <X size={16} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
      >
        <div className="flex items-center justify-between">
          <span className="text-gray-700 dark:text-gray-300">
            {getDisplayText()}
          </span>
          <ChevronDown 
            size={16} 
            className={`text-gray-500 transform transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </div>
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-96 flex flex-col">
          {/* Tab Headers */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {['react', 'url', 'emoji'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTab(tab as 'react' | 'url' | 'emoji')}
                className={`flex-1 px-4 py-3 text-sm font-medium capitalize transition-colors ${
                  selectedTab === tab
                    ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab === 'react' ? 'React Icons' : tab === 'url' ? 'Image URL' : 'Emoji'}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {selectedTab === 'react' && (
              <div className="flex flex-col">
                {/* Search Input */}
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search React icons..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Showing {filteredIcons.length} results {!searchTerm && '(first 50)'}
                  </p>
                </div>
                
                {/* Icons List */}
                <div className="flex-1 overflow-y-auto">
                  {filteredIcons.length > 0 ? (
                    <div className="p-2">
                      {filteredIcons.map((icon, index) => (
                        <button
                          key={`${icon.library}-${icon.name}-${index}`}
                          type="button"
                          onClick={() => handleReactIconSelect(icon)}
                          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors text-left"
                        >
                          <icon.component size={18} className="text-gray-600 dark:text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-800 dark:text-white text-sm truncate">
                              {icon.name}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {icon.library}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                      <Search size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                      <p>No icons found</p>
                      <p className="text-sm">Try a different search term</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {selectedTab === 'url' && (
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Image URL
                    </label>
                    <input
                      type="url"
                      value={tempIconUrl}
                      onChange={(e) => setTempIconUrl(e.target.value)}
                      placeholder="https://example.com/icon.png"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                  </div>
                  {tempIconUrl && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <img src={tempIconUrl} alt="Preview" className="w-8 h-8 object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
                      <span className="text-sm text-gray-600 dark:text-gray-400">Preview</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleUrlSubmit}
                    disabled={!tempIconUrl.trim()}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Use This URL
                  </button>
                </div>
              </div>
            )}

            {selectedTab === 'emoji' && (
              <div className="p-4">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Emoji
                    </label>
                    <input
                      type="text"
                      value={tempIconEmoji}
                      onChange={(e) => setTempIconEmoji(e.target.value)}
                      placeholder="🚀 ⚡ 💻 🎯"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Enter any emoji character
                    </p>
                  </div>
                  {tempIconEmoji && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                      <span className="text-2xl">{tempIconEmoji}</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">Preview</span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={handleEmojiSubmit}
                    disabled={!tempIconEmoji.trim()}
                    className="w-full px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Use This Emoji
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Skill Form Component
const SkillForm: React.FC<{
  onSubmit: (data: SkillFormData) => Promise<void>
  onCancel: () => void
  initialData?: Partial<SkillFormData>
  isLoading: boolean
}> = ({ onSubmit, onCancel, initialData, isLoading }) => {
  const [formData, setFormData] = useState<SkillFormData>({
    name: initialData?.name || '',
    category: initialData?.category || '',
    proficiency: initialData?.proficiency || 1,
    iconName: initialData?.iconName || '',
    iconLibrary: initialData?.iconLibrary || '',
    iconUrl: initialData?.iconUrl || '',
    iconEmoji: initialData?.iconEmoji || '',
    iconType: (initialData?.iconType as 'react' | 'url' | 'emoji') || 'react',
    orderIndex: initialData?.orderIndex || 0
  })

  const handleIconChange = (iconData: { 
    iconType: 'react' | 'url' | 'emoji'
    iconName?: string
    iconLibrary?: string
    iconUrl?: string
    iconEmoji?: string
  }) => {
    setFormData(prev => ({
      ...prev,
      iconType: iconData.iconType,
      iconName: iconData.iconName || '',
      iconLibrary: iconData.iconLibrary || '',
      iconUrl: iconData.iconUrl || '',
      iconEmoji: iconData.iconEmoji || ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="mb-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
              {initialData ? 'Edit Skill' : 'Add New Skill'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {initialData ? 'Update the skill information below.' : 'Fill in the details for the new skill.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Skill Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="e.g., React, Python, AWS"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">Select a category</option>
                {SKILL_CATEGORIES.slice(1).map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Proficiency Level: {['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert'][formData.proficiency]}
              </label>
              <input
                type="range"
                min="1"
                max="5"
                value={formData.proficiency}
                onChange={(e) => setFormData(prev => ({ ...prev, proficiency: parseInt(e.target.value) }))}
                className="mt-2 block w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
              />
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                <span>Beginner</span>
                <span>Basic</span>
                <span>Intermediate</span>
                <span>Advanced</span>
                <span>Expert</span>
              </div>
            </div>

            <IconSelector
              iconType={formData.iconType}
              iconName={formData.iconName}
              iconLibrary={formData.iconLibrary}
              iconUrl={formData.iconUrl}
              iconEmoji={formData.iconEmoji}
              onIconChange={handleIconChange}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Order Index
              </label>
              <input
                type="number"
                min="0"
                value={formData.orderIndex}
                onChange={(e) => setFormData(prev => ({ ...prev, orderIndex: parseInt(e.target.value) || 0 }))}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="0"
              />
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Lower numbers will appear first in the skills list.
              </p>
            </div>

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
                {isLoading ? 'Saving...' : (initialData ? 'Update Skill' : 'Add Skill')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}


// Main Skills Page Component
export default function SkillsPage() {
  const [activeTab, setActiveTab] = useState<'skills' | 'experiences'>('skills')
  const [skills, setSkills] = useState<Skill[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [loading, setLoading] = useState(true)
  const [experiencesLoading, setExperiencesLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [experiencesError, setExperiencesError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [showExperienceForm, setShowExperienceForm] = useState(false)
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmittingExperience, setIsSubmittingExperience] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [experienceSearchTerm, setExperienceSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [deleteConfirmation, setDeleteConfirmation] = useState<{show: boolean, skill: Skill | null}>({show: false, skill: null})
  const [deleteExperienceConfirmation, setDeleteExperienceConfirmation] = useState<{show: boolean, experience: Experience | null}>({show: false, experience: null})
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeletingExperience, setIsDeletingExperience] = useState(false)

  useEffect(() => {
    fetchSkills()
    fetchExperiences()
  }, [selectedCategory, searchTerm, experienceSearchTerm])

  const fetchSkills = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const params = new URLSearchParams()
      if (selectedCategory) params.set('category', selectedCategory)
      if (searchTerm) params.set('search', searchTerm)
      
      const response = await fetch(`/api/admin/skills?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch skills')
      }
      
      const data = await response.json()
      if (data.success) {
        setSkills(data.data || [])
      } else {
        throw new Error(data.error || 'Failed to fetch skills')
      }
    } catch (error) {
      console.error('Error fetching skills:', error)
      setError('Failed to load skills. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitSkill = async (skillData: SkillFormData) => {
    try {
      setIsSubmitting(true)
      
      const url = editingSkill ? `/api/admin/skills/${editingSkill.id}` : '/api/admin/skills'
      const method = editingSkill ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(skillData)
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save skill')
      }
      
      // Refresh skills list
      await fetchSkills()
      
      // Close form
      setShowForm(false)
      setEditingSkill(null)
      
    } catch (error) {
      console.error('Error saving skill:', error)
      setError('Failed to save skill. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddSkill = () => {
    setEditingSkill(null)
    setShowForm(true)
  }

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingSkill(null)
  }

  const handleDeleteSkill = (skill: Skill) => {
    setDeleteConfirmation({ show: true, skill })
  }

  const handleCancelDelete = () => {
    setDeleteConfirmation({ show: false, skill: null })
  }

  const handleConfirmDelete = async () => {
    if (!deleteConfirmation.skill) return
    
    try {
      setIsDeleting(true)
      setError(null)
      
      const response = await fetch(`/api/admin/skills/${deleteConfirmation.skill.id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete skill')
      }
      
      // Refresh skills list
      await fetchSkills()
      
      // Close confirmation dialog
      setDeleteConfirmation({ show: false, skill: null })
      
    } catch (error) {
      console.error('Error deleting skill:', error)
      setError('Failed to delete skill. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const getProficiencyLabel = (proficiency: number) => {
    const labels = ['', 'Beginner', 'Basic', 'Intermediate', 'Advanced', 'Expert']
    return labels[proficiency] || 'Unknown'
  }

  const getCategoryLabel = (category: string) => {
    const categoryObj = SKILL_CATEGORIES.find(c => c.value === category)
    return categoryObj?.label || category
  }

  // Experience Management Functions
  const fetchExperiences = async () => {
    try {
      setExperiencesLoading(true)
      setExperiencesError(null)
      
      const params = new URLSearchParams()
      if (experienceSearchTerm) params.set('search', experienceSearchTerm)
      
      const response = await fetch(`/api/admin/experiences?${params}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch experiences')
      }
      
      const data = await response.json()
      if (data.success) {
        setExperiences(data.data || [])
      } else {
        throw new Error(data.error || 'Failed to fetch experiences')
      }
    } catch (error) {
      console.error('Error fetching experiences:', error)
      setExperiencesError('Failed to load experiences. Please try again.')
    } finally {
      setExperiencesLoading(false)
    }
  }

  const handleSubmitExperience = async (experienceData: ExperienceFormData) => {
    try {
      setIsSubmittingExperience(true)
      
      const url = editingExperience ? `/api/admin/experiences/${editingExperience.id}` : '/api/admin/experiences'
      const method = editingExperience ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(experienceData)
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to save experience')
      }
      
      // Refresh experiences list
      await fetchExperiences()
      
      // Close form
      setShowExperienceForm(false)
      setEditingExperience(null)
      
    } catch (error) {
      console.error('Error saving experience:', error)
      setExperiencesError('Failed to save experience. Please try again.')
    } finally {
      setIsSubmittingExperience(false)
    }
  }

  const handleAddExperience = () => {
    setEditingExperience(null)
    setShowExperienceForm(true)
  }

  const handleEditExperience = (experience: Experience) => {
    setEditingExperience(experience)
    setShowExperienceForm(true)
  }

  const handleCancelExperienceForm = () => {
    setShowExperienceForm(false)
    setEditingExperience(null)
  }

  const handleDeleteExperience = (experience: Experience) => {
    setDeleteExperienceConfirmation({ show: true, experience })
  }

  const handleCancelExperienceDelete = () => {
    setDeleteExperienceConfirmation({ show: false, experience: null })
  }

  const handleConfirmExperienceDelete = async () => {
    if (!deleteExperienceConfirmation.experience) return
    
    try {
      setIsDeletingExperience(true)
      setExperiencesError(null)
      
      const response = await fetch(`/api/admin/experiences/${deleteExperienceConfirmation.experience.id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete experience')
      }
      
      // Refresh experiences list
      await fetchExperiences()
      
      // Close confirmation dialog
      setDeleteExperienceConfirmation({ show: false, experience: null })
      
    } catch (error) {
      console.error('Error deleting experience:', error)
      setExperiencesError('Failed to delete experience. Please try again.')
    } finally {
      setIsDeletingExperience(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Present'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short'
      })
    } catch {
      return dateString
    }
  }

  const formatEmploymentType = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  if (showForm) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SkillForm
          onSubmit={handleSubmitSkill}
          onCancel={handleCancelForm}
          initialData={editingSkill ? {
            name: editingSkill.name,
            category: editingSkill.category,
            proficiency: editingSkill.proficiency,
            iconName: editingSkill.iconName,
            iconLibrary: editingSkill.iconLibrary,
            iconUrl: editingSkill.iconUrl,
            iconEmoji: editingSkill.iconEmoji,
            iconType: editingSkill.iconType,
            orderIndex: editingSkill.orderIndex
          } : undefined}
          isLoading={isSubmitting}
        />
      </div>
    )
  }

  if (showExperienceForm) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExperienceForm
          onSubmit={handleSubmitExperience}
          onCancel={handleCancelExperienceForm}
          initialData={editingExperience ? {
            company: editingExperience.company,
            position: editingExperience.position,
            description: editingExperience.description,
            responsibilities: editingExperience.responsibilities,
            technologies: editingExperience.technologies,
            startDate: editingExperience.start_date,
            endDate: editingExperience.end_date,
            companyUrl: editingExperience.company_url,
            location: editingExperience.location,
            employmentType: editingExperience.employment_type,
            orderIndex: editingExperience.order_index
          } : undefined}
          isLoading={isSubmittingExperience}
        />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skills & Experience</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your technical skills, proficiency levels, and professional experience.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={activeTab === 'skills' ? handleAddSkill : handleAddExperience}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          >
            {activeTab === 'skills' ? 'Add New Skill' : 'Add New Experience'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('skills')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'skills'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Skills
          </button>
          <button
            onClick={() => setActiveTab('experiences')}
            className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === 'experiences'
                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Experience
          </button>
        </nav>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
          />
        </div>
        <div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-700 dark:text-white"
          >
            {SKILL_CATEGORIES.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-600 rounded-md">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
          {skills.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-lg">
                No skills found. {searchTerm || selectedCategory ? 'Try adjusting your filters.' : 'Add your first skill to get started.'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Skill
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Proficiency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  <AnimatePresence>
                    {skills.map((skill) => (
                      <motion.tr
                        key={skill.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="mr-3">
                              <IconRenderer
                                iconType={skill.iconType || 'react'}
                                iconName={skill.iconName}
                                iconLibrary={skill.iconLibrary}
                                iconUrl={skill.iconUrl}
                                iconEmoji={skill.iconEmoji}
                                size={32}
                                className="text-purple-600 dark:text-purple-400"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {skill.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
                            {getCategoryLabel(skill.category)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-1 mr-4">
                              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                <div
                                  className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${(skill.proficiency / 5) * 100}%` }}
                                />
                              </div>
                            </div>
                            <span className="text-sm text-gray-900 dark:text-white min-w-0">
                              {getProficiencyLabel(skill.proficiency)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {skill.orderIndex}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-4">
                            <button
                              onClick={() => handleEditSkill(skill)}
                              className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmation.show && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={handleCancelDelete}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    Delete Skill
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-700 dark:text-gray-300">
                  Are you sure you want to delete the skill 
                  <span className="font-medium text-gray-900 dark:text-white">
                    "{deleteConfirmation.skill?.name}"
                  </span>? 
                  This will permanently remove it from your portfolio.
                </p>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancelDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isDeleting && (
                    <div className="animate-spin -ml-1 mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  )}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
