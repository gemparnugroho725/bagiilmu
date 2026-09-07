import React, { useState, useMemo, useEffect } from 'react';
import { Course, Category, SubFilter } from './types';
import { INITIAL_COURSES } from './data/courses';
import { Language, translations } from './lib/i18n';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { FilterToolbar } from './components/FilterToolbar';
import { CourseCard } from './components/CourseCard';
import { CommunityBanner } from './components/CommunityBanner';
import { Footer } from './components/Footer';
import { CuratorConsole } from './components/CuratorConsole';
import { EnrollModal } from './components/EnrollModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { UserSettingsModal } from './components/UserSettingsModal';
import { BookmarksModal } from './components/BookmarksModal';
import { DesignSystemModal } from './components/DesignSystemModal';
import { CommunitySubmissionModal } from './components/CommunitySubmissionModal';
import { UserAuthModal } from './components/UserAuthModal';
import { UserDashboard } from './components/UserDashboard';
import { 
  subscribeToCoursesDb, 
  seedCoursesIfEmptyDb, 
  addCourseToDb, 
  deleteCourseFromDb,
  clearAllCoursesDb,
  addPendingSubmissionToFirestore,
  saveUserProgressToFirestore,
  getUserProgressFromFirestore,
  updateUserProfileInFirestore
} from './lib/db';

