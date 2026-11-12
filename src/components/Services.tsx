import React from 'react';
import { motion } from 'motion/react';
import { Monitor, Film, Palette, ArrowRight, Check } from 'lucide-react';
import { services, ServiceItem } from '../data/config';

interface ServicesProps {
  onSelectServiceForEnquiry: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectServiceForEnquiry }) => {
  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    'website-design': Monitor,
    'video-editing': Film,
    'graphic-design': Palette,
  };

  const handleServiceAction = (service: ServiceItem) => {
    onSelectServiceForEnquiry(service.shortName);
  };

  return (
    <section
      id="services"
      className="py-20 bg-[#0B0E16] relative overflow-hidden border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#E5B869] uppercase block mb-2.5">
            Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-[#F8FAFC] mb-3">
            What We Offer
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Focused digital services crafted to elevate your brand presence.
          </p>
        </div>

        {/* 3 Service Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, idx) => {
            const Icon = iconMap[service.id] || Monitor;
            return (
              <motion.article
                key={service.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
                className="group rounded-3xl bg-[#111520] border border-white/[0.08] hover:border-[#E5B869]/40 transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 shadow-xl"
              >
                <div>
                  {/* Card Visual Header */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#07090E]">
                    <img
                      src={service.imageUrl}
                      alt={service.name}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111520] via-black/40 to-transparent" />
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl bg-[#07090E]/85 backdrop-blur-md border border-[#E5B869]/35 flex items-center justify-center text-[#E5B869]">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <span className="absolute top-4 right-4 text-xs font-mono font-semibold text-[#E5B869] px-2.5 py-1 rounded-full bg-[#07090E]/85 backdrop-blur-md border border-white/10">
                      {service.number}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-7">
                    <h3 className="text-xl sm:text-2xl font-display font-semibold text-white mb-2.5 group-hover:text-[#E5B869] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                      {service.description}
                    </p>

                    <ul className="space-y-2.5">
                      {service.subcategories.map((item) => (
                        <li key={item} className="flex items-center gap-2.5 text-sm text-[#CBD5E1]">
                          <Check className="w-4 h-4 text-[#E5B869] shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-4 border-t border-white/[0.06]">
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
          })}
        </div>
      </div>
    </section>
  );
};
