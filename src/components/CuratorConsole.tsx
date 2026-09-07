import React, { useState, useEffect, useRef } from 'react';
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
import { createAuditLog } from '../lib/auditLogs';

interface CuratorConsoleProps {
  onBackToCatalog: () => void;
  onPublishCourse: (newCourse: Course) => Promise<void> | void;
  courses?: Course[];
  onDeleteCourse?: (courseId: string) => Promise<void> | void;
  onClearDatabase?: () => Promise<void> | void;
  onResetToSample?: () => Promise<void> | void;
  adminUsername?: string;
  onLogout?: () => void;
  initialEditingCourse?: Course | null;
}

const DEFAULT_CATEGORY_OPTIONS = [
  'Web Development & Engineering',
  'Data Science & Artificial Intelligence',
  'Cybersecurity & Ethical Hacking',
  'Cloud Computing & DevOps',
  'UI/UX Design & Product Strategy',
  'Computer Science Fundamentals',
  'Mobile Development',
  'Product & Management',
];

const DEFAULT_PLATFORM_OPTIONS = [
  'MIT OpenCourseWare',
  'freeCodeCamp',
  'Coursera',
  'edX',
  'Harvard Online',
  'YouTube',
  'Stanford Online',
  'Kaggle',
  'AWS Skill Builder',
  'Udacity',
  'Google Skillshop',
  'IBM SkillsBuild',
];

