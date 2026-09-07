import React from 'react';
import { BrandLogo } from './BrandLogo';
import { Language, translations } from '../lib/i18n';

interface FooterProps {
  onOpenGuidelines?: () => void;
  language: Language;
  onOpenDesignSpecs?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenGuidelines, language, onOpenDesignSpecs }) => {
  const t = translations[language];

  const directories = [
    { label: 'MIT OpenCourseWare', url: 'https://ocw.mit.edu' },
    { label: 'Harvard Online', url: 'https://online-learning.harvard.edu' },
    { label: 'freeCodeCamp', url: 'https://www.freecodecamp.org' },
    { label: 'edX Free Tracks', url: 'https://www.edx.org' },
    { label: 'Coursera Audit', url: 'https://www.coursera.org' },
    { label: 'Stanford Engineering', url: 'https://online.stanford.edu' },
  ];

  return (
    <footer className="w-full bg-[#05070d] border-t border-white/10">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-5 flex flex-col items-start gap-4">
            <BrandLogo size="md" showTagline={true} />

            <p className="text-xs sm:text-sm text-zinc-400 max-w-sm leading-relaxed font-normal">
              {t.footer.desc}
            </p>

            <div className="inline-flex items-center gap-1.5 text-emerald-400 text-xs font-black uppercase tracking-wider">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>{t.footer.verifiedText}</span>
            </div>
          </div>

          {/* Aggregated Directories Col */}
          <div className="md:col-span-4 flex flex-col gap-3.5">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">
              {t.footer.directoriesTitle}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-zinc-400 font-bold uppercase tracking-wider">
              {directories.map((dir) => (
                <a
                  key={dir.label}
                  href={dir.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 group py-0.5"
                >
                  <span className="material-symbols-outlined text-[15px] text-zinc-500 group-hover:text-blue-400">
                    arrow_outward
                  </span>
                  <span>{dir.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Standards & Trust Col */}
          <div className="md:col-span-3 flex flex-col gap-3.5">
            <h3 className="text-xs font-black text-white uppercase tracking-widest">
              {t.footer.standardsTitle}
            </h3>
            <ul className="space-y-2 text-xs text-zinc-400 font-bold uppercase tracking-wider">
              <li>
                <button
                  onClick={onOpenGuidelines}
                  className="hover:text-white transition-colors cursor-pointer text-left py-0.5"
                >
                  {t.footer.guidelines}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGuidelines}
                  className="hover:text-white transition-colors cursor-pointer text-left py-0.5"
                >
                  {t.footer.curationCriteria}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenGuidelines}
                  className="hover:text-white transition-colors cursor-pointer text-left py-0.5"
                >
                  {t.footer.privacy}
                </button>
              </li>
              {onOpenDesignSpecs && (
                <li>
                  <button
                    onClick={onOpenDesignSpecs}
                    className="hover:text-blue-400 text-blue-400/90 transition-colors cursor-pointer text-left py-0.5 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">architecture</span>
                    <span>Wireframes &amp; User Flow Specs</span>
                  </button>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
          <p>© {new Date().getFullYear()} bagiilmu.id. {t.footer.copyright}</p>
          <p className="text-[11px] text-zinc-400">{t.footer.madeFor}</p>
        </div>
      </div>
    </footer>
  );
};
