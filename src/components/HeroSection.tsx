import React from 'react';
import { Language, translations } from '../lib/i18n';

interface HeroSectionProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPlatform: string;
  onPlatformChange: (platform: string) => void;
  onSearchSubmit: () => void;
  language: Language;
  onOpenDesignSpecs?: () => void;
  totalCourses: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  onSearchChange,
  selectedPlatform,
  onPlatformChange,
  onSearchSubmit,
  language,
  onOpenDesignSpecs,
  totalCourses,
}) => {
  const t = translations[language];

  const trendingTags = [
    'Python',
    'Next.js 14',
    'Keamanan Siber',
    'Machine Learning',
    'UI/UX Figma',
    'Cloud AWS',
  ];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearchSubmit();
    }
  };

  return (
    <div className="relative w-full overflow-hidden">
      {/* Professional & Encouraging Ambient Glow Accents (Deep Cobalt & Emerald) */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[380px] bg-blue-600/15 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-4 right-1/4 translate-x-1/2 w-[550px] h-[380px] bg-emerald-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Hero Area Container */}
      <section className="max-w-[1280px] mx-auto px-6 pt-12 pb-16 w-full flex flex-col items-center text-center">
        {/* Trust Pill */}
        <div className="inline-flex items-center gap-2 bg-[#090d16]/80 border border-blue-500/30 px-4 py-1.5 rounded-full shadow-lg backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] text-white font-black uppercase tracking-wider">
            {t.hero.trustPill}
          </span>
          <span className="text-zinc-600">•</span>
          <span className="text-[11px] text-emerald-400 font-black uppercase tracking-wider">
            {language === 'id' 
              ? `${totalCourses} Kursus Gratis Terindeks` 
              : `${totalCourses} Free Courses Indexed`}
          </span>
        </div>

        {/* Headline */}
        <h1 className="mt-5 sm:mt-7 text-2xl sm:text-4xl md:text-5xl lg:text-[60px] xl:text-[64px] font-black uppercase tracking-tight text-white max-w-4xl leading-[1.1] sm:leading-[1.05]">
          {t.hero.headlinePrefix}{' '}
          <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
            {t.hero.headlineHighlight}
          </span>{' '}
          {t.hero.headlineSuffix}
        </h1>

        {/* Supporting Subtitle */}
        <p className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl leading-relaxed font-normal px-2">
          {t.hero.subtitle}
        </p>

        {/* Search Box Container */}
        <div className="mt-7 sm:mt-9 w-full max-w-3xl">
          <div className="bg-[#090d16] p-2.5 sm:p-2 rounded-2xl md:rounded-full shadow-2xl border border-blue-500/30 hover:border-blue-400/50 transition-all flex flex-col md:flex-row items-stretch md:items-center gap-2.5 sm:gap-2">
            {/* Input + Leading Icon */}
            <div className="flex items-center flex-1 w-full px-3 sm:px-4 py-1 sm:py-1.5 bg-white/5 md:bg-transparent rounded-xl md:rounded-none min-h-[44px]">
              <span className="material-symbols-outlined text-blue-400 text-[22px] sm:text-[24px] mr-2 select-none shrink-0">
                search
              </span>
              <input
                id="main-course-search"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t.hero.searchPlaceholder}
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder:text-zinc-500 focus:outline-none min-h-[40px]"
              />
              {searchQuery && (
                <button 
                  onClick={() => onSearchChange('')}
                  className="text-zinc-400 hover:text-white p-1 rounded-full cursor-pointer mr-1 shrink-0 min-w-[36px] min-h-[36px] flex items-center justify-center"
                  title={t.hero.clearSearch}
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              )}
            </div>

            {/* Platform Filter Select & Submit CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto justify-end pr-0 md:pr-1 pb-1 md:pb-0">
              <div className="relative inline-flex items-center w-full sm:w-auto">
                <select
                  id="platform-select"
                  aria-label="Select Learning Platform"
                  value={selectedPlatform}
                  onChange={(e) => onPlatformChange(e.target.value)}
                  className="w-full sm:w-auto appearance-none bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-wider text-white pl-3.5 pr-8 py-2.5 rounded-xl md:rounded-full cursor-pointer focus:outline-none transition-colors min-h-[44px]"
                >
                  <option value="all" className="bg-[#090d16] text-white">{t.hero.allPlatforms}</option>
                  <option value="coursera" className="bg-[#090d16] text-white">Coursera (Free Audit)</option>
                  <option value="edx" className="bg-[#090d16] text-white">edX / Harvard (Free Tracks)</option>
                  <option value="fcc" className="bg-[#090d16] text-white">freeCodeCamp (Certified)</option>
                  <option value="mit" className="bg-[#090d16] text-white">MIT OpenCourseWare</option>
                  <option value="aws" className="bg-[#090d16] text-white">AWS Skill Builder</option>
                </select>
                <span className="material-symbols-outlined absolute right-2.5 text-[18px] text-zinc-400 pointer-events-none">
                  expand_more
                </span>
              </div>

              <button
                id="search-btn"
                onClick={onSearchSubmit}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl md:rounded-full bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-6 py-2.5 shadow-lg shadow-blue-600/30 transition-all whitespace-nowrap cursor-pointer border border-blue-400/30 min-h-[44px]"
              >
                <span>{t.hero.findCoursesBtn}</span>
                <span className="material-symbols-outlined text-[16px] ml-1.5">arrow_forward</span>
              </button>
            </div>
          </div>

          {/* Trending Pills & Interactive Wireframe Button */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs">
            <span className="text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1 text-[10px] sm:text-[11px] w-full sm:w-auto justify-center mb-1 sm:mb-0">
              <span className="material-symbols-outlined text-[16px] text-emerald-400">trending_up</span>
              {t.hero.trending}
            </span>
            {trendingTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  onSearchChange(tag);
                  onSearchSubmit();
                }}
                className="trending-tag bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-zinc-300 font-black uppercase tracking-wider text-[10px] sm:text-[11px] px-3 py-1.5 rounded-full transition-colors cursor-pointer min-h-[36px] flex items-center"
              >
                {tag}
              </button>
            ))}

            {onOpenDesignSpecs && (
              <button
                onClick={onOpenDesignSpecs}
                className="mt-1 sm:mt-0 sm:ml-2 inline-flex items-center gap-1.5 bg-emerald-950/60 hover:bg-emerald-900/80 border border-emerald-500/40 text-emerald-300 font-black uppercase tracking-wider text-[10px] sm:text-[11px] px-3.5 py-1.5 rounded-full transition-all cursor-pointer shadow-sm min-h-[36px]"
              >
                <span className="material-symbols-outlined text-[14px]">view_quilt</span>
                <span>Wireframes &amp; User Flow v2.0</span>
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
