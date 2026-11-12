import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Instagram, Mail, Monitor, Film, Palette } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useSiteData } from '../context/SiteContext';

interface AboutProps {
  onContactClick: () => void;
}

export const About: React.FC<AboutProps> = ({ onContactClick }) => {
  const { settings } = useSiteData();
  const pillars = [
    { icon: Monitor, label: 'Web Design' },
    { icon: Film, label: 'Video Editing' },
    { icon: Palette, label: 'Graphic Design' },
  ];

  const commitments = [
    { code: '01', title: 'Bespoke Craft', subtitle: 'Built around your brand' },
    { code: '02', title: 'Unified Creative', subtitle: 'Web, video & visuals' },
    { code: '03', title: 'Direct Collaboration', subtitle: 'Clear & timely delivery' },
  ];

  return (
    <section
      id="about"
      className="py-20 bg-[#0B0E16] relative overflow-hidden border-t border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-gradient-to-b from-[#141926] to-[#0F131D] border border-white/[0.09] p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle top golden hairline & corner ambient glow */}
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5B869]/65 to-transparent" />
          <div className="absolute -bottom-28 -right-28 w-72 h-72 bg-[#E5B869]/[0.07] rounded-full blur-[110px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Left Column: Framed Studio Emblem Card */}
            <div className="lg:col-span-5">
              <div className="rounded-2xl bg-[#07090E]/90 border border-white/[0.08] p-7 sm:p-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(229,184,105,0.08),transparent_65%)] pointer-events-none" />

                <div className="relative group mb-5">
                  <div className="absolute -inset-3 rounded-full bg-[#E5B869]/20 blur-xl opacity-60 group-hover:opacity-90 transition-opacity duration-500" />
                  <BrandLogo size="xl" showText={false} className="relative z-10" />
                </div>

                <h3 className="font-display font-semibold text-xl text-white tracking-tight">
                  {settings.brandName}
                </h3>
                <span className="text-[11px] font-semibold text-[#E5B869] tracking-[0.22em] uppercase mt-1 mb-6">
                  {settings.slogan}
                </span>

                <div className="w-full pt-5 border-t border-white/[0.08] grid grid-cols-3 gap-2">
                  {pillars.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05]"
                    >
                      <Icon className="w-4 h-4 text-[#E5B869]" />
                      <span className="text-[11px] font-medium text-[#CBD5E1] leading-tight">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Narrative & Commitments */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <span className="text-xs font-semibold tracking-[0.2em] text-[#E5B869] uppercase block mb-2.5">
                  About MK Digital Craft
                </span>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-semibold text-white tracking-[-0.02em] leading-[1.14]">
                  {settings.aboutHeadingPrefix}{' '}
                  <span className="text-gradient-gold">{settings.aboutHeadingAccent}</span>
                </h2>
              </div>

              <p className="text-sm sm:text-base text-[#CBD5E1]/90 leading-[1.75]">
                {settings.aboutDescription}
              </p>

              {/* Clean 3-Point Studio Commitments */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {commitments.map((item) => (
                  <div
                    key={item.code}
                    className="p-3.5 rounded-xl bg-[#07090E]/75 border border-white/[0.07]"
                  >
                    <span className="text-[10px] font-mono font-semibold text-[#E5B869] block mb-1">
                      {item.code}
                    </span>
                    <h4 className="text-xs font-semibold text-white mb-0.5">{item.title}</h4>
                    <p className="text-[11px] text-[#94A3B8]">{item.subtitle}</p>
                  </div>
                ))}
              </div>

              {/* Action Row */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onContactClick}
                  className="min-h-[44px] inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all shadow-[0_8px_24px_-6px_rgba(229,184,105,0.45)] cursor-pointer"
                >
                  <span>Start a Project</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={settings.instagramDmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-[#E2E8F0] hover:text-white border border-white/15 hover:border-[#E5B869]/45 bg-white/[0.02] hover:bg-white/[0.05] transition-all"
                >
                  <Instagram className="w-4 h-4 text-[#E5B869]" />
                  <span>Instagram DM</span>
                </a>

                <a
                  href={`mailto:${settings.email}`}
                  className="min-h-[44px] inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs sm:text-sm font-medium text-[#94A3B8] hover:text-[#E5B869] border border-white/10 hover:border-[#E5B869]/35 transition-all"
                >
                  <Mail className="w-4 h-4 text-[#E5B869]" />
                  <span>Email</span>
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
