import React, { useState } from 'react';
import { Course, CuratorFormData } from '../types';
import { BrandLogo } from './BrandLogo';
import {
  AdminPendingSubmissions,
  PendingSubmission,
  INITIAL_PENDING_SUBMISSIONS,
} from './admin/AdminPendingSubmissions';
import { AdminCategoriesTags } from './admin/AdminCategoriesTags';
import { AdminPlatformIntegrations } from './admin/AdminPlatformIntegrations';
import { AdminAnalyticsLogs } from './admin/AdminAnalyticsLogs';
import { AdminSettings } from './admin/AdminSettings';

interface CuratorConsoleProps {
  onBackToCatalog: () => void;
  onPublishCourse: (newCourse: Course) => Promise<void> | void;
  courses?: Course[];
  onDeleteCourse?: (courseId: string) => Promise<void> | void;
  onClearDatabase?: () => Promise<void> | void;
  onResetToSample?: () => Promise<void> | void;
  adminUsername?: string;
  onLogout?: () => void;
}

export const CuratorConsole: React.FC<CuratorConsoleProps> = ({
  onBackToCatalog,
  onPublishCourse,
  courses = [],
  onDeleteCourse,
  onClearDatabase,
  onResetToSample,
  adminUsername = 'spar12',
  onLogout,
}) => {
  // Form state
  const [formData, setFormData] = useState<CuratorFormData>({
    title: 'Full-Stack Modern React & Next.js 14 Architecture',
    platform: 'freeCodeCamp',
    url: 'https://www.freecodecamp.org/learn/full-stack-developer/',
    instructor: 'MIT & Open Education Initiative',
    language: 'English',
    level: 'Intermediate',
    accessTier: '100% Free with Certificate',
    noCreditCardConfirmed: true,
    accessDuration: 'lifetime',
    primaryCategory: 'Web Development & Engineering',
    duration: '36 Jam (4-6 Minggu disarankan)',
    isSelfPaced: true,
    skills: ['React', 'TypeScript', 'Next.js 14', 'Tailwind CSS', 'Server Actions'],
    description:
      'Pelajari paradigma rekayasa web modern mulai dari fondasi React Server Components, optimasi caching Next.js App Router, hingga integrasi database Postgres dan arsitektur autentikasi nir-server. Dilengkapi 4 proyek mini industri dan 1 capstone project produksi nyata.',
    thumbnailUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDCMnQBVLBoDLS89x_cll6_VNujgzJ67uuZcmkYKLSwj-jZKl0X3MyO1wMr3aL98keIiVkcKNif7tThYVl7Iq6Sf4b5O7m8bW-xMPEZb97dcpdbV7IQmkpvC9O-AiRJdldnfLRmdg6u4IpaHlV_rct9ikAYkT3-N6eY-Tr2HrAWwMJs7ItIjm-rqxMi37eSPizjo0xARaKRrEq3mQs5A3ol6vv-AobvAXnaxVbnGA7ui5h5uQCluFO1',
    thumbnailFilename: 'react-next14-architecture-cover.webp',
  });

  const [newSkillTag, setNewSkillTag] = useState('');
  const [showAutoScrapeBanner, setShowAutoScrapeBanner] = useState(true);
  const [isScrapeModalOpen, setIsScrapeModalOpen] = useState(false);
  const [scrapeInputUrl, setScrapeInputUrl] = useState('https://www.edx.org/learn/computer-science/harvard-university-cs50');
  const [isExtracting, setIsExtracting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState('');
  const [deletingCourseId, setDeletingCourseId] = useState<string | null>(null);
  const [showToast, setShowToast] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Active sidebar nav
  const [activeNav, setActiveNav] = useState<
    'dashboard' | 'submit' | 'repo' | 'pending' | 'categories' | 'integrations' | 'analytics' | 'settings'
  >('dashboard');

  // Community pending submissions state (8 active community submissions)
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>(INITIAL_PENDING_SUBMISSIONS);

  // Community submission card state
  const [submissionStatus, setSubmissionStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const handleApproveSubmission = async (sub: PendingSubmission) => {
    const newCourse: Course = {
      id: `course-${Date.now()}`,
      title: sub.title,
      provider: sub.provider,
      platform: sub.platform,
      url: sub.url,
      image: sub.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRAhy1llol-QM2B2amETWfS9gB3Uf8o96k4QV0TNWuMZH0ICXndrPzkP7D9p6yPotI6z2y41Qd6M6iSJkE00RsQub5yorjy-fE3d6LiN8Pk3_qwHw9oLDezYzXLY4ZJCHjjmrt5YQyhbT44nr59sIrecHYUCAT3iRgcZ_7Mjbec31NKyyYA0jiwTvnCJSzXIc4R8vPw3rC2-adoLF3Gxu8fM0YCsaHI7difzlForJMPPHSrR4U7Sq8',
      imageAlt: sub.title,
      category: sub.category,
      categoryLabel: sub.categoryLabel,
      level: sub.level,
      duration: sub.duration,
      durationHours: 30,
      rating: 4.9,
      reviewCount: '1 (Baru)',
      hasCertificate: sub.hasCertificate,
      accessTier: sub.accessTier,
      accessBadgeText: sub.accessBadgeText,
      description: sub.description,
      skills: sub.skills,
    };

    await onPublishCourse(newCourse);
    setPendingSubmissions((prev) =>
      prev.map((s) => (s.id === sub.id ? { ...s, status: 'approved' } : s))
    );
    showToastNotification(`Kursus "${sub.title}" berhasil disetujui & dipublikasikan ke Firestore!`);
  };

  const handleRejectSubmission = (submissionId: string) => {
    setPendingSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'rejected' } : s))
    );
    showToastNotification('Submisi komunitas ditolak.');
  };

  const handleReviewInForm = (sub: PendingSubmission) => {
    setFormData({
      title: sub.title,
      platform: sub.provider,
      url: sub.url,
      instructor: sub.author,
      language: 'English',
      level: sub.level,
      accessTier: sub.hasCertificate ? '100% Free with Certificate' : 'Free Audit Only / No Free Certificate',
      noCreditCardConfirmed: true,
      accessDuration: 'lifetime',
      primaryCategory: sub.categoryLabel,
      duration: sub.duration,
      isSelfPaced: true,
      skills: sub.skills,
      description: sub.description,
      thumbnailUrl: sub.image || formData.thumbnailUrl,
      thumbnailFilename: 'community-submission-cover.webp',
    });
    setActiveNav('submit');
    showToastNotification(`Data submisi "${sub.title}" dimuat ke formulir kurasi!`);
  };

  const handleBatchApproveAll = async () => {
    const pendingOnly = pendingSubmissions.filter((s) => s.status === 'pending');
    for (const sub of pendingOnly) {
      const newCourse: Course = {
        id: `course-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: sub.title,
        provider: sub.provider,
        platform: sub.platform,
        url: sub.url,
        image: sub.image || formData.thumbnailUrl,
        imageAlt: sub.title,
        category: sub.category,
        categoryLabel: sub.categoryLabel,
        level: sub.level,
        duration: sub.duration,
        durationHours: 25,
        rating: 4.9,
        reviewCount: '1 (Baru)',
        hasCertificate: sub.hasCertificate,
        accessTier: sub.accessTier,
        accessBadgeText: sub.accessBadgeText,
        description: sub.description,
        skills: sub.skills,
      };
      await onPublishCourse(newCourse);
    }
    setPendingSubmissions((prev) =>
      prev.map((s) => (s.status === 'pending' ? { ...s, status: 'approved' } : s))
    );
    showToastNotification(`${pendingOnly.length} kursus komunitas disetujui & dipublikasikan ke Firestore!`);
  };

  // QA Checklist items
  const [qaItems, setQaItems] = useState([
    { id: 'qa-1', text: 'Link direct enrollment aktif', sub: 'Bebas link shortener spam, safelink, atau tautan pihak ketiga mencurigakan.', checked: true },
    { id: 'qa-2', text: 'Tanpa kartu kredit saat registrasi', sub: 'Pendaftaran langsung dengan email atau akun GitHub/Google.', checked: true },
    { id: 'qa-3', text: 'Resolusi thumbnail tajam', sub: 'Gambar rasio 16:9 berukuran minimal 1280×720 dengan rasio teks jelas.', checked: true },
    { id: 'qa-4', text: 'Silabus memiliki minimal 3 modul terstruktur', sub: 'Materi memiliki alur pembelajaran runtut dari konsep hingga implementasi proyek.', checked: true },
  ]);

  const toggleQaItem = (id: string) => {
    setQaItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const calculateQaScore = () => {
    const checkedCount = qaItems.filter((i) => i.checked).length;
    return Math.round((checkedCount / qaItems.length) * 100);
  };

  const handleAddSkill = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = newSkillTag.trim().replace(/^,|,$/g, '');
      if (trimmed && !formData.skills.includes(trimmed)) {
        setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
        setNewSkillTag('');
      }
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  // Auto-Scrape Extraction Simulation
  const handleAutoScrape = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setIsScrapeModalOpen(false);
      setFormData((prev) => ({
        ...prev,
        title: "CS50's Introduction to Computer Science & Python Programming",
        platform: 'Harvard Online',
        url: scrapeInputUrl,
        instructor: 'Prof. David J. Malan / Harvard University',
        accessTier: '100% Free with Certificate',
        level: 'Beginner',
        primaryCategory: 'Computer Science Core',
        duration: '10 Minggu (6-12 jam / minggu)',
        skills: ['C', 'Python', 'SQL', 'Algorithms', 'Data Structures', 'Flask'],
        description:
          "An introduction to the intellectual enterprises of computer science and the art of programming for majors and non-majors alike, with or without prior programming experience. Taught by David J. Malan.",
        thumbnailFilename: 'cs50-harvard-curriculum-cover.webp',
      }));
      showToastNotification('Metadata berhasil diekstrak dari tautan kursus!');
    }, 1200);
  };

  const showToastNotification = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 3500);
  };

  const handlePublish = async () => {
    if (!formData.title.trim()) {
      showToastNotification('Harap masukkan judul kursus!');
      return;
    }
    if (!formData.url.trim()) {
      showToastNotification('Harap masukkan direct URL kursus!');
      return;
    }

    setIsPublishing(true);
    try {
      // Determine category key
      let catKey: Course['category'] = 'webdev';
      const catLower = formData.primaryCategory.toLowerCase();
      if (catLower.includes('data') || catLower.includes('ai')) {
        catKey = 'ai';
      } else if (catLower.includes('security')) {
        catKey = 'security';
      } else if (catLower.includes('cloud')) {
        catKey = 'cloud';
      } else if (catLower.includes('design')) {
        catKey = 'design';
      } else if (catLower.includes('mobile')) {
        catKey = 'mobile';
      }

      const newCourse: Course = {
        id: `course-${Date.now()}`,
        title: formData.title.trim(),
        provider: formData.platform,
        platform: formData.platform.toLowerCase(),
        url: formData.url.trim(),
        image: formData.thumbnailUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRAhy1llol-QM2B2amETWfS9gB3Uf8o96k4QV0TNWuMZH0ICXndrPzkP7D9p6yPotI6z2y41Qd6M6iSJkE00RsQub5yorjy-fE3d6LiN8Pk3_qwHw9oLDezYzXLY4ZJCHjjmrt5YQyhbT44nr59sIrecHYUCAT3iRgcZ_7Mjbec31NKyyYA0jiwTvnCJSzXIc4R8vPw3rC2-adoLF3Gxu8fM0YCsaHI7difzlForJMPPHSrR4U7Sq8',
        imageAlt: formData.title,
        category: catKey,
        categoryLabel: formData.primaryCategory.split('&')[0].trim(),
        level: formData.level,
        duration: formData.duration,
        durationHours: 36,
        rating: 4.9,
        reviewCount: '1 (Baru)',
        hasCertificate: formData.accessTier.includes('Certificate'),
        accessTier: formData.accessTier.includes('Certificate') ? 'free_cert' : 'audit_only',
        accessBadgeText: formData.accessTier.includes('Certificate') ? 'Free Certificate' : 'Audit Only',
        description: formData.description,
        skills: formData.skills,
      };

      await onPublishCourse(newCourse);
      showToastNotification('Kursus berhasil disimpan permanen ke database Cloud Firestore!');
    } catch (err) {
      console.error(err);
      showToastNotification('Gagal menyimpan ke database Firestore. Coba lagi.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex bg-background min-h-screen">
      {/* Toast Alert */}
      {showToast && (
        <div className="fixed top-20 right-6 z-50 bg-on-surface text-surface-container-lowest px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-outline-variant/30 animate-in fade-in slide-in-from-top-4 duration-300">
          <span className="material-symbols-outlined text-emerald-400 text-[22px]">check_circle</span>
          <span className="text-sm font-semibold">{showToast}</span>
        </div>
      )}

      {/* Mobile Backdrop Overlay */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* LEFT NAVIGATION SIDEBAR (Curator Hub Console) */}
      <aside
        className={`fixed left-0 top-0 h-full w-72 bg-[#080808] border-r border-white/10 z-50 flex flex-col justify-between shadow-2xl transition-transform duration-300 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col">
          {/* Header Brand */}
          <div className="h-16 flex items-center justify-between px-5 border-b border-white/10">
            <div className="flex items-center gap-2">
              <BrandLogo size="sm" />
              <span className="px-1.5 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-[9px] font-black uppercase text-blue-300">
                Hub
              </span>
            </div>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="px-4 pt-5">
            <span className="px-2 text-[10px] font-black text-zinc-500 uppercase tracking-widest block mb-2.5">
              Navigation
            </span>
            <nav className="flex flex-col gap-1.5">
              <button
                onClick={() => {
                  setActiveNav('dashboard');
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors text-left cursor-pointer ${
                  activeNav === 'dashboard'
                    ? 'bg-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">space_dashboard</span>
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('submit');
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors text-left cursor-pointer ${
                  activeNav === 'submit'
                    ? 'bg-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">post_add</span>
                <span>Submit / Add Free Course</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('repo');
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors text-left cursor-pointer ${
                  activeNav === 'repo'
                    ? 'bg-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">auto_stories</span>
                <span>Course Repository</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('pending');
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors text-left cursor-pointer ${
                  activeNav === 'pending'
                    ? 'bg-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px]">pending_actions</span>
                  <span>Pending Submissions</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-[10px] font-black">
                  {pendingSubmissions.filter((s) => s.status === 'pending').length}
                </span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('categories');
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors text-left cursor-pointer ${
                  activeNav === 'categories'
                    ? 'bg-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">sell</span>
                <span>Categories &amp; Tags</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('integrations');
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors text-left cursor-pointer ${
                  activeNav === 'integrations'
                    ? 'bg-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">hub</span>
                <span>Platform Integrations</span>
              </button>

              <button
                onClick={() => {
                  setActiveNav('analytics');
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors text-left cursor-pointer ${
                  activeNav === 'analytics'
                    ? 'bg-blue-600 text-white font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] border border-blue-400/30'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-white font-bold'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">monitoring</span>
                <span>Analytics &amp; Audit Logs</span>
              </button>
            </nav>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <button
            onClick={() => {
              setActiveNav('settings');
              setIsMobileSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-colors text-left cursor-pointer ${
              activeNav === 'settings'
                ? 'bg-blue-600 text-white font-black'
                : 'text-zinc-400 hover:bg-white/5 hover:text-white font-bold'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">settings</span>
            <span>Settings</span>
          </button>

          <button
            onClick={onBackToCatalog}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-blue-300 bg-blue-600/15 border border-blue-500/30 hover:bg-blue-600/25 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            <span>Return to Catalog</span>
          </button>
        </div>
      </aside>

      {/* MAIN CURATOR CONTENT (Offset by lg:pl-72) */}
      <div className="pl-0 lg:pl-72 w-full flex flex-col min-h-screen">
        {/* Fixed Top Curator Bar */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#080808]/95 backdrop-blur-xl border-b border-white/10 z-40 flex items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Mobile Hamburger Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Buka Menu Navigasi"
            >
              <span className="material-symbols-outlined text-[20px]">menu</span>
            </button>

            <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-zinc-500 font-bold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[16px] text-blue-400">admin_panel_settings</span>
              <span>/</span>
              <span className="text-blue-400 font-black">/admin</span>
              <span>/</span>
              <span className="text-white font-black uppercase">
                {activeNav === 'dashboard' && 'Overview'}
                {activeNav === 'submit' && 'Submit Course'}
                {activeNav === 'repo' && 'Repository'}
                {activeNav === 'pending' && 'Pending Submissions'}
                {activeNav === 'categories' && 'Categories & Tags'}
                {activeNav === 'integrations' && 'Platform Integrations'}
                {activeNav === 'analytics' && 'Analytics & Logs'}
                {activeNav === 'settings' && 'Settings'}
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Database: Cloud Firestore (Online)</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={onBackToCatalog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-wider text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Buka Halaman Utama / Katalog Publik"
            >
              <span className="material-symbols-outlined text-[16px]">visibility</span>
              <span className="hidden md:inline">View Catalog (/)</span>
              <span className="md:hidden">Katalog</span>
            </button>

            <div className="h-5 w-px bg-white/10 hidden sm:block" />

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white border border-blue-400/40 text-xs font-black shadow-inner">
                {adminUsername ? adminUsername.slice(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-black uppercase tracking-wider text-white leading-tight">
                  {adminUsername}
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest mt-0.5">
                  /admin Verified
                </span>
              </div>
            </div>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-black uppercase tracking-wider border border-red-500/30 transition-colors cursor-pointer"
                title="Logout dari Portal Admin"
              >
                <span className="material-symbols-outlined text-[16px]">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Canvas */}
        <main className="w-full pt-20 pb-16 bg-[#050505] flex-1">
          <div className="max-w-[1400px] w-full mx-auto px-6 sm:px-8">
            {/* Top Action & Title Row */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-wider">
                    {activeNav === 'submit' && 'Portal Kurasi /admin'}
                    {activeNav === 'repo' && 'Database Repository'}
                    {activeNav === 'dashboard' && 'Admin Overview'}
                    {activeNav === 'pending' && 'Review Queue'}
                    {activeNav === 'categories' && 'Taksonomi & Tag'}
                    {activeNav === 'integrations' && 'Platform Connectors'}
                    {activeNav === 'analytics' && 'Telemetri & Logs'}
                    {activeNav === 'settings' && 'System Preferences'}
                  </span>
                  <span className="text-zinc-600 text-xs">•</span>
                  <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                    {activeNav === 'submit' ? 'Submit Course Hanya Bisa di /admin' : `Tersimpan: ${courses.length} Kursus Aktif`}
                  </span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black uppercase italic tracking-tighter text-white">
                  {activeNav === 'submit' && 'Input & Publish Free Course'}
                  {activeNav === 'repo' && 'Course Repository (Firestore)'}
                  {activeNav === 'dashboard' && 'Admin Overview & Database Health'}
                  {activeNav === 'pending' && 'Pending Community Submissions'}
                  {activeNav === 'categories' && 'Categories & Skill Tags'}
                  {activeNav === 'integrations' && 'Platform Integrations & APIs'}
                  {activeNav === 'analytics' && 'Analytics & Audit Logs'}
                  {activeNav === 'settings' && 'Console & Security Settings'}
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1 font-normal">
                  {activeNav === 'submit' && 'Verifikasi dan submit materi pembelajaran gratis langsung ke database Cloud Firestore'}
                  {activeNav === 'repo' && 'Daftar kursus real-time yang tersimpan di Cloud Firestore. Anda dapat mencari dan mengelola data di sini.'}
                  {activeNav === 'dashboard' && 'Status infrastruktur database Cloud Firestore, statistik agregasi kursus, dan kuota katalog'}
                  {activeNav === 'pending' && 'Tinjau submisi komunitas sebelum divalidasi dan disimpan permanen ke database'}
                  {activeNav === 'categories' && 'Kelola taksonomi hierarki kursus, tag keahlian spesifik, dan kata kunci filter publik'}
                  {activeNav === 'integrations' && 'Monitor koneksi scraper silabus, verifikator audit gratis LMS, dan database Cloud Firestore'}
                  {activeNav === 'analytics' && 'Pantau metrik direct enrollment, statistik kualitas zero-paywall, dan riwayat audit log'}
                  {activeNav === 'settings' && 'Konfigurasi parameter Quality Gate, aturan kurasi wajib, dan manajemen akun admin'}
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex items-center flex-wrap gap-2.5">
                {activeNav === 'submit' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => showToastNotification('Draf berhasil disimpan secara lokal!')}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-wider transition-colors border border-white/15 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px] text-zinc-400">bookmark</span>
                      <span>Save as Draft</span>
                    </button>

                    <button
                      id="btn-import-modal"
                      type="button"
                      onClick={() => setIsScrapeModalOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-blue-300 text-xs font-black uppercase tracking-wider transition-colors border border-white/20 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">auto_fix_high</span>
                      <span>Import via URL / Auto-Scrape</span>
                    </button>

                    <button
                      type="button"
                      disabled={isPublishing}
                      onClick={handlePublish}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,99,235,0.45)] hover:-translate-y-0.5 cursor-pointer border border-blue-400/30"
                    >
                      {isPublishing ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                          <span>Menyimpan ke Firestore...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">publish</span>
                          <span>Publish Course to Catalog</span>
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveNav('submit')}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(37,99,235,0.45)] cursor-pointer border border-blue-400/30"
                  >
                    <span className="material-symbols-outlined text-[18px]">add_circle</span>
                    <span>Submit Kursus Baru</span>
                  </button>
                )}
              </div>
            </div>

            {/* VIEW: COURSE REPOSITORY (activeNav === 'repo') */}
            {activeNav === 'repo' && (
              <div className="flex flex-col gap-6 mb-8">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0d0d0d] p-4 sm:p-6 rounded-2xl border border-white/15">
                  <div className="relative w-full sm:w-96">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-zinc-500">
                      search
                    </span>
                    <input
                      type="text"
                      value={repoSearchQuery}
                      onChange={(e) => setRepoSearchQuery(e.target.value)}
                      placeholder="Cari judul, platform, atau kategori di Firestore..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-zinc-400">
                    <span className="material-symbols-outlined text-blue-400 text-[18px]">database</span>
                    <span>{courses.length} Kursus di Cloud Firestore</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses
                    .filter((c) => {
                      if (!repoSearchQuery.trim()) return true;
                      const q = repoSearchQuery.toLowerCase();
                      return (
                        c.title.toLowerCase().includes(q) ||
                        c.provider.toLowerCase().includes(q) ||
                        c.categoryLabel.toLowerCase().includes(q)
                      );
                    })
                    .map((course) => (
                      <div
                        key={course.id}
                        className="bg-[#0d0d0d] rounded-2xl border border-white/15 p-5 flex flex-col justify-between gap-4 shadow-xl hover:border-white/30 transition-all"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="relative h-40 w-full overflow-hidden rounded-xl bg-zinc-900 border border-white/10">
                            <img
                              src={course.image}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                            <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/20">
                              {course.provider}
                            </span>
                            <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full bg-emerald-950/90 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                              {course.hasCertificate ? 'Free Cert' : 'Audit Free'}
                            </span>
                          </div>

                          <div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 block mb-1">
                              {course.categoryLabel}
                            </span>
                            <h3 className="text-base font-black uppercase tracking-tight text-white line-clamp-2 leading-snug">
                              {course.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-3 text-xs text-zinc-400 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1 text-amber-400">
                              <span className="material-symbols-outlined text-[16px]">star</span>
                              <span>{course.rating}</span>
                            </span>
                            <span>•</span>
                            <span>{course.level}</span>
                            <span>•</span>
                            <span>{course.duration}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-blue-400 hover:text-blue-300"
                          >
                            <span>Buka Link</span>
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          </a>

                          <button
                            type="button"
                            disabled={deletingCourseId === course.id}
                            onClick={async () => {
                              if (confirm(`Yakin ingin menghapus "${course.title}" dari database Cloud Firestore?`)) {
                                setDeletingCourseId(course.id);
                                try {
                                  await onDeleteCourse?.(course.id);
                                  showToastNotification(`Kursus "${course.title}" berhasil dihapus dari Cloud Firestore.`);
                                } catch (err) {
                                  console.error(err);
                                  showToastNotification('Gagal menghapus kursus dari database.');
                                } finally {
                                  setDeletingCourseId(null);
                                }
                              }
                            }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-red-950/50 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            <span>{deletingCourseId === course.id ? 'Menghapus...' : 'Hapus'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* VIEW: DASHBOARD OVERVIEW (activeNav === 'dashboard') */}
            {activeNav === 'dashboard' && (
              <div className="flex flex-col gap-8 mb-8">
                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/15 shadow-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-xs font-black uppercase tracking-wider">Total Kursus di Firestore</span>
                      <span className="material-symbols-outlined text-blue-400">inventory_2</span>
                    </div>
                    <span className="text-4xl font-black uppercase tracking-tighter text-white">{courses.length}</span>
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">sync</span>
                      Tersinkronisasi Real-Time
                    </span>
                  </div>

                  <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/15 shadow-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-xs font-black uppercase tracking-wider">Free Certificate Paths</span>
                      <span className="material-symbols-outlined text-emerald-400">verified</span>
                    </div>
                    <span className="text-4xl font-black uppercase tracking-tighter text-white">
                      {courses.filter((c) => c.hasCertificate).length}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-normal">Tersedia sertifikat tanpa biaya</span>
                  </div>

                  <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/15 shadow-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-xs font-black uppercase tracking-wider">Audit Only Tiers</span>
                      <span className="material-symbols-outlined text-purple-400">menu_book</span>
                    </div>
                    <span className="text-4xl font-black uppercase tracking-tighter text-white">
                      {courses.filter((c) => !c.hasCertificate).length}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-normal">Akses materi lengkap gratis</span>
                  </div>

                  <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/15 shadow-xl flex flex-col gap-2">
                    <div className="flex items-center justify-between text-zinc-400">
                      <span className="text-xs font-black uppercase tracking-wider">Penyedia / Universitas</span>
                      <span className="material-symbols-outlined text-amber-400">school</span>
                    </div>
                    <span className="text-4xl font-black uppercase tracking-tighter text-white">
                      {new Set(courses.map((c) => c.provider)).size}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-normal">MIT, Harvard, FCC, Coursera, edX</span>
                  </div>
                </div>

                {/* Database Infrastructure Status Panel */}
                <div className="bg-[#0d0d0d] p-8 rounded-2xl border border-white/15 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-[24px]">cloud_done</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-black uppercase tracking-tight text-white">
                        Cloud Firestore Infrastructure
                      </h2>
                      <p className="text-xs text-zinc-400 font-normal">
                        Database live yang mengelola persistensi data OpenCourse
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-bold text-zinc-400 uppercase tracking-wider">Project ID:</span>
                        <span className="font-mono text-white font-bold">gen-lang-client-0954371628</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-bold text-zinc-400 uppercase tracking-wider">Database Service:</span>
                        <span className="text-emerald-400 font-bold uppercase">Google Cloud Firestore</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-bold text-zinc-400 uppercase tracking-wider">Collection Name:</span>
                        <span className="font-mono text-white font-bold">courses</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-bold text-zinc-400 uppercase tracking-wider">Security Rule Access:</span>
                        <span className="text-blue-400 font-bold uppercase">Admin-Restricted (/admin writes)</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-bold text-zinc-400 uppercase tracking-wider">Client Listener:</span>
                        <span className="text-emerald-400 font-bold uppercase">Real-Time onSnapshot WebSocket</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/5">
                        <span className="font-bold text-zinc-400 uppercase tracking-wider">Sync State:</span>
                        <span className="text-white font-bold uppercase">Active &amp; Connected</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setActiveNav('submit')}
                      className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all border border-blue-400/30 cursor-pointer shadow-lg"
                    >
                      Buka Form Submit Kursus (/admin)
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveNav('repo')}
                      className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider transition-colors border border-white/20 cursor-pointer"
                    >
                      Buka Course Repository
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW: PENDING SUBMISSIONS (activeNav === 'pending') */}
            {activeNav === 'pending' && (
              <AdminPendingSubmissions
                submissions={pendingSubmissions}
                onApprove={handleApproveSubmission}
                onReject={handleRejectSubmission}
                onReviewInForm={handleReviewInForm}
                onBatchApproveAll={handleBatchApproveAll}
                showToastNotification={showToastNotification}
              />
            )}

            {/* VIEW: CATEGORIES & TAGS (activeNav === 'categories') */}
            {activeNav === 'categories' && (
              <AdminCategoriesTags
                courses={courses}
                showToastNotification={showToastNotification}
              />
            )}

            {/* VIEW: PLATFORM INTEGRATIONS (activeNav === 'integrations') */}
            {activeNav === 'integrations' && (
              <AdminPlatformIntegrations
                showToastNotification={showToastNotification}
              />
            )}

            {/* VIEW: ANALYTICS & AUDIT LOGS (activeNav === 'analytics') */}
            {activeNav === 'analytics' && (
              <AdminAnalyticsLogs
                courses={courses}
                showToastNotification={showToastNotification}
              />
            )}

            {/* VIEW: SETTINGS (activeNav === 'settings') */}
            {activeNav === 'settings' && (
              <AdminSettings
                adminUsername={adminUsername}
                courses={courses}
                onClearDatabase={onClearDatabase}
                onResetToSample={onResetToSample}
                showToastNotification={showToastNotification}
              />
            )}

            {/* VIEW: SUBMIT FORM (activeNav === 'submit') */}
            {activeNav === 'submit' && (
              <>

            {/* Auto-Extraction Engine Banner */}
            {showAutoScrapeBanner && (
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/40 via-[#0d0d0d] to-purple-950/40 p-4 sm:p-5 mb-6 shadow-xl border border-white/15">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-400">
                    <span className="material-symbols-outlined text-[22px]">smart_toy</span>
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">Auto-Extraction Engine Active</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 text-[10px] font-black uppercase tracking-wider border border-white/10">
                        Coursera, edX, MIT OCW, Harvard, YouTube
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-zinc-300 mt-1 leading-relaxed font-normal">
                      Tempel tautan kursus publik untuk secara otomatis mengekstrak metadata, silabus silang, nama instruktur, dan status lisensi Creative Commons/Audit gratis.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAutoScrapeBanner(false)}
                    className="text-zinc-400 hover:text-white text-[18px] p-1 rounded-md transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">close</span>
                  </button>
                </div>
              </div>
            )}

            {/* Main Grid (7 cols Form + 5 cols Sticky Preview) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: The Comprehensive Form (7 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                {/* SECTION 1: Basic Info */}
                <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 shadow-xl border border-white/15">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black border border-blue-400/30">
                      1
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-tight">
                        Informasi Dasar Kursus (Basic Info)
                      </h2>
                      <p className="text-xs text-zinc-400 font-normal">
                        Detail identifikasi utama dan sumber distribusi kursus
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Course Title */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5" htmlFor="course-title-input">
                        Judul Lengkap Kursus <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="course-title-input"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all border border-white/15 placeholder:text-zinc-600"
                        placeholder="e.g. CS50's Introduction to Computer Science"
                      />
                    </div>

                    {/* Platform & URL Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                      <div className="md:col-span-5">
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5" htmlFor="platform-select-form">
                          Platform Sumber <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="platform-select-form"
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            className="w-full appearance-none px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all border border-white/15 cursor-pointer"
                          >
                            <option value="MIT OpenCourseWare">MIT OpenCourseWare</option>
                            <option value="freeCodeCamp">freeCodeCamp</option>
                            <option value="Coursera">Coursera (Audit Tier)</option>
                            <option value="edX">edX (Free Audit)</option>
                            <option value="Harvard Online">Harvard Online</option>
                            <option value="YouTube">YouTube Open Curriculum</option>
                            <option value="Stanford Online">Stanford Online</option>
                            <option value="Kaggle">Kaggle Learn</option>
                            <option value="AWS Skill Builder">AWS Skill Builder</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none text-zinc-500">
                            expand_more
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-7">
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5" htmlFor="course-url-input">
                          Tautan Asli (Direct URL) <span className="text-red-500">*</span>
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-zinc-500">
                              link
                            </span>
                            <input
                              id="course-url-input"
                              type="url"
                              value={formData.url}
                              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all border border-white/15 placeholder:text-zinc-600"
                              placeholder="https://..."
                            />
                          </div>
                          <a
                            href={formData.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 shrink-0 transition-colors border border-white/10"
                            title="Uji Tautan Aktif"
                          >
                            <span className="material-symbols-outlined text-[16px] text-blue-400">open_in_new</span>
                            <span className="hidden sm:inline">Test</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Instructor & Language */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5" htmlFor="instructor-input">
                          Instruktur / Institusi Penyelenggara <span className="text-red-500">*</span>
                        </label>
                        <input
                          id="instructor-input"
                          type="text"
                          value={formData.instructor}
                          onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all border border-white/15 placeholder:text-zinc-600"
                          placeholder="e.g. Prof. David J. Malan / freeCodeCamp"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5" htmlFor="language-select">
                          Bahasa Pengantar &amp; Teks
                        </label>
                        <div className="relative">
                          <select
                            id="language-select"
                            value={formData.language}
                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                            className="w-full appearance-none px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all border border-white/15 cursor-pointer"
                          >
                            <option value="English">English (Subtitle Tersedia)</option>
                            <option value="Indonesian">Bahasa Indonesia</option>
                            <option value="Spanish">Spanish (Español)</option>
                            <option value="French">French (Français)</option>
                            <option value="German">German (Deutsch)</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none text-zinc-500">
                            translate
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Course Level Radio Buttons */}
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                        Tingkat Kesulitan (Difficulty Level)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {(['Beginner', 'Intermediate', 'Advanced', 'All Levels'] as const).map((lvl) => (
                          <label key={lvl} className="cursor-pointer">
                            <input
                              type="radio"
                              name="course-level"
                              value={lvl}
                              checked={formData.level === lvl}
                              onChange={() => setFormData({ ...formData, level: lvl })}
                              className="sr-only"
                            />
                            <div
                              className={`w-full py-2.5 px-3 rounded-xl text-center text-xs font-black uppercase tracking-wider transition-all border ${
                                formData.level === lvl
                                  ? 'bg-blue-600 text-white border-blue-400/40 shadow-[0_0_15px_rgba(37,99,235,0.35)]'
                                  : 'bg-black/50 text-zinc-400 border-white/10 hover:bg-white/5 hover:text-white'
                              }`}
                            >
                              {lvl === 'All Levels' ? 'Semua Level' : lvl}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Free Model & Access Tier */}
                <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 shadow-xl border border-white/15">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-xs font-black border border-purple-400/30">
                        2
                      </span>
                      <div>
                        <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-tight">
                          Status Gratis &amp; Model Akses
                        </h2>
                        <p className="text-xs text-zinc-400 font-normal">
                          Pastikan transparansi sertifikat dan kepatuhan anti-paywall
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-600/15 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      Zero-Paywall Policy
                    </span>
                  </div>

                  {/* 4 Access Tier Radio Cards */}
                  <div className="space-y-2.5 mb-5">
                    {/* Tier 1 */}
                    <label
                      className={`flex items-start p-4 rounded-xl transition-colors cursor-pointer group border ${
                        formData.accessTier === '100% Free with Certificate'
                          ? 'bg-blue-950/30 border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'bg-black/50 border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="radio"
                        name="access-tier"
                        value="100% Free with Certificate"
                        checked={formData.accessTier === '100% Free with Certificate'}
                        onChange={() => setFormData({ ...formData, accessTier: '100% Free with Certificate' })}
                        className="mt-1 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                            100% Free with Verified Certificate
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[9px] font-black uppercase tracking-wider">
                            Recommended
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed font-normal">
                          Siswa memperoleh materi lengkap, kuis penilaian, dan sertifikat kelulusan terverifikasi tanpa biaya apapun (e.g., freeCodeCamp, CS50 edX Free Certificate, Great Learning).
                        </p>
                      </div>
                    </label>

                    {/* Tier 2 */}
                    <label
                      className={`flex items-start p-4 rounded-xl transition-colors cursor-pointer group border ${
                        formData.accessTier === 'Free Audit Only / No Free Certificate'
                          ? 'bg-blue-950/30 border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'bg-black/50 border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="radio"
                        name="access-tier"
                        value="Free Audit Only / No Free Certificate"
                        checked={formData.accessTier === 'Free Audit Only / No Free Certificate'}
                        onChange={() => setFormData({ ...formData, accessTier: 'Free Audit Only / No Free Certificate' })}
                        className="mt-1 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0"
                      />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                            Free Audit Only (Tanpa Sertifikat Gratis)
                          </span>
                          <span className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-zinc-300 text-[9px] font-black uppercase tracking-wider">
                            Audit Mode
                          </span>
                        </div>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed font-normal">
                          Materi video dan tugas latihan dapat diakses gratis sepenuhnya, namun penerbitan sertifikat resmi memerlukan biaya terpisah (e.g., Coursera Audit, edX Free Tier).
                        </p>
                      </div>
                    </label>

                    {/* Tier 3 */}
                    <label
                      className={`flex items-start p-4 rounded-xl transition-colors cursor-pointer group border ${
                        formData.accessTier === 'Open Educational Resource (OER)'
                          ? 'bg-blue-950/30 border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'bg-black/50 border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="radio"
                        name="access-tier"
                        value="Open Educational Resource (OER)"
                        checked={formData.accessTier === 'Open Educational Resource (OER)'}
                        onChange={() => setFormData({ ...formData, accessTier: 'Open Educational Resource (OER)' })}
                        className="mt-1 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0"
                      />
                      <div className="ml-3 flex-1">
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                          Open Educational Resource (OER) / Public Domain
                        </span>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed font-normal">
                          Materi berlisensi terbuka (CC BY / CC0), lecture notes, slide PDF, kode sumber GitHub lengkap tanpa registrasi rumit (e.g., MIT OCW, Stanford Lagunita OER, YouTube DeepLearning).
                        </p>
                      </div>
                    </label>

                    {/* Tier 4 */}
                    <label
                      className={`flex items-start p-4 rounded-xl transition-colors cursor-pointer group border ${
                        formData.accessTier === 'Financial Aid Available'
                          ? 'bg-blue-950/30 border-blue-500/40 shadow-[0_0_15px_rgba(37,99,235,0.2)]'
                          : 'bg-black/50 border-white/10 hover:bg-white/5'
                      }`}
                    >
                      <input
                        type="radio"
                        name="access-tier"
                        value="Financial Aid Available"
                        checked={formData.accessTier === 'Financial Aid Available'}
                        onChange={() => setFormData({ ...formData, accessTier: 'Financial Aid Available' })}
                        className="mt-1 text-blue-500 focus:ring-blue-500 h-4 w-4 shrink-0"
                      />
                      <div className="ml-3 flex-1">
                        <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white group-hover:text-blue-400 transition-colors">
                          Financial Aid / Scholarship Guarantee Available
                        </span>
                        <p className="text-xs text-zinc-300 mt-1 leading-relaxed font-normal">
                          Platform menyediakan formulir bantuan finansial 100% dengan persetujuan mudah untuk pembelajar yang membutuhkan bantuan dana sertifikat.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Hidden Paywall & Duration Row */}
                  <div className="p-4 rounded-xl bg-black/60 space-y-3 border border-white/10">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={formData.noCreditCardConfirmed}
                        onChange={(e) => setFormData({ ...formData, noCreditCardConfirmed: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                        Konfirmasi Kurator: Bebas jebakan kartu kredit (No Credit Card Required)
                      </span>
                    </label>
                    <p className="text-xs text-zinc-400 pl-7 leading-relaxed font-normal">
                      Saya telah memeriksa secara langsung bahwa pendaftar dapat mulai belajar seketika tanpa memasukkan rincian metode pembayaran, tagihan terselubung, atau trial berbayar 7 hari otomatis.
                    </p>
                    <div className="pt-2 pl-7 flex items-center gap-4 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-wider text-zinc-400">Durasi Akses:</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                        <input
                          type="radio"
                          name="access-duration"
                          checked={formData.accessDuration === 'lifetime'}
                          onChange={() => setFormData({ ...formData, accessDuration: 'lifetime' })}
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        <span>Lifetime Free Access (Akses Selamanya)</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                        <input
                          type="radio"
                          name="access-duration"
                          checked={formData.accessDuration === 'promo'}
                          onChange={() => setFormData({ ...formData, accessDuration: 'promo' })}
                          className="text-blue-500 focus:ring-blue-500"
                        />
                        <span>Limited Free Cohort / Promo</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Metadata & Kurasi Konten */}
                <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 shadow-xl border border-white/15">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs font-black border border-blue-400/30">
                      3
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-tight">
                        Metadata &amp; Kurasi Konten
                      </h2>
                      <p className="text-xs text-zinc-400 font-normal">
                        Kategori, estimasi waktu belajar, dan sorotan silabus
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Category & Duration Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                      <div className="md:col-span-6">
                        <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5" htmlFor="primary-category">
                          Kategori Utama <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="primary-category"
                            value={formData.primaryCategory}
                            onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                            className="w-full appearance-none px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all border border-white/15 cursor-pointer"
                          >
                            <option value="Web Development & Engineering">Web Development &amp; Engineering</option>
                            <option value="Data Science & Artificial Intelligence">Data Science &amp; Artificial Intelligence</option>
                            <option value="Cybersecurity & Ethical Hacking">Cybersecurity &amp; Ethical Hacking</option>
                            <option value="Cloud Computing & DevOps">Cloud Computing &amp; DevOps</option>
                            <option value="UI/UX Design & Product Strategy">UI/UX Design &amp; Product Strategy</option>
                            <option value="Computer Science Core">Computer Science Fundamentals</option>
                          </select>
                          <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[20px] pointer-events-none text-zinc-500">
                            category
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-6">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="text-xs font-black uppercase tracking-wider text-zinc-300" htmlFor="duration-input">
                            Estimasi Waktu Belajar
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] text-zinc-400 font-bold uppercase">Self-paced</span>
                            <input
                              type="checkbox"
                              checked={formData.isSelfPaced}
                              onChange={(e) => setFormData({ ...formData, isSelfPaced: e.target.checked })}
                              className="rounded text-blue-500 focus:ring-blue-500 w-3.5 h-3.5"
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-zinc-500">
                            schedule
                          </span>
                          <input
                            id="duration-input"
                            type="text"
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                            className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all border border-white/15 placeholder:text-zinc-600"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Target Skills & Tags Chips */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-300">Target Keahlian &amp; Tags (Skills)</label>
                        <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Tekan Enter atau Komma</span>
                      </div>
                      <div className="p-3 rounded-xl bg-black/60 flex flex-wrap items-center gap-1.5 min-h-[48px] border border-white/15">
                        {formData.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white/10 text-blue-400 text-xs font-bold border border-white/15"
                          >
                            <span>{skill}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSkill(skill)}
                              className="hover:text-red-400 text-zinc-400 transition-colors cursor-pointer"
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </span>
                        ))}
                        <input
                          type="text"
                          value={newSkillTag}
                          onChange={(e) => setNewSkillTag(e.target.value)}
                          onKeyDown={handleAddSkill}
                          placeholder="+ Tambah skill..."
                          className="flex-1 min-w-[120px] bg-transparent text-white text-xs focus:outline-none px-2 py-0.5 placeholder:text-zinc-600"
                        />
                      </div>
                    </div>

                    {/* Description & Syllabus */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-black uppercase tracking-wider text-zinc-300" htmlFor="course-description">
                          Deskripsi Singkat &amp; Ikhtisar Silabus
                        </label>
                        <div className="flex items-center gap-1 text-zinc-500">
                          <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5">
                            <span className="material-symbols-outlined text-[16px]">format_bold</span>
                          </button>
                          <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5">
                            <span className="material-symbols-outlined text-[16px]">format_italic</span>
                          </button>
                          <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5">
                            <span className="material-symbols-outlined text-[16px]">format_list_bulleted</span>
                          </button>
                          <button type="button" className="p-1 hover:text-white rounded hover:bg-white/5">
                            <span className="material-symbols-outlined text-[16px]">code</span>
                          </button>
                        </div>
                      </div>
                      <textarea
                        id="course-description"
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-3.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all resize-y border border-white/15 leading-relaxed placeholder:text-zinc-600"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: Media & Thumbnail */}
                <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 shadow-xl border border-white/15">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 rounded-xl bg-zinc-800 text-white flex items-center justify-center text-xs font-black border border-white/15">
                      4
                    </span>
                    <div>
                      <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white leading-tight">
                        Media &amp; Sampul Thumbnail
                      </h2>
                      <p className="text-xs text-zinc-400 font-normal">
                        Rasio ideal 16:9 landscape dengan resolusi minimal 1280x720 piksel
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                    {/* Thumbnail Dropzone / Preview */}
                    <div className="sm:col-span-5 aspect-video rounded-xl bg-black/60 overflow-hidden relative group border border-white/15">
                      <img
                        src={formData.thumbnailUrl}
                        alt={formData.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white">
                        <button
                          type="button"
                          onClick={() => showToastNotification('Dialog unggah gambar siap!')}
                          className="p-2 rounded-full bg-white/20 text-white hover:bg-white/30 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => showToastNotification('Gambar reset')}
                          className="p-2 rounded-full bg-white/20 text-red-400 hover:bg-white/30 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>

                    {/* Upload Meta Details */}
                    <div className="sm:col-span-7 flex flex-col justify-center gap-2">
                      <div className="flex items-center gap-2 text-white">
                        <span className="material-symbols-outlined text-[20px] text-blue-400">check_circle</span>
                        <span className="text-xs font-black uppercase tracking-wider">{formData.thumbnailFilename}</span>
                      </div>
                      <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                        1920 × 1080 px • 142 KB • Format WebP optimal. Menampilkan kontras teks yang jelas untuk pembaca mobile.
                      </p>
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => showToastNotification('Buka file picker untuk mengganti gambar')}
                          className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-white/10"
                        >
                          <span className="material-symbols-outlined text-[16px]">upload_file</span>
                          <span>Ganti Gambar</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            showToastNotification('Berhasil mengenerate thumbnail via OpenGraph URL!');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-black/50 hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
                        >
                          Generate via OpenGraph
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sticky Live Preview & QA Checklist (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-6 lg:sticky lg:top-20">
                {/* BOX 1: Live Catalog Preview Card Replica */}
                <div className="bg-[#0d0d0d] rounded-2xl p-6 shadow-xl border border-white/15">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                      </span>
                      <span className="text-xs font-black uppercase tracking-wider text-white">Live Catalog Preview Card</span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-400 text-[10px] font-black uppercase tracking-wider border border-white/10">
                      Homepage View
                    </span>
                  </div>

                  {/* Public Course Card Component Replica */}
                  <div className="rounded-2xl overflow-hidden bg-black/60 p-4 transition-all duration-200 border border-white/15 hover:border-blue-500/40">
                    {/* 16:9 Thumbnail preview */}
                    <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-black">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCRAhy1llol-QM2B2amETWfS9gB3Uf8o96k4QV0TNWuMZH0ICXndrPzkP7D9p6yPotI6z2y41Qd6M6iSJkE00RsQub5yorjy-fE3d6LiN8Pk3_qwHw9oLDezYzXLY4ZJCHjjmrt5YQyhbT44nr59sIrecHYUCAT3iRgcZ_7Mjbec31NKyyYA0jiwTvnCJSzXIc4R8vPw3rC2-adoLF3Gxu8fM0YCsaHI7difzlForJMPPHSrR4U7Sq8"
                        alt="Course Preview"
                        className="w-full h-full object-cover"
                      />
                      {/* Provider Overlay */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/15">
                          <span className="material-symbols-outlined text-[13px] text-blue-400">school</span>
                          <span>{formData.platform}</span>
                        </span>
                      </div>
                      {/* Certificate / Audit Badge */}
                      <div className="absolute top-2.5 right-2.5">
                        {formData.accessTier.includes('Certificate') ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-950/90 backdrop-blur-md text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/40">
                            <span className="material-symbols-outlined text-[13px]">verified</span>
                            <span>Free Certificate</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-zinc-300 text-[10px] font-black uppercase tracking-wider border border-white/15">
                            <span>Audit Only</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Card Body Content */}
                    <div className="pt-4 flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1 text-blue-400 text-[11px] font-black uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[14px]">terminal</span>
                          <span>{formData.primaryCategory.split('&')[0].trim()}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                          <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                          <span>{formData.level}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-black uppercase tracking-tight text-white leading-snug line-clamp-2 hover:text-blue-400 transition-colors">
                        {formData.title}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal">
                        {formData.description}
                      </p>

                      {/* Meta Row: Rating, Hours */}
                      <div className="flex items-center justify-between pt-1 text-xs text-zinc-400">
                        <div className="flex items-center gap-1">
                          <span
                            className="material-symbols-outlined text-[15px] text-amber-400 fill-1"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                          <span className="font-black text-white">4.9</span>
                          <span className="text-zinc-500 text-[11px]">(1.2k)</span>
                        </div>
                        <div className="flex items-center gap-3 text-[11px] font-bold">
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-zinc-500">schedule</span>
                            <span>{formData.duration.split('(')[0].trim()}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px] text-zinc-500">all_inclusive</span>
                            <span>{formData.accessDuration === 'lifetime' ? 'Lifetime' : 'Cohort'}</span>
                          </span>
                        </div>
                      </div>

                      {/* Bottom CTA Shelf */}
                      <div className="pt-3 mt-1 border-t border-white/10 flex items-center justify-between">
                        <div>
                          <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block">Akses</span>
                          <span className="text-sm font-black uppercase tracking-tight text-blue-400">100% Gratis</span>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-500 transition-colors shadow-sm"
                        >
                          <span>Mulai</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* BOX 2: Admin Quality Assurance Checklist */}
                <div className="bg-[#0d0d0d] rounded-2xl p-6 shadow-xl border border-white/15">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[20px] text-blue-400">fact_check</span>
                      <h3 className="text-base font-black uppercase tracking-tight text-white">Kurasi Kualitas &amp; Kepatuhan</h3>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-white/10 text-zinc-300 font-black uppercase tracking-wider border border-white/10">
                      QA Matrix
                    </span>
                  </div>

                  {/* Quality Meter Progress Bar */}
                  <div className="mb-4 p-4 rounded-xl bg-black/60 border border-white/10">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-white font-black uppercase tracking-wider text-[11px]">Quality Signal Meter</span>
                      <span className="text-blue-400 font-black text-xs">
                        {calculateQaScore()}% ({calculateQaScore() >= 75 ? 'High Quality' : 'Needs Review'})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300"
                        style={{ width: `${calculateQaScore()}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed font-normal">
                      Memenuhi standar kurasi bebas iklan invasif &amp; materi lengkap berlisensi resmi.
                    </p>
                  </div>

                  {/* Interactive QA Checklist Items */}
                  <div className="space-y-2">
                    {qaItems.map((item) => (
                      <label
                        key={item.id}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/10"
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => toggleQaItem(item.id)}
                          className="mt-0.5 text-blue-500 focus:ring-blue-500 rounded"
                        />
                        <div className="text-white text-xs">
                          <span className="font-black uppercase tracking-wide block leading-tight text-[11px]">{item.text}</span>
                          <span className="text-zinc-400 text-[11px] leading-relaxed font-normal">{item.sub}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* BOX 3: Community Submission History Card */}
                <div className="bg-[#0d0d0d] rounded-2xl p-6 shadow-xl border border-white/15">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-purple-400">forum</span>
                      <span>Submisi Komunitas Terkait</span>
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        submissionStatus === 'approved'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : submissionStatus === 'rejected'
                          ? 'bg-red-950/80 text-red-300 border-red-500/40'
                          : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {submissionStatus === 'approved'
                        ? 'Approved'
                        : submissionStatus === 'rejected'
                        ? 'Rejected'
                        : 'Review Pending'}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-black/60 mb-3 border border-white/10">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xs">
                        B
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-black text-white leading-tight">@budi_dev</span>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Diajukan 2 jam yang lalu</span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300 italic leading-relaxed font-normal">
                      "Kursus ini baru saja diperbarui ke Next.js 14 App Router gratis di YouTube freeCodeCamp. Kualitas penjelasan server actions sangat aplikatif untuk mahasiswa."
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      disabled={submissionStatus !== 'pending'}
                      onClick={() => {
                        setSubmissionStatus('rejected');
                        showToastNotification('Submisi komunitas ditolak.');
                      }}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 text-center disabled:opacity-40 cursor-pointer border border-white/10"
                    >
                      <span className="material-symbols-outlined text-[16px]">close</span>
                      <span>Reject</span>
                    </button>
                    <button
                      type="button"
                      disabled={submissionStatus !== 'pending'}
                      onClick={() => {
                        setSubmissionStatus('approved');
                        showToastNotification('Submisi komunitas disetujui untuk dimasukkan ke antrean kurasi!');
                      }}
                      className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 text-center shadow-sm disabled:opacity-40 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Approve</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
          </div>
        </main>
      </div>

      {/* Auto-Scrape Modal Dialog */}
      {isScrapeModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-white/15 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-blue-400/30">
                  <span className="material-symbols-outlined text-[18px]">travel_explore</span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Auto-Scrape Course URL</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsScrapeModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed font-normal">
              Masukkan URL kursus dari Coursera, edX, Harvard Online, atau playlist YouTube. Mesin otomatis akan mengekstrak judul, durasi, lisensi gratis, dan foto sampul.
            </p>

            <div className="mb-5">
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5" htmlFor="modal-scrape-url">
                Direct Course Link
              </label>
              <div className="relative">
                <input
                  id="modal-scrape-url"
                  type="url"
                  value={scrapeInputUrl}
                  onChange={(e) => setScrapeInputUrl(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 border border-white/15 placeholder:text-zinc-600"
                  placeholder="https://www.edx.org/learn/computer-science/..."
                />
              </div>

              {/* Quick sample links */}
              <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-zinc-500 font-bold">
                <span className="uppercase tracking-wider">Sample:</span>
                <button
                  type="button"
                  onClick={() => setScrapeInputUrl('https://www.edx.org/learn/computer-science/harvard-university-cs50')}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Harvard CS50 (edX)
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setScrapeInputUrl('https://ocw.mit.edu/courses/6-0001-introduction-to-computer-science-and-programming-in-python-fall-2016/')}
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  MIT OCW Python
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsScrapeModalOpen(false)}
                className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleAutoScrape}
                disabled={isExtracting}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isExtracting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                    <span>Mengambil Data...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">bolt</span>
                    <span>Ekstrak Metadata</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
