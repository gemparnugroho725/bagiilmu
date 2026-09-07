export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'COURSE_PUBLISHED' | 'COURSE_DELETED' | 'SUBMISSION_APPROVED' | 'SUBMISSION_REJECTED' | 'CATEGORY_CREATED' | 'CATEGORY_DELETED' | 'SECURITY_SCAN' | 'FIRESTORE_SYNC';
  actionLabel: string;
  target: string;
  details: string;
  status: 'SUCCESS' | 'WARNING' | 'INFO';
}

const STORAGE_KEY = 'bagiilmu_audit_logs';

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
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
    details: 'Semua tautan eksternal lulus validasi HTTPS dan tanpa paywall terselubung.',
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

export function getStoredAuditLogs(): AuditLogEntry[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Error loading audit logs:', e);
  }
  return INITIAL_AUDIT_LOGS;
}

export function saveAuditLogs(logs: AuditLogEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving audit logs:', e);
  }
}

export function createAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
  const now = new Date();
  const dateStr = now.toISOString().replace('T', ' ').substring(0, 19);
  
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: dateStr,
  };

  const logs = getStoredAuditLogs();
  const updated = [newEntry, ...logs];
  saveAuditLogs(updated);
  return newEntry;
}
