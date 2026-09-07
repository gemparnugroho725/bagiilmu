import React, { useState } from 'react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (username: string) => void;
  reason?: string | null;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  reason,
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanUser = username.trim();
      const cleanPass = password.trim();

      if (cleanUser === 'spar12' && cleanPass === 'spar12') {
        // Save to localStorage for persistent session
        localStorage.setItem('opencourse_admin_user', 'spar12');
        setIsLoading(false);
        onLoginSuccess('spar12');
      } else {
        setIsLoading(false);
        setErrorMsg('Username atau password tidak valid! Gunakan spar12 : spar12');
      }
    }, 350);
  };

  const handleAutofill = () => {
    setUsername('spar12');
    setPassword('spar12');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-[#0d0d0d] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle accent glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Tutup Modal"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[26px]">admin_panel_settings</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/30">
                /admin gate
              </span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">
                Restricted Access
              </span>
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white mt-0.5">
              Login Administrator
            </h2>
          </div>
        </div>

        {/* Reason Banner if applicable */}
        {reason && (
          <div className="mb-5 p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 text-xs flex items-start gap-2.5">
            <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5 text-amber-400">
              lock
            </span>
            <span className="leading-snug">{reason}</span>
          </div>
        )}
        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
            <span className="material-symbols-outlined text-[18px] text-red-400">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Field */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
              Username Admin
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                person
              </span>
              <input
                type="text"
                required
                autoFocus
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Masukkan username (contoh: spar12)"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                password
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMsg) setErrorMsg(null);
                }}
                placeholder="Masukkan password (contoh: spar12)"
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300 cursor-pointer"
                title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col gap-2.5">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
            >
              {isLoading ? (
                <>
                  <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                  <span>Memverifikasi...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  <span>Masuk ke Console /admin</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="w-full py-2.5 rounded-full bg-transparent hover:bg-white/5 text-zinc-400 hover:text-white text-xs font-black uppercase tracking-wider transition-colors cursor-pointer border border-transparent hover:border-white/10"
            >
              Batal &amp; Kembali ke Katalog
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
