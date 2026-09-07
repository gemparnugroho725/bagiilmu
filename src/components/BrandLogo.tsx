import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
}) => {
  const iconSizeClass = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  }[size];

  const textSizeClass = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Encouraging & Knowledge-sharing Logo Icon Mark */}
      <div className={`relative ${iconSizeClass} flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-500 p-0.5 shadow-[0_0_16px_rgba(37,99,235,0.45)] group-hover:shadow-[0_0_22px_rgba(16,185,129,0.55)] transition-all duration-300`}>
        <div className="w-full h-full bg-[#070b14] rounded-[10px] flex items-center justify-center relative overflow-hidden">
          {/* Subtle geometric light lines */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 via-transparent to-emerald-400/20 pointer-events-none" />
          
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-5 h-5 text-white relative z-10 drop-shadow"
          >
            {/* Open Book / Wings of Education */}
            <path 
              d="M3.5 18.5C5.5 17.5 8 17.5 12 19V6C8 4.5 5.5 4.5 3.5 5.5V18.5Z" 
              fill="url(#brandGrad1)" 
              opacity="0.9"
            />
            <path 
              d="M20.5 18.5C18.5 17.5 16 17.5 12 19V6C16 4.5 18.5 4.5 20.5 5.5V18.5Z" 
              fill="url(#brandGrad2)" 
              opacity="0.95"
            />
            {/* Central Beacon of Knowledge */}
            <circle cx="12" cy="4.5" r="1.5" fill="#f59e0b" />
            <path 
              d="M12 6.5V18.5" 
              stroke="#60a5fa" 
              strokeWidth="1.2" 
              strokeLinecap="round" 
            />
            <defs>
              <linearGradient id="brandGrad1" x1="3.5" y1="5.5" x2="12" y2="19" gradientUnits="userSpaceOnUse">
                <stop stopColor="#3b82f6" />
                <stop offset="1" stopColor="#1d4ed8" />
              </linearGradient>
              <linearGradient id="brandGrad2" x1="12" y1="6" x2="20.5" y2="18.5" gradientUnits="userSpaceOnUse">
                <stop stopColor="#34d399" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Typography */}
      <div className="flex flex-col text-left">
        <div className="flex items-center">
          <span className={`${textSizeClass} font-black tracking-tight text-white transition-colors`}>
            bagiilmu
          </span>
          <span className={`${textSizeClass} font-black text-emerald-400`}>
            .id
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider -mt-1">
            Platform Belajar Terbuka
          </span>
        )}
      </div>
    </div>
  );
};
