import React, { useState, useMemo } from 'react';
import { Course, Category } from '../../types';

interface AdminCategoriesTagsProps {
  courses: Course[];
  onSelectCategoryFilter?: (cat: string) => void;
  showToastNotification: (msg: string) => void;
}

interface CategoryItem {
  id: string;
  key: Category;
  label: string;
  icon: string;
  description: string;
  badgeColor: string;
  isCustom?: boolean;
}

const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    key: 'webdev',
    label: 'Web Development',
    icon: 'code',
    description: 'HTML5, CSS3, JavaScript modern, React, Next.js, full-stack web architectures.',
    badgeColor: 'blue',
  },
  {
    id: 'cat-2',
    key: 'ai',
    label: 'Data Science & AI',
    icon: 'neurology',
    description: 'Machine Learning, Deep Neural Networks, PyTorch, LLMs, NLP, dan Data Analysis.',
    badgeColor: 'purple',
  },
  {
    id: 'cat-3',
    key: 'security',
    label: 'Cybersecurity',
    icon: 'shield',
    description: 'Ethical Hacking, OWASP Top 10, Network Defense, Cryptography, dan Penetration Testing.',
    badgeColor: 'rose',
  },
  {
    id: 'cat-4',
    key: 'cloud',
    label: 'Cloud & DevOps',
    icon: 'cloud',
    description: 'AWS, Google Cloud, Docker, Kubernetes, Terraform, dan CI/CD automation.',
    badgeColor: 'cyan',
  },
  {
    id: 'cat-5',
    key: 'design',
    label: 'Design & UX',
    icon: 'palette',
    description: 'UI/UX Design Systems, Figma, Wireframing, User Research, dan Accessibility.',
    badgeColor: 'amber',
  },
  {
    id: 'cat-6',
    key: 'mobile',
    label: 'Mobile Development',
    icon: 'smartphone',
    description: 'Flutter, React Native, Swift iOS, dan Kotlin Android development.',
    badgeColor: 'emerald',
  },
  {
    id: 'cat-7',
    key: 'product',
    label: 'Product & Management',
    icon: 'insights',
    description: 'Agile Scrum, Product Management, Tech Leadership, dan Business Analytics.',
    badgeColor: 'orange',
  },
];

