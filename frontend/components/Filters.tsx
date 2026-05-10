'use client';
import { useState, useEffect } from 'react';
import { categoryAPI } from '../lib/api';
import api from '../lib/api';

interface Category { id: number; name: string; }
interface Tag { id: number; name: string; }
interface FilterProps {
  onFilterChange?: (filters: { category?: number; tag?: number; sort?: string }) => void;
}

export default function Filters({ onFilterChange }: FilterProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    categoryAPI.list().then(({ data }) => setCategories(data.results ?? data));
    api.get('/tags/').then(({ data }) => setTags(data.results ?? data));
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    onFilterChange?.({
      category: e.target.value ? parseInt(e.target.value) : undefined,
      tag: selectedTag ? parseInt(selectedTag) : undefined,
      sort: sortBy
    });
  };

  const handleTagChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTag(e.target.value);
    onFilterChange?.({
      category: selectedCategory ? parseInt(selectedCategory) : undefined,
      tag: e.target.value ? parseInt(e.target.value) : undefined,
      sort: sortBy
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    onFilterChange?.({
      category: selectedCategory ? parseInt(selectedCategory) : undefined,
      tag: selectedTag ? parseInt(selectedTag) : undefined,
      sort: e.target.value
    });
  };

  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 px-5 py-3.5 mb-5">
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Filter</span>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="bg-gray-100 border-2 border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-gray-900 transition-colors cursor-pointer"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <select
            value={selectedTag}
            onChange={handleTagChange}
            className="bg-gray-100 border-2 border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-gray-900 transition-colors cursor-pointer"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>#{tag.name}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
          </svg>
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="bg-gray-100 border-2 border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-800 focus:outline-none focus:border-gray-900 transition-colors cursor-pointer"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="answers">Most Answers</option>
            <option value="votes">Most Votes</option>
          </select>
        </div>
      </div>
    </div>
  );
}
