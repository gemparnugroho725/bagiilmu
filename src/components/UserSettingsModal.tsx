import React from 'react';
import { Language, translations } from '../lib/i18n';
import { BrandLogo } from './BrandLogo';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  cardDensity: 'comfortable' | 'compact';
  onSelectDensity: (density: 'comfortable' | 'compact') => void;
  showToast: (msg: string) => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  language,
  onSelectLanguage,
  cardDensity,
  onSelectDensity,
  showToast,
}) => {
  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#090d16] border border-white/15 rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <span className="material-symbols-outlined text-[20px]">tune</span>
            </span>
            <div>
              <h3 className="text-base font-black uppercase tracking-tight text-white">
                {t.settings.title}
              </h3>
              <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider block">
                bagiilmu.id User Preferences
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Setting 1: Language Switcher */}
        <div className="mb-6 space-y-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-blue-400">language</span>
            <span>{t.settings.languageTitle}</span>
          </label>
          <p className="text-xs text-zinc-400 font-normal leading-relaxed">
            {t.settings.languageDesc}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                onSelectLanguage('id');
                showToast('Bahasa diubah ke Bahasa Indonesia (Bawaan).');
              }}
              className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                language === 'id'
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">🇮🇩</span>
                {language === 'id' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </div>
              <span className="text-xs font-black">Bahasa Indonesia</span>
              <span className="text-[10px] text-zinc-400">Default untuk semua pengguna</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSelectLanguage('en');
                showToast('Language switched to English.');
              }}
              className={`p-3.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                language === 'en'
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">🇬🇧</span>
                {language === 'en' && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </div>
              <span className="text-xs font-black">English</span>
              <span className="text-[10px] text-zinc-400">Universal international access</span>
            </button>
          </div>
        </div>

        {/* Setting 2: Card Density */}
        <div className="mb-6 space-y-2.5">
          <label className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">view_compact</span>
            <span>{t.settings.densityTitle}</span>
          </label>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              type="button"
              onClick={() => onSelectDensity('comfortable')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                cardDensity === 'comfortable'
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {t.settings.densityComfortable}
            </button>
            <button
              type="button"
              onClick={() => onSelectDensity('compact')}
              className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                cardDensity === 'compact'
                  ? 'bg-emerald-600/20 border-emerald-500 text-white shadow-sm'
                  : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
              }`}
            >
              {t.settings.densityCompact}
            </button>
          </div>
        </div>

        {/* Brand Pledge Notice */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 mb-6 text-xs text-zinc-300">
          <span className="material-symbols-outlined text-[18px] text-blue-400 shrink-0 mt-0.5">
            verified
          </span>
          <p className="leading-relaxed font-normal">
            <strong className="text-white font-bold">bagiilmu.id</strong> adalah inisiatif pendidikan terbuka nirlaba tanpa biaya langganan, pelacakan data pribadi berlebih, atau paywall terselubung.
          </p>
        </div>

        {/* CTA */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-blue-400/30"
        >
          {t.settings.saveBtn}
        </button>
      </div>
    </div>
  );
};
