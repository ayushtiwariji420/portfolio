'use client';

import { useState, useEffect } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';

interface Blog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  tags: string[];
  imageUrl?: string;
  published: boolean;
  featured: boolean;
  readTime: number;
  createdAt: string;
  updatedAt: string;
}

interface CreateBlog {
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  tags: string[];
  imageUrl?: string;
  published: boolean;
  featured: boolean;
  readTime: number;
}

type UpdateBlog = Partial<CreateBlog>;

interface BlogFormProps {
  blog?: Blog;
  onSubmit: (data: CreateBlog | UpdateBlog) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

function sanitizeHtml(html: string) {
  const withoutScripts = html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
    .replace(/on\w+\s*=\s*'[^']*'/gi, '')
    .replace(/on\w+\s*=\s*[^\s>]+/gi, '');
  return withoutScripts;
}

export default function BlogForm({ 
  blog, 
  onSubmit, 
  onCancel, 
  isLoading = false 
}: BlogFormProps) {
  const [formData, setFormData] = useState<CreateBlog>({
    title: '',
    content: '',
    excerpt: '',
    slug: '',
    tags: [],
    imageUrl: '',
    published: false,
    featured: false,
    readTime: 5
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        content: blog.content,
        excerpt: blog.excerpt,
        slug: blog.slug,
        tags: blog.tags,
        imageUrl: blog.imageUrl || '',
        published: blog.published,
        featured: blog.featured,
        readTime: blog.readTime
      });
      setTagInput(blog.tags.join(', '));
    }
  }, [blog]);

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  // Auto-generate excerpt from content
  const generateExcerpt = (content: string, maxLength: number = 160) => {
    // Remove HTML tags
    const plainText = content.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength).trim() + '...'
      : plainText;
  };

  // Estimate read time based on content
  const estimateReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute) || 1;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const tags = tagInput
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    const slug = formData.slug || generateSlug(formData.title);
    const excerpt = formData.excerpt || generateExcerpt(formData.content);
    const readTime = formData.readTime || estimateReadTime(formData.content);

    onSubmit({
      ...formData,
      tags,
      slug,
      excerpt,
      readTime
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      
      // Auto-generate slug when title changes
      if (name === 'title' && !blog) {
        const slug = generateSlug(value);
        setFormData(prev => ({ ...prev, slug }));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-6xl w-full max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {blog ? 'Edit Blog Post' : 'Create New Blog Post'}
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
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    placeholder="Enter blog title"
                    disabled={isLoading}
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                    placeholder="url-slug-for-blog"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Auto-generated from title, or customize it
                  </p>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="React, JavaScript, Web Development (comma-separated)"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Separate tags with commas
                  </p>
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Featured Image URL
                  </label>
                  <input
                    type="url"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="https://example.com/image.jpg"
                    disabled={isLoading}
                  />
                </div>

                {/* Settings */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Read Time (minutes)
                    </label>
                    <input
                      type="number"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="published"
                        checked={formData.published}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        disabled={isLoading}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Published</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="featured"
                        checked={formData.featured}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                        disabled={isLoading}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Featured</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Excerpt */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Excerpt
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Brief description of the blog post (auto-generated if left empty)"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Brief summary for the blog listing page
                  </p>
                </div>

                {/* Content */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Content *
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={16}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-mono text-sm"
                    required
                    placeholder="Write your blog content here... (HTML is supported)"
                    disabled={isLoading}
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    You can use HTML formatting tags like &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;, &lt;ul&gt;, &lt;ol&gt;, etc.
                  </p>
                </div>

                {/* Live Preview */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Live Preview</h3>
                    <span className="text-xs text-gray-500 dark:text-gray-400">Not saved yet</span>
                  </div>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-md p-4 bg-white dark:bg-gray-900">
                    {formData.imageUrl && (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-48 object-cover rounded-md mb-4" />
                    )}
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{formData.title || 'Blog title'}</h4>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{formData.excerpt || 'Short excerpt will appear here.'}</p>
                    {/* Render preview using the same pipeline as public page */}
                    <ReactMarkdown
                      className="prose prose-slate dark:prose-invert max-w-none"
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                    >
                      {formData.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 flex items-center"
                disabled={isLoading}
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {blog ? 'Update Blog' : 'Create Blog'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}