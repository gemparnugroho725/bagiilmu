import React from 'react';
import { Category, SubFilter } from '../types';
import { Language, translations } from '../lib/i18n';

interface FilterToolbarProps {
  activeCategory: Category;
  onSelectCategory: (cat: Category) => void;
  activeSubFilter: SubFilter;
  onSelectSubFilter: (sub: SubFilter) => void;
  activeLevelFilter: string;
  onSelectLevelFilter: (level: string) => void;
  matchCount: number;
  totalCatalogCount?: string;
  language: Language;
}

export const FilterToolbar: React.FC<FilterToolbarProps> = ({
  activeCategory,
  onSelectCategory,
  activeSubFilter,
  onSelectSubFilter,
  activeLevelFilter,
  onSelectLevelFilter,
  matchCount,
  totalCatalogCount = '2.480',
  language,
}) => {
  const t = translations[language];

  const categories: { id: Category; label: string; icon: string }[] = [
    { id: 'all', label: t.filters.allTracks, icon: 'apps' },
    { id: 'security', label: t.filters.cybersecurity, icon: 'verified_user' },
    { id: 'webdev', label: t.filters.webdev, icon: 'terminal' },
    { id: 'ai', label: t.filters.ai, icon: 'auto_awesome' },
    { id: 'design', label: t.filters.design, icon: 'palette' },
    { id: 'cloud', label: t.filters.cloud, icon: 'cloud_sync' },
    { id: 'mobile', label: t.filters.mobile, icon: 'smartphone' },
    { id: 'product', label: t.filters.product, icon: 'explore' },
  ];

  return (
    <section className="w-full bg-[#070b14] py-4 sm:py-5 border-y border-white/10 shadow-inner">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 flex flex-col gap-3.5 sm:gap-4">
        {/* Category Pills Horizontal Scroller */}
        <div 
          id="category-filter-rail"
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none snap-x touch-pan-x"
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer border min-h-[44px] snap-start shrink-0 ${
                  isActive
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_18px_rgba(37,99,235,0.45)]'
                    : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Secondary Sorting, Level Filter & Counter Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 border-t border-white/5 lg:border-t-0">
          {/* Matched Count */}
          <div className="flex items-center justify-between sm:justify-start gap-2.5">
            <span id="catalog-count-label" className="text-xs sm:text-sm font-black uppercase tracking-tight text-white">
              {activeCategory === 'all' && activeSubFilter === 'all' && activeLevelFilter === 'all'
                ? `${totalCatalogCount} ${t.filters.coursesMatched}`
                : `${matchCount} ${t.filters.coursesMatched}`}
            </span>
            <span className="text-[11px] sm:text-xs text-zinc-500 font-bold uppercase tracking-wider">
              • {t.filters.readyToStart}
            </span>
          </div>

          {/* Level Filter & Sub-Filter Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Level Selector */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 shrink-0">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                {t.filters.levelFilter}:
              </span>
              <select
                value={activeLevelFilter}
                onChange={(e) => onSelectLevelFilter(e.target.value)}
                className="bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-black uppercase tracking-wider text-white px-3 py-2 rounded-xl sm:rounded-full cursor-pointer focus:outline-none transition-colors min-h-[38px]"
              >
                <option value="all" className="bg-[#090d16] text-white">{t.filters.allLevels}</option>
                <option value="Beginner" className="bg-[#090d16] text-white">{t.filters.beginner}</option>
                <option value="Intermediate" className="bg-[#090d16] text-white">{t.filters.intermediate}</option>
                <option value="Advanced" className="bg-[#090d16] text-white">{t.filters.advanced}</option>
              </select>
            </div>

            {/* Sub-filters (All / Cert / Top Rated) */}
            <div className="inline-flex rounded-xl sm:rounded-full bg-white/5 p-1 border border-white/10 text-white overflow-x-auto max-w-full">
              <button
                id="view-all-filter"
                onClick={() => onSelectSubFilter('all')}
                className={`px-3 py-1.5 rounded-lg sm:rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                  activeSubFilter === 'all'
                    ? 'font-black bg-white text-black shadow-sm'
                    : 'font-bold text-zinc-400 hover:text-white'
                }`}
              >
                {t.filters.allCourses}
              </button>
              <button
                id="view-cert-filter"
                onClick={() => onSelectSubFilter('cert_only')}
                className={`px-3 py-1.5 rounded-lg sm:rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                  activeSubFilter === 'cert_only'
                    ? 'font-black bg-white text-black shadow-sm'
                    : 'font-bold text-zinc-400 hover:text-white'
                }`}
              >
                {t.filters.freeCertOnly}
              </button>
              <button
                id="view-top-filter"
                onClick={() => onSelectSubFilter('top_rated')}
                className={`px-3 py-1.5 rounded-lg sm:rounded-full text-xs uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap min-h-[36px] ${
                  activeSubFilter === 'top_rated'
                    ? 'font-black bg-white text-black shadow-sm'
                    : 'font-bold text-zinc-400 hover:text-white'
                }`}
              >
                {t.filters.topRatedOnly}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
