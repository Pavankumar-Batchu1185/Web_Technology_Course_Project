'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';
import NavbarWrapper from '../../../components/NavbarWrapper';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../lib/api';

export default function CreateAchievementPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    achievement_type: '',
    date_achieved: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!authLoading && !user) router.push('/login?redirect=/achievements/create');
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      setSubmitting(true);
      setError('');
      
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('achievement_type', formData.achievement_type);
      submitData.append('date_achieved', formData.date_achieved);
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      await api.post('/achievements/', submitData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      router.push('/achievements');
    } catch (err: any) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const messages = Object.entries(data).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`);
        setError(messages.join(' | ') || 'Failed to post achievement');
      } else {
        setError(data?.message || 'Failed to post achievement');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen" style={{ background: '#f8f8f6' }}>
        <NavbarWrapper />
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#f8f8f6' }}>
      <NavbarWrapper />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-black text-gray-900">Post Achievement</h1>
          <p className="text-gray-500 text-sm mt-1">Share student success stories</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Title */}
          <div className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-gray-900 transition-colors overflow-hidden">
            <div className="px-5 pt-4 pb-1">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Won First Prize in National Hackathon"
                className="w-full text-gray-900 font-semibold text-base placeholder-gray-300 focus:outline-none bg-transparent pb-3"
                required
                maxLength={200}
              />
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-gray-900 transition-colors overflow-hidden">
            <div className="px-5 pt-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the achievement, competition details, what was accomplished..."
                rows={6}
                className="w-full text-gray-800 text-sm leading-relaxed placeholder-gray-300 focus:outline-none bg-transparent resize-none pb-4"
                required
              />
            </div>
          </div>

          {/* Achievement Type + Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-gray-900 transition-colors px-5 py-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <select
                name="achievement_type"
                value={formData.achievement_type}
                onChange={handleChange}
                className="w-full text-gray-900 font-semibold text-sm focus:outline-none bg-transparent cursor-pointer"
                required
              >
               <option value="">Select type</option>
              <option value="hackathon">Hackathon</option>
              <option value="competition">Competition</option>
              <option value="award">Award</option>
              <option value="academic">Academic</option>
              <option value="sports">Sports</option>
              <option value="arts">Arts</option>
              <option value="community">Community</option>
              <option value="other">Other</option>
              </select>
            </div>

            <div className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-gray-900 transition-colors px-5 py-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_achieved"
                value={formData.date_achieved}
                onChange={handleChange}
                className="w-full text-gray-900 font-semibold text-sm focus:outline-none bg-transparent"
                required
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-white rounded-xl border-2 border-gray-200 focus-within:border-gray-900 transition-colors overflow-hidden">
            <div className="px-5 pt-4 pb-4">
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-700 cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover rounded-lg border-2 border-gray-200" />
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl px-5 py-3.5">
              <p className="text-red-700 font-semibold text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 disabled:bg-gray-300 text-white px-7 py-2.5 rounded-xl font-bold text-sm transition-colors"
            >
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Posting…</>
              ) : (
                <>🏆 Post Achievement</>
              )}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
