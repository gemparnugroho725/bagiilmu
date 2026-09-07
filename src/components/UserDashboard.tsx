import React, { useState, useMemo, useEffect } from 'react';
import { Course, CourseLearningStatus } from '../types';
import { CourseCard } from './CourseCard';
import { Language } from '../lib/i18n';
import { UserAvatar, PRESET_CHARACTERS } from './UserAvatar';

interface UserDashboardProps {
  loggedInUser: { 
    username: string; 
    email?: string; 
    fullName?: string;
    avatarType?: 'initials' | 'character' | 'custom';
    characterId?: 'wizard' | 'explorer' | 'analyst' | 'guardian' | 'artist';
    avatarUrl?: string;
  };
  courses: Course[];
  userCourseProgress: Record<string, CourseLearningStatus>;
  onChangeLearningStatus: (courseId: string, status: CourseLearningStatus) => void;
  bookmarkedIds: string[];
  onToggleBookmark: (courseId: string) => void;
  onEnroll: (course: Course) => void;
  language: Language;
  onBackToCatalog: () => void;
  onUpdateProfile: (updatedData: {
    fullName: string;
    email: string;
    avatarType: 'initials' | 'character' | 'custom';
    characterId: 'wizard' | 'explorer' | 'analyst' | 'guardian' | 'artist';
    avatarUrl: string;
  }) => Promise<void>;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  loggedInUser,
  courses,
  userCourseProgress,
  onChangeLearningStatus,
  bookmarkedIds,
  onToggleBookmark,
  onEnroll,
  language,
  onBackToCatalog,
  onUpdateProfile,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ongoing' | 'completed' | 'bookmarked'>('all');

