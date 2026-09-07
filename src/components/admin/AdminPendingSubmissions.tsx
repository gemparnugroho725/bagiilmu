import React, { useState } from 'react';
import { Course, PendingSubmission } from '../../types';

export type { PendingSubmission };

export const INITIAL_PENDING_SUBMISSIONS: PendingSubmission[] = [
  {
    id: 'sub-1',
    author: 'Cahyo Kusuma',
    authorRole: 'Community Contributor',
    avatar: 'CK',
    submittedTime: '2 jam yang lalu',
    note: 'Kursus ini baru saja diperbarui ke Next.js 14 App Router gratis di YouTube freeCodeCamp. Kualitas penjelasan server actions sangat aplikatif untuk mahasiswa.',
    title: 'Full-Stack Modern React & Next.js 14 Architecture',
    provider: 'freeCodeCamp / YouTube',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
    category: 'webdev',
    categoryLabel: 'Web Development',
    level: 'Intermediate',
    duration: '14 jam',
    hasCertificate: false,
    accessTier: 'oer',
    accessBadgeText: 'Free OER',
    description: 'Panduan lengkap arsitektur full-stack dengan Next.js 14 App Router, React Server Components, Tailwind CSS, Prisma ORM, dan autentikasi aman.',
    skills: ['Next.js 14', 'React Server Components', 'TypeScript', 'Prisma', 'Tailwind CSS'],
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-2',
    author: 'Sarah Devina',
    authorRole: 'AI Research Student',
    avatar: 'SD',
    submittedTime: '5 jam yang lalu',
    note: 'DeepLearning.AI menyediakan akses gratis audit tanpa kartu kredit. Sangat penting bagi pemula yang ingin memahami matematika dasar neural network.',
    title: 'Deep Learning Specialization: Neural Networks & Deep Learning',
    provider: 'DeepLearning.AI / Coursera',
    platform: 'coursera',
    url: 'https://www.coursera.org/learn/neural-networks-deep-learning',
    category: 'ai',
    categoryLabel: 'Data Science & AI',
    level: 'Intermediate',
    duration: '24 jam (4 minggu)',
    hasCertificate: false,
    accessTier: 'audit_only',
    accessBadgeText: 'Audit Only',
    description: 'Pelajari arsitektur neural network dari fondasi bersama Andrew Ng. Bangun deep neural network dengan Python dan NumPy murni.',
    skills: ['Deep Learning', 'Neural Networks', 'Python', 'NumPy', 'Vectorization'],
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-3',
    author: 'Reza Pratama',
    authorRole: 'DevOps Engineer',
    avatar: 'RP',
    submittedTime: '1 hari yang lalu',
    note: 'Mata kuliah legendaris dari MIT EECS tentang tools praktis yang jarang diajarkan di kelas formal: Bash, Git, SSH, VIM, dan debugging terminal.',
    title: 'The Missing Semester of Your CS Education',
    provider: 'MIT OpenCourseWare',
    platform: 'mit_ocw',
    url: 'https://missing.csail.mit.edu/',
    category: 'webdev',
    categoryLabel: 'Computer Science Core',
    level: 'All Levels',
    duration: '20 jam',
    hasCertificate: false,
    accessTier: 'oer',
    accessBadgeText: 'Free OER',
    description: 'Kuasai alat kerja terminal esensial: shell scripting lanjutan, version control Git, text editors, build systems, dan security cryptography.',
    skills: ['Bash', 'Git', 'Vim', 'Linux', 'Command Line', 'SSH'],
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-4',
    author: 'Nadia Utami',
    authorRole: 'UI/UX Designer',
    avatar: 'NU',
    submittedTime: '1 hari yang lalu',
    note: 'Desain visual dan interaksi langsung dari lead designer Google. Modul 1 sampai 4 bisa diaudit 100% gratis di Coursera.',
    title: 'Foundations of User Experience (UX) Design',
    provider: 'Google Career Certificates',
    platform: 'coursera',
    url: 'https://www.coursera.org/learn/foundations-user-experience-design',
    category: 'design',
    categoryLabel: 'Design & UX',
    level: 'Beginner',
    duration: '18 jam',
    hasCertificate: false,
    accessTier: 'audit_only',
    accessBadgeText: 'Audit Only',
    description: 'Kuasai fondasi UX: design thinking, user research, wireframing, prototyping di Figma, dan prinsip aksesibilitas web inklusif.',
    skills: ['Figma', 'UX Research', 'Wireframing', 'Prototyping', 'Accessibility'],
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-5',
    author: 'Fajar Nugroho',
    authorRole: 'Cloud Architect',
    avatar: 'FN',
    submittedTime: '2 hari yang lalu',
    note: 'Latihan resmi dari AWS Skill Builder dengan sertifikat digital badge gratis setelah menyelesaikan kuis akhir modul.',
    title: 'AWS Cloud Practitioner Essentials: Cloud Foundations',
    provider: 'Amazon Web Services',
    platform: 'aws_skill_builder',
    url: 'https://explore.skillbuilder.aws/learn/course/external/view/elearning/134/aws-cloud-practitioner-essentials',
    category: 'cloud',
    categoryLabel: 'Cloud & DevOps',
    level: 'Beginner',
    duration: '6 jam',
    hasCertificate: true,
    accessTier: 'free_cert',
    accessBadgeText: 'Free Digital Badge',
    description: 'Pelajari konsep inti komputasi awan AWS: EC2, S3, IAM Security, VPC Networking, dan estimasi biaya arsitektur cloud.',
    skills: ['AWS', 'Cloud Computing', 'IAM', 'S3', 'EC2', 'DevOps'],
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-6',
    author: 'Aris Wicaksono',
    authorRole: 'Systems Programmer',
    avatar: 'AW',
    submittedTime: '3 hari yang lalu',
    note: 'Buku interaktif dan course video komprehensif tentang memori safety, borrow checker, dan concurrency aman di bahasa Rust.',
    title: 'Rust Programming: Complete Beginner to Systems Pro',
    provider: 'freeCodeCamp / Rust Foundation',
    platform: 'youtube',
    url: 'https://www.youtube.com/watch?v=BpPEoQ4j87s',
    category: 'webdev',
    categoryLabel: 'Computer Science Core',
    level: 'Intermediate',
    duration: '13 jam',
    hasCertificate: false,
    accessTier: 'oer',
    accessBadgeText: 'Free OER',
    description: 'Kuasai bahasa Rust dari dasar: ownership system, lifetime, borrow checker, multi-threading aman, dan kompilasi WebAssembly.',
    skills: ['Rust', 'Systems Programming', 'Memory Safety', 'Concurrency', 'Cargo'],
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-7',
    author: 'Maya Lin',
    authorRole: 'Full-Stack Developer',
    avatar: 'ML',
    submittedTime: '3 hari yang lalu',
    note: 'Kursus MOOC Finlandia paling terkenal untuk web development modern. Terdapat sertifikat terverifikasi gratis jika menyelesaikan tugas GitHub.',
    title: 'Full Stack Open 2024: Deep Dive into Modern Web Development',
    provider: 'University of Helsinki',
    platform: 'helsinki_mooc',
    url: 'https://fullstackopen.com/en/',
    category: 'webdev',
    categoryLabel: 'Web Development',
    level: 'Intermediate',
    duration: '60 jam',
    hasCertificate: true,
    accessTier: 'free_cert',
    accessBadgeText: 'Free Certificate',
    description: 'Pelajari React, Redux, Node.js, Express, MongoDB, GraphQL, TypeScript, dan CI/CD pipeline dengan standar industri terkini.',
    skills: ['React', 'Node.js', 'Express', 'GraphQL', 'TypeScript', 'MongoDB', 'CI/CD'],
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'sub-8',
    author: 'Hendri Gunawan',
    authorRole: 'Security Analyst',
    avatar: 'HG',
    submittedTime: '4 hari yang lalu',
    note: 'Lab langsung untuk web exploitation (XSS, SQLi, CSRF, SSRF) dari PortSwigger (pencipta Burp Suite). Akses tanpa batas gratis.',
    title: 'Web Security Academy: Practical Web Application Defense',
    provider: 'PortSwigger',
    platform: 'portswigger',
    url: 'https://portswigger.net/web-security',
    category: 'security',
    categoryLabel: 'Cybersecurity',
    level: 'Intermediate',
    duration: '40 jam lab',
    hasCertificate: true,
    accessTier: 'free_cert',
    accessBadgeText: 'Free Practitioner Cert',
    description: 'Pelajari teknik peretasan etis dan pertahanan web app melalui ratusan lab interaktif gratis mencakup OWASP Top 10.',
    skills: ['Web Security', 'OWASP Top 10', 'Burp Suite', 'SQL Injection', 'XSS', 'Penetration Testing'],
    status: 'pending',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&auto=format&fit=crop&q=80',
  },
];

