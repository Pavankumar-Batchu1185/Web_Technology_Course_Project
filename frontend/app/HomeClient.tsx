'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import NavbarWrapper from '../components/NavbarWrapper';
import QuestionCard from '../components/QuestionCard';
import Filters from '../components/Filters';
import { questionAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

interface Question {
  id: number;
  title: string;
  content: string;
  slug: string;
  created_at: string;
  updated_at: string;
  vote_score: number;
  upvote_count: number;
  downvote_count: number;
  answer_count: number;
  category: {
    id: number;
    name: string;
  };
  tags: { id: number; name: string }[];
  author: {
    username: string;
  };
  time_since: string;
}

interface Filters {
  category: number | undefined;
  tag: number | undefined;
  sort: string | undefined;
}

export default function HomeClient() {
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<Filters>({ category: undefined, tag: undefined, sort: undefined });
  const [initialLoad, setInitialLoad] = useState(true);
  const { user } = useAuth();

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const params: Record<string, string | number> = {};
      if (filters.category) params.category = filters.category;
      if (filters.tag) params.tag = filters.tag;
      if (filters.sort) params.sort = filters.sort;
      
      const searchQuery = searchParams.get('search');
      if (searchQuery) params.search = searchQuery;

      const { data } = await questionAPI.list(params);
      setQuestions(data.results ?? data);
      setError('');
    } catch {
      setError('Failed to load questions');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [filters, searchParams]);

  const handleVote = async (id: number, direction: 'up' | 'down') => {
    if (!user) return;
    try {
      const endpoint = direction === 'up' ? 'upvote' : 'downvote';
      const { data } = await questionAPI[endpoint](id);
      setQuestions(questions.map(q =>
        q.id === id ? {
          ...q,
          vote_score: data.vote_score,
          upvote_count: data.upvote_count,
          downvote_count: data.downvote_count
        } : q
      ));
    } catch {
      // Handle vote error silently
    }
  };

  const handleFilterChange = (newFilters: { category?: number; tag?: number; sort?: string }) => {
    setFilters({ category: newFilters.category, tag: newFilters.tag, sort: newFilters.sort });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavbarWrapper />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 mb-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome to CampusQA</h1>
          <p className="text-blue-100 mb-4">Ask questions, share knowledge, and learn together</p>
          {user && (
            <Link
              href="/ask"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-full font-semibold hover:bg-blue-50 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ask a Question
            </Link>
          )}
        </div>

        {/* Filters */}
        <Filters onFilterChange={handleFilterChange} />

        {/* Questions List */}
        {initialLoad && loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : questions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No questions yet</h3>
            <p className="text-gray-500 mb-4">Be the first to ask a question!</p>
            {user && (
              <Link
                href="/ask"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors"
              >
                Ask a Question
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {loading && (
              <div className="flex justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
              </div>
            )}
            {questions.map((question) => (
              <QuestionCard
                key={question.id}
                question={question}
                onVote={user ? handleVote : undefined}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
