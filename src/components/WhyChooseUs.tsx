import React from 'react';
import { Lightbulb, Layout, Layers, CheckCircle2 } from 'lucide-react';
import { corePrinciples } from '../data/config';

export const WhyChooseUs: React.FC = () => {
  const icons = [Lightbulb, Layout, Layers, CheckCircle2];

  return (
    <section className="py-10 sm:py-18 bg-[#0B0E16] relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-7 sm:mb-12">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#E5B869] uppercase block mb-1.5 sm:mb-2">
            Why MK Digital Craft
          </span>
          <h2 className="text-2xl sm:text-4xl font-display font-bold tracking-tight text-white">
            Built for Distinction
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {corePrinciples.map((principle, index) => {
            const IconComponent = icons[index % icons.length];
            return (
              <div
                key={principle.title}
                className="p-4 sm:p-6 rounded-2xl bg-[#111520] border border-white/[0.08] hover:border-[#E5B869]/35 transition-all duration-300 group hover:-translate-y-0.5"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/25 mb-3 sm:mb-5 flex items-center justify-center text-[#E5B869] group-hover:scale-105 transition-transform">
                  <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <h3 className="text-sm sm:text-base font-display font-bold text-white mb-1 sm:mb-1.5 leading-snug">
                  {principle.title}
                </h3>
                <p className="text-[11px] sm:text-sm text-[#94A3B8] leading-snug sm:leading-relaxed">
                  {principle.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
