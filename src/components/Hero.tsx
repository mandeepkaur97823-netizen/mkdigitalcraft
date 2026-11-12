import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Instagram, Mail } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

interface HeroProps {
  onExploreWork: () => void;
  onStartProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onStartProject }) => {
  const { settings } = useSiteData();
  return (
    <section
      id="home"
      className="relative min-h-[88vh] flex items-center justify-center pt-36 sm:pt-36 pb-16 sm:pb-20 overflow-hidden bg-[#07090E]"
    >
      {/* Dark cinematic backdrop with subtle golden reflection and readability overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top subtle golden reflection */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[52rem] h-[26rem] rounded-full bg-[#E5B869]/[0.11] blur-[150px]" />
        {/* Warm bronze ambient floor reflection */}
        <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[40rem] h-[14rem] rounded-full bg-[#B88635]/[0.08] blur-[120px]" />
        {/* Architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        {/* Stronger dark vignette overlay for crisp text contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-[#07090E]/50 to-[#07090E]/90" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="flex flex-col items-center text-center"
        >
          {/* Minimal Eyebrow */}
          <span className="text-[11px] font-semibold tracking-[0.26em] text-[#E5B869] uppercase mb-5">
            Website Design · Video Editing · Graphic Design
          </span>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-display font-semibold tracking-[-0.03em] leading-[1.08] text-[#F8FAFC] text-balance mb-6">
            {settings.heroHeadlinePrefix}{' '}
            <span className="text-gradient-gold">{settings.heroHeadlineAccent}</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-base sm:text-lg text-[#CBD5E1]/90 max-w-2xl font-normal leading-relaxed mb-9 text-balance">
            {settings.heroSubtext}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto mb-10">
            <button
              onClick={onExploreWork}
              className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all duration-300 shadow-[0_12px_30px_-8px_rgba(229,184,105,0.45)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Our Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStartProject}
              className="w-full sm:w-auto min-h-[46px] px-8 py-3.5 rounded-full text-sm font-semibold text-[#F8FAFC] border border-white/20 hover:border-[#E5B869]/60 bg-white/[0.03] hover:bg-white/[0.07] transition-all duration-300 cursor-pointer"
            >
              Start a Project
            </button>
          </div>

          {/* Direct Instagram & Email */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-white/[0.08]">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111520]/90 border border-white/10 hover:border-[#E5B869]/50 text-xs sm:text-sm text-[#CBD5E1] hover:text-[#E5B869] transition-all"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E5B869]" />
                <span>{settings.instagramHandle}</span>
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111520]/90 border border-white/10 hover:border-[#E5B869]/50 text-xs sm:text-sm text-[#CBD5E1] hover:text-[#E5B869] transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-[#E5B869]" />
                <span>{settings.email}</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
