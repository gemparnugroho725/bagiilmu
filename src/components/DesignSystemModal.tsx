import React, { useState } from 'react';
import { Language, translations } from '../lib/i18n';
import { BrandLogo } from './BrandLogo';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onSwitchLanguage: (lang: Language) => void;
}

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({
  isOpen,
  onClose,
  language,
  onSwitchLanguage,
}) => {
  const [activeTab, setActiveTab] = useState<'wireframes' | 'userflows' | 'system'>('wireframes');
  const [selectedWireframeScreen, setSelectedWireframeScreen] = useState<'home' | 'filter' | 'card' | 'enroll'>('home');
  const [selectedFlow, setSelectedFlow] = useState<'discovery' | 'enrollment' | 'curation'>('discovery');

  if (!isOpen) return null;

  const t = translations[language];

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-[#090d16] border border-blue-500/30 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
        {/* Modal Top Bar */}
        <div className="p-5 sm:px-7 border-b border-white/10 flex items-center justify-between bg-[#06090e] shrink-0">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" />
            <div className="hidden sm:block h-5 w-px bg-white/15 mx-1" />
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
                <span>{t.designSpecs.modalTitle}</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-black uppercase">
                  v2.0 UI/UX
                </span>
              </h2>
              <p className="text-xs text-zinc-400">
                {language === 'id' 
                  ? 'Prototipe interaktif, cetak biru wireframe, dan arsitektur alur pengguna' 
                  : 'Interactive prototypes, wireframe blueprints, and user flow architectures'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Language Quick Switcher */}
            <div className="inline-flex p-0.5 rounded-full bg-white/5 border border-white/15">
              <button
                type="button"
                onClick={() => onSwitchLanguage('id')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                  language === 'id'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇮🇩 ID
              </button>
              <button
                type="button"
                onClick={() => onSwitchLanguage('en')}
                className={`px-2.5 py-1 rounded-full text-[11px] font-black transition-all cursor-pointer ${
                  language === 'en'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                🇬🇧 EN
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Close modal"
            >
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2 border-b border-white/10 bg-[#070a12] shrink-0 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('wireframes')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'wireframes'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/40'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">view_quilt</span>
            <span>{t.designSpecs.tabWireframes}</span>
          </button>

          <button
            onClick={() => setActiveTab('userflows')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'userflows'
                ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">account_tree</span>
            <span>{t.designSpecs.tabUserFlows}</span>
          </button>

          <button
            onClick={() => setActiveTab('system')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'system'
                ? 'bg-purple-600/20 text-purple-400 border border-purple-500/40'
                : 'text-zinc-400 hover:text-white border border-transparent'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">palette</span>
            <span>{t.designSpecs.tabDesignSystem}</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 text-zinc-300">
          {/* TAB 1: WIREFRAMES INTERAKTIF */}
          {activeTab === 'wireframes' && (
            <div className="space-y-6">
              {/* Screen selector chips */}
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider mr-1">
                  {language === 'id' ? 'Pilih Cetak Biru:' : 'Select Blueprint:'}
                </span>
                {[
                  { id: 'home', label: language === 'id' ? '1. Arsitektur Beranda & Navbar' : '1. Homepage & Navbar' },
                  { id: 'filter', label: language === 'id' ? '2. Mesin Filtrasi & Pencarian' : '2. Filter & Search Engine' },
                  { id: 'card', label: language === 'id' ? '3. Anatomi Kartu Kursus' : '3. Course Card Anatomy' },
                  { id: 'enroll', label: language === 'id' ? '4. Modal Alur Pendaftaran' : '4. Direct Enrollment Modal' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedWireframeScreen(s.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wide transition-all cursor-pointer border ${
                      selectedWireframeScreen === s.id
                        ? 'bg-blue-600 text-white border-blue-400/50 shadow-md'
                        : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* WIREFRAME DISPLAY */}
              <div className="bg-[#05070d] border border-blue-500/20 rounded-2xl p-6 relative shadow-inner">
                <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/80" />
                    <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-zinc-400 ml-2">
                      https://bagiilmu.id/{selectedWireframeScreen}
                    </span>
                  </div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-blue-950 border border-blue-500/30 text-blue-300">
                    Hi-Fi Wireframe
                  </span>
                </div>

                {selectedWireframeScreen === 'home' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-white/5 border border-dashed border-blue-500/40 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-600/40 border border-blue-400 flex items-center justify-center font-black text-xs text-white">
                          BI
                        </div>
                        <span className="text-xs font-black text-white">bagiilmu.id</span>
                      </div>
                      <div className="hidden sm:flex items-center gap-3 text-[11px] text-zinc-400">
                        <span className="text-white font-bold">Katalog Terbuka</span>
                        <span>Kategori</span>
                        <span>Rating Tertinggi</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded-full bg-blue-900/60 border border-blue-400/40 text-[10px] text-blue-200 font-bold">
                          🇮🇩 ID | 🇬🇧 EN
                        </span>
                        <span className="px-2 py-1 rounded-full bg-emerald-600/30 text-[10px] text-emerald-300 font-bold">
                          Tersimpan (3)
                        </span>
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-b from-blue-950/20 to-transparent border border-white/10 rounded-xl text-center space-y-3">
                      <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[10px] font-black uppercase">
                        ✓ 100% Bebas Biaya Tersembunyi • 2.480+ Materi Terverifikasi
                      </span>
                      <h3 className="text-xl font-black text-white">
                        Akses Direktori <span className="text-blue-400">Kursus Gratis Terbaik</span> Dunia Tanpa Paywall
                      </h3>
                      <p className="text-xs text-zinc-400 max-w-lg mx-auto">
                        Materi kuliah terstandarisasi Harvard, MIT, Stanford &amp; freeCodeCamp dengan kurasi transparansi biaya.
                      </p>
                      <div className="max-w-md mx-auto p-2 bg-white/5 border border-blue-500/30 rounded-full flex items-center gap-2">
                        <span className="text-blue-400 text-xs pl-2">🔍</span>
                        <span className="text-xs text-zinc-500 flex-1 text-left">Cari topik, keahlian, atau kampus...</span>
                        <span className="px-3 py-1 rounded-full bg-blue-600 text-[10px] font-black text-white">
                          Cari Kursus
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedWireframeScreen === 'filter' && (
                  <div className="space-y-4">
                    <div className="p-4 bg-white/5 border border-dashed border-emerald-500/40 rounded-xl space-y-3">
                      <div className="text-xs font-black text-emerald-300 uppercase tracking-wider">
                        Taksonomi Jalur Keahlian (Multi-facet Scroller)
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {['Semua Jalur', 'Keamanan Siber', 'Web Dev', 'Sains Data & AI', 'UI/UX Design', 'Cloud & DevOps'].map((cat, i) => (
                          <span
                            key={cat}
                            className={`px-3 py-1 rounded-full text-xs font-bold border ${
                              i === 0
                                ? 'bg-blue-600 text-white border-blue-400'
                                : 'bg-white/5 text-zinc-300 border-white/10'
                            }`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/10 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-white">2.480 Kursus Gratis Ditemukan</span>
                        <span className="text-[10px] text-zinc-500">• Siap Diakses Langsung</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] text-zinc-400">Filter:</span>
                        <span className="px-2.5 py-1 rounded-full bg-white text-black text-[10px] font-bold">
                          Semua
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-bold">
                          Sertifikat Gratis
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] text-zinc-300 font-bold">
                          Rating Tertinggi
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedWireframeScreen === 'card' && (
                  <div className="max-w-md mx-auto p-5 bg-[#0e1424] border border-blue-500/30 rounded-2xl space-y-3 shadow-xl">
                    <div className="h-32 rounded-xl bg-gradient-to-tr from-blue-900/60 to-emerald-900/40 border border-white/10 relative p-3 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/80 border border-white/20 text-[10px] font-black text-white">
                          Harvard Online / edX
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-300 text-[10px] font-black">
                          Sertifikat Gratis
                        </span>
                      </div>
                      <div className="text-[10px] text-zinc-300 bg-black/60 px-2 py-1 rounded w-fit">
                        Pemula • 12 minggu • 72 jam
                      </div>
                    </div>
                    <h4 className="text-sm font-black text-white uppercase tracking-tight">
                      CS50 Introduction to Computer Science
                    </h4>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      Pengenalan ilmu komputer terpopuler dunia yang membahas konsep algoritma, memori, data struktur C, Python, dan SQL.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {['C', 'Python', 'Algorithms', 'SQL'].map((t) => (
                        <span key={t} className="px-2 py-0.5 rounded bg-white/5 text-[9px] font-bold text-zinc-300">
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-amber-400 text-xs font-black">
                        ★ 4.9 <span className="text-[10px] text-zinc-500 font-normal">(42.5k)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-blue-400">🔖</span>
                        <span className="px-3 py-1.5 rounded-full bg-blue-600 text-white text-xs font-black">
                          Mulai Belajar ↗
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {selectedWireframeScreen === 'enroll' && (
                  <div className="max-w-lg mx-auto p-5 bg-[#0e1424] border border-blue-500/40 rounded-2xl space-y-4 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="p-1.5 rounded-lg bg-blue-600/30 text-blue-300 text-sm">🎓</span>
                        <div>
                          <span className="text-[10px] text-zinc-400 uppercase font-black">Panduan Pendaftaran Bebas Biaya</span>
                          <h4 className="text-xs font-black text-white uppercase">CS50 Harvard Online</h4>
                        </div>
                      </div>
                      <span className="text-zinc-400 text-xs">✕</span>
                    </div>

                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl space-y-1">
                      <span className="text-xs font-black text-emerald-300 flex items-center gap-1.5">
                        <span>🛡️</span> Jaminan 100% Akses Gratis bagiilmu.id
                      </span>
                      <p className="text-[11px] text-zinc-300">
                        Pada laman resmi edX/Harvard, klik tombol "Audit this Course" untuk belajar tanpa kartu kredit.
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-zinc-300">
                      <div className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">1</span>
                        <span>Klik tombol "Menuju Situs Resmi" untuk membuka portal institusi.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">2</span>
                        <span>Daftar akun gratis dengan Google tanpa mengisi detail pembayaran.</span>
                      </div>
                      <div className="flex gap-2">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">3</span>
                        <span>Mulai akses materi silabus, video, dan tugas pemrograman.</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-white/10 flex justify-end gap-2">
                      <span className="px-3 py-1.5 rounded-full text-xs text-zinc-400">Tutup</span>
                      <span className="px-4 py-1.5 rounded-full bg-blue-600 text-white text-xs font-black">
                        Buka Kursus Asli ↗
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Rationale & UX Principles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="font-black text-blue-400 uppercase tracking-wider block">
                    1. Zero-Friction Discovery
                  </span>
                  <p className="text-zinc-400 leading-relaxed font-normal">
                    Pengelompokan 8 jalur keahlian memangkas waktu pencarian hingga 60%. Bar pencarian cerdas mendukung pencarian instan berdasarkan bahasa pemrograman, nama dosen, atau universitas.
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="font-black text-emerald-400 uppercase tracking-wider block">
                    2. Anti-Paywall Transparency
                  </span>
                  <p className="text-zinc-400 leading-relaxed font-normal">
                    Setiap kartu kursus membedakan secara tegas apakah kursus memberikan Sertifikat Gratis atau Free Audit, sehingga pengguna tidak terjebak skema bayar terselubung.
                  </p>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-1">
                  <span className="font-black text-purple-400 uppercase tracking-wider block">
                    3. Indonesian Localization First
                  </span>
                  <p className="text-zinc-400 leading-relaxed font-normal">
                    Bahasa Indonesia diatur sebagai bawaan (*default*) dengan terminologi yang luwes dan ramah pemula, namun tetap menyediakan tombol alih bahasa instan ke bahasa Inggris.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER FLOW DIAGRAMS */}
          {activeTab === 'userflows' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 pb-2">
                <span className="text-xs text-zinc-500 font-bold uppercase tracking-wider mr-1">
                  {language === 'id' ? 'Pilih Alur:' : 'Select Flow:'}
                </span>
                {[
                  { id: 'discovery', label: language === 'id' ? 'Alur 1: Penelusuran & Filter Katalog' : 'Flow 1: Catalog Discovery & Filter' },
                  { id: 'enrollment', label: language === 'id' ? 'Alur 2: Pendaftaran Bebas Biaya (Zero Paywall)' : 'Flow 2: Zero-Paywall Direct Enrollment' },
                  { id: 'curation', label: language === 'id' ? 'Alur 3: Submisi Komunitas & Kurasi' : 'Flow 3: Community Submissions & Curator Review' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFlow(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wide transition-all cursor-pointer border ${
                      selectedFlow === f.id
                        ? 'bg-emerald-600 text-white border-emerald-400/50 shadow-md'
                        : 'bg-white/5 text-zinc-400 border-white/10 hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* FLOW DIAGRAM CONTAINER */}
              <div className="bg-[#060911] border border-emerald-500/30 rounded-2xl p-6 shadow-inner">
                {selectedFlow === 'discovery' && (
                  <div className="space-y-6">
                    <div className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                      Diagram Alur Penelusuran &amp; Filter (Discovery User Journey)
                    </div>

                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 relative">
                      {/* Step 1 */}
                      <div className="w-full md:w-1/4 p-4 bg-[#0c1220] border border-blue-500/30 rounded-xl text-center space-y-2 relative">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-black mx-auto flex items-center justify-center">
                          1
                        </div>
                        <h5 className="text-xs font-black uppercase text-white">Akses Beranda</h5>
                        <p className="text-[11px] text-zinc-400">
                          Pengguna tiba di bagiilmu.id (Bahasa Indonesia otomatis aktif).
                        </p>
                      </div>

                      <div className="text-zinc-500 font-black text-base hidden md:block">→</div>

                      {/* Step 2 */}
                      <div className="w-full md:w-1/4 p-4 bg-[#0c1220] border border-blue-500/30 rounded-xl text-center space-y-2">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-black mx-auto flex items-center justify-center">
                          2
                        </div>
                        <h5 className="text-xs font-black uppercase text-white">Pencarian &amp; Filter</h5>
                        <p className="text-[11px] text-zinc-400">
                          Memilih Jalur (cth: Keamanan Siber) atau mengetik kata kunci.
                        </p>
                      </div>

                      <div className="text-zinc-500 font-black text-base hidden md:block">→</div>

                      {/* Step 3 */}
                      <div className="w-full md:w-1/4 p-4 bg-[#0c1220] border border-emerald-500/30 rounded-xl text-center space-y-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black mx-auto flex items-center justify-center">
                          3
                        </div>
                        <h5 className="text-xs font-black uppercase text-white">Verifikasi Transparansi</h5>
                        <p className="text-[11px] text-zinc-400">
                          Memeriksa badge Sertifikat Gratis vs Free Audit, durasi, &amp; keahlian.
                        </p>
                      </div>

                      <div className="text-zinc-500 font-black text-base hidden md:block">→</div>

                      {/* Step 4 */}
                      <div className="w-full md:w-1/4 p-4 bg-[#0c1220] border border-emerald-500/30 rounded-xl text-center space-y-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white text-xs font-black mx-auto flex items-center justify-center">
                          4
                        </div>
                        <h5 className="text-xs font-black uppercase text-white">Simpan / Buka Panduan</h5>
                        <p className="text-[11px] text-zinc-400">
                          Menyimpan ke Bookmark atau menekan Mulai Belajar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFlow === 'enrollment' && (
                  <div className="space-y-6">
                    <div className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                      Diagram Alur Pendaftaran Tanpa Kartu Kredit (Zero-Paywall Guidance)
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-[#0c1220] border border-white/10 rounded-xl text-center space-y-2">
                        <span className="text-2xl">🖱️</span>
                        <h5 className="text-xs font-black text-white uppercase">Klik 'Mulai Belajar'</h5>
                        <p className="text-[11px] text-zinc-400">
                          Modal instruksi langsung terbuka sebelum pengguna dialihkan ke website penyedia.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0c1220] border border-emerald-500/40 rounded-xl text-center space-y-2">
                        <span className="text-2xl">📋</span>
                        <h5 className="text-xs font-black text-emerald-300 uppercase">Instruksi Spesifik</h5>
                        <p className="text-[11px] text-zinc-400">
                          Petunjuk jelas untuk memilih opsi "Audit" atau "Free Track" tanpa mengisi kartu kredit.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0c1220] border border-blue-500/40 rounded-xl text-center space-y-2">
                        <span className="text-2xl">🔗</span>
                        <h5 className="text-xs font-black text-blue-300 uppercase">Redirect Bersih</h5>
                        <p className="text-[11px] text-zinc-400">
                          Tautan langsung (*direct URL*) ke edX, Coursera, atau MIT OCW tanpa safelink beriklan.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0c1220] border border-purple-500/40 rounded-xl text-center space-y-2">
                        <span className="text-2xl">🚀</span>
                        <h5 className="text-xs font-black text-purple-300 uppercase">Akses Materi</h5>
                        <p className="text-[11px] text-zinc-400">
                          Siswa memulai video kuliah, unduh tugas, dan mengikuti latihan gratis selamanya.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedFlow === 'curation' && (
                  <div className="space-y-6">
                    <div className="text-xs font-black text-emerald-400 uppercase tracking-widest">
                      Diagram Alur Kurasi &amp; Penjaminan Mutu (Community QA Flow)
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-[#0c1220] border border-white/10 rounded-xl text-center space-y-2">
                        <span className="text-2xl">💡</span>
                        <h5 className="text-xs font-black text-white uppercase">Submisi Komunitas</h5>
                        <p className="text-[11px] text-zinc-400">
                          Pembelajar mengajukan URL kursus via formulir atau portal komunitas.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0c1220] border border-amber-500/40 rounded-xl text-center space-y-2">
                        <span className="text-2xl">🔍</span>
                        <h5 className="text-xs font-black text-amber-300 uppercase">Quality Gate</h5>
                        <p className="text-[11px] text-zinc-400">
                          Pengecekan otomatis anti-paywall, kelengkapan silabus, dan verifikasi institusi.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0c1220] border border-blue-500/40 rounded-xl text-center space-y-2">
                        <span className="text-2xl">🛡️</span>
                        <h5 className="text-xs font-black text-blue-300 uppercase">Review Kurator (/admin)</h5>
                        <p className="text-[11px] text-zinc-400">
                          Admin memeriksa antrean di Curator Hub dan menyetujui submisi.
                        </p>
                      </div>

                      <div className="p-4 bg-[#0c1220] border border-emerald-500/40 rounded-xl text-center space-y-2">
                        <span className="text-2xl">⚡</span>
                        <h5 className="text-xs font-black text-emerald-300 uppercase">Sinkronisasi Firestore</h5>
                        <p className="text-[11px] text-zinc-400">
                          Kursus seketika terbit di katalog publik secara real-time via Cloud Firestore.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: DESIGN SYSTEM & TOKENS */}
          {activeTab === 'system' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 mb-3">
                  1. Palet Warna Profesional &amp; Menggugah Semangat (Encouraging Palette)
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#090d16] border border-white/15">
                    <div className="h-10 rounded-lg bg-[#2563eb] mb-2 shadow" />
                    <span className="text-xs font-black text-white block">Cobalt Knowledge</span>
                    <span className="text-[10px] text-zinc-400 font-mono">#2563eb / Primary</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d16] border border-white/15">
                    <div className="h-10 rounded-lg bg-[#10b981] mb-2 shadow" />
                    <span className="text-xs font-black text-white block">Emerald Growth</span>
                    <span className="text-[10px] text-zinc-400 font-mono">#10b981 / Secondary</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d16] border border-white/15">
                    <div className="h-10 rounded-lg bg-[#f59e0b] mb-2 shadow" />
                    <span className="text-xs font-black text-white block">Amber Value</span>
                    <span className="text-[10px] text-zinc-400 font-mono">#f59e0b / Accent</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#090d16] border border-white/15">
                    <div className="h-10 rounded-lg bg-[#070b14] border border-white/15 mb-2 shadow" />
                    <span className="text-xs font-black text-white block">Deep Obsidian</span>
                    <span className="text-[10px] text-zinc-400 font-mono">#070b14 / Canvas</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-purple-400 mb-3">
                  2. Matriks Lokalisasi (Bahasa Indonesia vs English)
                </h4>
                <div className="overflow-x-auto border border-white/10 rounded-xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-white/5 text-zinc-400 font-black uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Elemen UI</th>
                        <th className="p-3">Bahasa Indonesia (Default)</th>
                        <th className="p-3">English</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                      <tr>
                        <td className="p-3 font-mono text-zinc-500">brand.name</td>
                        <td className="p-3 font-bold text-white">bagiilmu.id</td>
                        <td className="p-3 font-bold text-white">bagiilmu.id</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-zinc-500">hero.trustPill</td>
                        <td className="p-3 text-zinc-300">100% Gratis &amp; Kualitas Terverifikasi</td>
                        <td className="p-3 text-zinc-300">100% Free &amp; Verified Quality</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-zinc-500">card.freeCert</td>
                        <td className="p-3 text-emerald-300 font-bold">Sertifikat Gratis</td>
                        <td className="p-3 text-emerald-300 font-bold">Free Certificate</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-mono text-zinc-500">card.enrollBtn</td>
                        <td className="p-3 text-blue-300 font-bold">Mulai Belajar</td>
                        <td className="p-3 text-blue-300 font-bold">Enroll for Free</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-7 border-t border-white/10 bg-[#06090e] flex items-center justify-between shrink-0">
          <span className="text-[11px] text-zinc-400 font-normal">
            bagiilmu.id • Desain &amp; Arsitektur Informasi Teruji
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-blue-400/30"
          >
            {t.designSpecs.close}
          </button>
        </div>
      </div>
    </div>
  );
};
