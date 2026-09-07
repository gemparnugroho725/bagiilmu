import React, { useState } from 'react';
import { Language, translations } from '../lib/i18n';
import { registerUserToFirestore, authenticateUserInFirestore } from '../lib/db';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { username: string; email: string; fullName: string }) => void;
  language: Language;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  language,
}) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  
  // Login form states
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register form states
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  
  // General states
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const user = await authenticateUserInFirestore(loginUsername, loginPassword);
      setSuccessMsg(
        language === 'id'
          ? `Selamat datang kembali, ${user.fullName || user.username}!`
          : `Welcome back, ${user.fullName || user.username}!`
      );
      
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(user);
        onClose();
        // Clear inputs
        setLoginUsername('');
        setLoginPassword('');
      }, 1000);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Gagal masuk. Silakan coba lagi.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const usernameRegex = /^[a-zA-Z0-9_]{3,15}$/;
    if (!usernameRegex.test(regUsername)) {
      setErrorMsg(
        language === 'id'
          ? 'Username harus 3-15 karakter alfanumerik (tanpa spasi / simbol kecuali _)'
          : 'Username must be 3-15 alphanumeric characters (no spaces / symbols except _)'
      );
      return;
    }

    if (regPassword.length < 5) {
      setErrorMsg(
        language === 'id'
          ? 'Password minimal berukuran 5 karakter!'
          : 'Password must be at least 5 characters long!'
      );
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMsg(
        language === 'id'
          ? 'Konfirmasi password tidak cocok!'
          : 'Password confirmation does not match!'
      );
      return;
    }

    setIsLoading(true);

    try {
      const user = await registerUserToFirestore(
        regUsername,
        regEmail,
        regPassword,
        regFullName
      );
      
      setSuccessMsg(
        language === 'id'
          ? 'Pendaftaran berhasil! Akun Anda aktif sekarang.'
          : 'Registration successful! Your account is active now.'
      );
      
      setTimeout(() => {
        setIsLoading(false);
        onAuthSuccess(user);
        onClose();
        // Clear inputs
        setRegUsername('');
        setRegEmail('');
        setRegFullName('');
        setRegPassword('');
        setRegConfirmPassword('');
      }, 1200);
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Gagal mendaftar. Silakan coba lagi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn" id="user-auth-modal">
      <div 
        className="relative w-full max-w-md bg-[#0a0e17] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.85)] text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          title="Tutup Modal"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[26px]">
              {activeTab === 'login' ? 'login' : 'person_add'}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight text-white leading-none">
              {activeTab === 'login' 
                ? (language === 'id' ? 'Masuk Akun' : 'User Login') 
                : (language === 'id' ? 'Daftar Akun Baru' : 'Create User Account')
              }
            </h2>
            <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-wider mt-1.5">
              {language === 'id' ? 'GABUNG KOMUNITAS BAGIILMU.ID' : 'JOIN THE BAGIILMU.ID COMMUNITY'}
            </p>
          </div>
        </div>

        {/* Tab Headers */}
        <div className="flex items-center p-1 rounded-2xl bg-white/5 border border-white/10 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'login'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {language === 'id' ? 'Masuk' : 'Login'}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === 'register'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            {language === 'id' ? 'Daftar' : 'Register'}
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <span className="material-symbols-outlined text-[18px] text-emerald-400">check_circle</span>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2.5 animate-shake">
            <span className="material-symbols-outlined text-[18px] text-red-400">error</span>
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Content */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                {language === 'id' ? 'Username' : 'Username'}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={language === 'id' ? 'Masukkan username' : 'Enter username'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                  lock
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={language === 'id' ? 'Masukkan password' : 'Enter password'}
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

            {/* Submit Button */}
            <div className="pt-2 flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>{language === 'id' ? 'Memproses...' : 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">login</span>
                    <span>{language === 'id' ? 'Masuk Sekarang' : 'Log In Now'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                {language === 'id' ? 'Nama Lengkap' : 'Full Name'}
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                  badge
                </span>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => {
                    setRegFullName(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={language === 'id' ? 'Masukkan nama lengkap' : 'Enter full name'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-sans"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="contoh: budi@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                  alternate_email
                </span>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={(e) => {
                    setRegUsername(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder={language === 'id' ? 'Gunakan huruf & angka' : 'Use letters & numbers'}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                    lock
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Minimal 5 kar"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-300 mb-1.5">
                  Konfirmasi
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 text-[18px]">
                    check
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={regConfirmPassword}
                    onChange={(e) => {
                      setRegConfirmPassword(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder="Ulangi paswd"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[10px] font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 cursor-pointer flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
                <span>{showPassword ? (language === 'id' ? 'Sembunyikan' : 'Hide') : (language === 'id' ? 'Lihat Sandi' : 'Show Pass')}</span>
              </button>
            </div>

            {/* Submit Button */}
            <div className="pt-1 flex flex-col gap-2.5">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider transition-all shadow-[0_0_24px_rgba(37,99,235,0.3)] flex items-center justify-center gap-2 cursor-pointer border border-blue-400/30"
              >
                {isLoading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>{language === 'id' ? 'Mendaftarkan...' : 'Registering...'}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">person_add</span>
                    <span>{language === 'id' ? 'Buat Akun Sekarang' : 'Create Account Now'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
