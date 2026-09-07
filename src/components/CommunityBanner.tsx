import React from 'react';
import { Language, translations } from '../lib/i18n';

interface CommunityBannerProps {
  onSubmitCourse: () => void;
  onBrowseSubmissions: () => void;
  language: Language;
}

export const CommunityBanner: React.FC<CommunityBannerProps> = ({
  onSubmitCourse,
  onBrowseSubmissions,
  language,
}) => {
  const t = translations[language];

  return (
    <section className="max-w-[1280px] mx-auto px-6 pb-16 w-full">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/80 via-[#070e1e] to-emerald-950/70 border border-blue-500/30 text-white p-8 md:p-12 shadow-2xl">
        {/* Ambient Blur Highlights */}
        <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-80 h-80 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text & Narrative */}
          <div className="lg:col-span-8 flex flex-col gap-4 text-left">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/15 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">
                group_work
              </span>
              <span className="text-[11px] font-black tracking-wider uppercase text-emerald-300">
                {t.community.badge}
              </span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight leading-tight">
              {t.community.title}
            </h2>

            <p className="text-sm sm:text-base text-zinc-300 max-w-2xl leading-relaxed font-normal">
              {t.community.desc}
            </p>

            {/* Metric Highlights Bar */}
            <div className="pt-2 flex flex-wrap items-center gap-5 text-xs font-bold">
              <div className="flex items-center gap-2 text-zinc-200">
                <span className="material-symbols-outlined text-[19px] text-blue-400">
                  library_books
                </span>
                <span className="font-black uppercase tracking-wider text-xs">
                  {t.community.curatedCoursesCount}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <span className="material-symbols-outlined text-[19px] text-purple-400">
                  diversity_3
                </span>
                <span className="font-black uppercase tracking-wider text-xs">
                  {t.community.contributorsCount}
                </span>
              </div>
              <div className="flex items-center gap-2 text-zinc-200">
                <span className="material-symbols-outlined text-[19px] text-emerald-400">
                  lock_open
                </span>
                <span className="font-black uppercase tracking-wider text-xs">
                  {t.community.freeGuarantee}
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-stretch justify-center gap-3">
            <button
              onClick={onSubmitCourse}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black uppercase tracking-wider px-6 py-3.5 shadow-lg shadow-emerald-500/25 active:scale-95 transition-all text-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              <span>{t.community.submitBtn}</span>
            </button>

            <button
              onClick={onBrowseSubmissions}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 transition-all text-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>{t.community.browseBtn}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
