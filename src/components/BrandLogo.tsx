import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  showHubBadge?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  showHubBadge = false,
}) => {
  const iconSizeClass = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }[size];

  const outerRadiusClass = {
    sm: 'rounded-xl',
    md: 'rounded-2xl',
    lg: 'rounded-2xl',
  }[size];

  const innerRadiusClass = {
    sm: 'rounded-[10px]',
    md: 'rounded-[14px]',
    lg: 'rounded-[14px]',
  }[size];

  const svgSizeClass = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7.5 h-7.5',
  }[size];

  const textSizeClass = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Encouraging & Knowledge-sharing Logo Icon Mark */}
      <div className={`relative ${iconSizeClass} flex items-center justify-center ${outerRadiusClass} bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-[1.5px] shadow-[0_0_15px_rgba(59,130,246,0.3)] group-hover:shadow-[0_0_22px_rgba(16,185,129,0.45)] transition-all duration-300`}>
        <div className={`w-full h-full bg-[#0a0e17] ${innerRadiusClass} flex items-center justify-center relative overflow-hidden`}>
          {/* Subtle geometric light lines */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-teal-400/10 pointer-events-none" />
          
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className={`${svgSizeClass} text-white relative z-10 drop-shadow`}
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
            <circle cx="12" cy="4.5" r="1.5" fill="#f97316" />
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
                <stop stopColor="#10b981" />
                <stop offset="1" stopColor="#059669" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Typography & Badge */}
      <div className="flex items-center shrink-0">
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
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider -mt-0.5">
              Platform Belajar Terbuka
            </span>
          )}
        </div>
        
        {showHubBadge && (
          <span className="ml-2.5 px-2 py-0.5 text-[10px] font-black tracking-wider text-blue-300 bg-blue-950/40 border border-blue-500/30 rounded-[6px] uppercase shrink-0">
            HUB
          </span>
        )}
      </div>
    </div>
  );
};
