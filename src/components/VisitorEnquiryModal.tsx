import React, { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, ArrowRight, Send } from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { useSiteData } from '../context/SiteContext';
import { PhoneNumberInput } from './PhoneNumberInput';
import {
  formatFullPhone,
  getCountryByIso,
  validateCountryPhone,
} from '../utils/phoneCountries';

interface VisitorEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SERVICE_OPTIONS = ['Website Design', 'Video Editing', 'Graphic Design'] as const;

const TIMELINE_OPTIONS = [
  '3–4 Days (Express)',
  '1–2 Weeks',
  '3–4 Weeks',
  'Flexible / Exploring',
] as const;

export const VisitorEnquiryModal: React.FC<VisitorEnquiryModalProps> = ({ isOpen, onClose }) => {
  const { settings, addEnquiry } = useSiteData();

  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [countryIso, setCountryIso] = useState('IN');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [service, setService] = useState<string>('Website Design');
  const [timeline, setTimeline] = useState<string>('1–2 Weeks');
  const [projectDetails, setProjectDetails] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    const country = getCountryByIso(countryIso);
    const phoneError = validateCountryPhone(country, whatsappNumber);

    if (!name.trim()) nextErrors.name = 'Please enter your name.';
    if (phoneError) nextErrors.whatsappNumber = phoneError;
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!projectDetails.trim() || projectDetails.trim().length < 6) {
      nextErrors.projectDetails = 'Please share a brief note about your project.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const getFormattedPhone = () => {
    return formatFullPhone(getCountryByIso(countryIso), whatsappNumber);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addEnquiry({
        name: name.trim(),
        businessName: businessName.trim(),
        whatsappNumber: getFormattedPhone(),
        email: email.trim(),
        service,
        timeline,
        budgetRange: 'Standard Studio Package',
        referenceLink: '',
        projectDetails: projectDetails.trim(),
        channel: 'website',
      });

      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBase =
    'w-full px-3.5 py-2.5 sm:py-3 rounded-xl bg-[#07090E]/90 border text-white text-base sm:text-sm placeholder:text-[#94A3B8]/45 outline-none transition-all duration-200';
  const inputNormal = `${inputBase} border-white/12 hover:border-white/25 focus:border-[#E5B869] focus:ring-1 focus:ring-[#E5B869]/60`;
  const inputError = `${inputBase} border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="visitor-enquiry-title"
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full sm:max-w-xl max-h-[92dvh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[#111520] border border-white/12 shadow-[0_24px_80px_-15px_rgba(0,0,0,0.9)] flex flex-col">
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E5B869]/85 to-transparent shrink-0" />

        {/* Sticky Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-5 sm:px-7 py-4 bg-[#111520]/95 backdrop-blur-md border-b border-white/[0.08]">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo size="sm" showText={false} />
            <div className="min-w-0">
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#E5B869]">
                <Sparkles className="w-3 h-3 shrink-0" />
                <span>Welcome to {settings.brandName}</span>
              </span>
              <h2
                id="visitor-enquiry-title"
                className="text-base sm:text-lg font-display font-semibold text-white truncate"
              >
                Tell Us About Your Project
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close details form"
            className="p-2 rounded-full bg-white/[0.05] hover:bg-white/10 text-[#94A3B8] hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-7 pb-7">
          {submitted ? (
            <div className="py-5 text-center space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-400/35 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-xl font-display font-semibold text-white">
                  Message Sent!
                </h3>
                <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-md mx-auto leading-relaxed">
                  Thank you, {name.trim()}. We have received your message and will contact you soon.
                </p>
              </div>

              <div className="flex items-center justify-center pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all cursor-pointer"
                >
                  <span>Explore Website</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                Share your details below so our team can assist you with Website Design, Video
                Editing, or Graphic Design—or skip anytime to browse.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="visitor-name" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Your Name <span className="text-[#E5B869]">*</span>
                  </label>
                  <input
                    id="visitor-name"
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                    }}
                    placeholder="e.g. Amanpreet Singh"
                    className={errors.name ? inputError : inputNormal}
                  />
                  {errors.name && <p className="mt-1 text-[11px] text-rose-400">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="visitor-brand" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Business / Brand Name
                  </label>
                  <input
                    id="visitor-brand"
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Optional brand name"
                    className={inputNormal}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="visitor-phone" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    WhatsApp / Contact Number <span className="text-[#E5B869]">*</span>
                  </label>
                  <PhoneNumberInput
                    id="visitor-phone"
                    countryIso={countryIso}
                    onCountryChange={(iso) => {
                      setCountryIso(iso);
                      if (errors.whatsappNumber) {
                        setErrors((prev) => ({ ...prev, whatsappNumber: '' }));
                      }
                    }}
                    value={whatsappNumber}
                    onChange={(digits) => {
                      setWhatsappNumber(digits);
                      if (errors.whatsappNumber) {
                        setErrors((prev) => ({ ...prev, whatsappNumber: '' }));
                      }
                    }}
                    error={errors.whatsappNumber}
                  />
                </div>

                <div>
                  <label htmlFor="visitor-email" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Email Address
                  </label>
                  <input
                    id="visitor-email"
                    type="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                    }}
                    placeholder="you@example.com"
                    className={errors.email ? inputError : inputNormal}
                  />
                  {errors.email && <p className="mt-1 text-[11px] text-rose-400">{errors.email}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label htmlFor="visitor-service" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Select a Service <span className="text-[#E5B869]">*</span>
                  </label>
                  <select
                    id="visitor-service"
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={inputNormal}
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="visitor-timeline" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Preferred Timeline
                  </label>
                  <select
                    id="visitor-timeline"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className={inputNormal}
                  >
                    {TIMELINE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="visitor-details" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                  Project Details <span className="text-[#E5B869]">*</span>
                </label>
                <textarea
                  id="visitor-details"
                  rows={3}
                  value={projectDetails}
                  onChange={(e) => {
                    setProjectDetails(e.target.value);
                    if (errors.projectDetails) {
                      setErrors((prev) => ({ ...prev, projectDetails: '' }));
                    }
                  }}
                  placeholder="Briefly describe what you need (website, reels video edit, logo/posters)..."
                  className={`${errors.projectDetails ? inputError : inputNormal} resize-none`}
                />
                {errors.projectDetails && (
                  <p className="mt-1 text-[11px] text-rose-400">{errors.projectDetails}</p>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:flex-1 min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 disabled:opacity-65 transition-all shadow-[0_10px_26px_-8px_rgba(229,184,105,0.5)] cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send & Enter Website'}</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded-full text-xs font-medium text-[#94A3B8] hover:text-white border border-white/10 hover:border-white/25 transition-colors cursor-pointer"
                >
                  Skip for now
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