export default function App() {
  // Localization: 'id' (Bahasa Indonesia) is Default as required
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem('bagiilmu_language');
      return (stored === 'en' || stored === 'id') ? stored : 'id';
    } catch {
      return 'id';
    }
  });

  const [currentView, setCurrentView] = useState<'public' | 'curator'>('public');
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const [activeCategory, setActiveCategory] = useState<Category>('all');
  const [activeSubFilter, setActiveSubFilter] = useState<SubFilter>('all');
  const [activeLevelFilter, setActiveLevelFilter] = useState<string>('all');
  const [activeProgressFilter, setActiveProgressFilter] = useState<string>('all');
  const [cardDensity, setCardDensity] = useState<'comfortable' | 'compact'>('comfortable');

  // Learning progress tracker state
  const [userCourseProgress, setUserCourseProgress] = useState<Record<string, 'unstarted' | 'in_progress' | 'completed'>>(() => {
    try {
      const saved = localStorage.getItem('bagiilmu_user_progress');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  
  // Bookmarks persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bagiilmu_bookmarks');
      return saved ? JSON.parse(saved) : ['course-1', 'course-2'];
    } catch {
      return ['course-1', 'course-2'];
    }
  });

  // Modals state
  const [selectedCourseForEnroll, setSelectedCourseForEnroll] = useState<Course | null>(null);
  const [showGuidelinesModal, setShowGuidelinesModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [showDesignSpecsModal, setShowDesignSpecsModal] = useState(false);
  const [visibleCount, setVisibleCount] = useState(6);

  // Admin authentication state (username: spar12, password: spar12)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return (
        localStorage.getItem('bagiilmu_admin_user') === 'spar12' ||
        localStorage.getItem('opencourse_admin_user') === 'spar12'
      );
    } catch {
      return false;
    }
  });
  const [adminUsername, setAdminUsername] = useState<string>('spar12');
  const [showLoginModal, setShowLoginModal] = useState(false);

  // User authentication state
  const [loggedInUser, setLoggedInUser] = useState<{ 
    username: string; 
    email?: string; 
    fullName?: string;
    avatarType?: 'initials' | 'character' | 'custom';
    characterId?: 'wizard' | 'explorer' | 'analyst' | 'guardian' | 'artist';
    avatarUrl?: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('bagiilmu_logged_in_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [showUserAuthModal, setShowUserAuthModal] = useState(false);
  const [loginReason, setLoginReason] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingCourseForConsole, setEditingCourseForConsole] = useState<Course | null>(null);

  const t = translations[language];

  // Save language preference
  const handleSwitchLanguage = (newLang: Language) => {
    setLanguage(newLang);
    try {
      localStorage.setItem('bagiilmu_language', newLang);
      document.documentElement.lang = newLang;
    } catch (e) {
      console.error(e);
    }
    showToast(
      newLang === 'id'
        ? 'Bahasa diatur ke Bahasa Indonesia (Bawaan).'
        : 'Language set to English.'
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  // Hidden /admin route detector
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/admin' || hash === '#/admin' || hash === '#admin') {
        if (!isAdminLoggedIn) {
          handleOpenLogin(
            language === 'id' 
              ? 'Portal Administrator bagiilmu.id' 
              : 'bagiilmu.id Administrator Portal'
          );
        } else {
          setCurrentView('curator');
        }
      }
    };
    handleLocation();
    window.addEventListener('popstate', handleLocation);
    window.addEventListener('hashchange', handleLocation);
    return () => {
      window.removeEventListener('popstate', handleLocation);
      window.removeEventListener('hashchange', handleLocation);
    };
  }, [isAdminLoggedIn, language]);

  // Real-time Database sync & initial database seeding
  useEffect(() => {
    seedCoursesIfEmptyDb(INITIAL_COURSES);

    const unsubscribe = subscribeToCoursesDb(
      (dbCourses) => {
        setCourses(dbCourses);
      },
      (err) => {
        console.warn('Database snapshot error, using local fallback:', err);
      }
    );

    return () => unsubscribe();
  }, []);

  // Sync bookmarks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bagiilmu_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  // Sync learning progress to localStorage and Firestore
  useEffect(() => {
    try {
      localStorage.setItem('bagiilmu_user_progress', JSON.stringify(userCourseProgress));
      // Save under stable ID, loggedInUser's username, or guest
      const stableUserKey = loggedInUser?.username || localStorage.getItem('bagiilmu_admin_user') || 'guest_student';
      saveUserProgressToFirestore(stableUserKey, userCourseProgress);
    } catch (e) {
      console.error(e);
    }
  }, [userCourseProgress, loggedInUser]);

  const handleUserAuthSuccess = async (user: { username: string; email?: string; fullName?: string }) => {
    setLoggedInUser(user);
    setCurrentView('dashboard');
    try {
      localStorage.setItem('bagiilmu_logged_in_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }
    showToast(
      language === 'id' 
        ? `Berhasil masuk sebagai @${user.username}!` 
        : `Logged in as @${user.username}!`
    );

    // Sync cloud progress
    try {
      const cloudProgress = await getUserProgressFromFirestore(user.username);
      if (cloudProgress && Object.keys(cloudProgress).length > 0) {
        setUserCourseProgress(cloudProgress);
        showToast(
          language === 'id'
            ? 'Sinkronisasi progres belajar dari akun cloud Anda berhasil!'
            : 'Learning progress synchronized from your cloud account successfully!'
        );
      } else {
        // If they have local progress, save it to cloud immediately
        if (Object.keys(userCourseProgress).length > 0) {
          await saveUserProgressToFirestore(user.username, userCourseProgress);
        }
      }
    } catch (err) {
      console.warn('Failed to sync progress on login:', err);
    }
  };

  const handleUpdateProfile = async (updatedData: {
    fullName: string;
    email: string;
    avatarType: 'initials' | 'character' | 'custom';
    characterId: 'wizard' | 'explorer' | 'analyst' | 'guardian' | 'artist';
    avatarUrl: string;
  }) => {
    if (!loggedInUser) return;
    
    // Save to Firestore
    await updateUserProfileInFirestore(loggedInUser.username, updatedData);
    
    // Update local state and localStorage
    const newUser = {
      ...loggedInUser,
      ...updatedData
    };
    
    setLoggedInUser(newUser);
    try {
      localStorage.setItem('bagiilmu_logged_in_user', JSON.stringify(newUser));
    } catch (e) {
      console.error(e);
    }
    
    showToast(
      language === 'id'
        ? 'Profil dan avatar Anda berhasil diperbarui!'
        : 'Your profile and avatar have been successfully updated!'
    );
  };

  const handleUserLogout = () => {
    setLoggedInUser(null);
    setCurrentView('public');
    try {
      localStorage.removeItem('bagiilmu_logged_in_user');
      localStorage.removeItem('bagiilmu_user_progress');
      setUserCourseProgress({});
    } catch (e) {
      console.error(e);
    }
    showToast(
      language === 'id' 
        ? 'Anda telah keluar dari akun siswa.' 
        : 'You have logged out from student account.'
    );
  };

  const handleOpenLogin = (reason?: string) => {
    setLoginReason(reason || null);
    setShowLoginModal(true);
  };

  const handleLoginSuccess = (user: string) => {
    setIsAdminLoggedIn(true);
    setAdminUsername(user);
    try {
      localStorage.setItem('bagiilmu_admin_user', user);
    } catch (e) {
      console.error(e);
    }
    setShowLoginModal(false);
    showToast(
      language === 'id'
        ? `Login berhasil! Selamat datang di Portal Admin bagiilmu.id, ${user}.`
        : `Login successful! Welcome to the bagiilmu.id Admin Portal, ${user}.`
    );
    setCurrentView('curator');
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('bagiilmu_admin_user');
      localStorage.removeItem('opencourse_admin_user');
    } catch (e) {
      console.error(e);
    }
    setIsAdminLoggedIn(false);
    setCurrentView('public');
    showToast(
      language === 'id'
        ? 'Berhasil logout dari akun Administrator.'
        : 'Successfully logged out from Administrator account.'
    );
  };

  const handleRequestSubmitCourse = () => {
    if (!isAdminLoggedIn) {
      if (!loggedInUser) {
        setShowUserAuthModal(true);
        showToast(
          language === 'id'
            ? 'Silakan Masuk atau Daftar Akun terlebih dahulu untuk dapat mengajukan kursus baru!'
            : 'Please Sign In or Register an account first to submit a new free course!'
        );
      } else {
        setShowSubmissionsModal(true);
        showToast(
          language === 'id'
            ? 'Silakan lengkapi formulir pengajuan kursus gratis Anda. Admin akan meninjau pengajuan ini.'
            : 'Please complete your free course submission form. Admin will review this submission.'
        );
      }
    } else {
      setCurrentView('curator');
    }
  };

  const handleNavigate = (view: 'public' | 'admin') => {
    if (view === 'admin') {
      if (isAdminLoggedIn) {
        setCurrentView('curator');
      } else {
        // No longer triggering login modal automatically via navigate call from public buttons
        // Admin must use the /admin URL as requested.
        showToast(
          language === 'id'
            ? 'Gunakan URL /admin untuk masuk ke Konsol Administrator.'
            : 'Use the /admin URL to access the Administrator Console.'
        );
      }
    } else {
      setCurrentView('public');
    }
  };

  // Filtered courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Category filter
      if (activeCategory !== 'all' && course.category !== activeCategory) {
        return false;
      }

      // Platform filter
      if (selectedPlatform !== 'all') {
        const pLower = course.platform.toLowerCase();
        const provLower = course.provider.toLowerCase();
        if (selectedPlatform === 'coursera' && !provLower.includes('coursera')) return false;
        if (selectedPlatform === 'edx' && !provLower.includes('edx')) return false;
        if (selectedPlatform === 'fcc' && !pLower.includes('fcc') && !provLower.includes('freecodecamp')) return false;
        if (selectedPlatform === 'mit' && !provLower.includes('mit')) return false;
        if (selectedPlatform === 'aws' && !provLower.includes('aws')) return false;
      }

      // Level filter
      if (activeLevelFilter !== 'all') {
        if (course.level.toLowerCase() !== activeLevelFilter.toLowerCase()) {
          return false;
        }
      }

      // Sub-filter
      if (activeSubFilter === 'cert_only' && !course.hasCertificate) {
        return false;
      }
      if (activeSubFilter === 'top_rated' && course.rating < 4.8) {
        return false;
      }

      // Progress status filter
      if (activeProgressFilter !== 'all') {
        const userStatus = userCourseProgress[course.id] || 'unstarted';
        if (userStatus !== activeProgressFilter) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = course.title.toLowerCase().includes(q);
        const matchProvider = course.provider.toLowerCase().includes(q);
        const matchDesc = course.description.toLowerCase().includes(q);
        const matchSkills = course.skills.some((s) => s.toLowerCase().includes(q));
        const matchCategory = course.categoryLabel.toLowerCase().includes(q);
        if (!matchTitle && !matchProvider && !matchDesc && !matchSkills && !matchCategory) {
          return false;
        }
      }

      return true;
    });
  }, [courses, activeCategory, selectedPlatform, activeLevelFilter, activeSubFilter, searchQuery, activeProgressFilter, userCourseProgress]);

  const handleToggleBookmark = (courseId: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(courseId);
      const updated = exists ? prev.filter((id) => id !== courseId) : [...prev, courseId];
      showToast(
        exists
          ? (language === 'id' ? 'Kursus dihapus dari daftar tersimpan.' : 'Course removed from bookmarks.')
          : (language === 'id' ? 'Kursus berhasil disimpan!' : 'Course added to bookmarks!')
      );
      return updated;
    });
  };

  const bookmarkedCourses = useMemo(() => {
    return courses.filter((c) => bookmarkedIds.includes(c.id));
  }, [courses, bookmarkedIds]);

  const handlePublishNewCourse = async (newCourse: Course) => {
    try {
      const saved = await addCourseToDb(newCourse);
      setCourses((prev) => [saved, ...prev.filter((c) => c.id !== saved.id)]);
      showToast(
        language === 'id'
          ? `Kursus "${saved.title}" berhasil dipublikasikan ke database!`
          : `Course "${saved.title}" successfully published to database!`
      );
    } catch (err) {
      console.error('Database save failed, fallback to local:', err);
      setCourses((prev) => [newCourse, ...prev]);
      showToast(`Kursus "${newCourse.title}" berhasil ditambahkan.`);
    }

    // Reset filters to show the newly added course
    setActiveCategory('all');
    setActiveSubFilter('all');
    setActiveLevelFilter('all');
    setSearchQuery('');
    setSelectedPlatform('all');
    setCurrentView('public');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleDeleteCourse = async (courseId: string) => {
    try {
      await deleteCourseFromDb(courseId);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      showToast(
        language === 'id' ? 'Kursus berhasil dihapus dari database.' : 'Course deleted from database.'
      );
    } catch (err) {
      console.error('Failed to delete course from database:', err);
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
      showToast('Kursus dihapus.');
    }
  };

  const handleClearDatabase = async () => {
    try {
      await clearAllCoursesDb();
      showToast(
        language === 'id' ? 'Database berhasil dikosongkan.' : 'Database cleared successfully.'
      );
    } catch (err) {
      console.error('Failed to clear database:', err);
      showToast('Gagal mengosongkan database.');
    }
  };

  const handleResetToSample = async () => {
    try {
      localStorage.removeItem('bagiilmu_db_cleared_by_admin');
      await seedCoursesIfEmptyDb(INITIAL_COURSES);
      showToast(
        language === 'id' ? 'Sampel data berhasil dimuat ulang.' : 'Sample data reloaded successfully.'
      );
    } catch (err) {
      console.error('Failed to reset to sample:', err);
      showToast('Gagal memuat ulang sampel.');
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex flex-col selection:bg-blue-600 selection:text-white">
      {/* Fixed Navigation Header (Public & Dashboard Views) */}
      {currentView !== 'curator' && (
        <Navbar
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'admin') {
              handleNavigate('admin');
            } else {
              setCurrentView(view);
            }
          }}
          onRequestSubmit={handleRequestSubmitCourse}
          isAdminLoggedIn={isAdminLoggedIn}
          adminUsername={adminUsername}
          onLogout={handleLogout}
          onSearchFocus={() => {
            const el = document.getElementById('main-course-search');
            el?.focus();
          }}
          language={language}
          onSwitchLanguage={handleSwitchLanguage}
          bookmarkedCount={bookmarkedIds.length}
          onOpenBookmarks={() => setShowBookmarksModal(true)}
          onOpenDesignSpecs={() => setShowDesignSpecsModal(true)}
          onOpenSettings={() => setShowSettingsModal(true)}
          loggedInUser={loggedInUser}
          onOpenAuth={() => setShowUserAuthModal(true)}
          onUserLogout={handleUserLogout}
        />
      )}

      {/* Floating Status Notification Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 animate-bounce">
          <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#090d16] border border-blue-500/40 text-white text-xs font-bold shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <span className="material-symbols-outlined text-[18px] text-blue-400">info</span>
            <span>{toastMessage}</span>
            <button
              onClick={() => setToastMessage(null)}
              className="text-zinc-500 hover:text-white p-0.5 ml-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        </div>
      )}

      {currentView === 'curator' ? (
        /* CURATOR HUB CONSOLE */
        <CuratorConsole
          onBackToCatalog={() => {
            setCurrentView('public');
            setEditingCourseForConsole(null);
          }}
          onPublishCourse={handlePublishNewCourse}
          courses={courses}
          onDeleteCourse={handleDeleteCourse}
          onClearDatabase={handleClearDatabase}
          onResetToSample={handleResetToSample}
          adminUsername={adminUsername}
          onLogout={handleLogout}
          initialEditingCourse={editingCourseForConsole}
        />
      ) : currentView === 'dashboard' && loggedInUser ? (
        /* STUDENT USER DASHBOARD */
        <UserDashboard
          loggedInUser={loggedInUser}
          courses={courses}
          userCourseProgress={userCourseProgress}
          onChangeLearningStatus={(courseId, status) => {
            setUserCourseProgress((prev) => {
              const updated = { ...prev, [courseId]: status };
              showToast(
                language === 'id'
                  ? 'Status progress belajar berhasil diperbarui!'
                  : 'Learning progress status updated successfully!'
              );
              return updated;
            });
          }}
          bookmarkedIds={bookmarkedIds}
          onToggleBookmark={handleToggleBookmark}
          onEnroll={(c) => setSelectedCourseForEnroll(c)}
          language={language}
          onBackToCatalog={() => setCurrentView('public')}
          onUpdateProfile={handleUpdateProfile}
        />
      ) : (
        /* PUBLIC DIRECTORY & CATALOG */
        <div className="pt-16 flex-1 flex flex-col">
          {/* Hero Section with Search & Trending */}
          <HeroSection
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedPlatform={selectedPlatform}
            onPlatformChange={setSelectedPlatform}
            onSearchSubmit={() => {
              const grid = document.getElementById('course-grid');
              grid?.scrollIntoView({ behavior: 'smooth' });
            }}
            language={language}
            onOpenDesignSpecs={() => setShowDesignSpecsModal(true)}
          />

          {/* Tracks Filter Rail & Sort */}
          <FilterToolbar
            activeCategory={activeCategory}
            onSelectCategory={(cat) => {
              setActiveCategory(cat);
              setVisibleCount(6);
            }}
            activeSubFilter={activeSubFilter}
            onSelectSubFilter={(sub) => {
              setActiveSubFilter(sub);
              setVisibleCount(6);
            }}
            activeLevelFilter={activeLevelFilter}
            onSelectLevelFilter={setActiveLevelFilter}
            matchCount={filteredCourses.length}
            totalCatalogCount="2.480"
            language={language}
            activeProgressFilter={activeProgressFilter}
            onSelectProgressFilter={setActiveProgressFilter}
          />

          {/* Catalog Grid Section */}
          <main className="max-w-[1280px] mx-auto px-6 py-12 w-full flex-1">
            {filteredCourses.length === 0 ? (
              <div className="bg-[#090d16] rounded-2xl p-12 text-center border border-white/15 max-w-lg mx-auto my-8 shadow-2xl">
                <span className="material-symbols-outlined text-[48px] text-zinc-500 mb-3">
                  search_off
                </span>
                <h3 className="text-xl font-black uppercase tracking-tight text-white mb-2">
                  {t.catalog.noCoursesFound}
                </h3>
                <p className="text-sm text-zinc-400 mb-6 leading-relaxed font-normal">
                  {language === 'id'
                    ? `Tidak ada kursus yang cocok dengan filter atau kata kunci "${searchQuery}". Coba sesuaikan kata pencarian atau bersihkan filter.`
                    : `No courses matched your filters or search query "${searchQuery}". Try adjusting your keywords or clearing the active filters.`}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                    setSelectedPlatform('all');
                    setActiveSubFilter('all');
                    setActiveLevelFilter('all');
                  }}
                  className="px-6 py-2.5 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-500 transition-colors cursor-pointer border border-blue-400/30 shadow-md"
                >
                  {t.catalog.resetFilters}
                </button>
              </div>
            ) : (
              <>
                <div
                  id="course-grid"
                  className={`grid grid-cols-1 ${
                    cardDensity === 'compact'
                      ? 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5'
                      : 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-6'
                  }`}
                >
                  {filteredCourses.slice(0, visibleCount).map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={(c) => setSelectedCourseForEnroll(c)}
                      onDelete={isAdminLoggedIn ? handleDeleteCourse : undefined}
                      onEdit={
                        isAdminLoggedIn
                          ? (c) => {
                              setEditingCourseForConsole(c);
                              setCurrentView('curator');
                            }
                          : undefined
                      }
                      isBookmarked={bookmarkedIds.includes(course.id)}
                      onToggleBookmark={handleToggleBookmark}
                      language={language}
                      density={cardDensity}
                      learningStatus={userCourseProgress[course.id] || 'unstarted'}
                      onChangeLearningStatus={(courseId, status) => {
                        if (!loggedInUser) {
                          setShowUserAuthModal(true);
                          showToast(
                            language === 'id'
                              ? 'Fitur penanda progress belajar hanya dapat diakses setelah masuk sebagai Siswa!'
                              : 'Learning progress tracking feature is only accessible after logging in as a Student!'
                          );
                          return;
                        }
                        setUserCourseProgress((prev) => {
                          const updated = { ...prev, [courseId]: status };
                          showToast(
                            language === 'id'
                              ? 'Status progress belajar berhasil diperbarui!'
                              : 'Learning progress status updated successfully!'
                          );
                          return updated;
                        });
                      }}
                    />
                  ))}
                </div>

                {/* Explore All Bottom CTA Button */}
                <div className="mt-14 flex flex-col items-center justify-center gap-3">
                  {visibleCount < filteredCourses.length ? (
                    <button
                      onClick={() => setVisibleCount((prev) => prev + 6)}
                      className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 px-7 py-3 text-xs font-black uppercase tracking-wider text-white border border-white/15 hover:border-white/30 shadow-xl transition-all cursor-pointer"
                    >
                      <span>{t.catalog.showMore}</span>
                      <span className="material-symbols-outlined text-[18px]">expand_more</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-white/5 hover:bg-white/10 px-7 py-3 text-xs font-black uppercase tracking-wider text-white border border-white/15 hover:border-white/30 shadow-xl transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">explore</span>
                      <span>{t.catalog.exploreAll}</span>
                    </button>
                  )}
                  <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                    {t.catalog.displayingCount} {Math.min(visibleCount, filteredCourses.length)} {t.catalog.ofTotal} {filteredCourses.length} {t.catalog.verifiedPaths}
                  </span>
                </div>
              </>
            )}
          </main>

          {/* Open Education Collective Community Banner */}
          <CommunityBanner
            onSubmitCourse={handleRequestSubmitCourse}
            onBrowseSubmissions={() => setShowSubmissionsModal(true)}
            language={language}
          />

          {/* Footer */}
          <Footer 
            onOpenGuidelines={() => setShowGuidelinesModal(true)} 
            language={language}
            onOpenDesignSpecs={() => setShowDesignSpecsModal(true)}
          />
        </div>
      )}

      {/* Floating View Switcher Button (Bottom-Right for easy navigation on Public View) */}
      {currentView === 'public' && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
          {/* Quick Wireframes & Specs Pill */}
          <button
            onClick={() => setShowDesignSpecsModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#090d16]/90 text-blue-300 hover:text-white text-xs font-black uppercase tracking-wider shadow-2xl backdrop-blur-md border border-blue-500/40 hover:border-blue-400 transition-all cursor-pointer"
            title="Wireframe & Alur Prototype"
          >
            <span className="material-symbols-outlined text-[16px] text-blue-400">architecture</span>
            <span>Wireframes &amp; Flow</span>
          </button>
        </div>
      )}

      {/* Admin Login Modal (spar12:spar12) */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        reason={loginReason}
      />

      {/* Enrollment Guidance Modal */}
      <EnrollModal
        course={selectedCourseForEnroll}
        onClose={() => setSelectedCourseForEnroll(null)}
        language={language}
      />

      {/* User Settings Modal */}
      <UserSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        language={language}
        onSelectLanguage={handleSwitchLanguage}
        cardDensity={cardDensity}
        onSelectDensity={setCardDensity}
        showToast={showToast}
      />

      {/* Bookmarks / Saved Courses Modal */}
      <BookmarksModal
        isOpen={showBookmarksModal}
        onClose={() => setShowBookmarksModal(false)}
        bookmarkedCourses={bookmarkedCourses}
        onRemoveBookmark={handleToggleBookmark}
        onClearAll={() => {
          setBookmarkedIds([]);
          showToast(
            language === 'id' ? 'Semua kursus tersimpan telah dihapus.' : 'All saved courses cleared.'
          );
        }}
        onEnroll={(c) => setSelectedCourseForEnroll(c)}
        language={language}
      />

      {/* Design System, Wireframes & User Flows Interactive Prototype Modal */}
      <DesignSystemModal
        isOpen={showDesignSpecsModal}
        onClose={() => setShowDesignSpecsModal(false)}
        language={language}
        onSwitchLanguage={handleSwitchLanguage}
      />

      {/* Community Guidelines Modal */}
      {showGuidelinesModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#090d16] rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative border border-white/15">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
                  <span className="material-symbols-outlined text-[20px]">verified</span>
                </span>
                <h3 className="text-lg font-black uppercase tracking-tight text-white">
                  {language === 'id' ? 'Kebijakan Standar & Kepercayaan' : 'Standards & Trust Policy'}
                </h3>
              </div>
              <button
                onClick={() => setShowGuidelinesModal(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="space-y-3 text-xs text-zinc-300 leading-relaxed mb-6 font-normal">
              <p>
                <strong className="text-white">1. Zero Hidden Paywalls:</strong>{' '}
                {language === 'id'
                  ? 'Setiap materi yang dikurasi ke dalam bagiilmu.id wajib dapat diakses bebas biaya tanpa membutuhkan kartu kredit, masa trial berbayar, atau manipulasi biaya terselubung.'
                  : 'Every resource curated in bagiilmu.id must be accessible free of charge without requiring credit cards, paid trials, or hidden fees.'}
              </p>
              <p>
                <strong className="text-white">2. Academic &amp; Industry Quality:</strong>{' '}
                {language === 'id'
                  ? 'Kurikulum disaring dari institusi pendidikan terakreditasi (MIT, Harvard, Stanford) serta komunitas teknik terbuka global (freeCodeCamp, Linux Foundation).'
                  : 'Curricula are filtered from accredited universities (MIT, Harvard, Stanford) and global open technical communities (freeCodeCamp, Linux Foundation).'}
              </p>
              <p>
                <strong className="text-white">3. Audit vs Verified Certificate:</strong>{' '}
                {language === 'id'
                  ? 'Kami secara transparan mencantumkan apakah kursus menyediakan sertifikat gratis atau berstatus Free Audit.'
                  : 'We transparently disclose whether a course offers a verified free certificate or is a free audit track.'}
              </p>
            </div>
            <button
              onClick={() => setShowGuidelinesModal(false)}
              className="w-full py-3 rounded-full bg-blue-600 text-white text-xs font-black uppercase tracking-wider hover:bg-blue-500 transition-colors cursor-pointer border border-blue-400/30"
            >
              {language === 'id' ? 'Saya Mengerti' : 'I Understand'}
            </button>
          </div>
        </div>
      )}

      {/* Community Submissions Modal */}
      <CommunitySubmissionModal
        isOpen={showSubmissionsModal}
        onClose={() => setShowSubmissionsModal(false)}
        defaultAuthor={loggedInUser?.fullName || loggedInUser?.username || ''}
        onSubmit={async (submission) => {
          const submissionPayload = {
            ...submission,
            status: 'pending' as const,
            submittedTime: 'Baru saja'
          };
          await addPendingSubmissionToFirestore(submissionPayload);
          showToast(
            language === 'id' 
              ? 'Terima kasih! Pengajuan Anda berhasil dikirim ke antrean review Admin.' 
              : 'Thank you! Your submission has been successfully sent to the Admin review queue.'
          );
          setShowSubmissionsModal(false);
        }}
      />

      {/* User Authentication Modal (Login/Register) */}
      <UserAuthModal
        isOpen={showUserAuthModal}
        onClose={() => setShowUserAuthModal(false)}
        onAuthSuccess={handleUserAuthSuccess}
        language={language}
      />
    </div>
  );
}
