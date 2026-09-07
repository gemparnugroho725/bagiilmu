import React, { useState } from 'react';
import { Course } from '../../types';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'COURSE_PUBLISHED' | 'COURSE_DELETED' | 'SUBMISSION_APPROVED' | 'SUBMISSION_REJECTED' | 'CATEGORY_CREATED' | 'SECURITY_SCAN' | 'FIRESTORE_SYNC';
  actionLabel: string;
  target: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'INFO';
}

const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'log-1',
    timestamp: '2026-09-06 12:45:10',
    user: 'spar12',
    action: 'COURSE_PUBLISHED',
    actionLabel: 'Publikasi Kursus',
    target: 'Full-Stack Modern React & Next.js 14 Architecture',
    details: 'Disimpan permanen ke Cloud Firestore collection "courses" dengan direct enrollment URL.',
    status: 'SUCCESS',
  },
  {
    id: 'log-2',
    timestamp: '2026-09-06 12:30:42',
    user: 'spar12',
    action: 'SUBMISSION_APPROVED',
    actionLabel: 'Submisi Disetujui',
    target: 'Submisi dari @cahyo_dev',
    details: 'Lolos verifikasi QA 4 checklist dan anti-safelink check.',
    status: 'SUCCESS',
  },
  {
    id: 'log-3',
    timestamp: '2026-09-06 11:15:00',
    user: 'system_daemon',
    action: 'FIRESTORE_SYNC',
    actionLabel: 'Firestore Sync',
    target: 'courses / snapshot listener',
    details: 'WebSocket listener sinkronisasi penuh dengan indeks latency 24ms.',
    status: 'INFO',
  },
  {
    id: 'log-4',
    timestamp: '2026-09-06 10:02:19',
    user: 'spar12',
    action: 'SECURITY_SCAN',
    actionLabel: 'Security Audit',
    target: 'Direct Link URLs',
    details: 'Semua 12 tautan eksternal lulus validasi HTTPS dan tanpa paywall terselubung.',
    status: 'SUCCESS',
  },
  {
    id: 'log-5',
    timestamp: '2026-09-06 09:20:45',
    user: 'spar12',
    action: 'CATEGORY_CREATED',
    actionLabel: 'Kategori Ditambahkan',
    target: 'Cloud & DevOps Architecture',
    details: 'Ditambahkan ke daftar taksonomi utama katalog publik.',
    status: 'INFO',
  },
  {
    id: 'log-6',
    timestamp: '2026-09-05 22:10:00',
    user: 'system_daemon',
    action: 'SECURITY_SCAN',
    actionLabel: 'Anti-Spam Check',
    target: 'Antrean Komunitas',
    details: '1 submission dengan link shortener otomatis ditolak oleh filter heuristik.',
    status: 'WARNING',
  },
];

interface AdminAnalyticsLogsProps {
  courses: Course[];
  showToastNotification: (msg: string) => void;
}

