import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Menu, X, ArrowUpRight, Instagram, Mail } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useSiteData } from '../context/SiteContext';

interface NavbarProps {
  onContactClick: () => void;
}

const NAV_LINKS = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
] as const;

export const Navbar: React.FC<NavbarProps> = ({ onContactClick }) => {
  const { settings } = useSiteData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);

      const scrollOffset = window.scrollY + 180;
      let current = 'home';
      for (const link of NAV_LINKS) {
        const el = document.getElementById(link.id);
        if (el && el.offsetTop <= scrollOffset) {
          current = link.id;
        }
      }
      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    setActiveSection(id);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#07090E]/92 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_12px_36px_-15px_rgba(0,0,0,0.85)]'
          : 'bg-[#07090E]/75 backdrop-blur-md border-b border-white/[0.05]'
      }`}
    >
      {/* Top Contact Strip */}
      <div className="border-b border-white/[0.06] bg-[#0B0E16]/85">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex flex-wrap items-center justify-center sm:justify-between gap-x-5 gap-y-1 text-[11px] text-[#94A3B8]">
          <div className="hidden sm:inline-flex items-center gap-2 text-[#94A3B8]/90">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>{settings.availabilityText}</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 hover:text-[#E5B869] transition-colors"
              >
                <Instagram className="w-3 h-3 text-[#E5B869]" />
                <span>{settings.instagramHandle}</span>
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-1.5 hover:text-[#E5B869] transition-colors"
              >
                <Mail className="w-3 h-3 text-[#E5B869]" />
                <span>{settings.email}</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
          isScrolled ? 'py-2.5' : 'py-3.5'
        }`}
      >
        <div className="flex items-center justify-between gap-6">
          <a
            href="#home"
            onClick={(e) => handleLinkClick(e, '#home', 'home')}
            className="group flex items-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B869] rounded-lg"
          >
            <BrandLogo size="sm" showText={true} />
          </a>

          {/* Sleek Pill Navigation */}
          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-1 p-1 rounded-full bg-[#111520]/90 border border-white/[0.08] shadow-inner"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, link.id)}
                  className={`relative px-4 py-1.5 rounded-full text-xs lg:text-[13px] font-medium transition-colors duration-200 whitespace-nowrap shrink-0 ${
                    isActive ? 'text-[#07090E] font-semibold' : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="activeNavPill"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] shadow-[0_4px_14px_-4px_rgba(229,184,105,0.55)]"
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </a>
              );
            })}
          </nav>

          {/* CTA & Mobile Menu Toggle */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onContactClick}
              className="hidden sm:inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all duration-300 shadow-[0_8px_24px_-6px_rgba(229,184,105,0.45)] hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E5B869]"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B0E16]/95 backdrop-blur-xl border-b border-white/10 px-6 py-6">
          <div className="flex flex-col space-y-2">
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href, link.id)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#E5B869]/15 text-[#E5B869] border border-[#E5B869]/30'
                      : 'text-white/80 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  {link.label}
                </a>
              );
            })}
            <div className="pt-4 mt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onContactClick();
                }}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C]"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