  // Edit profile states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFullName, setEditFullName] = useState(loggedInUser.fullName || '');
  const [editEmail, setEditEmail] = useState(loggedInUser.email || '');
  const [editAvatarType, setEditAvatarType] = useState<'initials' | 'character' | 'custom'>(loggedInUser.avatarType || 'initials');
  const [editCharacterId, setEditCharacterId] = useState<'wizard' | 'explorer' | 'analyst' | 'guardian' | 'artist'>(loggedInUser.characterId || 'wizard');
  const [editAvatarUrl, setEditAvatarUrl] = useState(loggedInUser.avatarUrl || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  // Sync state if user changes in parent
  useEffect(() => {
    setEditFullName(loggedInUser.fullName || '');
    setEditEmail(loggedInUser.email || '');
    setEditAvatarType(loggedInUser.avatarType || 'initials');
    setEditCharacterId(loggedInUser.characterId || 'wizard');
    setEditAvatarUrl(loggedInUser.avatarUrl || '');
  }, [loggedInUser]);

  // Filter courses that are either bookmarked or have progress
  const interactedCourses = useMemo(() => {
    return courses.filter((course) => {
      const hasProgress = userCourseProgress[course.id] && userCourseProgress[course.id] !== 'unstarted';
      const isBookmarked = bookmarkedIds.includes(course.id);
      return hasProgress || isBookmarked;
    });
  }, [courses, userCourseProgress, bookmarkedIds]);

  // Tab filtering
  const filteredCourses = useMemo(() => {
    return interactedCourses.filter((course) => {
      const progress = userCourseProgress[course.id] || 'unstarted';
      const isBookmarked = bookmarkedIds.includes(course.id);

      if (activeTab === 'ongoing') {
        return progress === 'in_progress';
      }
      if (activeTab === 'completed') {
        return progress === 'completed';
      }
      if (activeTab === 'bookmarked') {
        return isBookmarked;
      }
      return true; // 'all'
    });
  }, [interactedCourses, activeTab, userCourseProgress, bookmarkedIds]);

  // Calculations for Stats
  const ongoingCount = useMemo(() => {
    return Object.values(userCourseProgress).filter((status) => status === 'in_progress').length;
  }, [userCourseProgress]);

  const completedCount = useMemo(() => {
    return Object.values(userCourseProgress).filter((status) => status === 'completed').length;
  }, [userCourseProgress]);

  const bookmarkedCount = bookmarkedIds.length;

  return (
    <div className="pt-24 pb-16 px-4 sm:px-6 max-w-[1280px] mx-auto w-full min-h-[85vh] flex flex-col">
      {/* Back to catalog & Welcome Banner */}
      <div className="mb-8">
        <button
          onClick={onBackToCatalog}
          className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors cursor-pointer mb-6"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>{language === 'id' ? 'Kembali ke Katalog' : 'Back to Catalog'}</span>
        </button>

        {/* Dashboard Title Panel */}
        <div className="relative p-6 sm:p-8 rounded-2xl overflow-hidden bg-[#090d16] border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-600/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10">
            <UserAvatar
              username={loggedInUser.username}
              fullName={loggedInUser.fullName}
              avatarType={loggedInUser.avatarType}
              characterId={loggedInUser.characterId as any}
              avatarUrl={loggedInUser.avatarUrl}
              size="lg"
            />
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider text-blue-400">
                {language === 'id' ? 'Dashboard Siswa' : 'Student Portal'}
              </span>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mt-1">
                {loggedInUser.fullName || loggedInUser.username}
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">@{loggedInUser.username} • {loggedInUser.email || 'No email specified'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 relative z-10 shrink-0">
            <div className="flex items-center gap-3">
              <span className="p-2 bg-emerald-500/10 border border-emerald-500/25 rounded-xl text-emerald-400">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </span>
              <div className="text-left">
                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Status Akun</div>
                <div className="text-xs font-black uppercase text-emerald-400 tracking-wide">Terverifikasi Cloud</div>
              </div>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 hover:text-white transition-all duration-200 cursor-pointer text-xs font-black uppercase tracking-wider hover:scale-[1.02]"
              title={language === 'id' ? 'Edit Profil & Avatar Saya' : 'Edit My Profile & Avatar'}
            >
              <span className="material-symbols-outlined text-[16px]">edit_square</span>
              <span>{language === 'id' ? 'Edit Profil' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Numerical Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border border-white/10 shadow-lg flex items-center gap-4">
          <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/25 text-blue-400">
            <span className="material-symbols-outlined text-[20px]">menu_book</span>
          </span>
          <div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Total Aktivitas</div>
            <div className="text-lg sm:text-xl font-black text-white">{interactedCourses.length}</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border border-white/10 shadow-lg flex items-center gap-4">
          <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400">
            <span className="material-symbols-outlined text-[20px]">bolt</span>
          </span>
          <div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Sedang Belajar</div>
            <div className="text-lg sm:text-xl font-black text-white">{ongoingCount}</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border border-white/10 shadow-lg flex items-center gap-4">
          <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400">
            <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
          </span>
          <div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Sudah Selesai</div>
            <div className="text-lg sm:text-xl font-black text-white">{completedCount}</div>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#090d16] border border-white/10 shadow-lg flex items-center gap-4">
          <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/25 text-rose-400">
            <span className="material-symbols-outlined text-[20px]">bookmark</span>
          </span>
          <div>
            <div className="text-[10px] text-zinc-500 font-black uppercase tracking-wider">Disimpan</div>
            <div className="text-lg sm:text-xl font-black text-white">{bookmarkedCount}</div>
          </div>
        </div>
      </div>

      {/* Main Filter Tabs for User Dashboard */}
      <div className="border-b border-white/10 flex items-center gap-2 mb-6 overflow-x-auto pb-0.5">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'all'
              ? 'border-blue-500 text-blue-400 font-black'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          {language === 'id' ? 'Semua Aktivitas' : 'All Activity'} ({interactedCourses.length})
        </button>

        <button
          onClick={() => setActiveTab('ongoing')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'ongoing'
              ? 'border-amber-500 text-amber-400 font-black'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          {language === 'id' ? 'Sedang Belajar' : 'Ongoing'} ({ongoingCount})
        </button>

        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'completed'
              ? 'border-emerald-500 text-emerald-400 font-black'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          {language === 'id' ? 'Selesai Belajar' : 'Completed'} ({completedCount})
        </button>

        <button
          onClick={() => setActiveTab('bookmarked')}
          className={`px-4 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
            activeTab === 'bookmarked'
              ? 'border-rose-500 text-rose-400 font-black'
              : 'border-transparent text-zinc-400 hover:text-white'
          }`}
        >
          {language === 'id' ? 'Kursus Disimpan' : 'Bookmarked'} ({bookmarkedCount})
        </button>
      </div>

      {/* Display Grid */}
      <div className="flex-1">
        {filteredCourses.length === 0 ? (
          <div className="text-center py-16 bg-[#090d16] rounded-2xl border border-white/10 max-w-md mx-auto my-6 shadow-xl">
            <span className="material-symbols-outlined text-[48px] text-zinc-600 mb-3">folder_open</span>
            <h3 className="text-base font-black text-white uppercase tracking-wider">
              {language === 'id' ? 'Belum Ada Kursus' : 'No Courses Found'}
            </h3>
            <p className="text-xs text-zinc-400 mt-1.5 px-6 leading-relaxed">
              {activeTab === 'ongoing'
                ? (language === 'id' ? 'Kamu belum menandai kursus apa pun sebagai "Sedang Belajar".' : 'You have not marked any courses as "In Progress" yet.')
                : activeTab === 'completed'
                ? (language === 'id' ? 'Kamu belum menandai kursus apa pun sebagai "Selesai". Terus belajar!' : 'You have not marked any courses as "Completed" yet. Keep studying!')
                : activeTab === 'bookmarked'
                ? (language === 'id' ? 'Kamu belum menyimpan kursus apa pun ke bookmark.' : 'You have not saved any courses to your bookmarks.')
                : (language === 'id' ? 'Mulai perjalanan belajarmu dengan membuka katalog utama kami!' : 'Start your learning journey by browsing our main free catalog!')}
            </p>
            <button
              onClick={onBackToCatalog}
              className="mt-6 px-5 py-2.5 rounded-full bg-blue-600 text-white text-[11px] font-black uppercase tracking-wider hover:bg-blue-500 transition-colors cursor-pointer shadow-md shadow-blue-600/25 border border-blue-400/20"
            >
              {language === 'id' ? 'Jelajahi Kursus Gratis' : 'Explore Free Courses'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onEnroll={onEnroll}
                isBookmarked={bookmarkedIds.includes(course.id)}
                onToggleBookmark={onToggleBookmark}
                language={language}
                learningStatus={userCourseProgress[course.id] || 'unstarted'}
                onChangeLearningStatus={onChangeLearningStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-[#02050b]/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#090d16] border border-white/10 rounded-2xl w-full max-w-xl p-6 sm:p-8 relative shadow-2xl animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 text-zinc-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            <div className="mb-6">
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider text-blue-400">
                {language === 'id' ? 'Pengaturan Profil' : 'Profile Settings'}
              </span>
              <h2 className="text-xl font-black uppercase text-white mt-1.5 tracking-tight">
                {language === 'id' ? 'Edit Profil Belajar' : 'Edit Study Profile'}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {language === 'id' ? 'Ubah identitas dasar dan pilih karakter belajarmu.' : 'Change basic details and select your learning character.'}
              </p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                setModalError(null);
                if (!editFullName.trim()) {
                  setModalError(language === 'id' ? 'Nama lengkap tidak boleh kosong!' : 'Full name cannot be empty!');
                  return;
                }
                if (!editEmail.trim()) {
                  setModalError(language === 'id' ? 'Email tidak boleh kosong!' : 'Email cannot be empty!');
                  return;
                }
                setIsUpdating(true);
                try {
                  await onUpdateProfile({
                    fullName: editFullName.trim(),
                    email: editEmail.trim(),
                    avatarType: editAvatarType,
                    characterId: editCharacterId,
                    avatarUrl: editAvatarUrl.trim(),
                  });
                  setIsEditModalOpen(false);
                } catch (err: any) {
                  setModalError(err.message || 'Gagal memperbarui profil.');
                } finally {
                  setIsUpdating(false);
                }
              }}
              className="space-y-5"
            >
              {modalError && (
                <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-500/20 text-red-300 text-xs font-bold uppercase tracking-wide flex items-center gap-2">
                  <span className="material-symbols-outlined text-[16px] shrink-0">error</span>
                  <span>{modalError}</span>
                </div>
              )}

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1.5">
                    {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    value={editFullName}
                    onChange={(e) => setEditFullName(e.target.value)}
                    required
                    className="w-full bg-[#05080e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold"
                    placeholder="Nama Lengkap"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full bg-[#05080e] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-bold"
                    placeholder="nama@email.com"
                  />
                </div>
              </div>

              {/* Avatar Type Selector */}
              <div>
                <label className="block text-[10px] font-black text-zinc-400 uppercase tracking-wider mb-2">
                  {language === 'id' ? 'Pilih Jenis Avatar' : 'Select Avatar Type'}
                </label>
                <div className="grid grid-cols-3 gap-2 bg-[#05080e] p-1 border border-white/10 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setEditAvatarType('initials')}
                    className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      editAvatarType === 'initials'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {language === 'id' ? 'Inisial' : 'Initials'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditAvatarType('character')}
                    className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      editAvatarType === 'character'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {language === 'id' ? 'Karakter' : 'Character'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditAvatarType('custom')}
                    className={`py-2 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors cursor-pointer ${
                      editAvatarType === 'custom'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {language === 'id' ? 'Link Gambar' : 'Custom Image'}
                  </button>
                </div>
              </div>

              {/* Dynamic Sub-configurator based on avatarType */}
              <div className="p-4 bg-[#05080e] border border-white/10 rounded-xl min-h-[140px] flex flex-col justify-center">
                {editAvatarType === 'initials' && (
                  <div className="text-center py-2">
                    <p className="text-xs text-zinc-400 font-bold leading-relaxed">
                      {language === 'id' 
                        ? 'Inisial nama Anda akan digunakan secara otomatis pada latar belakang gradien yang indah.'
                        : 'Your name initials will be automatically used over a beautiful gradient background.'}
                    </p>
                  </div>
                )}

                {editAvatarType === 'character' && (
                  <div>
                    <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-2 text-center">
                      {language === 'id' ? 'Pilih Salah Satu Karakter Belajar (5 Karakter Kustom)' : 'Select One Learning Character (5 Custom Characters)'}
                    </span>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(PRESET_CHARACTERS).map(([id, char]) => {
                        const isSelected = editCharacterId === id;
                        return (
                          <button
                            key={id}
                            type="button"
                            onClick={() => setEditCharacterId(id as any)}
                            className={`p-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-blue-600/15 border-blue-500 text-white scale-105 shadow-md shadow-blue-500/10'
                                : 'bg-[#090d16] border-white/5 text-zinc-400 hover:text-white hover:border-white/15'
                            }`}
                          >
                            <span className="text-2xl filter drop-shadow-sm">{char.emoji}</span>
                            <span className="text-[8px] font-black uppercase text-center leading-tight tracking-tight w-full truncate px-1">
                              {language === 'id' ? char.labelId : char.labelEn}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {editAvatarType === 'custom' && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[9px] font-black text-zinc-500 uppercase tracking-wider mb-1.5">
                        {language === 'id' ? 'Link URL Gambar Kustom' : 'Custom Image URL'}
                      </label>
                      <input
                        type="url"
                        value={editAvatarUrl}
                        onChange={(e) => setEditAvatarUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full bg-[#090d16] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
                      />
                    </div>
                    <p className="text-[10px] text-zinc-500 font-bold leading-snug">
                      💡 {language === 'id' 
                        ? 'Masukkan URL gambar publik kustom Anda (misal: Unsplash, Imgur, GitHub profile image, dll).' 
                        : 'Enter your custom public image URL (e.g. Unsplash, Imgur, GitHub profile picture, etc.).'}
                    </p>
                  </div>
                )}
              </div>

              {/* Avatar Live Preview Center */}
              <div className="pt-2.5 border-t border-white/5 flex items-center justify-between gap-4">
                <div className="text-left">
                  <span className="block text-[9px] font-black text-zinc-500 uppercase tracking-wider">
                    {language === 'id' ? 'Preview Tampilan' : 'Live Preview'}
                  </span>
                  <p className="text-[10px] text-zinc-400 font-bold mt-0.5 max-w-[200px] leading-tight">
                    {language === 'id' ? 'Tampilan avatar baru Anda di dashboard & navbar.' : 'Your new avatar on your dashboard & navbar.'}
                  </p>
                </div>

                <div className="flex items-center gap-4 bg-[#05080e] p-3 border border-white/10 rounded-2xl shrink-0">
                  {/* Dashboard Size Preview */}
                  <div className="flex flex-col items-center">
                    <UserAvatar
                      username={loggedInUser.username}
                      fullName={editFullName || loggedInUser.fullName}
                      avatarType={editAvatarType}
                      characterId={editCharacterId}
                      avatarUrl={editAvatarUrl}
                      size="lg"
                    />
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-wider mt-1.5">Profile</span>
                  </div>

                  {/* Divider */}
                  <div className="w-px h-10 bg-white/10" />

                  {/* Navbar Size Preview */}
                  <div className="flex flex-col items-center">
                    <UserAvatar
                      username={loggedInUser.username}
                      fullName={editFullName || loggedInUser.fullName}
                      avatarType={editAvatarType}
                      characterId={editCharacterId}
                      avatarUrl={editAvatarUrl}
                      size="sm"
                    />
                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-wider mt-1.5">Navbar</span>
                  </div>
                </div>
              </div>

              {/* Footer Button Group */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isUpdating}
                  className="px-5 py-2.5 rounded-xl border border-white/10 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer min-h-[44px]"
                >
                  {language === 'id' ? 'Batal' : 'Cancel'}
                </button>

                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <span className="w-4 h-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                      <span>{language === 'id' ? 'Menyimpan...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[16px]">save</span>
                      <span>{language === 'id' ? 'Simpan Perubahan' : 'Save Changes'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