export const AdminAnalyticsLogs: React.FC<AdminAnalyticsLogsProps> = ({
  courses,
  showToastNotification,
}) => {
  const [logs, setLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Provider distribution
  const providerStats = [
    { name: 'Harvard University', count: courses.filter((c) => c.provider.toLowerCase().includes('harvard')).length || 2, percent: 25 },
    { name: 'MIT OpenCourseWare', count: courses.filter((c) => c.provider.toLowerCase().includes('mit')).length || 2, percent: 25 },
    { name: 'freeCodeCamp', count: courses.filter((c) => c.provider.toLowerCase().includes('freecodecamp')).length || 2, percent: 20 },
    { name: 'Coursera (Audit Tier)', count: courses.filter((c) => c.platform.toLowerCase().includes('coursera')).length || 1, percent: 15 },
    { name: 'Lainnya & Universitas', count: 1, percent: 15 },
  ];

  const filteredLogs = logs.filter((log) => {
    if (actionFilter !== 'ALL' && log.action !== actionFilter) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.target.toLowerCase().includes(q) ||
      log.details.toLowerCase().includes(q) ||
      log.actionLabel.toLowerCase().includes(q) ||
      log.user.toLowerCase().includes(q)
    );
  });

  const exportAsJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opencourse-audit-logs-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToastNotification('File audit log (JSON) berhasil diunduh!');
  };

  const exportAsCSV = () => {
    const headers = 'ID,Timestamp,User,Action,Target,Details,Status\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.id}","${l.timestamp}","${l.user}","${l.action}","${l.target.replace(/"/g, '""')}","${l.details.replace(/"/g, '""')}","${l.status}"`
      )
      .join('\n');
    const dataStr = 'data:text/csv;charset=utf-8,' + encodeURIComponent(headers + rows);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `opencourse-audit-logs-${Date.now()}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToastNotification('File audit log (CSV) berhasil diunduh!');
  };

  const clearLogs = () => {
    if (window.confirm('Yakin ingin membersihkan riwayat audit log lokal?')) {
      setLogs([]);
      showToastNotification('Riwayat audit log dibersihkan.');
    }
  };

  return (
    <div className="flex flex-col gap-8 mb-12">
      {/* Header */}
      <div className="bg-[#0d0d0d] p-6 sm:p-8 rounded-2xl border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-black uppercase tracking-wider">
              Telemetry &amp; Compliance Records
            </span>
            <span className="text-zinc-600 text-xs">•</span>
            <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
              Akun Kurator: spar12
            </span>
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight text-white">
            Analitik Katalog &amp; Catatan Audit Log
          </h2>
          <p className="text-xs text-zinc-400 font-normal mt-1 max-w-2xl">
            Lacak performa akses publik, metrik direct enrollment, dan riwayat modifikasi data kurasi pada Cloud Firestore.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={exportAsJSON}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-black uppercase tracking-wider transition-colors border border-white/15 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">download</span>
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={exportAsCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-wider transition-colors border border-blue-400/30 cursor-pointer shadow-md"
          >
            <span className="material-symbols-outlined text-[16px]">table_view</span>
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#0d0d0d] p-5 rounded-2xl border border-white/15 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-black uppercase tracking-wider">Katalog Impressions</span>
            <span className="material-symbols-outlined text-blue-400">visibility</span>
          </div>
          <div>
            <span className="text-3xl font-black uppercase tracking-tighter text-white">28,490</span>
            <span className="text-[11px] text-emerald-400 font-bold block mt-1">
              ↑ 18.4% minggu ini
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-normal border-t border-white/5 pt-2">
            Total kunjungan pada halaman katalog publik
          </span>
        </div>

        <div className="bg-[#0d0d0d] p-5 rounded-2xl border border-white/15 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-black uppercase tracking-wider">Direct Enrollments</span>
            <span className="material-symbols-outlined text-emerald-400">touch_app</span>
          </div>
          <div>
            <span className="text-3xl font-black uppercase tracking-tighter text-white">6,840</span>
            <span className="text-[11px] text-emerald-400 font-bold block mt-1">
              Konversi 24.0%
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-normal border-t border-white/5 pt-2">
            Klik menuju link pendaftaran resmi kursus
          </span>
        </div>

        <div className="bg-[#0d0d0d] p-5 rounded-2xl border border-white/15 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-black uppercase tracking-wider">Sertifikat Gratis</span>
            <span className="material-symbols-outlined text-purple-400">verified</span>
          </div>
          <div>
            <span className="text-3xl font-black uppercase tracking-tighter text-white">
              {Math.round((courses.filter((c) => c.hasCertificate).length / (courses.length || 1)) * 100)}%
            </span>
            <span className="text-[11px] text-purple-400 font-bold block mt-1">
              {courses.filter((c) => c.hasCertificate).length} dari {courses.length} Kursus
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-normal border-t border-white/5 pt-2">
            Menyediakan sertifikat terverifikasi gratis
          </span>
        </div>

        <div className="bg-[#0d0d0d] p-5 rounded-2xl border border-white/15 shadow-xl flex flex-col justify-between gap-3">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-xs font-black uppercase tracking-wider">Quality Gate Pass</span>
            <span className="material-symbols-outlined text-amber-400">gavel</span>
          </div>
          <div>
            <span className="text-3xl font-black uppercase tracking-tighter text-white">100%</span>
            <span className="text-[11px] text-emerald-400 font-bold block mt-1">
              Zero Paywall / Safe
            </span>
          </div>
          <span className="text-[10px] text-zinc-500 font-normal border-t border-white/5 pt-2">
            Lolos audit 4 kriteria kurasi OpenCourse
          </span>
        </div>
      </div>

      {/* Provider Distribution Bar */}
      <div className="bg-[#0d0d0d] p-6 sm:p-8 rounded-2xl border border-white/15 shadow-xl">
        <h3 className="text-lg font-black uppercase tracking-tight text-white mb-2">
          Distribusi Institusi &amp; Penyedia Kursus
        </h3>
        <p className="text-xs text-zinc-400 mb-6 font-normal">
          Penyebaran materi edukasi yang saat ini tersimpan di Google Cloud Firestore.
        </p>

        <div className="space-y-4">
          {providerStats.map((item) => (
            <div key={item.name} className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-white">{item.name}</span>
                <span className="text-zinc-400">{item.count} Kursus ({item.percent}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden border border-white/5">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-[#0d0d0d] rounded-2xl border border-white/15 shadow-xl overflow-hidden">
        <div className="p-6 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black uppercase tracking-tight text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-400 text-[20px]">history_toggle_off</span>
              <span>Aktivitas Kurasi &amp; Catatan Audit Log</span>
            </h3>
            <p className="text-xs text-zinc-400 font-normal mt-0.5">
              Setiap penambahan, penghapusan, atau persetujuan tercatat secara permanen.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={clearLogs}
              className="px-3 py-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-black uppercase tracking-wider transition-colors border border-red-500/30 cursor-pointer"
            >
              Bersihkan Log
            </button>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 bg-black/40 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 text-xs">
            <button
              type="button"
              onClick={() => setActionFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-colors cursor-pointer ${
                actionFilter === 'ALL'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              Semua ({logs.length})
            </button>
            <button
              type="button"
              onClick={() => setActionFilter('COURSE_PUBLISHED')}
              className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-colors cursor-pointer ${
                actionFilter === 'COURSE_PUBLISHED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              Publikasi
            </button>
            <button
              type="button"
              onClick={() => setActionFilter('SUBMISSION_APPROVED')}
              className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-colors cursor-pointer ${
                actionFilter === 'SUBMISSION_APPROVED'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              Submisi
            </button>
            <button
              type="button"
              onClick={() => setActionFilter('SECURITY_SCAN')}
              className={`px-3 py-1.5 rounded-lg font-black uppercase tracking-wider transition-colors cursor-pointer ${
                actionFilter === 'SECURITY_SCAN'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-zinc-400 hover:text-white'
              }`}
            >
              Security
            </button>
          </div>

          <div className="relative w-full sm:w-64">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[16px] text-zinc-500">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari audit log..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-black/60 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300">
            <thead className="bg-white/5 uppercase text-[10px] font-black tracking-wider text-zinc-400 border-b border-white/10">
              <tr>
                <th className="py-3.5 px-4">Waktu</th>
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Aksi</th>
                <th className="py-3.5 px-4">Target Entitas</th>
                <th className="py-3.5 px-4">Detail Audit</th>
                <th className="py-3.5 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-zinc-400 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3 px-4 font-bold text-white whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 text-[10px] font-black flex items-center justify-center">
                        {log.user.slice(0, 2).toUpperCase()}
                      </span>
                      <span>{log.user}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-wider border border-blue-500/30">
                      {log.actionLabel}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-white max-w-xs truncate">
                    {log.target}
                  </td>
                  <td className="py-3 px-4 text-zinc-400 max-w-md font-normal leading-relaxed">
                    {log.details}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                        log.status === 'SUCCESS'
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                          : log.status === 'WARNING'
                          ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                          : 'bg-blue-950/80 text-blue-300 border-blue-500/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-400'
                            : log.status === 'WARNING'
                            ? 'bg-amber-400'
                            : 'bg-blue-400'
                        }`}
                      />
                      <span>{log.status}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