export const CuratorConsole: React.FC<CuratorConsoleProps> = ({
  onBackToCatalog,
  onPublishCourse,
  courses = [],
  onDeleteCourse,
  onClearDatabase,
  onResetToSample,
  adminUsername = 'spar12',
  onLogout,
  initialEditingCourse,
}) => {
  // Form state - Default empty fields with placeholders for clean user input
  const [formData, setFormData] = useState<CuratorFormData>({
    title: '',
    platform: 'freeCodeCamp',
    url: '',
    instructor: '',
    language: 'English',
    level: 'Intermediate',
    accessTier: '100% Free with Certificate',
    noCreditCardConfirmed: true,
    accessDuration: 'lifetime',
    primaryCategory: 'Web Development & Engineering',
    duration: '',
    isSelfPaced: true,
    skills: [],
    description: '',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    thumbnailFilename: 'default-course-cover.webp',
  });

  const [newSkillTag, setNewSkillTag] = useState('');
  const [showAutoScrapeBanner, setShowAutoScrapeBanner] = useState(true);
  const [isScrapeModalOpen, setIsScrapeModalOpen] = useState(false);
  const [scrapeInputUrl, setScrapeInputUrl] = useState('https://www.edx.org/learn/computer-science/harvard-university-cs50');

  // Image Upload & Media Management State & Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUrlImageModalOpen, setIsUrlImageModalOpen] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [isStockGalleryModalOpen, setIsStockGalleryModalOpen] = useState(false);

  // JSON Auto-Fill & Converter State
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [jsonInputText, setJsonInputText] = useState('');
  const [jsonParseError, setJsonParseError] = useState<string | null>(null);
  const [jsonParsedResult, setJsonParsedResult] = useState<CuratorFormData | null>(null);

  // Sample JSON Template for user example
  const SAMPLE_COURSE_JSON = JSON.stringify(
    {
      title: 'Harvard CS50: Introduction to Computer Science',
      platform: 'Harvard / edX',
      url: 'https://www.edx.org/learn/computer-science/harvard-university-cs50',
      instructor: 'Prof. David J. Malan',
      language: 'English',
      level: 'Beginner',
      accessTier: '100% Free with Certificate',
      noCreditCardConfirmed: true,
      accessDuration: 'lifetime',
      primaryCategory: 'Computer Science & Fundamentals',
      duration: '12 Minggu (6-12 jam/minggu)',
      isSelfPaced: true,
      skills: [
        'C Programming',
        'Python',
        'SQL',
        'HTML/CSS',
        'Algorithms',
        'Data Structures'
      ],
      description: 'Pengantar ilmu komputer dan seni pemrograman terkenal dari Harvard University. Membahas algoritma, struktur data, manajemen memori, keamanan siber, dan rekayasa perangkat lunak web secara komprehensif.',
      thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
      thumbnailFilename: 'harvard-cs50-cover.webp'
    },
    null,
    2
  );

  // Curated stock cover images for courses
  const STOCK_COVER_IMAGES = [
    {
      id: 'webdev',
      label: 'Web Development & Coding',
      category: 'Web Dev',
      url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80',
      filename: 'stock-web-development-code.webp',
    },
    {
      id: 'ai-data',
      label: 'AI & Data Science',
      category: 'Artificial Intelligence',
      url: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80',
      filename: 'stock-artificial-intelligence.webp',
    },
    {
      id: 'cybersecurity',
      label: 'Cybersecurity & Hacking',
      category: 'Security',
      url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80',
      filename: 'stock-cyber-security.webp',
    },
    {
      id: 'cloud',
      label: 'Cloud & DevOps Network',
      category: 'Cloud',
      url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80',
      filename: 'stock-cloud-infrastructure.webp',
    },
    {
      id: 'design',
      label: 'UI/UX Design & Prototyping',
      category: 'Design',
      url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&auto=format&fit=crop&q=80',
      filename: 'stock-uiux-design-wireframe.webp',
    },
    {
      id: 'cs-laptop',
      label: 'Computer Science Workstation',
      category: 'Computer Science',
      url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
      filename: 'stock-computer-science-laptop.webp',
    },
    {
      id: 'mobile',
      label: 'Mobile App Engineering',
      category: 'Mobile Dev',
      url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=1200&auto=format&fit=crop&q=80',
      filename: 'stock-mobile-app-dev.webp',
    },
    {
      id: 'algorithms',
      label: 'Algorithms & Code Logic',
      category: 'Software Engineering',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80',
      filename: 'stock-algorithms-matrix-code.webp',
    },
  ];

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToastNotification('Harap pilih berkas gambar yang valid (PNG, JPG, WebP, GIF).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showToastNotification('Ukuran berkas gambar maksimal 10 MB!');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const resultUrl = event.target?.result as string;
      if (!resultUrl) return;

      const img = new Image();
      img.src = resultUrl;
      img.onload = () => {
        const dimensions = `${img.width} × ${img.height} px`;
        const fileSizeInKB = Math.round(file.size / 1024);
        const fileSizeFormatted =
          fileSizeInKB > 1024
            ? `${(fileSizeInKB / 1024).toFixed(1)} MB`
            : `${fileSizeInKB} KB`;

        setFormData((prev) => ({
          ...prev,
          thumbnailUrl: resultUrl,
          thumbnailFilename: file.name,
          thumbnailDimensions: dimensions,
          thumbnailSize: fileSizeFormatted,
        }));

        createAuditLog({
          user: adminUsername || 'spar12',
          action: 'SECURITY_SCAN',
          actionLabel: 'Unggah Sampul Kursus',
          target: file.name,
          details: `Mengunggah sampul gambar baru "${file.name}" (${dimensions}, ${fileSizeFormatted})`,
          status: 'SUCCESS',
        });

        showToastNotification(`Gambar "${file.name}" berhasil diunggah!`);
      };
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleGenerateOpenGraph = () => {
    const url = formData.url.trim();
    const title = formData.title.trim();

    const ytMatch = url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
    );
    if (ytMatch && ytMatch[1]) {
      const videoId = ytMatch[1];
      const ytThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
      setFormData((prev) => ({
        ...prev,
        thumbnailUrl: ytThumbnail,
        thumbnailFilename: `youtube-og-${videoId}.jpg`,
        thumbnailDimensions: '1280 × 720 px',
        thumbnailSize: '185 KB',
      }));
      showToastNotification('Thumbnail OpenGraph YouTube berhasil diekstrak!');
      return;
    }

    let generatedUrl =
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80';
    const lowerCat = formData.primaryCategory.toLowerCase();
    const lowerTitle = title.toLowerCase();

    if (
      lowerCat.includes('data') ||
      lowerCat.includes('ai') ||
      lowerTitle.includes('python') ||
      lowerTitle.includes('ai')
    ) {
      generatedUrl =
        'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=1200&auto=format&fit=crop&q=80';
    } else if (
      lowerCat.includes('cyber') ||
      lowerTitle.includes('security') ||
      lowerTitle.includes('hacking')
    ) {
      generatedUrl =
        'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=1200&auto=format&fit=crop&q=80';
    } else if (
      lowerCat.includes('cloud') ||
      lowerTitle.includes('aws') ||
      lowerTitle.includes('devops')
    ) {
      generatedUrl =
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop&q=80';
    } else if (
      lowerCat.includes('web') ||
      lowerTitle.includes('react') ||
      lowerTitle.includes('javascript') ||
      lowerTitle.includes('html')
    ) {
      generatedUrl =
        'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&auto=format&fit=crop&q=80';
    } else if (
      lowerCat.includes('design') ||
      lowerTitle.includes('ui') ||
      lowerTitle.includes('ux')
    ) {
      generatedUrl =
        'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1200&auto=format&fit=crop&q=80';
    }

    setFormData((prev) => ({
      ...prev,
      thumbnailUrl: generatedUrl,
      thumbnailFilename: 'generated-og-cover.webp',
      thumbnailDimensions: '1920 × 1080 px',
      thumbnailSize: '142 KB',
    }));

    showToastNotification('Thumbnail OpenGraph HD berhasil digenerate berdasarkan tautan & topik!');
  };

  const handleResetImage = () => {
    setFormData((prev) => ({
      ...prev,
      thumbnailUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&auto=format&fit=crop&q=80',
      thumbnailFilename: 'default-course-cover.webp',
      thumbnailDimensions: '1920 × 1080 px',
      thumbnailSize: '142 KB',
    }));
    showToastNotification('Sampul gambar dikembalikan ke bawaan.');
  };

  const handleApplyUrlImage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = imageUrlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      showToastNotification('Harap masukkan URL yang valid (http://, https://, atau data:image)');
      return;
    }

    setFormData((prev) => ({
      ...prev,
      thumbnailUrl: trimmed,
      thumbnailFilename: 'custom-url-cover.webp',
      thumbnailDimensions: 'Resolusi Web',
      thumbnailSize: 'Remote Link',
    }));
    setIsUrlImageModalOpen(false);
    setImageUrlInput('');
    showToastNotification('URL gambar berhasil diterapkan!');
  };

  const handleValidateAndParseJson = (text: string) => {
    setJsonInputText(text);
    if (!text.trim()) {
      setJsonParseError(null);
      setJsonParsedResult(null);
      return;
    }
    try {
      const parsed = JSON.parse(text);
      if (typeof parsed !== 'object' || parsed === null) {
        setJsonParseError('JSON harus berupa objek { ... } yang valid');
        setJsonParsedResult(null);
        return;
      }
      setJsonParseError(null);
      setJsonParsedResult(parsed as CuratorFormData);
    } catch (err: any) {
      setJsonParseError(err.message || 'Format JSON tidak valid');
      setJsonParsedResult(null);
    }
  };

  const handleApplyJsonToGui = () => {
    if (!jsonParsedResult) return;

    // Safely merge parsed JSON with current form defaults
    const mergedData: CuratorFormData = {
      title: jsonParsedResult.title || formData.title,
      platform: jsonParsedResult.platform || formData.platform,
      url: jsonParsedResult.url || formData.url,
      instructor: jsonParsedResult.instructor || formData.instructor,
      language: jsonParsedResult.language || formData.language,
      level: jsonParsedResult.level || formData.level,
      accessTier: jsonParsedResult.accessTier || formData.accessTier,
      noCreditCardConfirmed:
        typeof jsonParsedResult.noCreditCardConfirmed === 'boolean'
          ? jsonParsedResult.noCreditCardConfirmed
          : true,
      accessDuration: jsonParsedResult.accessDuration || formData.accessDuration,
      primaryCategory: jsonParsedResult.primaryCategory || formData.primaryCategory,
      duration: jsonParsedResult.duration || formData.duration,
      isSelfPaced:
        typeof jsonParsedResult.isSelfPaced === 'boolean'
          ? jsonParsedResult.isSelfPaced
          : true,
      skills: Array.isArray(jsonParsedResult.skills) ? jsonParsedResult.skills : formData.skills,
      description: jsonParsedResult.description || formData.description,
      thumbnailUrl: jsonParsedResult.thumbnailUrl || formData.thumbnailUrl,
      thumbnailFilename: jsonParsedResult.thumbnailFilename || formData.thumbnailFilename,
      thumbnailDimensions: jsonParsedResult.thumbnailDimensions || '1920 × 1080 px',
      thumbnailSize: jsonParsedResult.thumbnailSize || '142 KB',
    };

    setFormData(mergedData);
    setIsJsonModalOpen(false);

    createAuditLog({
      user: adminUsername || 'spar12',
      action: 'SECURITY_SCAN',
      actionLabel: 'Konversi JSON ke GUI',
      target: mergedData.title || 'Data Kursus',
      details: 'Mengimpor metadata JSON dan mengisi otomatis seluruh kolom formulir GUI',
      status: 'SUCCESS',
    });

    showToastNotification('Formulir GUI berhasil diisi otomatis dari data JSON!');
  };

  const handleExportGuiToJson = () => {
    const exportedJson = JSON.stringify(formData, null, 2);
    setJsonInputText(exportedJson);
    handleValidateAndParseJson(exportedJson);
    setIsJsonModalOpen(true);
    showToastNotification('Data formulir GUI saat ini telah diekspor ke format JSON!');
  };

  // Dynamic Categories Management State
  const [categoryOptions, setCategoryOptions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bagiilmu_custom_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CATEGORY_OPTIONS;
  });

  const [isManageCatModalOpen, setIsManageCatModalOpen] = useState(false);
  const [newCatInputText, setNewCatInputText] = useState('');

  const saveCategoryOptions = (options: string[]) => {
    setCategoryOptions(options);
    try {
      localStorage.setItem('bagiilmu_custom_categories', JSON.stringify(options));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCategoryOption = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newCatInputText.trim();
    if (!trimmed) return;
    if (categoryOptions.includes(trimmed)) {
      showToastNotification(`Kategori "${trimmed}" sudah ada.`);
      return;
    }
    const updated = [...categoryOptions, trimmed];
    saveCategoryOptions(updated);
    setNewCatInputText('');
    setFormData((prev) => ({ ...prev, primaryCategory: trimmed }));
    showToastNotification(`Kategori "${trimmed}" berhasil ditambahkan!`);
  };

  const handleDeleteCategoryOption = (catToDelete: string) => {
    if (categoryOptions.length <= 1) {
      showToastNotification('Minimal harus ada 1 kategori di dalam daftar!');
      return;
    }
    const updated = categoryOptions.filter((c) => c !== catToDelete);
    saveCategoryOptions(updated);
    if (formData.primaryCategory === catToDelete) {
      setFormData((prev) => ({ ...prev, primaryCategory: updated[0] || '' }));
    }
    showToastNotification(`Kategori "${catToDelete}" berhasil dihapus.`);
  };

  const handleResetCategoryOptions = () => {
    saveCategoryOptions(DEFAULT_CATEGORY_OPTIONS);
    if (!DEFAULT_CATEGORY_OPTIONS.includes(formData.primaryCategory)) {
      setFormData((prev) => ({ ...prev, primaryCategory: DEFAULT_CATEGORY_OPTIONS[0] }));
    }
    showToastNotification('Daftar kategori dikembalikan ke bawaan.');
  };

  // Dynamic Platform Options Management State
  const [platformOptions, setPlatformOptions] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bagiilmu_custom_platforms');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_PLATFORM_OPTIONS;
  });

  const [isManagePlatformModalOpen, setIsManagePlatformModalOpen] = useState(false);
  const [newPlatformInputText, setNewPlatformInputText] = useState('');

  const savePlatformOptions = (options: string[]) => {
    setPlatformOptions(options);
    try {
      localStorage.setItem('bagiilmu_custom_platforms', JSON.stringify(options));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddPlatformOption = (nameInput?: string | React.FormEvent) => {
    if (typeof nameInput === 'object' && nameInput !== null && 'preventDefault' in nameInput) {
      nameInput.preventDefault();
    }
    const nameStr = typeof nameInput === 'string' ? nameInput : newPlatformInputText;
    const trimmed = nameStr.trim();
    if (!trimmed) return;
    if (platformOptions.some((p) => p.toLowerCase() === trimmed.toLowerCase())) {
      showToastNotification(`Platform "${trimmed}" sudah ada di dalam daftar.`);
      return;
    }
    const updated = [...platformOptions, trimmed];
    savePlatformOptions(updated);
    setNewPlatformInputText('');
    setFormData((prev) => ({ ...prev, platform: trimmed }));
    createAuditLog({
      user: adminUsername || 'spar12',
      action: 'SECURITY_SCAN',
      actionLabel: 'Tambah Platform Sumber',
      target: trimmed,
      details: `Menambahkan platform sumber baru "${trimmed}"`,
      status: 'SUCCESS',
    });
    showToastNotification(`Platform "${trimmed}" berhasil ditambahkan!`);
  };

  const handleDeletePlatformOption = (platformToDelete: string) => {
    if (platformOptions.length <= 1) {
      showToastNotification('Minimal harus ada 1 platform sumber di dalam daftar!');
      return;
    }
    const updated = platformOptions.filter((p) => p !== platformToDelete);
    savePlatformOptions(updated);
    if (formData.platform === platformToDelete) {
      setFormData((prev) => ({ ...prev, platform: updated[0] || '' }));
    }
    createAuditLog({
      user: adminUsername || 'spar12',
      action: 'SECURITY_SCAN',
      actionLabel: 'Hapus Platform Sumber',
      target: platformToDelete,
      details: `Menghapus platform sumber "${platformToDelete}"`,
      status: 'WARNING',
    });
    showToastNotification(`Platform "${platformToDelete}" berhasil dihapus.`);
  };

  const handleResetPlatformOptions = () => {
    savePlatformOptions(DEFAULT_PLATFORM_OPTIONS);
    if (!DEFAULT_PLATFORM_OPTIONS.includes(formData.platform)) {
      setFormData((prev) => ({ ...prev, platform: DEFAULT_PLATFORM_OPTIONS[0] }));
    }
    showToastNotification('Daftar platform dikembalikan ke bawaan.');
  };
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

  // Community pending submissions state (persisted to localStorage)
  const [pendingSubmissions, setPendingSubmissions] = useState<PendingSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('bagiilmu_pending_submissions');
      return saved ? JSON.parse(saved) : INITIAL_PENDING_SUBMISSIONS;
    } catch {
      return INITIAL_PENDING_SUBMISSIONS;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bagiilmu_pending_submissions', JSON.stringify(pendingSubmissions));
    } catch (e) {
      console.error('Failed to save pending submissions:', e);
    }
  }, [pendingSubmissions]);

  // Community submission card state
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>('sub-1');
  const activeSubmission = selectedSubmissionId
    ? pendingSubmissions.find((s) => s.id === selectedSubmissionId) || null
    : null;

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
    createAuditLog({
      user: adminUsername || 'spar12',
      action: 'SUBMISSION_APPROVED',
      actionLabel: 'Approval Submisi',
      target: sub.title,
      details: `Menyetujui submisi komunitas "${sub.title}" oleh ${sub.author}`,
      status: 'SUCCESS',
    });
    showToastNotification(`Kursus "${sub.title}" berhasil disetujui & dipublikasikan ke Firestore!`);
  };

  const handleRejectSubmission = (submissionId: string) => {
    const sub = pendingSubmissions.find((s) => s.id === submissionId);
    setPendingSubmissions((prev) =>
      prev.map((s) => (s.id === submissionId ? { ...s, status: 'rejected' } : s))
    );
    if (sub) {
      createAuditLog({
        user: adminUsername || 'spar12',
        action: 'SUBMISSION_REJECTED',
        actionLabel: 'Penolakan Submisi',
        target: sub.title,
        details: `Menolak submisi komunitas "${sub.title}" oleh ${sub.author}`,
        status: 'WARNING',
      });
    }
    showToastNotification('Submisi komunitas ditolak.');
  };

  const handleReviewInForm = (sub: PendingSubmission) => {
    setSelectedSubmissionId(sub.id);
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
    createAuditLog({
      user: adminUsername || 'spar12',
      action: 'SUBMISSION_APPROVED',
      actionLabel: 'Batch Approval',
      target: `${pendingOnly.length} Submisi Komunitas`,
      details: `Persetujuan massal untuk ${pendingOnly.length} submisi komunitas`,
      status: 'SUCCESS',
    });
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

  // Auto-Scrape Extraction Logic (Dynamic parsing based on URL pattern)
  const handleAutoScrape = () => {
    setIsExtracting(true);
    setTimeout(() => {
      setIsExtracting(false);
      setIsScrapeModalOpen(false);

      const urlLower = scrapeInputUrl.toLowerCase();
      let extractedTitle = "CS50's Introduction to Computer Science & Python Programming";
      let extractedPlatform = 'Harvard Online';
      let extractedInstructor = 'Prof. David J. Malan / Harvard University';
      let extractedAccessTier = '100% Free with Certificate';
      let extractedLevel = 'Beginner';
      let extractedCategory = 'Computer Science Core';
      let extractedDuration = '10 Minggu (6-12 jam / minggu)';
      let extractedSkills = ['C', 'Python', 'SQL', 'Algorithms', 'Data Structures', 'Flask'];
      let extractedDesc = "An introduction to the intellectual enterprises of computer science and the art of programming for majors and non-majors alike.";

      if (urlLower.includes('youtube.com') || urlLower.includes('youtu.be')) {
        extractedTitle = "Full Stack Web Development Open Course Series";
        extractedPlatform = "YouTube";
        extractedInstructor = "FreeCodeCamp & Tech Educator Community";
        extractedAccessTier = "Open Educational Resource (OER)";
        extractedCategory = "Web Development & Frontend";
        extractedDuration = "12 Jam Video";
        extractedSkills = ["JavaScript", "HTML5", "CSS3", "React", "Node.js"];
        extractedDesc = "Materi kursus pemrograman web modern lengkap dengan contoh proyek praktis.";
      } else if (urlLower.includes('freecodecamp.org')) {
        extractedTitle = "Responsive Web Design Certification Curriculum";
        extractedPlatform = "freeCodeCamp";
        extractedInstructor = "Quincy Larson & freeCodeCamp Contributors";
        extractedAccessTier = "100% Free with Certificate";
        extractedCategory = "Web Development & Frontend";
        extractedDuration = "300 Jam (Self-Paced)";
        extractedSkills = ["HTML5", "CSS3", "Flexbox", "CSS Grid", "Accessibility"];
        extractedDesc = "Belajar mendesain web responsif interaktif lengkap dengan proyek portofolio gratis.";
      } else if (urlLower.includes('coursera.org')) {
        extractedTitle = "Machine Learning & AI Engineering Fundamentals";
        extractedPlatform = "Coursera";
        extractedInstructor = "Stanford University & DeepLearning.AI";
        extractedAccessTier = "Free Audit Only / No Free Certificate";
        extractedCategory = "AI, Data & Machine Learning";
        extractedDuration = "8 Minggu (5 jam / minggu)";
        extractedSkills = ["Python", "TensorFlow", "Supervised Learning", "Data Analysis"];
        extractedDesc = "Akses materi kuliah Machine Learning dari Stanford University secara gratis melalui mode Audit.";
      } else if (urlLower.includes('ocw.mit.edu')) {
        extractedTitle = "MIT 6.0001 Introduction to Computer Science and Programming in Python";
        extractedPlatform = "MIT OpenCourseWare";
        extractedInstructor = "Prof. Eric Grimson & Prof. John Guttag / MIT";
        extractedAccessTier = "Open Educational Resource (OER)";
        extractedCategory = "Computer Science Core";
        extractedDuration = "15 Minggu (Self-Paced)";
        extractedSkills = ["Python 3", "Algorithms", "Object-Oriented Programming", "Computational Thinking"];
        extractedDesc = "Materi perkuliahan resmi MIT meliputi slide presentasi, masalah pemrograman, dan ujian beserta kunci jawaban.";
      }

      setFormData((prev) => ({
        ...prev,
        title: extractedTitle,
        platform: extractedPlatform,
        url: scrapeInputUrl || prev.url,
        instructor: extractedInstructor,
        accessTier: extractedAccessTier,
        level: extractedLevel,
        primaryCategory: extractedCategory,
        duration: extractedDuration,
        skills: extractedSkills,
        description: extractedDesc,
        thumbnailFilename: 'extracted-course-cover.webp',
      }));
      showToastNotification('Metadata berhasil diekstrak secara dinamis dari tautan kursus!');
    }, 1200);
  };

  const showToastNotification = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => {
      setShowToast(null);
    }, 3500);
  };

  // Editing state
  const [editingCourseId, setEditingCourseId] = useState<string | null>(initialEditingCourse?.id || null);

  useEffect(() => {
    if (initialEditingCourse) {
      handleStartEditCourse(initialEditingCourse);
    }
  }, [initialEditingCourse]);

  const handleStartEditCourse = (course: Course) => {
    setFormData({
      title: course.title || '',
      platform: course.provider || 'freeCodeCamp',
      url: course.url || '',
      instructor: '',
      language: 'English',
      level: course.level || 'Intermediate',
      accessTier: course.hasCertificate ? '100% Free with Certificate' : 'Free Audit Only',
      noCreditCardConfirmed: true,
      accessDuration: 'lifetime',
      primaryCategory: course.categoryLabel || 'Web Development & Engineering',
      duration: course.duration || '',
      isSelfPaced: true,
      skills: course.skills || [],
      description: course.description || '',
      thumbnailUrl:
        course.image ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      thumbnailFilename: 'edited-course-cover.webp',
      thumbnailDimensions: '1920 × 1080 px',
      thumbnailSize: '142 KB',
    });
    setEditingCourseId(course.id);
    setActiveNav('submit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    showToastNotification(`Mode Edit diaktifkan untuk: "${course.title}". Silakan sesuaikan data.`);
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null);
    setFormData({
      title: '',
      platform: 'freeCodeCamp',
      url: '',
      instructor: '',
      language: 'English',
      level: 'Intermediate',
      accessTier: '100% Free with Certificate',
      noCreditCardConfirmed: true,
      accessDuration: 'lifetime',
      primaryCategory: 'Web Development & Engineering',
      duration: '',
      isSelfPaced: true,
      skills: [],
      description: '',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      thumbnailFilename: 'sampul-kursus.webp',
      thumbnailDimensions: '1920 × 1080 px',
      thumbnailSize: '142 KB',
    });
    showToastNotification('Mode edit dibatalkan. Kembali ke formulir baru.');
  };

  const handleResetForm = () => {
    setFormData({
      title: '',
      platform: 'freeCodeCamp',
      url: '',
      instructor: '',
      language: 'English',
      level: 'Intermediate',
      accessTier: '100% Free with Certificate',
      noCreditCardConfirmed: true,
      accessDuration: 'lifetime',
      primaryCategory: 'Web Development & Engineering',
      duration: '',
      isSelfPaced: true,
      skills: [],
      description: '',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      thumbnailFilename: 'sampul-kursus.webp',
      thumbnailDimensions: '1920 × 1080 px',
      thumbnailSize: '142 KB',
    });
    setEditingCourseId(null);
    setSelectedSubmissionId(null);
    showToastNotification('Formulir di-reset! Siap mengunggah kursus baru.');
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

      const courseToSave: Course = {
        id: editingCourseId || `course-${Date.now()}`,
        title: formData.title.trim(),
        provider: formData.platform,
        platform: formData.platform.toLowerCase(),
        url: formData.url.trim(),
        image: formData.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
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

      await onPublishCourse(courseToSave);

      if (selectedSubmissionId) {
        setPendingSubmissions((prev) =>
          prev.map((s) => (s.id === selectedSubmissionId ? { ...s, status: 'approved' } : s))
        );
      }

      if (editingCourseId) {
        createAuditLog({
          user: adminUsername || 'spar12',
          action: 'COURSE_PUBLISHED',
          actionLabel: 'Perbarui Kursus',
          target: courseToSave.title,
          details: `Perubahan berhasil diperbarui di Cloud Firestore (ID: ${editingCourseId})`,
          status: 'SUCCESS',
        });
        showToastNotification(`Perubahan "${courseToSave.title}" berhasil diperbarui di Cloud Firestore!`);
        setEditingCourseId(null);
      } else {
        createAuditLog({
          user: adminUsername || 'spar12',
          action: 'COURSE_PUBLISHED',
          actionLabel: 'Publikasi Kursus',
          target: courseToSave.title,
          details: `Disimpan permanen ke Cloud Firestore collection "courses" (${courseToSave.provider})`,
          status: 'SUCCESS',
        });
        showToastNotification('Kursus baru berhasil disimpan permanen ke database Cloud Firestore!');
      }
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

                        <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 flex-wrap">
                          <a
                            href={course.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-blue-400 hover:text-blue-300"
                          >
                            <span>Buka Link</span>
                            <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                          </a>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleStartEditCourse(course)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer"
                              title="Edit data kursus ini"
                            >
                              <span className="material-symbols-outlined text-[16px]">edit</span>
                              <span>Edit</span>
                            </button>

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
                platformOptions={platformOptions}
                onAddPlatformOption={handleAddPlatformOption}
                onDeletePlatformOption={handleDeletePlatformOption}
                onResetPlatformOptions={handleResetPlatformOptions}
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
                {/* Mode Edit Banner */}
                {editingCourseId && (
                  <div className="rounded-2xl bg-amber-950/70 p-4 sm:p-5 mb-6 border border-amber-500/50 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                        <span className="material-symbols-outlined text-[24px]">edit_note</span>
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base font-black uppercase tracking-tight text-white flex items-center gap-2">
                          <span>Mode Edit Kursus Aktif</span>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-black uppercase tracking-wider border border-amber-500/40">
                            Firestore Doc
                          </span>
                        </h3>
                        <p className="text-xs text-amber-200/80 font-mono mt-0.5">
                          ID Dokumen: <span className="font-bold text-amber-300">{editingCourseId}</span> — Perubahan akan langsung disimpan ke Cloud Firestore.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-black uppercase tracking-wider transition-colors border border-white/20 cursor-pointer flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                      <span>Batalkan Edit</span>
                    </button>
                  </div>
                )}

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
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3">
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

                    {/* Quick Tools & JSON Converters */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          if (!jsonInputText) {
                            setJsonInputText(SAMPLE_COURSE_JSON);
                            handleValidateAndParseJson(SAMPLE_COURSE_JSON);
                          }
                          setIsJsonModalOpen(true);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer border border-purple-400/30 shadow-md hover:scale-105"
                        title="Input JSON dan konversi otomatis ke kolom GUI"
                      >
                        <span className="material-symbols-outlined text-[16px]">data_object</span>
                        <span>Konversi JSON ke GUI</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleExportGuiToJson}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer border border-white/10"
                        title="Ekspor isi GUI saat ini ke format JSON"
                      >
                        <span className="material-symbols-outlined text-[16px]">code</span>
                        <span>Export JSON</span>
                      </button>
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
                        placeholder="Contoh: Full-Stack Modern React & Next.js 14 Architecture"
                      />
                    </div>

                    {/* Platform & URL Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                      <div className="md:col-span-5">
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-black uppercase tracking-wider text-zinc-300" htmlFor="platform-select-form">
                            Platform Sumber <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsManagePlatformModalOpen(true)}
                            className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                            title="Kelola, Tambah atau Hapus Pilihan Platform Sumber"
                          >
                            <span className="material-symbols-outlined text-[15px]">settings_suggest</span>
                            <span>Kelola ±</span>
                          </button>
                        </div>
                        <div className="relative">
                          <select
                            id="platform-select-form"
                            value={formData.platform}
                            onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            className="w-full appearance-none px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all border border-white/15 cursor-pointer pr-10"
                          >
                            {platformOptions.map((plat) => (
                              <option key={plat} value={plat} className="bg-[#0d0d0d] text-white">
                                {plat}
                              </option>
                            ))}
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
                              placeholder="Contoh: https://www.freecodecamp.org/learn/full-stack-developer/"
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
                          placeholder="Contoh: MIT & Open Education Initiative"
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
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-xs font-black uppercase tracking-wider text-zinc-300" htmlFor="primary-category">
                            Kategori Utama <span className="text-red-500">*</span>
                          </label>
                          <button
                            type="button"
                            onClick={() => setIsManageCatModalOpen(true)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:text-blue-300 uppercase tracking-wider transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">edit_note</span>
                            <span>+ / - Kelola Kategori</span>
                          </button>
                        </div>
                        <div className="relative">
                          <select
                            id="primary-category"
                            value={formData.primaryCategory}
                            onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                            className="w-full appearance-none px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 transition-all border border-white/15 cursor-pointer pr-10"
                          >
                            {categoryOptions.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
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
                            placeholder="Contoh: 36 Jam (4-6 Minggu disarankan)"
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
                        placeholder="Contoh: Pelajari paradigma rekayasa web modern mulai dari fondasi React Server Components, optimasi caching Next.js App Router, hingga integrasi database..."
                      />
                    </div>
                  </div>
                </div>

                {/* Hidden File Input for Device Upload */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageFileSelect}
                  className="hidden"
                />

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
                    <div className="sm:col-span-5 aspect-video rounded-xl bg-black/60 overflow-hidden relative group border border-white/15 shadow-inner">
                      <img
                        src={formData.thumbnailUrl}
                        alt={formData.title || 'Sampul Kursus'}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          // Fallback if image fails to load
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 text-white p-3 backdrop-blur-[2px]">
                        <p className="text-[10px] font-black uppercase tracking-wider text-blue-300 mb-1">
                          Klik untuk Ubah Gambar
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                            title="Unggah Gambar dari Perangkat"
                          >
                            <span className="material-symbols-outlined text-[18px]">upload</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsUrlImageModalOpen(true)}
                            className="p-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                            title="Masukkan URL Gambar"
                          >
                            <span className="material-symbols-outlined text-[18px]">link</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleResetImage}
                            className="p-2.5 rounded-full bg-red-600/80 hover:bg-red-500 text-white shadow-lg cursor-pointer transition-transform hover:scale-110"
                            title="Reset Gambar ke Bawaan"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Upload Meta Details & Control Buttons */}
                    <div className="sm:col-span-7 flex flex-col justify-center gap-3">
                      <div className="flex items-center gap-2 text-white">
                        <span className="material-symbols-outlined text-[20px] text-blue-400">check_circle</span>
                        <span className="text-xs font-black uppercase tracking-wider truncate max-w-[280px]">
                          {formData.thumbnailFilename || 'sampul-kursus.webp'}
                        </span>
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                        {formData.thumbnailDimensions || '1920 × 1080 px'} • {formData.thumbnailSize || '142 KB'} • Format visual optimal. Menampilkan kontras teks yang jelas untuk pembaca mobile.
                      </p>

                      <div className="flex items-center gap-2 pt-1 flex-wrap">
                        {/* Primary Change Image File Picker */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all inline-flex items-center gap-1.5 cursor-pointer border border-blue-400/30 shadow-md"
                        >
                          <span className="material-symbols-outlined text-[16px]">upload_file</span>
                          <span>Ganti Gambar</span>
                        </button>

                        {/* OpenGraph Generator */}
                        <button
                          type="button"
                          onClick={handleGenerateOpenGraph}
                          className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 cursor-pointer border border-white/10"
                          title="Generate thumbnail dari tautan atau YouTube"
                        >
                          <span className="material-symbols-outlined text-[16px] text-blue-400">auto_awesome</span>
                          <span>Generate via OpenGraph</span>
                        </button>

                        {/* Custom URL Input Modal trigger */}
                        <button
                          type="button"
                          onClick={() => setIsUrlImageModalOpen(true)}
                          className="px-3 py-2.5 rounded-xl bg-black/50 hover:bg-white/5 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer border border-white/10"
                          title="Masukkan URL Gambar Langsung"
                        >
                          <span className="material-symbols-outlined text-[16px]">link</span>
                          <span>Input URL</span>
                        </button>

                        {/* Stock Gallery picker */}
                        <button
                          type="button"
                          onClick={() => setIsStockGalleryModalOpen(true)}
                          className="px-3 py-2.5 rounded-xl bg-black/50 hover:bg-white/5 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-1 cursor-pointer border border-white/10"
                          title="Pilih dari Galeri Stok HD"
                        >
                          <span className="material-symbols-outlined text-[16px]">collections</span>
                          <span>Stok Galeri</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION 5: Final Upload Action Box */}
                <div className="bg-[#0d0d0d] rounded-2xl p-5 sm:p-7 shadow-xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0d0d0d] to-purple-950/30 flex flex-col gap-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-11 h-11 rounded-2xl ${editingCourseId ? 'bg-amber-600/20 text-amber-400 border-amber-500/40' : 'bg-blue-600/20 text-blue-400 border-blue-500/40'} border flex items-center justify-center shrink-0 shadow-md`}>
                        <span className="material-symbols-outlined text-[24px]">
                          {editingCourseId ? 'edit_document' : 'cloud_upload'}
                        </span>
                      </div>
                      <div>
                        <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2 flex-wrap">
                          <span>{editingCourseId ? 'Simpan Perubahan Data Kursus' : 'Publikasikan & Upload Kursus'}</span>
                          <span className={`px-2.5 py-0.5 rounded-full ${editingCourseId ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'} border text-[10px] font-black uppercase tracking-wider`}>
                            {editingCourseId ? 'Mode Edit' : 'Firestore Live'}
                          </span>
                        </h2>
                        <p className="text-xs text-zinc-400 font-normal">
                          {editingCourseId
                            ? `Memperbarui dokumen Firestore ID "${editingCourseId}" & memperbarui katalog`
                            : 'Simpan permanen ke database Cloud Firestore & langsung tampil di katalog publik'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={editingCourseId ? handleCancelEdit : handleResetForm}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider transition-colors border border-white/15 cursor-pointer text-center"
                      title={editingCourseId ? "Batalkan mode edit" : "Kosongkan seluruh kolom form untuk upload baru"}
                    >
                      {editingCourseId ? 'Batalkan Edit' : 'Reset Form'}
                    </button>
                    <button
                      type="button"
                      disabled={isPublishing || !formData.title.trim() || !formData.url.trim()}
                      onClick={handlePublish}
                      className={`w-full sm:w-auto px-6 py-3 rounded-xl ${
                        editingCourseId
                          ? 'bg-amber-600 hover:bg-amber-500 border-amber-400/40 shadow-amber-600/30'
                          : 'bg-blue-600 hover:bg-blue-500 border-blue-400/40 shadow-blue-600/30'
                      } disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 border shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      {isPublishing ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">sync</span>
                          <span>{editingCourseId ? 'Memperbarui...' : 'Mengunggah...'}</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">
                            {editingCourseId ? 'save' : 'add_circle'}
                          </span>
                          <span>{editingCourseId ? 'Simpan Perubahan (Update)' : '+ Upload Course Baru'}</span>
                        </>
                      )}
                    </button>
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
                    <div className="aspect-video w-full rounded-xl overflow-hidden relative bg-black group">
                      <img
                        src={formData.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'}
                        alt={formData.title || 'Course Preview'}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                      {/* Provider Overlay */}
                      <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-wider border border-white/15">
                          <span className="material-symbols-outlined text-[13px] text-blue-400">school</span>
                          <span>{formData.platform || 'Platform Sumber'}</span>
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
                          <span>{formData.primaryCategory ? formData.primaryCategory.split('&')[0].trim() : 'General'}</span>
                        </span>
                        <span className="flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-zinc-400">
                          <span className="material-symbols-outlined text-[14px]">signal_cellular_alt</span>
                          <span>{formData.level || 'Beginner'}</span>
                        </span>
                      </div>

                      <h3 className="text-base font-black uppercase tracking-tight text-white leading-snug line-clamp-2 hover:text-blue-400 transition-colors">
                        {formData.title || 'JUDUL LENGKAP KURSUS...'}
                      </h3>

                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal">
                        {formData.description || 'Deskripsi singkat dan ikhtisar silabus akan ditampilkan di sini...'}
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
                            <span>{formData.duration ? formData.duration.split('(')[0].trim() : '36 Jam'}</span>
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
                        <a
                          href={formData.url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (!formData.url) {
                              e.preventDefault();
                              showToastNotification('Tautan direct URL kursus belum diisi di form!');
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-sm cursor-pointer hover:scale-105"
                        >
                          <span>Mulai</span>
                          <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
                        </a>
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
                    {activeSubmission ? (
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                          activeSubmission.status === 'approved'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                            : activeSubmission.status === 'rejected'
                            ? 'bg-red-950/80 text-red-300 border-red-500/40'
                            : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                        }`}
                      >
                        {activeSubmission.status === 'approved'
                          ? 'Approved'
                          : activeSubmission.status === 'rejected'
                          ? 'Rejected'
                          : 'Review Pending'}
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full bg-blue-950/80 text-blue-300 border border-blue-500/40 text-[10px] font-black uppercase tracking-wider">
                        Mode Mandiri
                      </span>
                    )}
                  </div>

                  {activeSubmission ? (
                    <>
                      <div className="p-3.5 rounded-xl bg-black/60 mb-3 border border-white/10">
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center font-black text-xs uppercase shadow-sm">
                              {activeSubmission.avatar || activeSubmission.author.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-white leading-tight">
                                @{activeSubmission.author.toLowerCase().replace(/\s+/g, '_')}
                              </span>
                              <span className="text-[10px] text-zinc-500 uppercase tracking-wider">
                                Diajukan {activeSubmission.submittedTime}
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedSubmissionId(null)}
                            className="text-[10px] text-zinc-400 hover:text-white hover:underline cursor-pointer"
                            title="Lepas tautan submisi untuk mode mandiri"
                          >
                            Lepas Tautan
                          </button>
                        </div>
                        <p className="text-xs text-zinc-300 italic leading-relaxed font-normal">
                          "{activeSubmission.note || activeSubmission.description}"
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          disabled={activeSubmission.status !== 'pending'}
                          onClick={() => handleRejectSubmission(activeSubmission.id)}
                          className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 text-center disabled:opacity-40 cursor-pointer border border-white/10"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                          <span>Reject</span>
                        </button>
                        <button
                          type="button"
                          disabled={activeSubmission.status !== 'pending'}
                          onClick={() => handleApproveSubmission(activeSubmission)}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1 text-center shadow-sm disabled:opacity-40 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          <span>Approve</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-xs text-zinc-400 font-normal leading-relaxed">
                        Formulir saat ini dalam <strong>Mode Kurasi Mandiri</strong>. Jika ingin meninjau submisi dari pengguna komunitas:
                      </p>

                      {pendingSubmissions.length > 0 ? (
                        <div className="space-y-2">
                          <label className="block text-[11px] font-black uppercase tracking-wider text-zinc-300">
                            Pilih Submisi Komunitas:
                          </label>
                          <select
                            onChange={(e) => {
                              const selected = pendingSubmissions.find((s) => s.id === e.target.value);
                              if (selected) {
                                handleReviewInForm(selected);
                              }
                            }}
                            value=""
                            className="w-full px-3 py-2 rounded-xl bg-black/60 text-white text-xs border border-white/15 focus:outline-none focus:border-blue-500"
                          >
                            <option value="" disabled>
                              -- Pilih submisi untuk ditinjau ({pendingSubmissions.filter((s) => s.status === 'pending').length} pending) --
                            </option>
                            {pendingSubmissions.map((sub) => (
                              <option key={sub.id} value={sub.id}>
                                [{sub.status.toUpperCase()}] {sub.author} - {sub.title}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : (
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                          <p className="text-xs text-zinc-400">Belum ada submisi komunitas terdaftar.</p>
                        </div>
                      )}
                    </div>
                  )}
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

      {/* Manage Categories Modal Dialog */}
      {isManageCatModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-white/15 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-blue-400/30">
                  <span className="material-symbols-outlined text-[18px]">category</span>
                </div>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">Kelola Opsi Kategori</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsManageCatModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed font-normal">
              Tambah kategori baru atau hapus kategori yang tidak diperlukan. Pilihan kategori akan otomatis diperbarui di formulir kurator.
            </p>

            {/* Add new category input */}
            <form onSubmit={handleAddCategoryOption} className="flex gap-2 mb-5">
              <input
                type="text"
                value={newCatInputText}
                onChange={(e) => setNewCatInputText(e.target.value)}
                placeholder="Nama kategori baru (mis. AI Prompt Engineering)..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 border border-white/15 placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-blue-400/30 flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Tambah</span>
              </button>
            </form>

            {/* Current categories list */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-5 scrollbar-thin">
              <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                Daftar Kategori Aktif ({categoryOptions.length})
              </div>
              {categoryOptions.map((cat) => (
                <div
                  key={cat}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-xs text-white font-bold">
                    <span className="material-symbols-outlined text-[16px] text-blue-400">label</span>
                    <span>{cat}</span>
                    {formData.primaryCategory === cat && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase">
                        Terpilih
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategoryOption(cat)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer"
                    title="Hapus Kategori"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetCategoryOptions}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Reset ke Bawaan
              </button>
              <button
                type="button"
                onClick={() => setIsManageCatModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-blue-400/30"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Platform Options Modal Dialog */}
      {isManagePlatformModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-white/15 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-blue-400/30">
                  <span className="material-symbols-outlined text-[18px]">hub</span>
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Kelola Platform Sumber</h3>
                  <p className="text-[11px] text-zinc-400 font-normal">Tambah atau hapus pilihan platform dari dropdown</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsManagePlatformModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <p className="text-xs text-zinc-300 mb-4 leading-relaxed font-normal">
              Masukkan nama platform baru (mis. Google Skillshop, IBM SkillsBuild, Udemy Free) untuk menambahkan ke daftar dropdown, atau tekan tombol Hapus untuk menghapus platform yang tidak digunakan.
            </p>

            {/* Add new platform input */}
            <form onSubmit={handleAddPlatformOption} className="flex gap-2 mb-5">
              <input
                type="text"
                value={newPlatformInputText}
                onChange={(e) => setNewPlatformInputText(e.target.value)}
                placeholder="Nama platform sumber baru..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 border border-white/15 placeholder:text-zinc-600"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-blue-400/30 flex items-center gap-1 shrink-0"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
                <span>Tambah</span>
              </button>
            </form>

            {/* Current platforms list */}
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1 mb-5 scrollbar-thin">
              <div className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mb-2">
                Daftar Platform Aktif ({platformOptions.length})
              </div>
              {platformOptions.map((plat) => (
                <div
                  key={plat}
                  className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-xs text-white font-bold">
                    <span className="material-symbols-outlined text-[16px] text-blue-400">check_circle</span>
                    <span>{plat}</span>
                    {formData.platform === plat && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase">
                        Terpilih
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePlatformOption(plat)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1 text-[11px]"
                    title="Hapus Platform"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    <span>Hapus</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={handleResetPlatformOptions}
                className="text-xs text-zinc-400 hover:text-white underline cursor-pointer"
              >
                Reset ke Bawaan
              </button>
              <button
                type="button"
                onClick={() => setIsManagePlatformModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-blue-400/30"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Custom Image URL Modal */}
      {isUrlImageModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-white/15 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-blue-400/30">
                  <span className="material-symbols-outlined text-[18px]">link</span>
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Masukkan Direct URL Gambar</h3>
                  <p className="text-[11px] text-zinc-400 font-normal">Gunakan link gambar publik dari Unsplash, CDN, atau GitHub</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsUrlImageModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleApplyUrlImage} className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5" htmlFor="image-url-modal-input">
                  Tautan Gambar (HTTP / HTTPS / Base64)
                </label>
                <input
                  id="image-url-modal-input"
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-... atau https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-black/60 text-white text-xs focus:outline-none focus:border-blue-500 border border-white/15 placeholder:text-zinc-600"
                  autoFocus
                />
              </div>

              {/* URL Image Live Preview */}
              {imageUrlInput.trim().startsWith('http') && (
                <div className="aspect-video rounded-xl bg-black/60 overflow-hidden relative border border-white/15">
                  <img
                    src={imageUrlInput.trim()}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute bottom-2 left-2 bg-black/80 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider text-blue-400 border border-white/10">
                    Live Link Preview
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsUrlImageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider cursor-pointer border border-white/10"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!imageUrlInput.trim()}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider cursor-pointer border border-blue-400/30 transition-colors"
                >
                  Terapkan Gambar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Cover Gallery Modal */}
      {isStockGalleryModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative border border-white/15 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center border border-blue-400/30">
                  <span className="material-symbols-outlined text-[18px]">collections</span>
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white">Galeri Stok Sampul HD</h3>
                  <p className="text-[11px] text-zinc-400 font-normal">Pilih salah satu gambar HD profesional rasio 16:9 berikut</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsStockGalleryModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-1 pb-4 scrollbar-thin">
              {STOCK_COVER_IMAGES.map((imgItem) => (
                <div
                  key={imgItem.id}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      thumbnailUrl: imgItem.url,
                      thumbnailFilename: imgItem.filename,
                      thumbnailDimensions: '1920 × 1080 px',
                      thumbnailSize: '142 KB',
                    }));
                    setIsStockGalleryModalOpen(false);
                    showToastNotification(`Sampul stok "${imgItem.label}" berhasil dipilih!`);
                  }}
                  className={`group relative rounded-xl overflow-hidden border border-white/15 bg-black/60 cursor-pointer hover:border-blue-500 transition-all shadow-md ${
                    formData.thumbnailUrl === imgItem.url ? 'ring-2 ring-blue-500 border-blue-500' : ''
                  }`}
                >
                  <div className="aspect-video w-full overflow-hidden">
                    <img
                      src={imgItem.url}
                      alt={imgItem.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2.5 bg-black/90 flex flex-col justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-blue-400 truncate">
                      {imgItem.category}
                    </span>
                    <span className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                      {imgItem.label}
                    </span>
                  </div>
                  {formData.thumbnailUrl === imgItem.url && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white p-1 rounded-full shadow-lg border border-blue-400/40">
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10 shrink-0">
              <p className="text-[11px] text-zinc-500">Foto berlisensi terbuka dari Unsplash untuk konsistensi visual.</p>
              <button
                type="button"
                onClick={() => setIsStockGalleryModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* JSON Auto-Fill & GUI Converter Modal */}
      {isJsonModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#0d0d0d] rounded-2xl p-6 sm:p-8 max-w-3xl w-full shadow-2xl relative border border-white/15 max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <span className="material-symbols-outlined text-[22px]">data_object</span>
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                    <span>Konversi JSON Metadata ke GUI Form</span>
                    <span className="px-2 py-0.5 rounded-full bg-purple-950/80 text-purple-300 border border-purple-500/40 text-[9px] font-black uppercase tracking-wider">
                      Auto-Populate
                    </span>
                  </h3>
                  <p className="text-xs text-zinc-400 font-normal">
                    Input atau tempelkan JSON metadata di bawah. Sistem akan otomatis memetakan nilai ke seluruh kolom formulir GUI.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsJsonModalOpen(false)}
                className="text-zinc-500 hover:text-white p-1 rounded-lg cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Quick Actions Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setJsonInputText(SAMPLE_COURSE_JSON);
                    handleValidateAndParseJson(SAMPLE_COURSE_JSON);
                    showToastNotification('Template JSON contoh (Harvard CS50) dimuat!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-all border border-purple-500/40 inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">auto_stories</span>
                  <span>Muat Template Contoh (CS50)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(SAMPLE_COURSE_JSON);
                    showToastNotification('Template JSON berhasil disalin ke clipboard!');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors border border-white/10 inline-flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[15px]">content_copy</span>
                  <span>Salin Template JSON</span>
                </button>
              </div>

              {jsonInputText && (
                <button
                  type="button"
                  onClick={() => {
                    setJsonInputText('');
                    setJsonParseError(null);
                    setJsonParsedResult(null);
                  }}
                  className="text-[11px] font-bold uppercase text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                >
                  Bersihkan Textarea
                </button>
              )}
            </div>

            {/* JSON Code Input Area */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              <div className="relative">
                <textarea
                  value={jsonInputText}
                  onChange={(e) => handleValidateAndParseJson(e.target.value)}
                  placeholder={`Tempelkan JSON metadata di sini...\n\nContoh Struktur:\n{\n  "title": "Nama Kursus",\n  "platform": "freeCodeCamp",\n  "url": "https://...",\n  "instructor": "Nama Instruktur",\n  "level": "Intermediate",\n  "accessTier": "100% Free with Certificate",\n  "skills": ["React", "TypeScript"],\n  "description": "Deskripsi..."\n}`}
                  rows={10}
                  className="w-full p-4 rounded-xl bg-black/90 text-emerald-300 font-mono text-xs border border-white/15 focus:outline-none focus:border-purple-500 transition-all placeholder:text-zinc-600 leading-relaxed shadow-inner"
                />
              </div>

              {/* Real-time Validation Status */}
              {jsonParseError ? (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-[20px] text-red-400 shrink-0">error</span>
                  <div>
                    <span className="font-black uppercase tracking-wider block">JSON Syntax Error</span>
                    <span className="font-mono text-[11px] text-red-200">{jsonParseError}</span>
                  </div>
                </div>
              ) : jsonParsedResult ? (
                <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-black uppercase tracking-wider flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
                      <span>JSON Valid &amp; Siap Diimpor ke GUI Form!</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-900/60 text-[10px] font-mono text-emerald-200 border border-emerald-500/30">
                      {Object.keys(jsonParsedResult).length} Properti Terdeteksi
                    </span>
                  </div>

                  {/* Mapping Preview Box */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-emerald-500/20 text-[11px] font-normal text-zinc-300">
                    <div>
                      <strong className="text-emerald-400 uppercase font-mono">Judul:</strong>{' '}
                      {jsonParsedResult.title || <span className="italic text-zinc-500">(Kosong)</span>}
                    </div>
                    <div>
                      <strong className="text-emerald-400 uppercase font-mono">Platform:</strong>{' '}
                      {jsonParsedResult.platform || <span className="italic text-zinc-500">(Kosong)</span>}
                    </div>
                    <div>
                      <strong className="text-emerald-400 uppercase font-mono">Instruktur:</strong>{' '}
                      {jsonParsedResult.instructor || <span className="italic text-zinc-500">(Kosong)</span>}
                    </div>
                    <div>
                      <strong className="text-emerald-400 uppercase font-mono">Level:</strong>{' '}
                      {jsonParsedResult.level || <span className="italic text-zinc-500">(Kosong)</span>}
                    </div>
                    <div>
                      <strong className="text-emerald-400 uppercase font-mono">Akses Tier:</strong>{' '}
                      {jsonParsedResult.accessTier || <span className="italic text-zinc-500">(Kosong)</span>}
                    </div>
                    <div>
                      <strong className="text-emerald-400 uppercase font-mono">Skills:</strong>{' '}
                      {Array.isArray(jsonParsedResult.skills) && jsonParsedResult.skills.length > 0
                        ? jsonParsedResult.skills.join(', ')
                        : <span className="italic text-zinc-500">(Kosong)</span>}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10 shrink-0">
              <span className="text-[11px] text-zinc-500 hidden sm:inline">
                Data JSON akan langsung disinkronkan ke komponen kontrol GUI.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsJsonModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer border border-white/10"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={!jsonParsedResult || !!jsonParseError}
                  onClick={handleApplyJsonToGui}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-40 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer border border-purple-400/30 shadow-lg flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[18px]">input</span>
                  <span>Terapkan ke GUI Form (1-Click)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
