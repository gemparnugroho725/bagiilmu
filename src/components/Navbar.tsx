import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { Language, translations } from '../lib/i18n';

interface NavbarProps {
  currentView: 'public' | 'admin';
  onNavigate: (view: 'public' | 'admin') => void;
  onRequestSubmit?: () => void;
  onSearchFocus?: () => void;
  onFilterCategory?: (cat: string) => void;
  isAdminLoggedIn?: boolean;
  adminUsername?: string | null;
  onLogout?: () => void;
  language: Language;
  onSwitchLanguage: (lang: Language) => void;
  bookmarkedCount?: number;
  onOpenBookmarks?: () => void;
  onOpenDesignSpecs?: () => void;
  onOpenSettings?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  onRequestSubmit,
  onSearchFocus,
  isAdminLoggedIn = false,
  adminUsername = 'spar12',
  onLogout,
  language,
  onSwitchLanguage,
  bookmarkedCount = 0,
  onOpenBookmarks,
  onOpenDesignSpecs,
  onOpenSettings,
}) => {
  const t = translations[language];
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 bg-[#070b14]/95 backdrop-blur-md border-b border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.7)] transition-all">
        <div className="h-16 max-w-[1280px] mx-auto px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button 
              onClick={() => {
                onNavigate('public');
                closeMobileMenu();
              }}
              className="group focus:outline-none text-left cursor-pointer min-h-[44px] flex items-center"
              title="bagiilmu.id - Beranda"
            >
              <BrandLogo size="md" />
            </button>
            
            <span className="hidden xl:inline-flex items-center rounded-full bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-300">
              {t.brand.verifiedBadge}
            </span>
          </div>

          {/* Center Nav Links (Desktop & Tablet Wide) */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-6">
            <button
              onClick={() => {
                onNavigate('public');
                const el = document.getElementById('category-filter-rail');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="min-h-[44px] px-2 flex items-center text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.categories}
            </button>
            
            <button
              onClick={() => {
                onNavigate('public');
                const el = document.getElementById('view-top-filter');
                el?.click();
                const grid = document.getElementById('course-grid');
                grid?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="min-h-[44px] px-2 flex items-center text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.nav.topRated}
            </button>
            
            <button
              onClick={() => {
                onNavigate('public');
                onSearchFocus?.();
                const input = document.getElementById('main-course-search');
                input?.focus();
              }}
              className="min-h-[44px] px-2 flex items-center gap-1 text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[17px]">search</span>
              <span>{t.nav.browse}</span>
            </button>

            {/* Wireframes & Specs Button */}
            <button
              onClick={onOpenDesignSpecs}
              className="min-h-[44px] flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors cursor-pointer px-3 py-1.5 rounded-xl bg-blue-950/40 border border-blue-500/30 hover:border-blue-400/50"
              title="Lihat Wireframes & User Flows Prototype"
            >
              <span className="material-symbols-outlined text-[16px]">architecture</span>
              <span className="hidden lg:inline">{t.nav.designSpecs}</span>
              <span className="lg:hidden">Specs</span>
            </button>
          </nav>

          {/* Right CTA Actions: Language Switcher + Bookmarks + Settings + Mobile Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* PROMINENT LANGUAGE SWITCHER */}
            <div 
              id="homepage-language-switcher"
              className="inline-flex items-center p-0.5 rounded-full bg-white/5 border border-white/15 shadow-sm"
              title={t.nav.switchLanguage}
            >
              <button
                type="button"
                onClick={() => onSwitchLanguage('id')}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black transition-all cursor-pointer min-h-[36px] ${
                  language === 'id'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
                aria-label="Ganti ke Bahasa Indonesia"
              >
                <span>🇮🇩</span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase">ID</span>
              </button>
              <button
                type="button"
                onClick={() => onSwitchLanguage('en')}
                className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-black transition-all cursor-pointer min-h-[36px] ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-zinc-400 hover:text-white'
                }`}
                aria-label="Switch to English"
              >
                <span>🇬🇧</span>
                <span className="text-[10px] sm:text-[11px] font-black uppercase">EN</span>
              </button>
            </div>

            {/* Bookmarks Icon Button */}
            {onOpenBookmarks && (
              <button
                onClick={onOpenBookmarks}
                className="relative p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
                title={t.nav.bookmarks}
              >
                <span className="material-symbols-outlined text-[20px]">bookmark</span>
                {bookmarkedCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-black text-[10px] font-black flex items-center justify-center shadow-lg animate-pulse">
                    {bookmarkedCount}
                  </span>
                )}
              </button>
            )}

            {/* User Settings Modal Trigger */}
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-300 hover:text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px] hidden sm:flex items-center justify-center"
                title={t.nav.settings}
              >
                <span className="material-symbols-outlined text-[20px]">settings</span>
              </button>
            )}

            {/* Admin Logout only if logged in */}
            {isAdminLoggedIn && (
              <button
                onClick={onLogout}
                className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-red-300 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer min-h-[44px]"
                title={t.nav.logout}
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span>{t.nav.logout}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-zinc-200 hover:text-white transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
              aria-label="Toggle Mobile Menu"
            >
              <span className="material-symbols-outlined text-[24px]">
                {isMobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE & TABLET NAVIGATION DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex flex-col justify-between bg-[#070b14]/98 backdrop-blur-xl pt-20 px-6 pb-8 border-b border-white/15 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200 overflow-y-auto">
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-black uppercase tracking-widest text-zinc-400">
                Menu Navigasi
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-950 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider text-blue-300">
                Responsive Mobile
              </span>
            </div>

            <nav className="flex flex-col gap-2">
              <button
                onClick={() => {
                  onNavigate('public');
                  closeMobileMenu();
                  const el = document.getElementById('category-filter-rail');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-wider border border-white/10 text-left cursor-pointer min-h-[48px]"
              >
                <span className="material-symbols-outlined text-blue-400 text-[20px]">category</span>
                <span>{t.nav.categories}</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('public');
                  closeMobileMenu();
                  const el = document.getElementById('view-top-filter');
                  el?.click();
                  const grid = document.getElementById('course-grid');
                  grid?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-wider border border-white/10 text-left cursor-pointer min-h-[48px]"
              >
                <span className="material-symbols-outlined text-amber-400 text-[20px]">star</span>
                <span>{t.nav.topRated}</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('public');
                  closeMobileMenu();
                  onSearchFocus?.();
                  const input = document.getElementById('main-course-search');
                  input?.focus();
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-wider border border-white/10 text-left cursor-pointer min-h-[48px]"
              >
                <span className="material-symbols-outlined text-emerald-400 text-[20px]">search</span>
                <span>{t.nav.browse}</span>
              </button>

              <button
                onClick={() => {
                  closeMobileMenu();
                  onOpenDesignSpecs?.();
                }}
                className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-950/40 hover:bg-blue-900/50 text-blue-300 font-black text-xs uppercase tracking-wider border border-blue-500/30 text-left cursor-pointer min-h-[48px]"
              >
                <span className="material-symbols-outlined text-[20px]">architecture</span>
                <span>{t.nav.designSpecs}</span>
              </button>

              {onOpenSettings && (
                <button
                  onClick={() => {
                    closeMobileMenu();
                    onOpenSettings();
                  }}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-wider border border-white/10 text-left cursor-pointer min-h-[48px]"
                >
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                  <span>{t.nav.settings}</span>
                </button>
              )}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
            {isAdminLoggedIn ? (
              <button
                onClick={() => {
                  closeMobileMenu();
                  onLogout?.();
                }}
                className="w-full flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider min-h-[48px]"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                <span>{t.nav.logout}</span>
              </button>
            ) : (
              <div className="flex items-center justify-between text-xs text-zinc-400 font-bold uppercase tracking-wider px-2">
                <span>Portal Kurator:</span>
                <a 
                  href="/admin" 
                  onClick={closeMobileMenu}
                  className="text-blue-400 font-black hover:underline"
                >
                  /admin Login
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

