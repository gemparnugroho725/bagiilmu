import React from 'react';
import { Course } from '../types';
import { Language, translations } from '../lib/i18n';

interface EnrollModalProps {
  course: Course | null;
  onClose: () => void;
  language: Language;
}

export const EnrollModal: React.FC<EnrollModalProps> = ({ course, onClose, language }) => {
  if (!course) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#090d16] rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative border border-blue-500/30 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <span className="material-symbols-outlined text-[20px]">school</span>
            </span>
            <div>
              <span className="text-[10px] text-zinc-400 font-black uppercase tracking-widest block">
                {course.provider} • {course.level}
              </span>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white leading-snug">
                {course.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Thumbnail preview */}
        <div className="aspect-video w-full rounded-xl overflow-hidden relative mb-4 border border-white/10">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2.5 right-2.5">
            {course.hasCertificate ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-500/40 backdrop-blur-md text-emerald-300 text-[10px] font-black uppercase tracking-wider shadow-md">
                <span className="material-symbols-outlined text-[13px]">workspace_premium</span>
                <span>{t.card.freeCert}</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-[#070b14]/90 border border-white/15 backdrop-blur-md text-zinc-300 text-[10px] font-black uppercase tracking-wider shadow-md">
                <span>{t.card.auditOnly}</span>
              </span>
            )}
          </div>
        </div>

        {/* Audit Instructions / Guarantee */}
        <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 mb-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-emerald-300 mb-1">
            <span className="material-symbols-outlined text-[16px] text-emerald-400">verified_user</span>
            <span>{t.enrollModal.guideTitle}</span>
          </div>
          <p className="text-xs text-zinc-300 leading-relaxed font-normal">
            {course.hasCertificate
              ? t.enrollModal.freeCertDesc
              : t.enrollModal.auditDesc}
          </p>
        </div>

        {/* 3 Step Guidance */}
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 mb-4 space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-white block">
            {t.enrollModal.stepsTitle}
          </span>
          <div className="space-y-1.5 text-xs text-zinc-300">
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-600/40 text-blue-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <span>{t.enrollModal.step1}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-600/40 text-blue-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <span>{t.enrollModal.step2}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-4 h-4 rounded-full bg-blue-600/40 text-blue-300 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <span>{t.enrollModal.step3}</span>
            </div>
          </div>
        </div>

        {/* Skills Pills */}
        <div className="mb-4">
          <span className="text-xs font-black uppercase tracking-wider text-zinc-400 block mb-1.5">
            {t.enrollModal.skillsTitle}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {course.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-zinc-300 font-bold uppercase tracking-wider text-[10px]"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <span className="text-[10px] text-zinc-400 font-medium hidden sm:inline">
            {t.enrollModal.guaranteeText}
          </span>
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              {t.enrollModal.closeBtn}
            </button>
            <a
              href={course.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-500 shadow-md shadow-blue-600/30 transition-all cursor-pointer border border-blue-400/30"
            >
              <span>{t.enrollModal.directEnrollBtn}</span>
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
