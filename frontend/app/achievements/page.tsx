'use client';
import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import NavbarWrapper from '../../components/NavbarWrapper';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';
import api from '../../lib/api';

interface Achievement {
  id: number;
  title: string;
  description: string;
  student_name: string;
  achievement_type: string;
  achievement_type_display: string;
  date_achieved: string;
  image?: string;
  student: { username: string };
  created_at: string;
}

const TYPE_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  academic:    { label: 'Academic',    color: '#185FA5', bg: '#E6F1FB' },
  sports:      { label: 'Sports',      color: '#3B6D11', bg: '#EAF3DE' },
  arts:        { label: 'Arts',        color: '#993556', bg: '#FBEAF0' },
  community:   { label: 'Community',   color: '#854F0B', bg: '#FAEEDA' },
  default:     { label: 'Achievement', color: '#3C3489', bg: '#EEEDFE' },
};
function getTypeConfig(type: string) {
  return TYPE_CONFIG[type?.toLowerCase()] ?? TYPE_CONFIG.default;
}
function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const cfg = getTypeConfig(achievement.achievement_type);
  const isFeatured = index === 0;

  return (
    <article
      className={`group relative bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
        isFeatured
          ? 'col-span-1 md:col-span-2 lg:col-span-2 rounded-2xl shadow-md'
          : 'rounded-2xl shadow-sm hover:shadow-md'
      }`}
      style={{ border: '1px solid #ede9e3' }}
    >
      {achievement.image ? (
        <div className={`overflow-hidden bg-gray-100 ${isFeatured ? 'h-72 md:h-80' : 'h-44'}`}>
          <img
            src={achievement.image}
            alt={achievement.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className={`flex items-center justify-center ${isFeatured ? 'h-40' : 'h-28'}`}
          style={{ background: cfg.bg }}
        >
          <span style={{ fontSize: isFeatured ? 56 : 40 }}>🏆</span>
        </div>
      )}

      <div className={`p-5 ${isFeatured ? 'md:p-7' : ''}`}>
        <span
          className="inline-block text-xs font-semibold tracking-widest uppercase rounded-full px-3 py-1 mb-3"
          style={{ color: cfg.color, background: cfg.bg }}
        >
          {achievement.achievement_type_display ?? cfg.label}
        </span>

        <h2
          className={`font-black text-gray-900 leading-tight mb-2 line-clamp-2 ${
            isFeatured ? 'text-2xl md:text-3xl' : 'text-lg'
          }`}
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          {achievement.title}
        </h2>

        <p className={`text-gray-500 leading-relaxed mb-4 ${isFeatured ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>
          {achievement.description}
        </p>
        <div className="border-t border-gray-100 pt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
              style={{ background: cfg.color }}
            >
              {achievement.student_name?.charAt(0)?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{achievement.student_name}</p>
              <p className="text-xs text-gray-400">
                {new Date(achievement.date_achieved).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric',
                })}
              </p>
            </div>
          </div>

          <Link
            href={`/profile/${achievement.student?.username}`}
            className="text-xs text-gray-400 hover:text-gray-700 font-medium transition-colors flex-shrink-0 hover:underline"
          >
            @{achievement.student?.username}
          </Link>
        </div>
      </div>
    </article>
  );
}

function SkeletonCard({ wide }: { wide?: boolean }) {
  return (
    <div
      className={`rounded-2xl bg-white animate-pulse overflow-hidden ${wide ? 'col-span-1 md:col-span-2' : ''}`}
      style={{ border: '1px solid #ede9e3' }}
    >
      <div className={`bg-gray-100 ${wide ? 'h-72' : 'h-44'}`} />
      <div className="p-5 space-y-3">
        <div className="h-3 w-20 bg-gray-100 rounded-full" />
        <div className="h-5 w-3/4 bg-gray-200 rounded" />
        <div className="h-4 w-full bg-gray-100 rounded" />
        <div className="h-4 w-2/3 bg-gray-100 rounded" />
        <div className="flex items-center gap-2 pt-2">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="space-y-1">
            <div className="h-3 w-24 bg-gray-200 rounded" />
            <div className="h-2 w-16 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

const FILTERS = ['All', 'Academic', 'Sports', 'Arts', 'Community'];

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const { user } = useAuth();

  useEffect(() => {
    api.get('/achievements/')
      .then(({ data }) => setAchievements(data.results ?? data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = activeFilter === 'All'
    ? achievements
    : achievements.filter(a =>
        a.achievement_type?.toLowerCase() === activeFilter.toLowerCase() ||
        a.achievement_type_display?.toLowerCase() === activeFilter.toLowerCase()
      );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20">
      <NavbarWrapper />

      <header className="relative overflow-hidden border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-2">
              Student Spotlight
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-none tracking-tight">
              Achievements
            </h1>
            <p className="text-slate-400 mt-2 text-base">
              {loading ? '—' : `${achievements.length} milestone${achievements.length !== 1 ? 's' : ''} and counting`}
            </p>
          </div>

          {user && (
            <Link
              href="/achievements/create"
              className="inline-flex items-center gap-2.5 text-sm font-bold px-6 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 self-start md:self-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Post Achievement
            </Link>
          )}
        </div>

        <div
          className="absolute bottom-0 left-0 h-0.5 w-24 ml-4 sm:ml-6 lg:ml-8"
          style={{ background: '#f59e0b', marginLeft: 'calc((100vw - min(100%, 72rem)) / 2 + 1rem)' }}
        />
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">

        <div className="flex flex-wrap gap-2 mb-8">
          {FILTERS.map(f => {
            const active = f === activeFilter;
            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`text-sm font-semibold px-4 py-2 rounded-full transition-all ${
                  active
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <SkeletonCard wide />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="rounded-2xl p-16 text-center"
            style={{ border: '2px dashed #ddd', background: '#fff' }}
          >
            <p className="text-5xl mb-4">🎯</p>
            <p className="font-bold text-gray-700 text-lg mb-1">
              {activeFilter === 'All' ? 'No achievements yet' : `No ${activeFilter} achievements yet`}
            </p>
            <p className="text-gray-400 text-sm">Be the first to share a milestone!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((achievement, i) => (
              <AchievementCard key={achievement.id} achievement={achievement} index={i} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}