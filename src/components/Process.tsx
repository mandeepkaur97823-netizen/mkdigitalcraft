import React from 'react';
import { motion } from 'motion/react';
import { processSteps } from '../data/config';

export const Process: React.FC = () => {
  return (
    <section
      id="process"
      className="py-20 bg-[#07090E] relative overflow-hidden border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#E5B869] uppercase block mb-2">
            Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-semibold tracking-tight text-white">
            How We Work
          </h2>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute top-6 left-[12%] right-[12%] h-[1px] bg-gradient-to-r from-transparent via-[#E5B869]/40 to-transparent z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {processSteps.map((step, idx) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className="flex flex-col items-center lg:items-start text-center lg:text-left bg-[#111520] lg:bg-transparent p-6 lg:p-0 rounded-2xl lg:rounded-none border border-white/[0.07] lg:border-none"
              >
                <div className="w-12 h-12 rounded-full bg-[#111520] border border-[#E5B869]/50 flex items-center justify-center mb-4 shadow-[0_0_20px_-6px_rgba(229,184,105,0.4)]">
                  <span className="font-mono text-xs font-bold text-[#E5B869]">{step.step}</span>
                </div>

                <h3 className="text-lg font-display font-semibold text-white mb-1">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
