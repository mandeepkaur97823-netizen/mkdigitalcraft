import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Eye, Play, Monitor, Film, Palette, ArrowRight } from 'lucide-react';
import { PortfolioItem } from '../data/config';
import { useSiteData } from '../context/SiteContext';
import { ProjectModal } from './ProjectModal';

interface PortfolioProps {
  onEnquireProject: (projectName: string, serviceCategory: string) => void;
}

type FilterCategory = 'all' | 'website-design' | 'video-editing' | 'graphic-design';

export const Portfolio: React.FC<PortfolioProps> = ({ onEnquireProject }) => {
  const { portfolio } = useSiteData();
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);

  const filters: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All Projects' },
    { id: 'website-design', label: 'Website Projects' },
    { id: 'video-editing', label: 'Video Editing Projects' },
    { id: 'graphic-design', label: 'Graphic Design Projects' },
  ];

  const filteredItems =
    activeFilter === 'all'
      ? portfolio
      : portfolio.filter((item) => item.category === activeFilter);

  const mapCategoryToService = (category: PortfolioItem['category']) => {
    if (category === 'video-editing') return 'Video Editing';
    if (category === 'graphic-design') return 'Graphic Design';
    return 'Website Design';
  };

  return (
    <section
      id="work"
      className="py-20 bg-[#07090E] relative overflow-hidden border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-semibold tracking-[0.2em] text-[#E5B869] uppercase block mb-2">
              Our Work
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white mb-2">
              Selected Showcase
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8]">
              Demo concepts and replaceable placeholders illustrating our creative capabilities.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-[#111520] border border-white/10 self-start lg:self-auto">
            {filters.map((filter) => {
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#E5B869] text-[#07090E] font-semibold'
                      : 'text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <motion.article
              layout
              key={item.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group rounded-2xl bg-[#111520] border border-white/[0.08] overflow-hidden flex flex-col justify-between hover:border-[#E5B869]/40 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div>
                <div
                  className="relative aspect-[16/10] overflow-hidden bg-[#07090E] cursor-pointer"
                  onClick={() => setSelectedProject(item)}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/75 via-transparent to-[#07090E]/85 pointer-events-none" />

                  <div className="absolute top-3 inset-x-3 flex items-center justify-between gap-2 z-10">
                    <span className="px-2.5 py-1 rounded-full bg-[#07090E]/90 backdrop-blur-md border border-white/15 text-white font-medium text-[11px] flex items-center gap-1.5 shadow-sm truncate">
                      {item.category === 'website-design' && <Monitor className="w-3 h-3 text-[#E5B869] shrink-0" />}
                      {item.category === 'video-editing' && <Film className="w-3 h-3 text-[#E5B869] shrink-0" />}
                      {item.category === 'graphic-design' && <Palette className="w-3 h-3 text-[#E5B869] shrink-0" />}
                      <span className="truncate">{item.categoryLabel}</span>
                    </span>

                    {item.isDemo && (
                      <span className="px-2.5 py-1 rounded-full bg-[#07090E]/90 backdrop-blur-md border border-[#E5B869]/45 text-[#F3D18E] text-[10px] font-mono tracking-wide shrink-0 shadow-sm">
                        Demo Concept
                      </span>
                    )}
                  </div>

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/45 backdrop-blur-[2px]">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E5B869] text-[#07090E] font-semibold text-xs shadow-lg">
                      {item.previewType === 'video' ? (
                        <Play className="w-3.5 h-3.5 fill-[#07090E]" />
                      ) : (
                        <Eye className="w-3.5 h-3.5" />
                      )}
                      <span>{item.ctaLabel}</span>
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3
                    onClick={() => setSelectedProject(item)}
                    className="text-lg font-display font-semibold text-white group-hover:text-[#E5B869] transition-colors cursor-pointer mb-1.5"
                  >
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedProject(item)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#E5B869] hover:text-[#F3D18E] transition-colors cursor-pointer py-1"
                >
                  <span>{item.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => onEnquireProject(item.title, mapCategoryToService(item.category))}
                  className="text-xs text-[#94A3B8] hover:text-white transition-colors cursor-pointer py-1"
                >
                  Enquire
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>

      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onEnquire={(projectName) =>
          onEnquireProject(
            projectName,
            selectedProject ? mapCategoryToService(selectedProject.category) : 'Website Design'
          )
        }
      />
    </section>
  );
};
