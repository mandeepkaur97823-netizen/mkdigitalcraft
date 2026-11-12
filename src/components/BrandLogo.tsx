import React from 'react';
import { useSiteData } from '../context/SiteContext';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const { settings } = useSiteData();
  const sizeDimensions = {
    sm: 'w-9 h-9',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20 md:w-24 md:h-24',
  }[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div
        className={`relative ${sizeDimensions} rounded-full p-[1.5px] bg-gradient-to-tr from-[#B88635] via-[#E5B869] to-[#F7E0AC] shadow-[0_0_22px_-6px_rgba(229,184,105,0.4)] group-hover:shadow-[0_0_28px_-4px_rgba(229,184,105,0.6)] transition-all duration-300 shrink-0`}
      >
        <div className="w-full h-full rounded-full overflow-hidden bg-[#07090E] flex items-center justify-center relative">
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full p-1.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-label={settings.brandName}
          >
            <defs>
              <linearGradient id="mkGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F7E0AC" />
                <stop offset="50%" stopColor="#E5B869" />
                <stop offset="100%" stopColor="#B88635" />
              </linearGradient>
            </defs>
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#mkGoldGrad)"
              strokeWidth="1.5"
              opacity="0.35"
            />
            <path
              d="M 27 65 V 35 L 39 51 L 49 37 V 65"
              stroke="url(#mkGoldGrad)"
              strokeWidth="5.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 55 35 V 65 M 55 50 L 73 35 M 61 46 L 74 65"
              stroke="url(#mkGoldGrad)"
              strokeWidth="5.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col text-left">
          <span className="font-display font-bold text-[#F8FAFC] tracking-tight leading-tight text-base sm:text-lg">
            {settings.brandName}
          </span>
          <span className="text-[10px] font-medium tracking-[0.18em] text-[#E5B869] uppercase">
            {settings.tagline}
          </span>
        </div>
      )}
    </div>
  );
};
