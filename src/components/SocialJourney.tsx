import React from 'react';
import { Instagram, Mail, ArrowUpRight } from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

export const SocialJourney: React.FC = () => {
  const { settings } = useSiteData();
  const channels = [
    settings.instagramUrl
      ? {
          name: 'Instagram',
          url: settings.instagramUrl,
          handle: settings.instagramHandle,
          icon: Instagram,
          external: true,
        }
      : null,
    settings.email
      ? {
          name: 'Email',
          url: `mailto:${settings.email}`,
          handle: settings.email,
          icon: Mail,
          external: false,
        }
      : null,
  ].filter(Boolean);

  if (channels.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 bg-[#0B0E16] relative overflow-hidden border-t border-white/[0.06]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-5 sm:mb-8">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#E5B869] uppercase block mb-1">
            Connect
          </span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold tracking-tight text-white">
            Reach Us Directly
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {channels.map((channel) => {
            if (!channel) return null;
            const Icon = channel.icon;
            return (
              <a
                key={channel.name}
                href={channel.url}
                {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="p-4 sm:p-5 rounded-2xl bg-[#111520] border border-white/[0.08] hover:border-[#E5B869]/40 transition-all duration-300 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/20 flex items-center justify-center text-[#E5B869] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-display font-bold text-white group-hover:text-[#E5B869] transition-colors">
                      {channel.name}
                    </h3>
                    <span className="text-xs font-mono text-[#94A3B8] truncate block">
                      {channel.handle}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#94A3B8] group-hover:text-[#E5B869] transition-colors shrink-0" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
};
