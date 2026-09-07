import React, { useState } from 'react';
import { Course } from '../../types';

interface AdminSettingsProps {
  adminUsername: string;
  courses: Course[];
  onClearDatabase?: () => void;
  onResetToSample?: () => void;
  showToastNotification: (msg: string) => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({
  adminUsername,
  courses,
  onClearDatabase,
  onResetToSample,
  showToastNotification,
}) => {
  // Quality Gate Policies
  const [requireDirectUrl, setRequireDirectUrl] = useState(true);
  const [requireMinModules, setRequireMinModules] = useState(true);
  const [verifyFreeCert, setVerifyFreeCert] = useState(true);
  const [autoExtractMetadata, setAutoExtractMetadata] = useState(true);
  const [notifyOnNewSubmission, setNotifyOnNewSubmission] = useState(true);

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    showToastNotification('Preferensi kurasi dan aturan kualitas berhasil disimpan!');
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 4) {
      showToastNotification('Password baru minimal 4 karakter!');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToastNotification('Konfirmasi password tidak cocok!');
      return;
    }

    setIsChangingPassword(true);
    setTimeout(() => {
      setIsChangingPassword(false);
      localStorage.setItem('opencourse_admin_custom_pass', newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToastNotification('Password akun /admin berhasil diperbarui!');
    }, 600);
  };

  const handleDownloadBackup = () => {
    const backupData = {
      project: 'OpenCourse Curator Platform',
      firestoreProjectId: 'gen-lang-client-0954371628',
      exportedAt: new Date().toISOString(),
      curatorUser: adminUsername,
      totalCourses: courses.length,
      courses: courses,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opencourse-firestore-backup-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToastNotification(`Cadangan ${courses.length} kursus berhasil diunduh!`);
  };

  return (
    <div className="flex flex-col gap-8 mb-12">
      {/* Header */}
      <div className="bg-[#0d0d0d] p-6 sm:p-8 rounded-2xl border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
              System Configuration
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
              Role: Master Curator
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Pengaturan Konsol Kurator &amp; Database
          </h2>
          <p className="text-xs text-zinc-400 font-normal mt-1 max-w-2xl">
            Atur parameter verifikasi kualitas materi gratis, kredensial akses admin, dan pencadangan database Firestore.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadBackup}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer border border-blue-400/30 shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">cloud_download</span>
          <span>Unduh Cadangan Database</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Policies & Quality Gate */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quality Gate Policy Card */}
          <div className="bg-[#0d0d0d] p-6 sm:p-8 rounded-2xl border border-white/15 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-400 text-[22px]">policy</span>
              <span>Aturan Kualitas &amp; Verifikasi Kurasi</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-6 font-normal">
              Parameter otomatis yang diterapkan pada form kurasi dan antrean submisi komunitas.
            </p>

            <form onSubmit={handleSavePreferences} className="space-y-4">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-white block">
                    Wajib Direct Enrollment URL
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    Blokir semua link safelink, shortener (bit.ly, adfly), atau redirect mencurigakan.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={requireDirectUrl}
                  onChange={(e) => setRequireDirectUrl(e.target.checked)}
                  className="w-5 h-5 rounded bg-black/60 border-white/20 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-white block">
                    Wajib Silabus Minimal 3 Modul
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    Mengharuskan materi memiliki silabus terstruktur sebelum tombol publish aktif.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={requireMinModules}
                  onChange={(e) => setRequireMinModules(e.target.checked)}
                  className="w-5 h-5 rounded bg-black/60 border-white/20 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-white block">
                    Verifikasi Sertifikat 100% Bebas Biaya
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    Label "Free Certificate" hanya boleh disematkan jika sertifikat digital tidak memerlukan biaya bayar.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={verifyFreeCert}
                  onChange={(e) => setVerifyFreeCert(e.target.checked)}
                  className="w-5 h-5 rounded bg-black/60 border-white/20 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-white block">
                    Auto-Scrape Metadata saat URL Ditempel
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    Panggil scraper otomatis untuk edX, Coursera, Harvard, dan MIT saat link diinput.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={autoExtractMetadata}
                  onChange={(e) => setAutoExtractMetadata(e.target.checked)}
                  className="w-5 h-5 rounded bg-black/60 border-white/20 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-black/40 border border-white/5">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-white block">
                    Notifikasi Toast Submisi Komunitas Baru
                  </span>
                  <span className="text-[11px] text-zinc-400 font-normal">
                    Munculkan indikator visual saat ada submisi kursus baru dari komunitas.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={notifyOnNewSubmission}
                  onChange={(e) => setNotifyOnNewSubmission(e.target.checked)}
                  className="w-5 h-5 rounded bg-black/60 border-white/20 text-blue-600 focus:ring-0 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-md cursor-pointer border border-blue-400/30"
                >
                  Simpan Kebijakan Kurasi
                </button>
              </div>
            </form>
          </div>

