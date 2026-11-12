import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Monitor, Film, Palette, ArrowRight, Check } from 'lucide-react';
import { services, ServiceItem } from '../data/config';

interface ServicesProps {
  onSelectServiceForEnquiry: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForEnquiry }) => {
  const [activeMobileIdx, setActiveMobileIdx] = useState(0);

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'website-design': Monitor,
    'video-editing': Film,
    'graphic-design': Palette,
  };

  const handleServiceAction = (service: ServiceItem) => {
    onSelectServiceForEnquiry(service.shortName);
  };

  const renderServiceCard = (service: ServiceItem, idx: number, compactMobile = false) => {
    const Icon = iconMap[service.id] || Monitor;

    return (
      <motion.article
        key={compactMobile ? `mobile-${service.id}` : service.id}
        initial={{ opacity: 0, y: compactMobile ? 8 : 18 }}
        animate={compactMobile ? { opacity: 1, y: 0 } : undefined}
        whileInView={compactMobile ? undefined : { opacity: 1, y: 0 }}
        viewport={compactMobile ? undefined : { once: true, amount: 0.2 }}
        transition={{ duration: compactMobile ? 0.25 : 0.45, delay: compactMobile ? 0 : idx * 0.08 }}
        className="group rounded-3xl bg-[#111520] border border-white/[0.08] hover:border-[#E5B869]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 shadow-xl"
      >
        <div>
          {/* Card Visual Header */}
          <div className={`relative overflow-hidden bg-[#07090E] ${compactMobile ? 'aspect-[16/9]' : 'aspect-[16/10]'}`}>
            <img
              src={service.imageUrl}
              alt={service.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111520] via-black/40 to-transparent" />
            <div className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 flex items-center gap-2">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#07090E]/85 backdrop-blur-md border border-[#E5B869]/35 flex items-center justify-center text-[#E5B869]">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
            </div>
            <span className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-xs font-mono font-semibold text-[#E5B869] px-2.5 py-1 rounded-full bg-[#07090E]/85 backdrop-blur-md border border-white/10">
              {service.number}
            </span>
          </div>

          {/* Content */}
          <div className="p-5 sm:p-7">
            <h3 className="text-lg sm:text-2xl font-display font-semibold text-white mb-2 group-hover:text-[#E5B869] transition-colors">
              {service.name}
            </h3>
            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-4 sm:mb-6">
              {service.description}
            </p>

            {compactMobile ? (
              <div className="flex flex-wrap gap-1.5">
                {service.subcategories.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#07090E]/80 border border-white/[0.07] text-[11px] text-[#CBD5E1]"
                  >
                    <Check className="w-3 h-3 text-[#E5B869] shrink-0" />
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            ) : (
              <ul className="space-y-2.5">
                {service.subcategories.map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-[#CBD5E1]">
                    <Check className="w-4 h-4 text-[#E5B869] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-5 sm:px-7 pb-5 sm:pb-7 pt-3.5 sm:pt-4 border-t border-white/[0.06]">
          <button
            type="button"
            onClick={() => handleServiceAction(service)}
            className="w-full min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all duration-300 cursor-pointer"
          >
            <span>{service.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </motion.article>
    );
  };

  const activeMobileService = services[activeMobileIdx] || services[0];

  return (
    <section
      id="services"
      className="py-12 sm:py-20 bg-[#0B0E16] relative overflow-hidden border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-6 sm:mb-14">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#E5B869] uppercase block mb-2">
            Services
          </span>
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[#F8FAFC] mb-2 sm:mb-3">
            What We Offer
          </h2>
          <p className="text-xs sm:text-base text-[#94A3B8]">
            Focused digital services crafted to elevate your brand presence.
          </p>
        </div>

        {/* Mobile Interactive Service Switcher (< lg) */}
        <div className="lg:hidden space-y-4">
          <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-2xl bg-[#111520] border border-white/10">
            {services.map((service, idx) => {
              const Icon = iconMap[service.id] || Monitor;
              const isSelected = activeMobileIdx === idx;
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActiveMobileIdx(idx)}
                  className={`flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 py-2.5 px-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] text-[#07090E] shadow-md'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate max-w-full">{service.shortName}</span>
                </button>
              );
            })}
          </div>

          {renderServiceCard(activeMobileService, activeMobileIdx, true)}
        </div>

        {/* Desktop 3-Column Service Grid (lg+) */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {services.map((service, idx) => renderServiceCard(service, idx, false))}
        </div>
      </div>
    </section>
  );
};