interface AdminPendingSubmissionsProps {
  submissions: PendingSubmission[];
  onApprove: (submission: PendingSubmission) => void;
  onReject: (submissionId: string) => void;
  onReviewInForm: (submission: PendingSubmission) => void;
  onBatchApproveAll: () => void;
}

export const AdminPendingSubmissions: React.FC<AdminPendingSubmissionsProps> = ({
  submissions,
  onApprove,
  onReject,
  onReviewInForm,
  onBatchApproveAll,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = submissions.filter((sub) => {
    if (filterTab !== 'all' && sub.status !== filterTab) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      sub.title.toLowerCase().includes(q) ||
      sub.provider.toLowerCase().includes(q) ||
      sub.author.toLowerCase().includes(q) ||
      sub.skills.some((s) => s.toLowerCase().includes(q))
    );
  });

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const approvedCount = submissions.filter((s) => s.status === 'approved').length;
  const rejectedCount = submissions.filter((s) => s.status === 'rejected').length;

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Control & Summary Bar */}
      <div className="bg-[#0d0d0d] p-6 rounded-2xl border border-white/15 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-400">
              Antrean Submisi Komunitas ({pendingCount} Menunggu Review)
            </span>
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight text-white">
            Community Course Review Queue
          </h2>
          <p className="text-xs text-zinc-400 font-normal mt-0.5">
            Tinjau, validasi kelayakan gratis, dan publikasikan kursus langsung ke Cloud Firestore dengan 1 klik.
          </p>
        </div>

        {pendingCount > 0 && (
          <button
            type="button"
            onClick={onBatchApproveAll}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/30"
          >
            <span className="material-symbols-outlined text-[18px]">done_all</span>
            <span>Setujui Semua ({pendingCount} Kursus)</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-2 ${
              filterTab === 'pending'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <span>Pending ({pendingCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              filterTab === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <span>Semua ({submissions.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('approved')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              filterTab === 'approved'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <span>Disetujui ({approvedCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab('rejected')}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-colors cursor-pointer ${
              filterTab === 'rejected'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white border border-white/10'
            }`}
          >
            <span>Ditolak ({rejectedCount})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-zinc-500">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari submisi komunitas..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0d0d0d] border border-white/15 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Submissions List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filtered.map((item) => (
          <div
            key={item.id}
            className={`bg-[#0d0d0d] rounded-2xl border p-6 flex flex-col justify-between gap-4 transition-all shadow-xl ${
              item.status === 'approved'
                ? 'border-emerald-500/40 bg-emerald-950/10'
                : item.status === 'rejected'
                ? 'border-red-500/30 opacity-60 bg-red-950/10'
                : 'border-white/15 hover:border-blue-500/40'
            }`}
          >
            <div className="flex flex-col gap-3">
              {/* Contributor Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 text-white font-black text-xs flex items-center justify-center border border-white/20">
                    {item.avatar}
                  </div>
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-white block">
                      {item.author}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-normal">
                      {item.authorRole} • {item.submittedTime}
                    </span>
                  </div>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                    item.status === 'approved'
                      ? 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40'
                      : item.status === 'rejected'
                      ? 'bg-red-600/20 text-red-300 border-red-500/40'
                      : 'bg-amber-600/20 text-amber-300 border-amber-500/40'
                  }`}
                >
                  {item.status === 'approved'
                    ? 'Disetujui'
                    : item.status === 'rejected'
                    ? 'Ditolak'
                    : 'Pending Verifikasi'}
                </span>
              </div>

              {/* Contributor Note */}
              <div className="bg-white/5 rounded-xl p-3 text-xs text-zinc-300 italic border border-white/5">
                "{item.note}"
              </div>

              {/* Course Info */}
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-wider border border-blue-500/30">
                    {item.categoryLabel}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 text-[10px] font-black uppercase tracking-wider">
                    {item.provider}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 text-[10px] font-black uppercase tracking-wider border border-emerald-500/30">
                    {item.accessBadgeText}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold">
                    ⏱ {item.duration}
                  </span>
                </div>

                <h3 className="text-base font-black uppercase tracking-tight text-white mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-zinc-400 font-normal leading-relaxed line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-md bg-white/5 text-zinc-300 text-[10px] font-bold border border-white/10"
                  >
                    #{skill}
                  </span>
                ))}
              </div>

              {/* Link check */}
              <div className="flex items-center gap-2 text-xs text-blue-400 truncate">
                <span className="material-symbols-outlined text-[16px] shrink-0">link</span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="truncate hover:underline text-[11px]"
                >
                  {item.url}
                </a>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-2 pt-3 border-t border-white/10 mt-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onReviewInForm(item)}
                  className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
                  title="Buka dan sunting di form submit /admin"
                >
                  <span className="material-symbols-outlined text-[16px]">edit_document</span>
                  <span>Buka di Form</span>
                </button>
              </div>

              {item.status === 'pending' ? (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onReject(item.id)}
                    className="px-3.5 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 text-xs font-black uppercase tracking-wider transition-colors flex items-center gap-1 cursor-pointer border border-red-500/30"
                  >
                    <span className="material-symbols-outlined text-[16px]">close</span>
                    <span>Tolak</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onApprove(item)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md hover:scale-105 active:scale-95 cursor-pointer border border-emerald-400/30"
                  >
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Setujui &amp; Publish</span>
                  </button>
                </div>
              ) : (
                <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">
                  {item.status === 'approved' ? '✓ Telah Dipublikasikan' : '✕ Ditolak'}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
