import React from 'react';
import { Instagram, Mail, ArrowUp, Lock } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useSiteData } from '../context/SiteContext';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { settings } = useSiteData();
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Services', href: '#services' },
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  const serviceLinks = [
    { label: 'Website Design', href: '#services' },
    { label: 'Video Editing', href: '#services' },
    { label: 'Graphic Design', href: '#services' },
  ];

  return (
    <footer className="bg-[#07090E] border-t border-white/[0.08] pt-10 pb-8 sm:pt-14 sm:pb-10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-7 sm:gap-10 pb-7 sm:pb-10 border-b border-white/[0.08]">
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            <div className="flex items-start justify-between gap-4">
              <a href="#home" className="inline-block">
                <BrandLogo size="md" showText={true} />
              </a>
              <button
                onClick={scrollToTop}
                className="lg:hidden p-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#E5B869]/50 text-white/80 hover:text-[#E5B869] transition-all cursor-pointer shrink-0"
                aria-label="Back to top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs sm:text-sm text-[#94A3B8] max-w-xs leading-relaxed">
              {settings.slogan} — Websites, video production, and brand design.
            </p>

            <div className="flex items-center gap-2.5 pt-1">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#E5B869]/50 flex items-center justify-center text-white/80 hover:text-[#E5B869] transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.email && (
                <a
                  href={`mailto:${settings.email}`}
                  className="w-9 h-9 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#E5B869]/50 flex items-center justify-center text-white/80 hover:text-[#E5B869] transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 lg:col-span-6">
            <div className="space-y-2.5 sm:space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E5B869]">
                Navigation
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#94A3B8] hover:text-white transition-colors block py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-2.5 sm:space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E5B869]">
                Services
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                {serviceLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-[#94A3B8] hover:text-white transition-colors block py-0.5"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="hidden lg:flex lg:col-span-1 justify-end items-start">
            <button
              onClick={scrollToTop}
              className="p-3 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#E5B869]/50 text-white/80 hover:text-[#E5B869] transition-all cursor-pointer"
              aria-label="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-7 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94A3B8]/70 gap-3">
          <span>© {currentYear} {settings.brandName}. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono tracking-wider text-[#E5B869]/80">
              {settings.tagline.toUpperCase()}
            </span>
            {onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#E5B869]/50 text-[11px] font-medium text-[#94A3B8] hover:text-[#E5B869] transition-all cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