export const AdminCategoriesTags: React.FC<AdminCategoriesTagsProps> = ({
  courses,
  showToastNotification,
}) => {
  const [categories, setCategories] = useState<CategoryItem[]>(INITIAL_CATEGORIES);
  const [selectedTagOrCategory, setSelectedTagOrCategory] = useState<string | null>(null);

  // New Category Form State
  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [newCatLabel, setNewCatLabel] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('folder');
  const [newCatDesc, setNewCatDesc] = useState('');

  // New Skill Tag State
  const [customTags, setCustomTags] = useState<string[]>([
    'Python', 'React', 'JavaScript', 'TypeScript', 'Docker', 'Kubernetes',
    'Machine Learning', 'Deep Learning', 'Figma', 'AWS', 'SQL', 'Git',
    'Rust', 'Cybersecurity', 'Algorithms', 'GraphQL', 'Next.js 14',
  ]);
  const [newTagInput, setNewTagInput] = useState('');
  const [tagSearchQuery, setTagSearchQuery] = useState('');

  // Calculate live course counts per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    courses.forEach((c) => {
      counts[c.category] = (counts[c.category] || 0) + 1;
    });
    return counts;
  }, [courses]);

  // Calculate live course counts per tag
  const tagCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    courses.forEach((c) => {
      c.skills.forEach((s) => {
        counts[s] = (counts[s] || 0) + 1;
      });
    });
    return counts;
  }, [courses]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatLabel.trim()) return;

    const newKey = newCatLabel.toLowerCase().replace(/[^a-z0-9]/g, '') as Category;
    const newCategory: CategoryItem = {
      id: `cat-${Date.now()}`,
      key: newKey,
      label: newCatLabel.trim(),
      icon: newCatIcon || 'category',
      description: newCatDesc.trim() || 'Kategori kursus edukasi publik.',
      badgeColor: 'blue',
      isCustom: true,
    };

    setCategories((prev) => [...prev, newCategory]);
    setNewCatLabel('');
    setNewCatDesc('');
    setIsAddCatOpen(false);
    showToastNotification(`Kategori "${newCategory.label}" berhasil ditambahkan!`);
  };

  const handleDeleteCategory = (id: string, label: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToastNotification(`Kategori "${label}" dihapus.`);
  };

  const handleAddSkillTag = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTagInput.trim().replace(/^#/, '');
    if (!trimmed) return;
    if (customTags.includes(trimmed)) {
      showToastNotification(`Tag "${trimmed}" sudah terdaftar.`);
      return;
    }
    setCustomTags((prev) => [trimmed, ...prev]);
    setNewTagInput('');
    showToastNotification(`Tag baru "${trimmed}" berhasil ditambahkan ke pustaka tag!`);
  };

  const handleDeleteSkillTag = (tag: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag));
    showToastNotification(`Tag "${tag}" dihapus.`);
  };

  // Filter courses for preview when category or tag selected
  const previewCourses = useMemo(() => {
    if (!selectedTagOrCategory) return [];
    return courses.filter((c) => {
      return (
        c.category === selectedTagOrCategory ||
        c.categoryLabel.toLowerCase() === selectedTagOrCategory.toLowerCase() ||
        c.skills.some((s) => s.toLowerCase() === selectedTagOrCategory.toLowerCase())
      );
    });
  }, [courses, selectedTagOrCategory]);

  const filteredTags = customTags.filter((t) =>
    t.toLowerCase().includes(tagSearchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-8 mb-12">
      {/* Overview Header */}
      <div className="bg-[#0d0d0d] p-6 sm:p-8 rounded-2xl border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
              Taxonomy &amp; Metadata Engine
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
              {categories.length} Kategori • {customTags.length} Skill Tags
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Kelola Kategori &amp; Tag Pustaka Kursus
          </h2>
          <p className="text-xs text-zinc-400 font-normal mt-1 max-w-2xl">
            Struktur taksonomi digunakan oleh filter katalog publik dan auto-extractor metadata saat kurasi kursus baru.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsAddCatOpen(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/30"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>Tambah Kategori Baru</span>
        </button>
      </div>

      {/* Add Category Modal */}
      {isAddCatOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 max-w-md w-full border border-white/20 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              <h3 className="text-lg font-black uppercase tracking-tight text-white">
                Buat Kategori Baru
              </h3>
              <button
                type="button"
                onClick={() => setIsAddCatOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-400 font-black uppercase tracking-wider mb-1">
                  Nama Kategori
                </label>
                <input
                  type="text"
                  required
                  value={newCatLabel}
                  onChange={(e) => setNewCatLabel(e.target.value)}
                  placeholder="e.g. Game Development, Data Engineering..."
                  className="w-full px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-black uppercase tracking-wider mb-1">
                  Ikon Material Symbol
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    placeholder="sports_esports, database, terminal..."
                    className="flex-1 px-3 py-2.5 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 font-mono"
                  />
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[20px]">{newCatIcon || 'folder'}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-black uppercase tracking-wider mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  rows={3}
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Penjelasan ringkas cakupan materi dalam kategori ini..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddCatOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider cursor-pointer shadow-md"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400 text-[20px]">category</span>
            <span>Daftar Kategori ({categories.length})</span>
          </h3>
          <span className="text-xs text-zinc-500 font-bold">
            Klik kartu kategori untuk melihat kursus terkait
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const count = categoryCounts[cat.key] || 0;
            const isSelected = selectedTagOrCategory === cat.key;
            return (
              <div
                key={cat.id}
                onClick={() => setSelectedTagOrCategory(isSelected ? null : cat.key)}
                className={`bg-[#0d0d0d] rounded-2xl border p-5 flex flex-col justify-between gap-3 cursor-pointer transition-all shadow-lg hover:-translate-y-0.5 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/20 shadow-[0_0_20px_rgba(37,99,235,0.3)]'
                    : 'border-white/15 hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/15 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[20px]">{cat.icon}</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-white text-[11px] font-black border border-white/10">
                      {count} Kursus
                    </span>
                  </div>

                  <h4 className="text-base font-black uppercase tracking-tight text-white mb-1">
                    {cat.label}
                  </h4>
                  <p className="text-xs text-zinc-400 font-normal line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-400">
                    {isSelected ? '✓ Aktif Ditampilkan' : 'Klik untuk Filter'}
                  </span>
                  {cat.isCustom && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteCategory(cat.id, cat.label);
                      }}
                      className="text-zinc-500 hover:text-red-400 p-1"
                      title="Hapus Kategori Custom"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Skill Tags Library Management */}
      <div className="bg-[#0d0d0d] p-6 sm:p-8 rounded-2xl border border-white/15 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-400 text-[20px]">label</span>
              <span>Pustaka Skill &amp; Technology Tags</span>
            </h3>
            <p className="text-xs text-zinc-400 font-normal mt-0.5">
              Tag digunakan saat autokomplit penginputan kursus dan pencarian cepat.
            </p>
          </div>

          <form onSubmit={handleAddSkillTag} className="flex items-center gap-2">
            <input
              type="text"
              value={newTagInput}
              onChange={(e) => setNewTagInput(e.target.value)}
              placeholder="Tambah tag baru (e.g. Svelte)..."
              className="px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500 w-56"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider cursor-pointer border border-purple-400/30 shrink-0"
            >
              + Tambah
            </button>
          </form>
        </div>

        {/* Tag search */}
        <div className="mb-4 flex items-center justify-between">
          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-zinc-500">
              search
            </span>
            <input
              type="text"
              value={tagSearchQuery}
              onChange={(e) => setTagSearchQuery(e.target.value)}
              placeholder="Cari tag..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder:text-zinc-600 focus:outline-none"
            />
          </div>
          <span className="text-xs text-zinc-500 font-bold">
            Total {filteredTags.length} tag terdaftar
          </span>
        </div>

        {/* Tags Cloud */}
        <div className="flex flex-wrap gap-2.5">
          {filteredTags.map((tag) => {
            const count = tagCounts[tag] || 0;
            const isSelected = selectedTagOrCategory === tag;
            return (
              <div
                key={tag}
                onClick={() => setSelectedTagOrCategory(isSelected ? null : tag)}
                className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-purple-600 text-white border-purple-400 shadow-md scale-105'
                    : 'bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white border-white/10'
                }`}
              >
                <span>#{tag}</span>
                {count > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-black text-purple-300">
                    {count}
                  </span>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSkillTag(tag);
                  }}
                  className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                  title="Hapus Tag"
                >
                  <span className="material-symbols-outlined text-[14px]">close</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Tag or Category Preview Panel */}
      {selectedTagOrCategory && (
        <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-blue-500/40 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400">filter_alt</span>
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                Kursus Terkait: <strong className="text-white font-black">{selectedTagOrCategory}</strong> ({previewCourses.length} ditemukan)
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTagOrCategory(null)}
              className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
            >
              Tutup Filter
            </button>
          </div>

          {previewCourses.length === 0 ? (
            <p className="text-xs text-zinc-500 italic py-4">
              Belum ada kursus di Cloud Firestore yang menggunakan tag atau kategori ini.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {previewCourses.map((c) => (
                <div
                  key={c.id}
                  className="bg-black/40 p-4 rounded-xl border border-white/10 flex flex-col justify-between gap-2"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1 text-[10px] font-bold text-zinc-400">
                      <span>{c.provider}</span>
                      <span className="text-blue-400">{c.categoryLabel}</span>
                    </div>
                    <h5 className="text-xs font-black uppercase text-white line-clamp-2">
                      {c.title}
                    </h5>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px]">
                    <span className="text-emerald-400 font-bold">
                      {c.hasCertificate ? 'Free Cert' : 'Audit Only'}
                    </span>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="text-blue-400 hover:underline flex items-center gap-0.5"
                    >
                      <span>Lihat Kursus</span>
                      <span className="material-symbols-outlined text-[12px]">open_in_new</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
