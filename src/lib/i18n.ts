export type Language = 'id' | 'en';

export interface Translations {
  brand: {
    name: string;
    tagline: string;
    shortTagline: string;
    mission: string;
    verifiedBadge: string;
  };
  nav: {
    catalog: string;
    categories: string;
    topRated: string;
    browse: string;
    bookmarks: string;
    learningPaths: string;
    designSpecs: string;
    adminPortal: string;
    adminLoggedAs: string;
    adminLogin: string;
    adminConsole: string;
    submitCourse: string;
    logout: string;
    settings: string;
    switchLanguage: string;
  };
  hero: {
    trustPill: string;
    indexedCount: string;
    headlinePrefix: string;
    headlineHighlight: string;
    headlineSuffix: string;
    subtitle: string;
    searchPlaceholder: string;
    allPlatforms: string;
    findCoursesBtn: string;
    trending: string;
    clearSearch: string;
  };
  filters: {
    allTracks: string;
    cybersecurity: string;
    webdev: string;
    ai: string;
    design: string;
    cloud: string;
    mobile: string;
    product: string;
    filterBy: string;
    allCourses: string;
    freeCertOnly: string;
    topRatedOnly: string;
    coursesMatched: string;
    readyToStart: string;
    resetAll: string;
    levelFilter: string;
    allLevels: string;
    beginner: string;
    intermediate: string;
    advanced: string;
    sortLabel: string;
    sortDefault: string;
    sortAlphabetical: string;
    sortAlphabeticalDesc: string;
    sortLatest: string;
    sortOldest: string;
  };
  card: {
    freeCert: string;
    auditOnly: string;
    enrollBtn: string;
    detailsBtn: string;
    saveTooltip: string;
    savedTooltip: string;
    hours: string;
    reviews: string;
    skillsLearned: string;
    verifiedProvider: string;
  };
  catalog: {
    noCoursesFound: string;
    resetFilters: string;
    showMore: string;
    exploreAll: string;
    displayingCount: string;
    ofTotal: string;
    verifiedPaths: string;
  };
  enrollModal: {
    title: string;
    subtitle: string;
    guideTitle: string;
    freeCertDesc: string;
    auditDesc: string;
    stepsTitle: string;
    step1: string;
    step2: string;
    step3: string;
    skillsTitle: string;
    closeBtn: string;
    directEnrollBtn: string;
    guaranteeText: string;
  };
  community: {
    badge: string;
    title: string;
    desc: string;
    curatedCoursesCount: string;
    contributorsCount: string;
    freeGuarantee: string;
    submitBtn: string;
    browseBtn: string;
  };
  footer: {
    desc: string;
    verifiedText: string;
    directoriesTitle: string;
    standardsTitle: string;
    guidelines: string;
    curationCriteria: string;
    privacy: string;
    copyright: string;
    madeFor: string;
  };
  bookmarks: {
    title: string;
    emptyTitle: string;
    emptyDesc: string;
    browseCourses: string;
    removeAll: string;
    itemCount: string;
  };
  settings: {
    title: string;
    languageTitle: string;
    languageDesc: string;
    densityTitle: string;
    densityComfortable: string;
    densityCompact: string;
    saveBtn: string;
  };
  designSpecs: {
    modalTitle: string;
    tabWireframes: string;
    tabUserFlows: string;
    tabDesignSystem: string;
    close: string;
  };
}

