import React from 'react';
import { Course } from '../types';
import { Language, translations } from '../lib/i18n';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarkedCourses: Course[];
  onRemoveBookmark: (courseId: string) => void;
  onClearAll: () => void;
  onEnroll: (course: Course) => void;
  language: Language;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarkedCourses,
  onRemoveBookmark,
  onClearAll,
  onEnroll,
  language,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#090d16] border border-white/15 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <span className="material-symbols-outlined text-[20px]">bookmark</span>
            </span>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>{t.bookmarks.title}</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-950 border border-blue-500/30 text-blue-300 text-[10px] font-black">
                  {bookmarkedCourses.length}
                </span>
              </h3>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                bagiilmu.id Saved Learning Plan
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {bookmarkedCourses.length > 0 && (
              <button
                type="button"
                onClick={onClearAll}
                className="text-[11px] font-bold text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded cursor-pointer"
              >
                {t.bookmarks.removeAll}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 space-y-3 pr-1">
          {bookmarkedCourses.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <span className="material-symbols-outlined text-4xl text-zinc-500">
                bookmark_border
              </span>
              <h4 className="text-sm font-black uppercase tracking-tight text-white">
                {t.bookmarks.emptyTitle}
              </h4>
              <p className="text-xs text-zinc-400 max-w-sm mx-auto font-normal leading-relaxed">
                {t.bookmarks.emptyDesc}
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-blue-400/30"
              >
                {t.bookmarks.browseCourses}
              </button>
            </div>
          ) : (
            bookmarkedCourses.map((course) => (
              <div
                key={course.id}
                className="p-3.5 bg-white/5 hover:bg-white/[0.08] border border-white/10 rounded-xl flex items-center justify-between gap-3 transition-colors"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 border border-white/10 bg-black">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="overflow-hidden">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block truncate">
                      {course.provider} • {course.level}
                    </span>
                    <h5 className="text-xs font-black text-white uppercase tracking-tight truncate">
                      {course.title}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onClose();
                      onEnroll(course);
                    }}
                    className="px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer border border-blue-400/30"
                  >
                    {t.card.enrollBtn}
                  </button>
                  <button
                    onClick={() => onRemoveBookmark(course.id)}
                    className="p-1.5 rounded-full text-zinc-400 hover:text-red-400 hover:bg-white/10 transition-colors cursor-pointer"
                    title="Remove bookmark"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
