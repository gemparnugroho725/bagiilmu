import React from 'react';

export interface UserAvatarProps {
  username: string;
  fullName?: string;
  avatarType?: 'initials' | 'character' | 'custom';
  characterId?: 'wizard' | 'explorer' | 'analyst' | 'guardian' | 'artist';
  avatarUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PRESET_CHARACTERS = {
  wizard: {
    emoji: '🧙‍♂️',
    labelId: 'Penyihir Kode',
    labelEn: 'Code Wizard',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    glowColor: 'shadow-indigo-500/30'
  },
  explorer: {
    emoji: '🚀',
    labelId: 'Penjelajah Sains',
    labelEn: 'Tech Explorer',
    gradient: 'from-teal-500 via-emerald-600 to-cyan-600',
    glowColor: 'shadow-teal-500/30'
  },
  analyst: {
    emoji: '📊',
    labelId: 'Genius Data',
    labelEn: 'Data Genius',
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    glowColor: 'shadow-pink-500/30'
  },
  guardian: {
    emoji: '🛡️',
    labelId: 'Ninja Keamanan',
    labelEn: 'Security Ninja',
    gradient: 'from-rose-600 via-red-600 to-amber-600',
    glowColor: 'shadow-rose-500/30'
  },
  artist: {
    emoji: '🎨',
    labelId: 'Kreator Estetika',
    labelEn: 'UX Creator',
    gradient: 'from-fuchsia-500 via-rose-500 to-yellow-500',
    glowColor: 'shadow-fuchsia-500/30'
  }
};

export const UserAvatar: React.FC<UserAvatarProps> = ({
  username,
  fullName = '',
  avatarType = 'initials',
  characterId = 'wizard',
  avatarUrl = '',
  size = 'md',
  className = '',
}) => {
  const initials = (fullName || username || '?')
    .split(' ')
    .map((word) => word[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  // Avatar Sizing Classes
  const sizeClasses = {
    xs: 'w-7 h-7 text-[10px] rounded-lg',
    sm: 'w-9 h-9 text-xs rounded-xl',
    md: 'w-12 h-12 text-sm rounded-xl',
    lg: 'w-16 h-16 text-xl rounded-2xl',
    xl: 'w-24 h-24 text-3xl rounded-[28px]',
  };

  const emojiSizes = {
    xs: 'text-sm',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  const containerClass = `relative shrink-0 flex items-center justify-center font-black select-none overflow-hidden transition-all duration-300 shadow-md ${sizeClasses[size]} ${className}`;

  // 1. CUSTOM IMAGE AVATAR
  if (avatarType === 'custom' && avatarUrl) {
    return (
      <div className={`${containerClass} border border-white/10 bg-[#0e1424]`}>
        <img
          src={avatarUrl}
          alt={fullName || username}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback to initials if image loading fails
            (e.currentTarget as HTMLImageElement).style.display = 'none';
            const parent = e.currentTarget.parentElement;
            if (parent) {
              parent.className += ' bg-gradient-to-br from-blue-600 to-emerald-500 text-white';
              const textNode = document.createTextNode(initials);
              parent.appendChild(textNode);
            }
          }}
        />
      </div>
    );
  }

  // 2. CHARACTER PRESET AVATAR
  if (avatarType === 'character' && PRESET_CHARACTERS[characterId]) {
    const char = PRESET_CHARACTERS[characterId];
    return (
      <div className={`${containerClass} bg-gradient-to-br ${char.gradient} text-white shadow-lg ${char.glowColor} border border-white/10`}>
        <span className={`${emojiSizes[size]} filter drop-shadow-md transform hover:scale-110 transition-transform duration-300`}>
          {char.emoji}
        </span>
      </div>
    );
  }

  // 3. INITIALS AVATAR (DEFAULT)
  return (
    <div className={`${containerClass} bg-gradient-to-br from-blue-600 to-emerald-500 text-white border border-white/10 shadow-lg shadow-blue-500/10`}>
      <span className="tracking-tight">{initials}</span>
    </div>
  );
};
