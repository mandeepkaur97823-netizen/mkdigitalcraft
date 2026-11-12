import React, { useState, useEffect } from 'react';
import {
  Instagram,
  Mail,
  Copy,
  Check,
  ArrowUpRight,
  Monitor,
  Film,
  Palette,
  Layers,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { useSiteData } from '../context/SiteContext';

interface ContactProps {
  initialService?: string;
  initialProjectNote?: string;
}

interface FormErrors {
  name?: string;
  whatsappNumber?: string;
  email?: string;
  projectDetails?: string;
}

const SERVICE_OPTIONS = [
  { id: 'Website Design', label: 'Website Design', icon: Monitor },
  { id: 'Video Editing', label: 'Video Editing', icon: Film },
  { id: 'Graphic Design', label: 'Graphic Design', icon: Palette },
  { id: 'Multiple Services', label: 'Multiple Services', icon: Layers },
] as const;

const TIMELINE_OPTIONS = [
  'Urgent (3–4 Days)',
  'Fast Track (1–2 Weeks)',
  'Standard (2–4 Weeks)',
  'Flexible / Ongoing',
];

const BUDGET_OPTIONS = [
  'Starter Package',
  'Business / Growth',
  'Full Brand Suite',
  'Discuss on Call',
];

export const Contact: React.FC<ContactProps> = ({
  initialService = 'Website Design',
  initialProjectNote = '',
}) => {
  const { settings, addEnquiry } = useSiteData();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [serviceRequired, setServiceRequired] = useState(initialService);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[0]);
  const [budgetRange, setBudgetRange] = useState(BUDGET_OPTIONS[3]);
  const [referenceLink, setReferenceLink] = useState('');
  const [projectDetails, setProjectDetails] = useState(initialProjectNote);

  const [errors, setErrors] = useState<FormErrors>({});
  const [copied, setCopied] = useState(false);
  const [hasDispatched, setHasDispatched] = useState(false);
  const [dispatchChannel, setDispatchChannel] = useState<'instagram' | 'email'>('instagram');

  useEffect(() => {
    if (initialService) {
      setServiceRequired(initialService);
    }
    if (initialProjectNote) {
      setProjectDetails((prev) => {
        const note = `Interested in: ${initialProjectNote}`;
        if (!prev) return note;
        return prev.includes(note) ? prev : `${prev}\n${note}`;
      });
    }
  }, [initialService, initialProjectNote]);

  const validateForm = (): boolean => {
    const nextErrors: FormErrors = {};
    const digitsOnly = whatsappNumber.replace(/[^0-9]/g, '');

    if (name.trim().length < 2) {
      nextErrors.name = 'Please enter your full name (min 2 characters).';
    }
    if (digitsOnly.length < 8 || digitsOnly.length > 15) {
      nextErrors.whatsappNumber =
        'Enter a valid contact/WhatsApp number with country code (e.g. +91 98765 43210).';
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (projectDetails.trim().length < 15) {
      nextErrors.projectDetails = 'Please share a brief description of at least 15 characters.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const buildFormattedBrief = () => {
    return `Hello MK Digital Craft!

New Project Enquiry
- Name: ${name.trim()}
${businessName.trim() ? `- Business / Brand: ${businessName.trim()}\n` : ''}- Contact / WhatsApp: ${whatsappNumber.trim()}
${email.trim() ? `- Email: ${email.trim()}\n` : ''}- Service: ${serviceRequired}
- Timeline: ${timeline}
- Project Tier: ${budgetRange}
${referenceLink.trim() ? `- Reference Link: ${referenceLink.trim()}\n` : ''}
Project Details:
${projectDetails.trim()}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const brief = buildFormattedBrief();
    try {
      await navigator.clipboard.writeText(brief);
      setCopied(true);
      setTimeout(() => setCopied(false), 3500);
    } catch {
      // Clipboard may be unavailable in restricted contexts; user can still use Copy Brief button
    }

    setDispatchChannel('instagram');
    setHasDispatched(true);
    addEnquiry({
      name: name.trim(),
      businessName: businessName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      email: email.trim(),
      service: serviceRequired,
      timeline,
      budgetRange,
      referenceLink: referenceLink.trim(),
      projectDetails: projectDetails.trim(),
      channel: 'instagram',
    });
    window.open(settings.instagramDmUrl, '_blank', 'noopener,noreferrer');
  };

  const handleEmailSubmit = () => {
    if (!validateForm()) return;

    setDispatchChannel('email');
    setHasDispatched(true);
    addEnquiry({
      name: name.trim(),
      businessName: businessName.trim(),
      whatsappNumber: whatsappNumber.trim(),
      email: email.trim(),
      service: serviceRequired,
      timeline,
      budgetRange,
      referenceLink: referenceLink.trim(),
      projectDetails: projectDetails.trim(),
      channel: 'email',
    });
    const subject = encodeURIComponent(`Project Enquiry: ${serviceRequired} — ${name.trim()}`);
    const body = encodeURIComponent(buildFormattedBrief());
    window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`;
  };

  const handleCopyDetails = () => {
    navigator.clipboard.writeText(buildFormattedBrief());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleReset = () => {
    setName('');
    setBusinessName('');
    setWhatsappNumber('');
    setEmail('');
    setReferenceLink('');
    setProjectDetails('');
    setErrors({});
    setHasDispatched(false);
  };

  const getBriefPlaceholder = () => {
    if (serviceRequired === 'Video Editing') {
      return 'Tell us about your video type (Reels, promo, YouTube), approximate length, footage status, and style references...';
    }
    if (serviceRequired === 'Graphic Design') {
      return 'Describe the creatives needed (brand identity, social posts, posters), target audience, and preferred visual direction...';
    }
    return 'Tell us about your business, pages/features needed (e.g. home, services, booking), and any websites you admire...';
  };

  const inputBase =
    'w-full px-4 py-3 rounded-xl bg-[#07090E]/90 border text-white text-sm placeholder:text-[#94A3B8]/40 outline-none transition-all duration-200';
  const inputNormal = `${inputBase} border-white/12 hover:border-white/25 focus:border-[#E5B869] focus:bg-[#090C12] focus:ring-1 focus:ring-[#E5B869]/60`;
  const inputError = `${inputBase} border-rose-500/70 focus:border-rose-400 focus:ring-1 focus:ring-rose-400/50`;

  return (
    <section
      id="contact"
      className="py-20 bg-[#07090E] relative overflow-hidden border-t border-white/[0.06]"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold tracking-[0.2em] text-[#E5B869] uppercase block mb-2">
            Start a Project
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold tracking-tight text-white mb-3">
            Tell Us About Your Vision
          </h2>
          <p className="text-sm sm:text-base text-[#94A3B8]">
            Fill out your project details below to send directly via Instagram DM or Email.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Panel: Direct Channels */}
          <div className="lg:col-span-4 space-y-5">
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111520] border border-white/[0.08] space-y-6">
              <div>
                <span className="text-[11px] font-semibold tracking-[0.18em] text-[#E5B869] uppercase block mb-1.5">
                  Direct Channels
                </span>
                <h3 className="text-xl font-display font-semibold text-white mb-1.5">
                  Message Us Directly
                </h3>
                <p className="text-xs text-[#94A3B8] leading-relaxed">
                  Reach out on Instagram DM or Email for quick project discussions.
                </p>
              </div>

              <div className="space-y-3">
                <a
                  href={settings.instagramDmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-[#E5B869]/15 to-[#07090E] border border-[#E5B869]/35 hover:border-[#E5B869] text-xs font-semibold text-white transition-all group"
                >
                  <span className="inline-flex items-center gap-2.5">
                    <Instagram className="w-4 h-4 text-[#E5B869] shrink-0" />
                    <span>DM {settings.instagramHandle}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-[#E5B869] shrink-0" />
                </a>

                {settings.email && (
                  <a
                    href={`mailto:${settings.email}`}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-[#07090E] border border-white/[0.07] hover:border-[#E5B869]/45 text-xs text-[#CBD5E1] hover:text-[#E5B869] transition-all gap-2"
                  >
                    <span className="inline-flex items-center gap-2.5 truncate">
                      <Mail className="w-4 h-4 text-[#E5B869] shrink-0" />
                      <span className="truncate">{settings.email}</span>
                    </span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </a>
                )}
              </div>

              <div className="pt-4 border-t border-white/[0.08] space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8] block">
                  Quick Select Service
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {SERVICE_OPTIONS.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setServiceRequired(item.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition-colors cursor-pointer ${
                        serviceRequired === item.id
                          ? 'bg-[#E5B869]/15 border-[#E5B869]/50 text-[#E5B869]'
                          : 'bg-[#07090E] border-white/10 text-[#94A3B8] hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Structured Client Intake Form */}
          <div className="lg:col-span-8">
            <form
              onSubmit={handleSubmit}
              noValidate
              className="p-6 sm:p-8 lg:p-9 rounded-3xl bg-gradient-to-b from-[#131825] to-[#10141E] border border-white/[0.1] shadow-2xl space-y-6 relative overflow-hidden"
            >
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5B869]/70 to-transparent" />

              {/* Step 01: Client Details */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-2.5">
                  <span className="text-xs font-semibold tracking-[0.16em] text-[#E5B869] uppercase">
                    01 · Client Details
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">* Required fields</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name-input" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Full Name <span className="text-[#E5B869]">*</span>
                    </label>
                    <input
                      id="name-input"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (errors.name) setErrors({ ...errors, name: undefined });
                      }}
                      placeholder="e.g. Alex Johnson"
                      className={errors.name ? inputError : inputNormal}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.name}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="biz-input" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Business / Brand Name
                    </label>
                    <input
                      id="biz-input"
                      type="text"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      placeholder="e.g. Northstar Studio (Optional)"
                      className={inputNormal}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="wa-input" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      WhatsApp / Contact Number <span className="text-[#E5B869]">*</span>
                    </label>
                    <input
                      id="wa-input"
                      type="tel"
                      required
                      value={whatsappNumber}
                      onChange={(e) => {
                        setWhatsappNumber(e.target.value);
                        if (errors.whatsappNumber)
                          setErrors({ ...errors, whatsappNumber: undefined });
                      }}
                      placeholder="+91 98765 43210"
                      className={errors.whatsappNumber ? inputError : inputNormal}
                    />
                    {errors.whatsappNumber && (
                      <p className="mt-1.5 text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.whatsappNumber}</span>
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email-input" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Email Address
                    </label>
                    <input
                      id="email-input"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="you@company.com"
                      className={errors.email ? inputError : inputNormal}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-[11px] text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 02: Project Scope */}
              <div className="space-y-4 pt-1">
                <div className="border-b border-white/[0.07] pb-2.5">
                  <span className="text-xs font-semibold tracking-[0.16em] text-[#E5B869] uppercase">
                    02 · Project Scope
                  </span>
                </div>

                <div>
                  <span className="block text-xs font-medium text-[#E2E8F0] mb-2">
                    Select a Service <span className="text-[#E5B869]">*</span>
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {SERVICE_OPTIONS.map(({ id, label, icon: Icon }) => {
                      const active = serviceRequired === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => setServiceRequired(id)}
                          className={`p-3 rounded-xl border text-left transition-all duration-200 flex flex-col gap-2 cursor-pointer ${
                            active
                              ? 'bg-[#E5B869]/12 border-[#E5B869] text-white shadow-[0_0_20px_-8px_rgba(229,184,105,0.45)]'
                              : 'bg-[#07090E]/80 border-white/10 text-[#94A3B8] hover:border-white/25 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <Icon
                              className={`w-4 h-4 ${active ? 'text-[#E5B869]' : 'text-[#94A3B8]'}`}
                            />
                            {active && <span className="w-2 h-2 rounded-full bg-[#E5B869]" />}
                          </div>
                          <span className="text-xs font-medium leading-tight">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="timeline-select" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Target Timeline
                    </label>
                    <div className="relative">
                      <select
                        id="timeline-select"
                        value={timeline}
                        onChange={(e) => setTimeline(e.target.value)}
                        className={`${inputNormal} appearance-none pr-10 cursor-pointer`}
                      >
                        {TIMELINE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#111520] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#E5B869] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="budget-select" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Project Tier
                    </label>
                    <div className="relative">
                      <select
                        id="budget-select"
                        value={budgetRange}
                        onChange={(e) => setBudgetRange(e.target.value)}
                        className={`${inputNormal} appearance-none pr-10 cursor-pointer`}
                      >
                        {BUDGET_OPTIONS.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#111520] text-white">
                            {opt}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#E5B869] pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="ref-input" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Existing Website or Reference Link{' '}
                    <span className="text-[#94A3B8]/70">(Optional)</span>
                  </label>
                  <input
                    id="ref-input"
                    type="url"
                    value={referenceLink}
                    onChange={(e) => setReferenceLink(e.target.value)}
                    placeholder="https://example.com or Instagram/Drive reference link"
                    className={inputNormal}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label htmlFor="details-textarea" className="block text-xs font-medium text-[#E2E8F0]">
                      Project Details <span className="text-[#E5B869]">*</span>
                    </label>
                    <span className="text-[11px] font-mono text-[#94A3B8]/70">
                      {projectDetails.length} chars
                    </span>
                  </div>
                  <textarea
                    id="details-textarea"
                    required
                    rows={4}
                    value={projectDetails}
                    onChange={(e) => {
                      setProjectDetails(e.target.value);
                      if (errors.projectDetails)
                        setErrors({ ...errors, projectDetails: undefined });
                    }}
                    placeholder={getBriefPlaceholder()}
                    className={`${errors.projectDetails ? inputError : inputNormal} resize-none`}
                  />
                  {errors.projectDetails && (
                    <p className="mt-1.5 text-[11px] text-rose-400 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{errors.projectDetails}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Submit Actions */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <button
                  type="submit"
                  className="flex-1 min-h-[48px] py-3.5 px-6 rounded-full text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all shadow-[0_10px_28px_-8px_rgba(229,184,105,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Send via Instagram DM</span>
                </button>

                <button
                  type="button"
                  onClick={handleEmailSubmit}
                  className="min-h-[48px] py-3.5 px-6 rounded-full text-sm font-medium text-[#F8FAFC] border border-white/15 hover:border-[#E5B869]/50 bg-white/[0.02] hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4 text-[#E5B869]" />
                  <span>Send via Email</span>
                </button>
              </div>

              {hasDispatched && (
                <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      {dispatchChannel === 'instagram'
                        ? 'Brief copied & @mk.digitalcraft Instagram DM opened — just paste and send!'
                        : 'Your structured brief has been prepared in your Email client.'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={handleCopyDetails}
                      className="inline-flex items-center gap-1 font-semibold underline text-white hover:text-[#E5B869] cursor-pointer"
                    >
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy Brief'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleReset}
                      className="text-[#94A3B8] hover:text-white underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
