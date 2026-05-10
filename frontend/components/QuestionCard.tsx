import Link from 'next/link';

interface Tag { id: number; name: string; }
interface Category { id: number; name: string; }
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
  category: Category;
  tags: Tag[];
  author: { username: string };
  time_since: string;
}
interface QuestionCardProps {
  question: Question;
  onVote?: (id: number, direction: 'up' | 'down') => void;
}

export default function QuestionCard({ question, onVote }: QuestionCardProps) {
  return (
    <div className="bg-white rounded-xl border-2 border-gray-200 hover:border-gray-900 p-5 transition-all hover:shadow-lg group">
      <div className="flex gap-4">

        {/* Vote */}
        <div className="flex flex-col items-center gap-1 pt-0.5">
          <button
            onClick={() => onVote?.(question.id, 'up')}
            disabled={!onVote}
            className="p-1.5 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-gray-500 hover:text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
            </svg>
          </button>
          <span className="text-sm font-black text-green-600">
            {question.upvote_count || 0}
          </span>
          <button
            onClick={() => onVote?.(question.id, 'down')}
            disabled={!onVote}
            className="p-1.5 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 text-gray-500 hover:text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <span className="text-sm font-black text-red-600">
            {question.downvote_count || 0}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Link href={`/question/${question.id}`}>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
              {question.title}
            </h3>
          </Link>

          <p className="text-gray-600 text-sm mt-1.5 line-clamp-2 leading-relaxed">
            {question.content}
          </p>

          {/* Tags */}
          {question.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {question.tags.slice(0, 4).map((tag) => (
                <span key={tag.id} className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-md border border-gray-200">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {/* Meta row */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 min-w-0">
              {question.category?.name && (
                <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-200 shrink-0">
                  {question.category.name}
                </span>
              )}
              <Link href={`/profile/${question.author?.username}`} className="text-xs text-gray-500 hover:text-gray-800 font-medium truncate">
                <span className="text-gray-400">by </span>
                <span className="text-gray-700 font-semibold">{question.author?.username}</span>
              </Link>
              <span className="text-xs text-gray-400 shrink-0">{question.time_since || question.created_at}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 ml-3">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-xs font-bold text-gray-600">{question.answer_count || 0}</span>
              <span className="text-xs text-gray-400">answers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