export const translations: Record<Language, Translations> = {
  id: {
    brand: {
      name: 'bagiilmu.id',
      tagline: 'Platform Kurasi Kursus Gratis Terbaik',
      shortTagline: 'Belajar Tanpa Biaya Tersembunyi',
      mission: 'Membuka akses pendidikan berstandar global bagi seluruh pembelajar di Indonesia tanpa sekat biaya.',
      verifiedBadge: '100% Gratis & Terverifikasi',
    },
    nav: {
      catalog: 'Katalog Terbuka',
      categories: 'Kategori',
      topRated: 'Rating Tertinggi',
      browse: 'Cari Kursus',
      bookmarks: 'Tersimpan',
      learningPaths: 'Jalur Belajar',
      designSpecs: 'Wireframe & Alur',
      adminPortal: 'Portal /admin',
      adminLoggedAs: 'Admin',
      adminLogin: 'Masuk Admin',
      adminConsole: 'Konsol /admin',
      submitCourse: 'Ajukan Kursus',
      logout: 'Keluar',
      settings: 'Pengaturan',
      switchLanguage: 'Pilih Bahasa',
    },
    hero: {
      trustPill: '100% Gratis & Kualitas Terverifikasi',
      indexedCount: '2.480+ Materi Terindeks',
      headlinePrefix: 'Akses Direktori',
      headlineHighlight: 'Kursus Gratis Terbaik',
      headlineSuffix: 'Dunia Tanpa Paywall',
      subtitle: 'Daftar materi edukasi pilihan dari universitas kelas dunia (Harvard, MIT, Stanford) dan komunitas teknologi global. Tanpa biaya tersembunyi, fokus pada keahlian nyata masa depan.',
      searchPlaceholder: 'Cari topik, keahlian, atau kampus (cth: Python, Next.js, Cyber Security, UI Design)...',
      allPlatforms: 'Semua Platform',
      findCoursesBtn: 'Cari Kursus Gratis',
      trending: 'Tren Belajar:',
      clearSearch: 'Bersihkan',
    },
    filters: {
      allTracks: 'Semua Jalur',
      cybersecurity: 'Keamanan Siber',
      webdev: 'Pengembangan Web',
      ai: 'Sains Data & AI',
      design: 'Desain UI/UX',
      cloud: 'Cloud & DevOps',
      mobile: 'Mobile Developer',
      product: 'Manajemen Produk',
      filterBy: 'Saring Berdasarkan:',
      allCourses: 'Semua',
      freeCertOnly: 'Sertifikat Gratis',
      topRatedOnly: 'Rating Tertinggi',
      coursesMatched: 'Kursus Gratis Ditemukan',
      readyToStart: 'siap diakses langsung',
      resetAll: 'Reset Semua Filter',
      levelFilter: 'Level Belajar',
      allLevels: 'Semua Tingkat',
      beginner: 'Pemula (Beginner)',
      intermediate: 'Menengah (Intermediate)',
      advanced: 'Lanjutan (Advanced)',
      sortLabel: 'Urutan',
      sortDefault: 'Bawaan',
      sortAlphabetical: 'Abjad (A-Z)',
      sortAlphabeticalDesc: 'Abjad (Z-A)',
      sortLatest: 'Terbaru',
      sortOldest: 'Terlama',
    },
    card: {
      freeCert: 'Sertifikat Gratis',
      auditOnly: 'Akses Penuh / Audit',
      enrollBtn: 'Mulai Belajar',
      detailsBtn: 'Panduan Akses',
      saveTooltip: 'Simpan ke Daftar Belajar',
      savedTooltip: 'Tersimpan di Favorit',
      hours: 'jam',
      reviews: 'ulasan',
      skillsLearned: 'Keahlian:',
      verifiedProvider: 'Penyedia Resmi',
    },
    catalog: {
      noCoursesFound: 'Tidak Ada Kursus Ditemukan',
      resetFilters: 'Bersihkan Semua Filter',
      showMore: 'Muat Lebih Banyak Kursus',
      exploreAll: 'Jelajahi Kembali ke Atas',
      displayingCount: 'Menampilkan',
      ofTotal: 'dari total',
      verifiedPaths: 'jalur terverifikasi',
    },
    enrollModal: {
      title: 'Panduan Akses Bebas Biaya',
      subtitle: 'Instruksi pendaftaran langsung tanpa kartu kredit',
      guideTitle: 'Jaminan Akses 100% Gratis bagiilmu.id',
      freeCertDesc: 'Kursus ini menyediakan sertifikat kelulusan terverifikasi resmi secara gratis setelah menyelesaikan seluruh materi dan tugas tanpa biaya terselubung.',
      auditDesc: 'Materi kursus dapat diakses gratis sepenuhnya. Pada halaman pendaftaran penyedia, pilih tombol "Audit Course" atau "Free Track" untuk belajar tanpa perlu memasukkan informasi kartu kredit.',
      stepsTitle: 'Langkah Cepat Memulai Belajar:',
      step1: 'Klik tombol "Menuju Situs Resmi" di bawah untuk membuka halaman asli penyedia kursus.',
      step2: 'Buat akun gratis atau masuk dengan Google/GitHub tanpa mencantumkan metode pembayaran.',
      step3: 'Pilih opsi "Audit" atau "Full Free Access" dan nikmati seluruh silabus video serta latihan.',
      skillsTitle: 'Keahlian yang Akan Kamu Kuasai:',
      closeBtn: 'Tutup',
      directEnrollBtn: 'Menuju Situs Resmi',
      guaranteeText: 'Bebas biaya selamanya • Tanpa penipuan safelink • Aman & Legal',
    },
    community: {
      badge: 'Gerakan Pendidikan Terbuka Indonesia',
      title: 'Tahu Sumber Belajar Berkualitas yang Gratis?',
      desc: 'Bantu sesama pembelajar di Indonesia dengan mendaftarkan silabus universitas, dokumentasi resmi, atau materi video berkualitas tinggi tanpa pungutan biaya.',
      curatedCoursesCount: '2.480+ Kursus Terkurasi',
      contributorsCount: '350+ Kontributor Aktif',
      freeGuarantee: 'Selalu 100% Bebas Biaya',
      submitBtn: 'Ajukan Kursus Gratis',
      browseBtn: 'Lihat Antrean Komunitas',
    },
    footer: {
      desc: 'Gerbang pendidikan terbuka tanpa hambatan biaya. Mengagregasikan kursus berkualitas tinggi, transparan, dan teruji untuk mencerdaskan generasi digital Indonesia.',
      verifiedText: 'Katalog Kursus Terbuka & Terverifikasi',
      directoriesTitle: 'Direktori Mitra Global',
      standardsTitle: 'Standar & Transparansi',
      guidelines: 'Panduan Kurasi',
      curationCriteria: 'Kebijakan Anti-Paywall',
      privacy: 'Kebijakan Privasi',
      copyright: 'Hak Cipta Terpelihara. Didedikasikan untuk Pendidikan Indonesia.',
      madeFor: 'Dibangun dengan semangat berbagi ilmu untuk masa depan bangsa.',
    },
    bookmarks: {
      title: 'Kursus Tersimpan',
      emptyTitle: 'Belum Ada Kursus Tersimpan',
      emptyDesc: 'Klik ikon bookmark pada kartu kursus untuk menyimpannya di sini agar mudah diakses kembali kapan saja.',
      browseCourses: 'Jelajahi Katalog',
      removeAll: 'Hapus Semua',
      itemCount: 'kursus tersimpan',
    },
    settings: {
      title: 'Pengaturan & Preferensi',
      languageTitle: 'Bahasa Antarmuka (Language)',
      languageDesc: 'Pilih bahasa tampilan utama untuk katalog, navigasi, dan panduan belajar.',
      densityTitle: 'Kerapatan Tampilan Kartu',
      densityComfortable: 'Nyaman (Standard)',
      densityCompact: 'Padat (Compact)',
      saveBtn: 'Simpan Perubahan',
    },
    designSpecs: {
      modalTitle: 'Arsitektur Desain & Alur Pengguna bagiilmu.id',
      tabWireframes: 'Wireframes Interaktif',
      tabUserFlows: 'Diagram Alur Pengguna',
      tabDesignSystem: 'Sistem Desain & Warna',
      close: 'Tutup',
    },
  },
  en: {
    brand: {
      name: 'bagiilmu.id',
      tagline: 'Best Free Online Courses Curator',
      shortTagline: 'Zero Hidden Paywalls',
      mission: 'Unlocking friction-free access to world-class education for every learner with zero financial barriers.',
      verifiedBadge: '100% Free & Verified',
    },
    nav: {
      catalog: 'Open Catalog',
      categories: 'Categories',
      topRated: 'Top Rated',
      browse: 'Search Courses',
      bookmarks: 'Saved',
      learningPaths: 'Learning Paths',
      designSpecs: 'Wireframes & Flows',
      adminPortal: 'Portal /admin',
      adminLoggedAs: 'Admin',
      adminLogin: 'Admin Login',
      adminConsole: 'Console /admin',
      submitCourse: 'Submit Course',
      logout: 'Logout',
      settings: 'Settings',
      switchLanguage: 'Switch Language',
    },
    hero: {
      trustPill: '100% Free & Verified Quality',
      indexedCount: '2,480+ Indexed Tracks',
      headlinePrefix: 'Discover the',
      headlineHighlight: 'Best Free Courses',
      headlineSuffix: 'Online with Zero Paywalls',
      subtitle: 'Aggregated, vetted, and organized from world-class universities (Harvard, MIT, Stanford) and tech innovators. Genuine skills, completely accessible.',
      searchPlaceholder: 'Search skills, topics, or universities (e.g. Python, Next.js, Cybersecurity, UI Design)...',
      allPlatforms: 'All Platforms',
      findCoursesBtn: 'Find Free Courses',
      trending: 'Trending:',
      clearSearch: 'Clear',
    },
    filters: {
      allTracks: 'All Tracks',
      cybersecurity: 'Cybersecurity',
      webdev: 'Web Development',
      ai: 'Data Science & AI',
      design: 'UI/UX Design',
      cloud: 'Cloud & DevOps',
      mobile: 'Mobile Dev',
      product: 'Product Management',
      filterBy: 'Filter By:',
      allCourses: 'All',
      freeCertOnly: 'Free Certificate Only',
      topRatedOnly: 'Top Rated',
      coursesMatched: 'Free Courses Matched',
      readyToStart: 'ready to start immediately',
      resetAll: 'Reset All Filters',
      levelFilter: 'Difficulty Level',
      allLevels: 'All Levels',
      beginner: 'Beginner',
      intermediate: 'Intermediate',
      advanced: 'Advanced',
      sortLabel: 'Sort',
      sortDefault: 'Default',
      sortAlphabetical: 'Alphabetical (A-Z)',
      sortAlphabeticalDesc: 'Alphabetical (Z-A)',
      sortLatest: 'Latest',
      sortOldest: 'Oldest',
    },
    card: {
      freeCert: 'Free Certificate',
      auditOnly: 'Full Access / Audit',
      enrollBtn: 'Enroll for Free',
      detailsBtn: 'Access Guide',
      saveTooltip: 'Save to My Learning List',
      savedTooltip: 'Saved in Bookmarks',
      hours: 'hrs',
      reviews: 'reviews',
      skillsLearned: 'Skills:',
      verifiedProvider: 'Official Provider',
    },
    catalog: {
      noCoursesFound: 'No Courses Found',
      resetFilters: 'Reset All Filters',
      showMore: 'Show More Courses',
      exploreAll: 'Explore All & Back to Top',
      displayingCount: 'Displaying',
      ofTotal: 'of',
      verifiedPaths: 'verified paths',
    },
    enrollModal: {
      title: 'Zero-Cost Access Guide',
      subtitle: 'Direct registration instructions without credit card requirement',
      guideTitle: 'bagiilmu.id 100% Free Access Guarantee',
      freeCertDesc: 'This course offers an official verified certificate of completion for free upon finishing all assignments and quizzes without hidden charges.',
      auditDesc: 'Course lectures and materials are completely free. When on the provider registration page, select "Audit Course" or "Free Track" without entering credit card details.',
      stepsTitle: 'Quick Steps to Begin Learning:',
      step1: 'Click "Proceed to Official Site" below to open the provider learning page.',
      step2: 'Sign up for a free account or log in with Google/GitHub without entering billing info.',
      step3: 'Select the "Audit" or "Free Track" option and access all video lessons and exercises.',
      skillsTitle: 'Skills You Will Master:',
      closeBtn: 'Close',
      directEnrollBtn: 'Proceed to Official Site',
      guaranteeText: 'Always free • No safelink or ad-walls • Safe & Legal',
    },
    community: {
      badge: 'Open Education Movement',
      title: 'Know an Incredible Free Learning Resource?',
      desc: 'Contribute to the open catalog by submitting a zero-cost university syllabus, official documentation track, or high-signal video series.',
      curatedCoursesCount: '2,480+ Curated Courses',
      contributorsCount: '350+ Verified Contributors',
      freeGuarantee: 'Always 100% Free Access',
      submitBtn: 'Submit a Free Course',
      browseBtn: 'Browse Submissions',
    },
    footer: {
      desc: 'A friction-free gateway to universal open education. Aggregating high-signal, zero-cost academic paths and community resources worldwide.',
      verifiedText: 'Verified Free & Open Access Catalog',
      directoriesTitle: 'Aggregated Global Partners',
      standardsTitle: 'Standards & Trust',
      guidelines: 'Community Guidelines',
      curationCriteria: 'Anti-Paywall Policy',
      privacy: 'Privacy & Terms',
      copyright: 'All Rights Reserved. Dedicated to open knowledge.',
      madeFor: 'Empowering future generations through shared knowledge.',
    },
    bookmarks: {
      title: 'Saved Courses',
      emptyTitle: 'No Saved Courses Yet',
      emptyDesc: 'Click the bookmark icon on any course card to save it here for quick access later.',
      browseCourses: 'Browse Catalog',
      removeAll: 'Clear All',
      itemCount: 'courses saved',
    },
    settings: {
      title: 'Preferences & Settings',
      languageTitle: 'Interface Language',
      languageDesc: 'Choose your default language for catalog discovery, navigation, and enrollment guides.',
      densityTitle: 'Card Display Density',
      densityComfortable: 'Comfortable',
      densityCompact: 'Compact',
      saveBtn: 'Save Preferences',
    },
    designSpecs: {
      modalTitle: 'bagiilmu.id Design Architecture & User Flows',
      tabWireframes: 'Interactive Wireframes',
      tabUserFlows: 'User Flow Diagrams',
      tabDesignSystem: 'Design System & Colors',
      close: 'Close',
    },
  },
};
