import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Instagram, Mail, Sparkles } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

interface HeroProps {
  onExploreWork: () => void;
  onStartProject: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreWork, onStartProject }) => {
  const { settings, services } = useSiteData();

  return (
    <section
      id="home"
      className="relative min-h-[86vh] flex items-center justify-center pt-24 sm:pt-36 pb-14 sm:pb-20 overflow-hidden bg-[#07090E]"
    >
      {/* Dark cinematic backdrop with subtle golden reflection and readability overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[30rem] sm:w-[52rem] h-[18rem] sm:h-[26rem] rounded-full bg-[#E5B869]/[0.12] blur-[130px]" />
        <div className="absolute -bottom-28 left-1/2 -translate-x-1/2 w-[24rem] sm:w-[40rem] h-[12rem] sm:h-[14rem] rounded-full bg-[#B88635]/[0.08] blur-[110px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #FFFFFF 1px, transparent 1px), linear-gradient(to bottom, #FFFFFF 1px, transparent 1px)',
            backgroundSize: '56px 56px',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-[#07090E]/55 to-[#07090E]/95" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="flex flex-col items-center text-center"
        >
          {/* Golden Studio Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5B869]/10 border border-[#E5B869]/30 mb-5 max-w-full">
            <Sparkles className="w-3 h-3 text-[#E5B869] shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.14em] sm:tracking-[0.22em] text-[#F3D18E] uppercase truncate">
              Website Design · Video Editing · Graphic Design
            </span>
          </div>

          {/* Main Headline — mobile-safe sizing & clean wrapping */}
          <h1 className="w-full max-w-4xl text-[1.85rem] leading-[1.16] sm:text-5xl lg:text-[3.5rem] lg:leading-[1.08] font-display font-semibold tracking-[-0.025em] text-[#F8FAFC] break-words mb-4 sm:mb-6">
            {settings.heroHeadlinePrefix}{' '}
            <span className="text-gradient-gold">{settings.heroHeadlineAccent}</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-lg text-[#CBD5E1]/90 max-w-2xl font-normal leading-relaxed mb-7 sm:mb-9 px-1">
            {settings.heroSubtext}
          </p>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-sm sm:max-w-none sm:w-auto mb-9 sm:mb-11">
            <button
              onClick={onExploreWork}
              className="w-full sm:w-auto min-h-[48px] inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all duration-300 shadow-[0_12px_30px_-8px_rgba(229,184,105,0.45)] active:scale-[0.98] cursor-pointer"
            >
              <span>Explore Our Work</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onStartProject}
              className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 rounded-full text-sm font-semibold text-[#F8FAFC] border border-white/20 hover:border-[#E5B869]/60 bg-white/[0.04] hover:bg-white/[0.08] transition-all duration-300 cursor-pointer"
            >
              Start a Project
            </button>
          </div>

          {/* Interactive Visual Studio Pillars (turns plain hero into visual craft preview on mobile & desktop) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-4xl mb-8 text-left">
            {services.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={onExploreWork}
                className="group relative flex sm:flex-col items-center sm:items-stretch gap-3.5 sm:gap-0 p-2.5 sm:p-0 rounded-2xl bg-[#111520]/85 border border-white/[0.08] hover:border-[#E5B869]/45 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              >
                <div className="relative w-20 h-14 sm:w-full sm:h-28 rounded-xl sm:rounded-none overflow-hidden bg-[#07090E] shrink-0">
                  <img
                    src={service.imageUrl}
                    alt={service.shortName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-[#111520] via-black/25 to-transparent" />
                  <span className="hidden sm:inline-flex absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#07090E]/85 backdrop-blur-md border border-[#E5B869]/35 text-[10px] font-mono text-[#E5B869]">
                    {service.number}
                  </span>
                </div>

                <div className="flex-1 min-w-0 sm:p-3.5 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <span className="sm:hidden text-[10px] font-mono text-[#E5B869] block">
                      {service.number} · STUDIO CRAFT
                    </span>
                    <h2 className="text-sm font-display font-semibold text-white group-hover:text-[#F3D18E] transition-colors truncate">
                      {service.shortName}
                    </h2>
                    <p className="text-[11px] text-[#94A3B8] truncate">
                      {service.subcategories.slice(0, 2).join(' · ')}
                    </p>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-[#E5B869] shrink-0 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            ))}
          </div>

          {/* Direct Instagram & Email */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-5 border-t border-white/[0.08] w-full max-w-xl">
            {settings.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111520]/90 border border-white/10 hover:border-[#E5B869]/50 text-xs sm:text-sm text-[#CBD5E1] hover:text-[#E5B869] transition-all"
              >
                <Instagram className="w-3.5 h-3.5 text-[#E5B869] shrink-0" />
                <span>{settings.instagramHandle}</span>
              </a>
            )}
            {settings.email && (
              <a
                href={`mailto:${settings.email}`}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111520]/90 border border-white/10 hover:border-[#E5B869]/50 text-xs sm:text-sm text-[#CBD5E1] hover:text-[#E5B869] transition-all max-w-full"
              >
                <Mail className="w-3.5 h-3.5 text-[#E5B869] shrink-0" />
                <span className="truncate">{settings.email}</span>
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