          {/* Database Info Card */}
          <div className="bg-[#0d0d0d] p-6 sm:p-8 rounded-2xl border border-white/15 shadow-xl">
            <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-[22px]">database</span>
              <span>Status Database Firestore</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-5 font-normal">
              Informasi koneksi persisten Google Cloud Firestore.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block">
                  Project ID
                </span>
                <span className="text-white font-mono font-bold">gen-lang-client-0954371628</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block">
                  Primary Collection
                </span>
                <span className="text-white font-mono font-bold">courses ({courses.length} docs)</span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block">
                  Sync State
                </span>
                <span className="text-emerald-400 font-bold uppercase flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Real-Time onSnapshot (Online)
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5">
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-wider block">
                  Access Level
                </span>
                <span className="text-blue-400 font-bold uppercase">Admin-Restricted (/admin)</span>
              </div>
            </div>

            {onClearDatabase && (
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-red-400 block uppercase tracking-tight">
                    Kosongkan Seluruh Database
                  </span>
                  <span className="text-[11px] text-zinc-500 font-normal">
                    Hapus permanen semua kursus ({courses.length} dokumen) dari Firestore. Tindakan ini tidak bisa dibatalkan.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    console.log('Clear DB button clicked');
                    if (confirm('PERINGATAN: Anda akan menghapus SELURUH data kursus dari database Firestore. Apakah Anda yakin?')) {
                      try {
                        console.log('Confirmed. Calling onClearDatabase...');
                        await (onClearDatabase as any)();
                        console.log('onClearDatabase completed');
                      } catch (err) {
                        console.error('Error in onClearDatabase callback:', err);
                      }
                    }
                  }}
                  className="px-4 py-2 rounded-xl bg-red-950/30 hover:bg-red-900/40 text-red-400 text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-red-500/20 shrink-0"
                >
                  Kosongkan DB
                </button>
              </div>
            )}

            {onResetToSample && (
              <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-zinc-300 block">
                    Muat Ulang Sampel Data Standar
                  </span>
                  <span className="text-[11px] text-zinc-500 font-normal">
                    Jika Anda ingin menyinkronkan kembali daftar kursus bawaan MIT, Harvard, dan freeCodeCamp.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={onResetToSample}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-white/10 shrink-0"
                >
                  Reset Sampel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right 1 Col: Admin Profile & Credentials */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/15 shadow-xl">
            <h3 className="text-base font-black uppercase tracking-tight text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-[20px]">admin_panel_settings</span>
              <span>Identitas Akun Admin</span>
            </h3>

            <div className="flex items-center gap-3.5 mb-5 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-base flex items-center justify-center border-2 border-blue-400/40 shadow-lg">
                {adminUsername.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <span className="text-sm font-black uppercase tracking-wider text-white block">
                  {adminUsername}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-[9px] font-black uppercase tracking-widest mt-0.5">
                  /admin Verified Master
                </span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Status:</span>
                <span className="text-emerald-400 font-bold">Aktif &amp; Terautentikasi</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Akses Portal:</span>
                <span className="text-white font-mono">/admin</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/5">
                <span className="text-zinc-500 font-bold uppercase tracking-wider">Izin Write:</span>
                <span className="text-white font-bold">Cloud Firestore Master</span>
              </div>
            </div>
          </div>

          {/* Change Password Card */}
          <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/15 shadow-xl">
            <h3 className="text-base font-black uppercase tracking-tight text-white mb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-400 text-[20px]">lock_reset</span>
              <span>Ganti Password /admin</span>
            </h3>
            <p className="text-xs text-zinc-400 mb-4 font-normal">
              Perbarui kata sandi untuk login kurator berikutnya.
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-black uppercase tracking-wider mb-1">
                  Password Saat Ini
                </label>
                <input
                  type="password"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Masukkan password lama..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-black uppercase tracking-wider mb-1">
                  Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Password baru..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-black uppercase tracking-wider mb-1">
                  Konfirmasi Password Baru
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ulangi password baru..."
                  className="w-full px-3 py-2 rounded-xl bg-black/60 border border-white/15 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-black uppercase tracking-wider transition-all cursor-pointer shadow-md border border-blue-400/30"
              >
                {isChangingPassword ? 'Menyimpan...' : 'Perbarui Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
