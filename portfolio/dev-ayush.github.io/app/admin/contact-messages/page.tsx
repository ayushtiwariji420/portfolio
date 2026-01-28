'use client';

import { useEffect, useState } from 'react';
import {
  EnvelopeIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  status: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data?: ContactMessage[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  error?: string;
}

export default function ContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalMessages, setTotalMessages] = useState(0);

  useEffect(() => {
    fetchMessages();
  }, [filter, currentPage]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(filter !== 'all' && { isRead: filter === 'read' ? 'true' : 'false' })
      });

      const response = await fetch(`/api/admin/contact-messages?${params}`);
      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        setMessages(data.data);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalMessages(data.pagination?.total || 0);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'PATCH',
      });

      if (response.ok) {
        setMessages(messages.map(msg =>
          msg.id === messageId ? { ...msg, is_read: true, status: 'read' } : msg
        ));
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const deleteMessage = async (messageId: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await fetch(`/api/admin/contact-messages/${messageId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== messageId));
        setSelectedMessage(null);
        setTotalMessages(prev => prev - 1);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const getStatusIcon = (status: string, isRead: boolean) => {
    if (!isRead) {
      return <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />;
    }
    switch (status) {
      case 'replied':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'read':
        return <EyeIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string, isRead: boolean) => {
    if (!isRead) return 'Unread';
    switch (status) {
      case 'replied':
        return 'Replied';
      case 'read':
        return 'Read';
      default:
        return 'New';
    }
  };

  if (loading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Contact Messages</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage messages from your contact form. Total: {totalMessages}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 flex space-x-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'all'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All ({totalMessages})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'unread'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Unread ({messages.filter(m => !m.is_read).length})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-md text-sm font-medium ${
            filter === 'read'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Read ({messages.filter(m => m.is_read).length})
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Messages</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    onClick={() => {
                      setSelectedMessage(message);
                      if (!message.is_read) {
                        markAsRead(message.id);
                      }
                    }}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                    } ${!message.is_read ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(message.status, message.is_read)}
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {message.name}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {message.subject || 'No subject'}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(message.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No messages found
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4 flex justify-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-3 py-1">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded border disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {selectedMessage.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedMessage.email}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getStatusIcon(selectedMessage.status, selectedMessage.is_read)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {getStatusText(selectedMessage.status, selectedMessage.is_read)}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMessage(selectedMessage.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>

                {selectedMessage.subject && (
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject</h4>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">
                      {selectedMessage.subject}
                    </p>
                  </div>
                )}

                <div>
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</h4>
                  <div className="mt-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-md">
                    <p className="text-sm text-gray-900 dark:text-white whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                  Received: {new Date(selectedMessage.created_at).toLocaleString()}
                </div>

                <div className="mt-4 flex space-x-3">
                  <a
                    href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                  >
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    Reply via Email
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <EnvelopeIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No message selected
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select a message from the list to view its details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}