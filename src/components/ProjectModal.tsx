import React, { useState, useEffect } from 'react';
import { X, Laptop, Smartphone, Play, Pause } from 'lucide-react';
import { PortfolioItem } from '../data/config';
import { useSiteData } from '../context/SiteContext';

interface ProjectModalProps {
  project: PortfolioItem | null;
  onClose: () => void;
  onEnquire: (projectName: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onEnquire }) => {
  const { settings } = useSiteData();
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!project) return;
    setDeviceMode('desktop');
    setIsPlaying(false);
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#111520] border border-white/15 rounded-3xl shadow-2xl z-10 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 sticky top-0 bg-[#111520]/95 backdrop-blur-md z-20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E5B869]">
                {project.categoryLabel}
              </span>
              {project.isDemo && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#E5B869]/15 border border-[#E5B869]/30 text-[#E5B869]">
                  Demo Placeholder
                </span>
              )}
            </div>
            <h3 className="text-xl sm:text-2xl font-display font-semibold text-white">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-8 space-y-6">
          {project.previewType === 'website' && (
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 p-1 bg-[#07090E] border border-white/10 rounded-full mb-4">
                <button
                  type="button"
                  onClick={() => setDeviceMode('desktop')}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    deviceMode === 'desktop'
                      ? 'bg-[#E5B869] text-[#07090E] font-semibold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" />
                  <span>Desktop</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDeviceMode('mobile')}
                  className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                    deviceMode === 'mobile'
                      ? 'bg-[#E5B869] text-[#07090E] font-semibold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Mobile</span>
                </button>
              </div>

              {deviceMode === 'desktop' ? (
                <div className="w-full rounded-2xl bg-[#07090E] border border-white/15 p-3 shadow-xl">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black">
                    <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                  </div>
                </div>
              ) : (
                <div className="w-60 rounded-3xl bg-[#07090E] border-2 border-white/20 p-2.5 shadow-xl">
                  <div className="w-20 h-2.5 bg-white/15 rounded-full mx-auto mb-2" />
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover object-right"
                    />
                  </div>
                  <div className="w-14 h-1 bg-white/25 rounded-full mx-auto mt-2" />
                </div>
              )}
            </div>
          )}

          {project.previewType === 'video' && (
            <div className="w-full rounded-2xl bg-[#07090E] border border-white/15 overflow-hidden">
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-16 h-16 rounded-full bg-[#E5B869] text-[#07090E] flex items-center justify-center shadow-[0_0_30px_rgba(229,184,105,0.5)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                  >
                    {isPlaying ? (
                      <Pause className="w-7 h-7 fill-[#07090E]" />
                    ) : (
                      <Play className="w-7 h-7 fill-[#07090E] translate-x-0.5" />
                    )}
                  </button>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                  <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-1.5 font-mono">
                    <span className="text-white">
                      {isPlaying ? '00:15' : '00:00'} / {project.duration || '0:45'}
                    </span>
                    <span className="text-[#E5B869]">DEMO PREVIEW</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#E5B869] transition-all duration-300"
                      style={{ width: isPlaying ? '58%' : '28%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {project.previewType === 'graphic' && (
            <div className="w-full rounded-2xl bg-[#07090E] border border-white/15 overflow-hidden">
              <div className="relative aspect-video bg-black">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10">
            <div className="md:col-span-2 space-y-3">
              <p className="text-sm text-[#CBD5E1] leading-relaxed">{project.details}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs text-[#CBD5E1] bg-white/[0.04] border border-white/10 rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#07090E] border border-white/10 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#E5B869] block mb-2">
                  Stack & Tools
                </span>
                <div className="flex flex-wrap gap-1.5 text-xs text-[#94A3B8]">
                  {project.toolsUsed?.map((tool) => (
                    <span key={tool} className="px-2 py-0.5 rounded bg-white/5">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    onClose();
                    onEnquire(project.title);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-[#07090E] bg-[#E5B869] hover:bg-[#F3D18E] transition-colors cursor-pointer"
                >
                  Start Similar Project
                </button>
                <a
                  href={settings.instagramDmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-block py-2 px-4 rounded-xl text-xs font-medium text-white/80 hover:text-white border border-white/10 hover:border-[#E5B869]/40 text-center transition-colors"
                >
                  Message on Instagram DM
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
