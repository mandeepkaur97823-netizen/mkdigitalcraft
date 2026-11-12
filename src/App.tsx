import React, { useState, useEffect } from 'react';
import { SiteProvider, useSiteData } from './context/SiteContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Services } from './components/Services';
import { Portfolio } from './components/Portfolio';
import { WhyChooseUs } from './components/WhyChooseUs';
import { Process } from './components/Process';
import { About } from './components/About';
import { Contact } from './components/Contact';
import { SocialJourney } from './components/SocialJourney';
import { Footer } from './components/Footer';
import { AdminPortal } from './components/AdminPortal';
import { BrandLogo } from './components/BrandLogo';
import { VisitorEnquiryModal } from './components/VisitorEnquiryModal';
import { Monitor, Film, MessageSquare, Instagram, Mail, Lock, Sparkles } from 'lucide-react';

function isAdminLocation(): boolean {
  if (typeof window === 'undefined') return false;
  const normalizedPath = window.location.pathname.replace(/\/+$/, '');
  return (
    normalizedPath === '/admin' ||
    window.location.hash === '#admin' ||
    new URLSearchParams(window.location.search).has('admin')
  );
}

const VISITOR_MODAL_SESSION_KEY = 'mk_dc_visitor_prompted';

function AppContent() {
  const { settings } = useSiteData();
  const [selectedServiceForEnquiry, setSelectedServiceForEnquiry] = useState('Website Design');
  const [selectedProjectNote, setSelectedProjectNote] = useState('');
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(isAdminLocation);
  const [showVisitorModal, setShowVisitorModal] = useState<boolean>(false);

  useEffect(() => {
    if (isAdminRoute || !settings.siteEnabled) return;
    try {
      if (sessionStorage.getItem(VISITOR_MODAL_SESSION_KEY) === '1') return;
    } catch {
      // Ignore storage restrictions
    }
    const timer = window.setTimeout(() => {
      setShowVisitorModal(true);
    }, 450);
    return () => window.clearTimeout(timer);
  }, [isAdminRoute, settings.siteEnabled]);

  const handleCloseVisitorModal = () => {
    setShowVisitorModal(false);
    try {
      sessionStorage.setItem(VISITOR_MODAL_SESSION_KEY, '1');
    } catch {
      // Ignore storage restrictions
    }
  };

  useEffect(() => {
    const syncRoute = () => setIsAdminRoute(isAdminLocation());
    window.addEventListener('hashchange', syncRoute);
    window.addEventListener('popstate', syncRoute);
    return () => {
      window.removeEventListener('hashchange', syncRoute);
      window.removeEventListener('popstate', syncRoute);
    };
  }, []);

  const openAdminPortal = () => {
    window.location.hash = 'admin';
    setIsAdminRoute(true);
    window.scrollTo({ top: 0 });
  };

  const exitAdminPortal = () => {
    const normalizedPath = window.location.pathname.replace(/\/+$/, '');
    if (normalizedPath === '/admin') {
      window.history.replaceState(null, '', '/');
    } else if (window.location.hash === '#admin') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } else if (new URLSearchParams(window.location.search).has('admin')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
    setIsAdminRoute(false);
    window.scrollTo({ top: 0 });
  };

  if (isAdminRoute) {
    return <AdminPortal onExit={exitAdminPortal} />;
  }

  if (!settings.siteEnabled) {
    return (
      <div className="min-h-screen bg-[#07090E] text-[#F8FAFC] flex flex-col items-center justify-center p-5 relative overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[44rem] h-[24rem] rounded-full bg-[#E5B869]/[0.09] blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#E5B86910_1px,transparent_1px)] [background-size:28px_28px] opacity-40 pointer-events-none" />

        <div className="w-full max-w-xl rounded-3xl bg-[#111520]/90 backdrop-blur-xl border border-white/10 p-8 sm:p-11 text-center shadow-2xl relative z-10 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5B869]/80 to-transparent" />

          <div className="flex justify-center mb-6">
            <BrandLogo size="lg" showText={true} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-400/30 text-[11px] font-semibold tracking-wider uppercase text-amber-300 mb-5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Scheduled Studio Update</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-display font-bold text-white tracking-tight mb-4">
            {settings.maintenanceTitle}
          </h1>
          <p className="text-sm sm:text-base text-[#CBD5E1] leading-relaxed mb-8">
            {settings.maintenanceMessage}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={settings.instagramDmUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all shadow-[0_10px_24px_-8px_rgba(229,184,105,0.5)]"
            >
              <Instagram className="w-4 h-4" />
              <span>Message on Instagram DM</span>
            </a>
            <a
              href={`mailto:${settings.email}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-medium text-white border border-white/15 hover:border-[#E5B869]/50 hover:text-[#E5B869] transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>Email Studio</span>
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs text-[#94A3B8]">
            <span>{settings.instagramHandle}</span>
            <button
              type="button"
              onClick={openAdminPortal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-[#E5B869]/50 text-[#CBD5E1] hover:text-[#E5B869] transition-all cursor-pointer"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => scrollToSection('contact');
  const scrollToWork = () => scrollToSection('work');

  const handleSelectServiceForEnquiry = (serviceName: string) => {
    setSelectedServiceForEnquiry(serviceName);
    scrollToContact();
  };

  const handleEnquireProject = (projectName: string, serviceCategory: string) => {
    setSelectedServiceForEnquiry(serviceCategory);
    setSelectedProjectNote(projectName);
    scrollToContact();
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-[#F8FAFC] flex flex-col relative selection:bg-[#E5B869]/30 selection:text-white pb-16 sm:pb-0 overflow-x-hidden">
      <Navbar onContactClick={scrollToContact} />

      <main className="flex-grow">
        <Hero onExploreWork={scrollToWork} onStartProject={scrollToContact} />
        <Services onSelectServiceForEnquiry={handleSelectServiceForEnquiry} />
        <Portfolio onEnquireProject={handleEnquireProject} />
        <WhyChooseUs />
        <Process />
        <About onContactClick={scrollToContact} />
        <Contact
          initialService={selectedServiceForEnquiry}
          initialProjectNote={selectedProjectNote}
        />
        <SocialJourney />
      </main>

      <Footer onOpenAdmin={openAdminPortal} />

      <VisitorEnquiryModal isOpen={showVisitorModal} onClose={handleCloseVisitorModal} />

      {/* Mobile Quick Actions */}
      <nav
        aria-label="Mobile quick actions"
        className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-[#0B0E16]/95 backdrop-blur-md border-t border-white/10 px-4 py-2.5 flex items-center justify-around"
      >
        <button
          type="button"
          onClick={() => scrollToSection('services')}
          className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#94A3B8] hover:text-white"
        >
          <Monitor className="w-4 h-4 text-[#E5B869]" />
          <span>Services</span>
        </button>

        <button
          type="button"
          onClick={scrollToWork}
          className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#94A3B8] hover:text-white"
        >
          <Film className="w-4 h-4 text-[#E5B869]" />
          <span>Work</span>
        </button>

        <button
          type="button"
          onClick={scrollToContact}
          className="flex flex-col items-center gap-1 text-[11px] font-medium text-[#94A3B8] hover:text-white"
        >
          <MessageSquare className="w-4 h-4 text-[#E5B869]" />
          <span>Contact</span>
        </button>
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <SiteProvider>
      <AppContent />
    </SiteProvider>
  );
}
