import React, { useRef } from 'react';

interface AppStoreIconProps {
  onDoubleClick: () => void;
  className?: string;
  size?: number;
}

export const AppStoreIcon: React.FC<AppStoreIconProps> = ({
  onDoubleClick,
  className = '',
  size = 54,
}) => {
  const lastTapRef = useRef<number>(0);

  // Mobile double-tap detection
  const handleTouchEnd = (e: React.TouchEvent) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapRef.current;
    if (tapLength < 350 && tapLength > 0) {
      e.preventDefault();
      onDoubleClick();
    }
    lastTapRef.current = currentTime;
  };

  return (
    <button
      type="button"
      onDoubleClick={onDoubleClick}
      onTouchEnd={handleTouchEnd}
      aria-label="Abrir panel de administración (Doble clic)"
      title="Doble clic para abrir panel de administrador"
      className={`group relative flex items-center justify-center rounded-full transition-transform active:scale-95 hover:scale-105 focus:outline-none select-none ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
      }}
    >
      {/* App Store Circular Badge Icon matching icono.png */}
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-md transition-shadow group-hover:drop-shadow-lg"
      >
        <defs>
          <linearGradient id="appStoreBgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1DA1F2" />
            <stop offset="100%" stopColor="#0070E0" />
          </linearGradient>
        </defs>

        {/* Circular Blue Background */}
        <circle cx="60" cy="60" r="58" fill="url(#appStoreBgGradient)" />

        {/* Apple App Store "A" Glyph: Pencil, Paintbrush & Ruler */}
        <g fill="#FFFFFF" fillRule="evenodd">
          {/* Ruler bar (left leg of A) */}
          <path
            d="M 33 87 
               C 31 84, 31 81, 33 78 
               L 53 37 
               C 55 33, 59 33, 61 35 
               L 65 39 
               C 67 41, 67 44, 65 47 
               L 42 90 
               C 40 93, 36 93, 34 91 
               Z"
          />

          {/* Pencil (right leg of A) with tip */}
          <path
            d="M 87 87 
               C 89 84, 89 81, 87 78 
               L 67 37 
               C 65 33, 61 33, 59 35 
               L 55 39 
               C 53 41, 53 44, 55 47 
               L 78 90 
               C 80 93, 84 93, 86 91 
               Z"
          />

          {/* Horizontal crossbar (Paintbrush) */}
          <rect
            x="28"
            y="54"
            width="64"
            height="11"
            rx="5.5"
            fill="#FFFFFF"
          />

          {/* Paintbrush bristles detailing tip */}
          <path
            d="M 88 56.5 
               C 91 56.5, 93 58, 93 60 
               C 93 62, 91 63.5, 88 63.5 
               Z"
          />
        </g>
      </svg>

      {/* Discrete subtle indicator */}
      <span className="sr-only">Panel de Administrador (Doble clic)</span>
    </button>
  );
};
