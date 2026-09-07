import React, { useState } from 'react';
import { Category, PendingSubmission } from '../types';

interface CommunitySubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (submission: Omit<PendingSubmission, 'id' | 'status' | 'submittedTime'>) => Promise<void>;
  defaultAuthor?: string;
}

const CATEGORY_OPTIONS: { value: Category; label: string }[] = [
  { value: 'webdev', label: 'Web Development' },
  { value: 'ai', label: 'Data Science & AI' },
  { value: 'security', label: 'Cybersecurity' },
  { value: 'cloud', label: 'Cloud & DevOps' },
  { value: 'design', label: 'Design & UX' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'product', label: 'Product Management' },
];

const LEVEL_OPTIONS: { value: PendingSubmission['level']; label: string }[] = [
  { value: 'Beginner', label: 'Beginner / Pemula' },
  { value: 'Intermediate', label: 'Intermediate / Menengah' },
  { value: 'Advanced', label: 'Advanced / Mahir' },
  { value: 'All Levels', label: 'All Levels / Semua Tingkat' },
];

export const CommunitySubmissionModal: React.FC<CommunitySubmissionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  defaultAuthor = '',
}) => {
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState<Category>('webdev');
  const [level, setLevel] = useState<PendingSubmission['level']>('Intermediate');
  const [note, setNote] = useState('');
  const [author, setAuthor] = useState(defaultAuthor);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Dropdown Open States
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLevelOpen, setIsLevelOpen] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setAuthor(defaultAuthor);
    }
  }, [isOpen, defaultAuthor]);

  if (!isOpen) return null;

  const getCategoryLabel = (val: Category) => {
    return CATEGORY_OPTIONS.find((opt) => opt.value === val)?.label || val;
  };

  const getLevelLabel = (val: PendingSubmission['level']) => {
    return LEVEL_OPTIONS.find((opt) => opt.value === val)?.label || val;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim() || !provider.trim() || !author.trim()) {
      alert('Harap isi semua kolom wajib!');
      return;
    }

    setIsSubmitting(true);
    try {
      let categoryLabel = 'Web Development';
      if (category === 'ai') categoryLabel = 'Data Science & AI';
      else if (category === 'security') categoryLabel = 'Cybersecurity';
      else if (category === 'cloud') categoryLabel = 'Cloud & DevOps';
      else if (category === 'design') categoryLabel = 'Design & UX';
      else if (category === 'mobile') categoryLabel = 'Mobile Development';
      else if (category === 'product') categoryLabel = 'Product Management';

      await onSubmit({
        title: title.trim(),
        provider: provider.trim(),
        platform: provider.toLowerCase().replace(/\s+/g, '_'),
        url: url.trim(),
        category,
        categoryLabel,
        level,
        duration: 'Self-paced',
        hasCertificate: false,
        accessTier: 'audit_only',
        accessBadgeText: 'Free Access',
        description: note.trim() || `Kursus gratis berkualitas untuk belajar ${title}.`,
        skills: [categoryLabel],
        author: author.trim(),
        authorRole: 'Community Contributor',
        avatar: author.substring(0, 2).toUpperCase(),
        note: note.trim(),
      });

      // Reset
      setTitle('');
      setProvider('');
      setUrl('');
      setNote('');
      setAuthor('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#090d16] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] relative border border-white/15 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
              <span className="material-symbols-outlined text-[20px]">volunteer_activism</span>
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-white">
                Ajukan Kursus Baru
              </h3>
              <p className="text-[11px] text-zinc-400 font-medium">Community Course Submission</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
              Nama Pengaju (Ditinjau oleh Admin) <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Cahyo Kusuma"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
              Judul Kursus <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Full-Stack Modern React & Next.js 14"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Penyedia / Provider <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="YouTube / Coursera / edX"
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
              />
            </div>

            {/* Premium Custom Category Dropdown */}
            <div className="relative">
              <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
                Kategori Utama
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsLevelOpen(false);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs flex items-center justify-between hover:bg-white/10 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer text-left"
              >
                <span className="truncate">{getCategoryLabel(category)}</span>
                <span className="material-symbols-outlined text-[18px] text-zinc-500 shrink-0 transition-transform duration-200" style={{ transform: isCategoryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                  keyboard_arrow_down
                </span>
              </button>

              {isCategoryOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsCategoryOpen(false)} />
                  <ul className="absolute left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl bg-[#0e1320] border border-white/15 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.85)] z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          type="button"
                          onClick={() => {
                            setCategory(opt.value);
                            setIsCategoryOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                            category === opt.value
                              ? 'bg-blue-600 text-white'
                              : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <span>{opt.label}</span>
                          {category === opt.value && (
                            <span className="material-symbols-outlined text-[14px]">check</span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
              Tautan Langsung (Direct Link) <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
          </div>

          {/* Premium Custom Difficulty Level Dropdown */}
          <div className="relative">
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
              Tingkat Kesulitan
            </label>
            <button
              type="button"
              onClick={() => {
                setIsLevelOpen(!isLevelOpen);
                setIsCategoryOpen(false);
              }}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs flex items-center justify-between hover:bg-white/10 focus:outline-none focus:border-blue-500/50 transition-all cursor-pointer text-left"
            >
              <span className="truncate">{getLevelLabel(level)}</span>
              <span className="material-symbols-outlined text-[18px] text-zinc-500 shrink-0 transition-transform duration-200" style={{ transform: isLevelOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                keyboard_arrow_down
              </span>
            </button>

            {isLevelOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsLevelOpen(false)} />
                <ul className="absolute left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-xl bg-[#0e1320] border border-white/15 py-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.85)] z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  {LEVEL_OPTIONS.map((opt) => (
                    <li key={opt.value}>
                      <button
                        type="button"
                        onClick={() => {
                          setLevel(opt.value);
                          setIsLevelOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                          level === opt.value
                            ? 'bg-blue-600 text-white'
                            : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {level === opt.value && (
                          <span className="material-symbols-outlined text-[14px]">check</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-400 mb-1.5">
              Catatan Kenapa Kursus Ini Bermanfaat (Opsional)
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan secara singkat materi kursus gratis ini..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-blue-500/50 transition-colors resize-none"
            />
          </div>

          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-lg shadow-blue-600/20"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  <span>Mengirim...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  <span>Kirim Pengajuan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
