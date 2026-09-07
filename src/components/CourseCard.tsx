import React from 'react';
import { Course } from '../types';
import { Language, translations } from '../lib/i18n';

interface CourseCardProps {
  course: Course;
  onEnroll: (course: Course) => void;
  onDelete?: (courseId: string) => void;
  onEdit?: (course: Course) => void;
  isBookmarked?: boolean;
  onToggleBookmark?: (courseId: string) => void;
  language: Language;
  density?: 'comfortable' | 'compact';
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  onEnroll,
  onDelete,
  onEdit,
  isBookmarked = false,
  onToggleBookmark,
  language,
  density = 'comfortable',
}) => {
  const t = translations[language];

  // Dot color by provider platform
  const getProviderDotColor = (provider: string) => {
    if (provider.includes('freeCodeCamp')) return 'bg-emerald-400';
    if (provider.includes('Harvard') || provider.includes('edX')) return 'bg-blue-400';
    if (provider.includes('DeepLearning')) return 'bg-cyan-400';
    if (provider.includes('Google')) return 'bg-indigo-400';
    if (provider.includes('AWS')) return 'bg-amber-400';
    if (provider.includes('MIT')) return 'bg-red-400';
    return 'bg-blue-500';
  };

  const getDurationIcon = (duration: string) => {
    if (duration.toLowerCase().includes('week') || duration.toLowerCase().includes('minggu')) return 'calendar_today';
    if (duration.toLowerCase().includes('self') || duration.toLowerCase().includes('mandiri')) return 'bolt';
    return 'schedule';
  };

  // Localized level text
  const getLocalizedLevel = (lvl: string) => {
    if (language === 'en') return lvl;
    if (lvl.toLowerCase().includes('beginner')) return 'Pemula';
    if (lvl.toLowerCase().includes('intermediate')) return 'Menengah';
    if (lvl.toLowerCase().includes('advanced')) return 'Lanjutan';
    return 'Semua Tingkat';
  };

  const isCompact = density === 'compact';

  return (
    <article 
      className={`group flex flex-col justify-between bg-[#090d16] rounded-2xl ${isCompact ? 'p-4' : 'p-5 sm:p-6'} shadow-xl border border-white/10 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-200`}
      data-cat={course.category}
      data-cert={course.hasCertificate ? 'true' : 'false'}
    >
      <div>
        {/* Thumbnail Graphic Container */}
        <div className={`relative w-full ${isCompact ? 'aspect-[16/8]' : 'aspect-video'} rounded-xl overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center mb-3.5`}>
          <img
            src={course.image}
            alt={course.imageAlt || course.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
            loading="lazy"
            referrerPolicy="no-referrer"
          />

          {/* Provider Pill (Top Left) */}
          <div className="absolute top-2.5 left-2.5 bg-[#070b14]/90 backdrop-blur-sm border border-white/15 px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-md">
            <span className={`w-2 h-2 rounded-full ${getProviderDotColor(course.provider)}`} />
            <span className="text-[10px] font-black uppercase tracking-wider text-white">
              {course.provider}
            </span>
          </div>

          {/* Certificate / Audit Only Badge (Top Right) */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {course.hasCertificate ? (
              <div className="bg-emerald-950/95 border border-emerald-500/50 backdrop-blur-sm text-emerald-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
                <span>{t.card.freeCert}</span>
              </div>
            ) : (
              <div className="bg-[#070b14]/90 border border-white/15 backdrop-blur-sm text-zinc-300 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-md">
                {t.card.auditOnly}
              </div>
            )}
          </div>
        </div>

        {/* Metadata Pill Row */}
        <div className="flex items-center gap-2 text-xs text-zinc-400 mb-2">
          <span className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider text-[10px] text-white">
            {getLocalizedLevel(course.level)}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1 font-bold text-zinc-400 text-xs">
            <span className="material-symbols-outlined text-[13px] text-zinc-500">
              {getDurationIcon(course.duration)}
            </span>
            <span>{course.duration}</span>
          </span>
          {course.categoryLabel && (
            <>
              <span className="hidden sm:inline text-zinc-600">•</span>
              <span className="hidden sm:inline text-blue-400 font-black uppercase tracking-wider text-[11px]">
                {course.categoryLabel}
              </span>
            </>
          )}
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
          {course.title}
        </h2>

        {/* Description */}
        <p className={`mt-2 text-xs sm:text-sm text-zinc-400 ${isCompact ? 'line-clamp-1' : 'line-clamp-2'} leading-relaxed font-normal`}>
          {course.description}
        </p>

        {/* Skills Tags */}
        <div className="mt-3 flex flex-wrap gap-1">
          {course.skills.slice(0, 3).map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300 text-[10px] font-bold"
            >
              {skill}
            </span>
          ))}
          {course.skills.length > 3 && (
            <span className="px-1.5 py-0.5 text-zinc-500 text-[10px] font-bold">
              +{course.skills.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer Info & CTA */}
      <div className="mt-5 pt-3.5 -mx-5 sm:-mx-6 -mb-5 sm:-mb-6 px-5 sm:px-6 pb-5 rounded-b-2xl flex flex-col gap-4 border-t border-white/10 bg-white/[0.01]">
        <div className="flex items-center gap-1.5">
          <span
            className="material-symbols-outlined text-[18px] text-amber-400 fill-1"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            star
          </span>
          <span className="text-sm font-black text-white">{course.rating.toFixed(1)}</span>
          <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest ml-1">
            • {getLocalizedLevel(course.level)} • {course.duration}
          </span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-1">
            <button
              onClick={() => onEnroll(course)}
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-xs sm:text-[11px] font-black uppercase tracking-wider transition-colors cursor-pointer min-h-[44px] px-2 rounded-lg hover:bg-blue-500/10 active:scale-95"
            >
              <span>{language === 'id' ? 'BUKA LINK' : 'OPEN LINK'}</span>
              <span className="material-symbols-outlined text-[18px]">open_in_new</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(course.id)}
                className={`p-2.5 rounded-full border transition-all cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center active:scale-90 ${
                  isBookmarked 
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' 
                    : 'border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
                title={isBookmarked ? t.card.savedTooltip : t.card.saveTooltip}
              >
                <span 
                  className="material-symbols-outlined text-[20px]"
                  style={isBookmarked ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  bookmark
                </span>
              </button>
            )}

            {onEdit && (
              <button
                onClick={() => onEdit(course)}
                className="inline-flex items-center gap-1.5 border border-blue-500/40 hover:bg-blue-500/10 active:bg-blue-500/20 text-blue-400 text-xs sm:text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer min-h-[44px] active:scale-95"
                title={language === 'id' ? 'Edit data kursus' : 'Edit course data'}
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
                <span>{language === 'id' ? 'EDIT' : 'EDIT'}</span>
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => {
                  if (confirm(language === 'id' ? 'Hapus kursus ini?' : 'Delete this course?')) {
                    onDelete(course.id);
                  }
                }}
                className="inline-flex items-center gap-1.5 border border-red-500/40 hover:bg-red-500/10 active:bg-red-500/20 text-red-400 text-xs sm:text-[11px] font-black uppercase tracking-wider px-3.5 py-2 rounded-xl transition-all cursor-pointer min-h-[44px] active:scale-95"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>{language === 'id' ? 'HAPUS' : 'DELETE'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};
