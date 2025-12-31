'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';

export default function Home() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'search'>('write');

  const handleSave = async () => {
    if (!content.trim()) {
      setError('Note content cannot be empty');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3001/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save note');
      }

      setSuccess('Note saved successfully! 🎉');
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <main className="container mx-auto px-4 py-16 max-w-2xl">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            MeOVault
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-8">
            Capture and search your thoughts
          </p>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-8 border-b border-zinc-200 dark:border-zinc-700">
            <button
              onClick={() => setActiveTab('write')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'write'
                  ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              ✍️ Write
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeTab === 'search'
                  ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              🔍 Search
            </button>
          </div>

          {/* Write Tab */}
          {activeTab === 'write' && (
            <div className="space-y-4">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note here..."
                className="w-full h-64 p-4 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500"
                disabled={loading}
              />

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-lg">
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 rounded-lg">
                  {success}
                </div>
              )}

              <button
                onClick={handleSave}
                disabled={loading}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 text-white font-medium rounded-lg transition-colors duration-200 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Save Note'}
              </button>
            </div>
          )}

          {/* Search Tab */}
          {activeTab === 'search' && <SearchBar />}
        </div>
      </main>
    </div>
  );
}
