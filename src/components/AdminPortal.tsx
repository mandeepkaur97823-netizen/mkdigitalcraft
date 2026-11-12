import React, { useState, useEffect } from 'react';
import {
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  LogOut,
  Inbox,
  FolderKanban,
  Settings,
  Plus,
  Trash2,
  Pencil,
  Copy,
  Check,
  RotateCcw,
  Save,
  ExternalLink,
  Search,
  Upload,
  CheckCircle2,
  AlertCircle,
  Power,
  Globe,
  Sparkles,
  Mail,
  ShieldCheck,
  CloudUpload,
  RefreshCw,
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import {
  useSiteData,
  EnquiryStatus,
  SiteSettings,
} from '../context/SiteContext';
import { PortfolioItem, portfolioItems as defaultPortfolio } from '../data/config';

interface AdminPortalProps {
  onExit: () => void;
}

const ADMIN_PASSCODE = '12345678';
const AUTH_SESSION_KEY = 'mk_dc_admin_auth';

type AdminTab = 'enquiries' | 'portfolio' | 'settings';

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExit }) => {
  const {
    settings,
    portfolio,
    enquiries,
    syncState,
    syncMessage,
    githubServerConfigured,
    githubSyncToken,
    setGithubSyncToken,
    manualSyncToGithub,
    updateSettings,
    addPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem,
    updateEnquiryStatus,
    deleteEnquiry,
    resetSiteDefaults,
  } = useSiteData();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(AUTH_SESSION_KEY) === '1';
    } catch {
      return false;
    }
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<AdminTab>('enquiries');
  const [enquiryFilter, setEnquiryFilter] = useState<'all' | EnquiryStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [siteToast, setSiteToast] = useState<string | null>(null);

  // Settings form state
  const [draftSettings, setDraftSettings] = useState<SiteSettings>(settings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  useEffect(() => {
    setDraftSettings(settings);
  }, [settings]);

  // Portfolio editor state
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] =
    useState<PortfolioItem['category']>('website-design');
  const [projDesc, setProjDesc] = useState('');
  const [projDetails, setProjDetails] = useState('');
  const [projImageUrl, setProjImageUrl] = useState(defaultPortfolio[0].imageUrl);
  const [projTags, setProjTags] = useState('Custom Design, Responsive');
  const [projTools, setProjTools] = useState('React, Tailwind CSS');
  const [projDuration, setProjDuration] = useState('0:45');
  const [projIsDemo, setProjIsDemo] = useState(false);

  const showToastMessage = (message: string) => {
    setSiteToast(message);
    setTimeout(() => setSiteToast(null), 2600);
  };

  const handleToggleSiteStatus = () => {
    const nextEnabled = !settings.siteEnabled;
    const updated: SiteSettings = { ...settings, siteEnabled: nextEnabled };
    updateSettings(updated);
    setDraftSettings(updated);
    showToastMessage(
      nextEnabled
        ? 'Website is now ON (Live for all visitors)'
        : 'Website is now OFF (Maintenance Mode active)'
    );
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSCODE) {
      setIsAuthenticated(true);
      setAuthError('');
      setPasswordInput('');
      try {
        sessionStorage.setItem(AUTH_SESSION_KEY, '1');
      } catch {
        // Ignore
      }
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    try {
      sessionStorage.removeItem(AUTH_SESSION_KEY);
    } catch {
      // Ignore
    }
  };

  const handleCopyEnquiry = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const openNewProjectForm = () => {
    setEditingItemId(null);
    setProjTitle('');
    setProjCategory('website-design');
    setProjDesc('');
    setProjDetails('');
    setProjImageUrl(defaultPortfolio[0].imageUrl);
    setProjTags('Brand Project, Custom');
    setProjTools('React, Tailwind CSS');
    setProjDuration('0:45');
    setProjIsDemo(false);
    setShowProjectForm(true);
  };

  const openEditProjectForm = (item: PortfolioItem) => {
    setEditingItemId(item.id);
    setProjTitle(item.title);
    setProjCategory(item.category);
    setProjDesc(item.description);
    setProjDetails(item.details);
    setProjImageUrl(item.imageUrl);
    setProjTags(item.tags.join(', '));
    setProjTools((item.toolsUsed || []).join(', '));
    setProjDuration(item.duration || '0:45');
    setProjIsDemo(item.isDemo);
    setShowProjectForm(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProjImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle.trim() || !projDesc.trim()) return;

    const categoryMeta: Record<
      PortfolioItem['category'],
      {
        label: string;
        previewType: PortfolioItem['previewType'];
        ctaLabel: PortfolioItem['ctaLabel'];
      }
    > = {
      'website-design': {
        label: 'Website Projects',
        previewType: 'website',
        ctaLabel: 'View Project',
      },
      'video-editing': {
        label: 'Video Editing Projects',
        previewType: 'video',
        ctaLabel: 'View Video',
      },
      'graphic-design': {
        label: 'Graphic Design Projects',
        previewType: 'graphic',
        ctaLabel: 'View Project',
      },
    };

    const meta = categoryMeta[projCategory];
    const parsedTags = projTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const parsedTools = projTools
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Omit<PortfolioItem, 'id'> = {
      title: projTitle.trim(),
      category: projCategory,
      categoryLabel: meta.label,
      description: projDesc.trim(),
      details: projDetails.trim() || projDesc.trim(),
      tags: parsedTags.length ? parsedTags : ['Digital Craft'],
      imageUrl: projImageUrl.trim() || defaultPortfolio[0].imageUrl,
      previewType: meta.previewType,
      ctaLabel: meta.ctaLabel,
      duration: projCategory === 'video-editing' ? projDuration.trim() || '0:45' : undefined,
      toolsUsed: parsedTools.length ? parsedTools : ['MK Digital Craft'],
      isDemo: projIsDemo,
    };

    if (editingItemId) {
      updatePortfolioItem({ ...payload, id: editingItemId });
      showToastMessage('Portfolio project updated');
    } else {
      addPortfolioItem(payload);
      showToastMessage('New project added to portfolio');
    }

    setShowProjectForm(false);
    setEditingItemId(null);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(draftSettings);
    setSettingsSaved(true);
    showToastMessage('Site settings saved live');
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    resetSiteDefaults();
    setSettingsSaved(true);
    showToastMessage('Site defaults restored');
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  const filteredEnquiries = enquiries.filter((item) => {
    const matchesStatus = enquiryFilter === 'all' || item.status === enquiryFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.businessName.toLowerCase().includes(q) ||
      item.service.toLowerCase().includes(q) ||
      item.projectDetails.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  const inputClasses =
    'w-full px-4 py-2.5 rounded-xl bg-[#07090E]/90 border border-white/12 focus:border-[#E5B869] focus:ring-1 focus:ring-[#E5B869]/60 text-white text-sm placeholder:text-[#94A3B8]/40 outline-none transition-all';

  // =========================================================================
  // LOGIN GATE
  // =========================================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#07090E] text-[#F8FAFC] flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[42rem] h-[22rem] rounded-full bg-[#E5B869]/[0.1] blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#E5B86910_1px,transparent_1px)] [background-size:28px_28px] opacity-35 pointer-events-none" />

        <div className="w-full max-w-md rounded-3xl bg-[#111520]/95 backdrop-blur-xl border border-white/10 p-7 sm:p-9 shadow-[0_24px_80px_-20px_rgba(0,0,0,0.85)] relative z-10 overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5B869]/85 to-transparent" />

          <div className="flex flex-col items-center text-center mb-7">
            <BrandLogo size="lg" showText={false} className="mb-4" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5B869]/10 border border-[#E5B869]/30 text-[10px] font-semibold tracking-[0.2em] text-[#E5B869] uppercase mb-2.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>MK Digital Craft · Admin Console</span>
            </span>
            <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
              Studio Admin Portal
            </h1>
            <p className="text-xs text-[#94A3B8] mt-1.5 max-w-xs">
              Sign in to toggle website status, manage client enquiries, and update your portfolio.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#E5B869] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="Enter admin password"
                  className={`${inputClasses} pl-10 pr-10`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-white cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {authError && (
                <p className="mt-2 text-xs text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full min-h-[46px] py-3 rounded-full text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all shadow-[0_12px_28px_-8px_rgba(229,184,105,0.55)] cursor-pointer"
            >
              Unlock Admin Portal
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.08] flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 text-[#94A3B8]">
              <span
                className={`w-2 h-2 rounded-full ${
                  settings.siteEnabled ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span>{settings.siteEnabled ? 'Site is Live (ON)' : 'Site Offline (OFF)'}</span>
            </span>

            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 text-[#94A3B8] hover:text-[#E5B869] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED ADMIN DASHBOARD
  // =========================================================================
  const newCount = enquiries.filter((e) => e.status === 'new').length;
  const inProgressCount = enquiries.filter((e) => e.status === 'in-progress').length;
  const completedCount = enquiries.filter((e) => e.status === 'completed').length;

  const statusBadgeClasses: Record<EnquiryStatus, string> = {
    new: 'bg-[#E5B869]/15 text-[#F3D18E] border-[#E5B869]/35',
    'in-progress': 'bg-sky-500/15 text-sky-300 border-sky-400/30',
    completed: 'bg-emerald-500/15 text-emerald-300 border-emerald-400/30',
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-[#F8FAFC] flex flex-col relative overflow-x-hidden">
      {/* Subtle Ambient Backdrop Glow */}
      <div className="fixed -top-48 left-1/2 -translate-x-1/2 w-[56rem] h-[22rem] rounded-full bg-[#E5B869]/[0.06] blur-[160px] pointer-events-none" />

      {/* Top Accent Bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#E5B869]/80 to-transparent" />

      {/* Sticky Studio Header */}
      <header className="sticky top-0 z-30 bg-[#0B0E16]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <BrandLogo size="sm" showText={true} />
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.16em] bg-[#E5B869]/15 border border-[#E5B869]/35 text-[#E5B869]">
              Studio Admin
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Prominent Website ON / OFF Switch */}
            <button
              type="button"
              role="switch"
              aria-checked={settings.siteEnabled}
              onClick={handleToggleSiteStatus}
              title="Turn public website ON or OFF (Maintenance Mode)"
              className={`inline-flex items-center gap-2.5 pl-3 pr-2 py-1.5 rounded-full border text-xs font-semibold transition-all cursor-pointer ${
                settings.siteEnabled
                  ? 'bg-emerald-500/10 border-emerald-400/35 text-emerald-300 hover:bg-emerald-500/15'
                  : 'bg-rose-500/10 border-rose-400/35 text-rose-300 hover:bg-rose-500/15'
              }`}
            >
              <span className="relative flex h-2 w-2">
                {settings.siteEnabled && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${
                    settings.siteEnabled ? 'bg-emerald-400' : 'bg-rose-400'
                  }`}
                />
              </span>
              <span>{settings.siteEnabled ? 'Site ON' : 'Site OFF'}</span>
              <span
                className={`w-9 h-5 rounded-full p-0.5 transition-colors flex items-center ${
                  settings.siteEnabled ? 'bg-emerald-500 justify-end' : 'bg-white/20 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm" />
              </span>
            </button>

            {/* GitHub Sync Status Button */}
            <button
              type="button"
              onClick={async () => {
                const ok = await manualSyncToGithub();
                if (!ok && !githubServerConfigured && !githubSyncToken) {
                  setActiveTab('settings');
                }
                showToastMessage(
                  ok
                    ? 'All live site data saved to GitHub!'
                    : 'Configure GitHub Token in Settings to push live changes'
                );
              }}
              title={syncMessage}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                syncState === 'synced'
                  ? 'bg-[#E5B869]/10 border-[#E5B869]/40 text-[#F3D18E]'
                  : syncState === 'error'
                    ? 'bg-rose-500/10 border-rose-400/35 text-rose-300'
                    : 'bg-white/[0.03] border-white/15 text-[#CBD5E1] hover:border-[#E5B869]/50 hover:text-[#E5B869]'
              }`}
            >
              {syncState === 'syncing' ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E5B869]" />
              ) : (
                <CloudUpload className="w-3.5 h-3.5 text-[#E5B869]" />
              )}
              <span>
                {syncState === 'syncing'
                  ? 'Syncing...'
                  : syncState === 'synced'
                    ? 'GitHub Synced'
                    : 'Sync to GitHub'}
              </span>
            </button>

            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#E2E8F0] bg-white/[0.03] border border-white/15 hover:border-[#E5B869]/50 hover:text-[#E5B869] transition-colors cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{settings.siteEnabled ? 'View Live Site' : 'Preview Offline Page'}</span>
            </button>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[#94A3B8] hover:text-rose-300 border border-white/10 hover:border-rose-500/30 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Live Feedback Toast */}
      {siteToast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#111520]/95 border border-[#E5B869]/50 text-xs font-medium text-white shadow-2xl backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4 text-[#E5B869]" />
          <span>{siteToast}</span>
        </div>
      )}

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-7 flex-grow relative z-10">
        {/* Executive Studio Command Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#131826] via-[#101420] to-[#0B0E16] border border-white/[0.09] p-6 sm:p-7 overflow-hidden shadow-xl">
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-[#E5B869]/[0.08] blur-[90px] pointer-events-none" />
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E5B869]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Studio Command Center</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-white tracking-tight">
                Welcome back, {settings.brandName}
              </h1>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl">
                Monitor incoming client briefs, manage showcase projects, and control live site
                availability from one workspace.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={handleToggleSiteStatus}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  settings.siteEnabled
                    ? 'bg-emerald-500/10 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/20'
                    : 'bg-rose-500/10 border-rose-400/30 text-rose-300 hover:bg-rose-500/20'
                }`}
              >
                <Power className="w-3.5 h-3.5" />
                <span>{settings.siteEnabled ? 'Turn Site OFF' : 'Turn Site ON'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setActiveTab('portfolio');
                  openNewProjectForm();
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all shadow-[0_10px_24px_-8px_rgba(229,184,105,0.45)] cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Portfolio Project</span>
              </button>
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="group relative p-5 rounded-2xl bg-[#111520]/90 border border-white/[0.08] hover:border-[#E5B869]/35 transition-all overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5B869]/40 to-transparent opacity-70" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-[#94A3B8] block mb-1.5">
                  Total Enquiries
                </span>
                <span className="text-3xl font-display font-semibold text-white">
                  {enquiries.length}
                </span>
                <span className="text-[11px] text-[#94A3B8]/80 block mt-1">
                  All submitted client briefs
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/25 text-[#E5B869]">
                <Inbox className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="group relative p-5 rounded-2xl bg-[#111520]/90 border border-white/[0.08] hover:border-[#E5B869]/35 transition-all overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5B869]/40 to-transparent opacity-70" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-[#94A3B8] block mb-1.5">
                  New Enquiries
                </span>
                <span className="text-3xl font-display font-semibold text-[#E5B869]">
                  {newCount}
                </span>
                <span className="text-[11px] text-[#94A3B8]/80 block mt-1">
                  Awaiting studio response
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/25 text-[#E5B869]">
                <Sparkles className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="group relative p-5 rounded-2xl bg-[#111520]/90 border border-white/[0.08] hover:border-[#E5B869]/35 transition-all overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#E5B869]/40 to-transparent opacity-70" />
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-[#94A3B8] block mb-1.5">
                  Portfolio Projects
                </span>
                <span className="text-3xl font-display font-semibold text-white">
                  {portfolio.length}
                </span>
                <span className="text-[11px] text-[#94A3B8]/80 block mt-1">
                  Published work cards
                </span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#E5B869]/10 border border-[#E5B869]/25 text-[#E5B869]">
                <FolderKanban className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="group relative p-5 rounded-2xl bg-[#111520]/90 border border-white/[0.08] hover:border-[#E5B869]/35 transition-all overflow-hidden">
            <div
              className={`absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent ${
                settings.siteEnabled ? 'via-emerald-400/50' : 'via-rose-400/50'
              } to-transparent`}
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-medium text-[#94A3B8] block mb-1.5">
                  Website Status
                </span>
                <span
                  className={`text-2xl sm:text-3xl font-display font-semibold ${
                    settings.siteEnabled ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {settings.siteEnabled ? 'Live (ON)' : 'Offline (OFF)'}
                </span>
                <span className="text-[11px] text-[#94A3B8]/80 block mt-1">
                  {settings.siteEnabled ? 'Public access enabled' : 'Maintenance screen active'}
                </span>
              </div>
              <div
                className={`p-2.5 rounded-xl border ${
                  settings.siteEnabled
                    ? 'bg-emerald-500/10 border-emerald-400/25 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-400/25 text-rose-400'
                }`}
              >
                <Globe className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 rounded-2xl sm:rounded-full bg-[#111520] border border-white/[0.08] shadow-inner">
            {[
              { id: 'enquiries' as const, label: 'Enquiries', count: enquiries.length, icon: Inbox },
              {
                id: 'portfolio' as const,
                label: 'Portfolio',
                count: portfolio.length,
                icon: FolderKanban,
              },
              { id: 'settings' as const, label: 'Site Settings & Status', icon: Settings },
            ].map(({ id, label, count, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    active
                      ? 'bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#D4A04B] text-[#07090E] font-semibold shadow-md'
                      : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {typeof count === 'number' && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        active ? 'bg-[#07090E]/15 text-[#07090E]' : 'bg-white/[0.07] text-[#CBD5E1]'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===============================================================
            TAB 1: ENQUIRIES INBOX
           =============================================================== */}
        {activeTab === 'enquiries' && (
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-[#111520]/80 border border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {(
                  [
                    { key: 'all', label: 'All', count: enquiries.length },
                    { key: 'new', label: 'New', count: newCount },
                    { key: 'in-progress', label: 'In Progress', count: inProgressCount },
                    { key: 'completed', label: 'Completed', count: completedCount },
                  ] as const
                ).map(({ key, label, count }) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setEnquiryFilter(key)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                      enquiryFilter === key
                        ? 'bg-[#E5B869]/15 border-[#E5B869] text-[#F3D18E]'
                        : 'bg-[#07090E]/70 border-white/10 text-[#94A3B8] hover:text-white hover:border-white/25'
                    }`}
                  >
                    <span>{label}</span>
                    <span className="text-[10px] opacity-75">({count})</span>
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search name, brand, or service..."
                  className={`${inputClasses} pl-9 py-2`}
                />
              </div>
            </div>

            {filteredEnquiries.length === 0 ? (
              <div className="relative p-12 sm:p-14 rounded-3xl bg-[#111520]/85 border border-white/[0.08] text-center overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full bg-[#E5B869]/[0.06] blur-[70px] pointer-events-none" />
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-2xl bg-[#E5B869]/10 border border-[#E5B869]/30 flex items-center justify-center mx-auto mb-4">
                    <Inbox className="w-7 h-7 text-[#E5B869]" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-display font-semibold text-white mb-1.5">
                    {enquiries.length === 0
                      ? 'No Client Enquiries Yet'
                      : 'No Matching Enquiries'}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto mb-5 leading-relaxed">
                    {enquiries.length === 0
                      ? 'When visitors submit the project form on your website, their full contact details, timeline, and brief appear here automatically.'
                      : 'Try clearing your search filter or switching tabs to view other enquiries.'}
                  </p>
                  {enquiries.length === 0 && (
                    <button
                      type="button"
                      onClick={onExit}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-medium text-[#E5B869] bg-[#E5B869]/10 border border-[#E5B869]/30 hover:bg-[#E5B869]/20 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Open Website Contact Form</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredEnquiries.map((item) => {
                  const summaryText = `Name: ${item.name}
Business: ${item.businessName || 'N/A'}
Contact/WhatsApp: ${item.whatsappNumber}
Email: ${item.email || 'N/A'}
Service: ${item.service}
Timeline: ${item.timeline}
Tier: ${item.budgetRange}
Reference: ${item.referenceLink || 'N/A'}
Details: ${item.projectDetails}`;

                  return (
                    <div
                      key={item.id}
                      className="p-5 sm:p-6 rounded-2xl bg-[#111520]/90 border border-white/[0.08] hover:border-[#E5B869]/30 transition-all space-y-4 shadow-lg"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-base sm:text-lg font-display font-semibold text-white">
                              {item.name}
                            </h3>
                            {item.businessName && (
                              <span className="text-xs text-[#94A3B8]">· {item.businessName}</span>
                            )}
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-[#E5B869]/15 text-[#E5B869] border border-[#E5B869]/30">
                              {item.service}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                                statusBadgeClasses[item.status]
                              }`}
                            >
                              {item.status.replace('-', ' ')}
                            </span>
                          </div>
                          <p className="text-xs text-[#94A3B8]">
                            {new Date(item.createdAt).toLocaleString()} · via{' '}
                            {item.channel === 'website'
                              ? 'Website Form'
                              : item.channel === 'instagram'
                                ? 'Instagram DM'
                                : 'Email'}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          {item.email && (
                            <a
                              href={`mailto:${item.email}?subject=${encodeURIComponent(
                                `Re: ${item.service} Enquiry - ${settings.brandName}`
                              )}`}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#07090E] border border-white/10 hover:border-[#E5B869]/40 text-xs text-[#CBD5E1] hover:text-[#E5B869] transition-colors"
                              title="Reply via Email"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              <span>Reply</span>
                            </a>
                          )}

                          <select
                            value={item.status}
                            onChange={(e) =>
                              updateEnquiryStatus(item.id, e.target.value as EnquiryStatus)
                            }
                            aria-label="Enquiry status"
                            className="px-3 py-1.5 rounded-lg bg-[#07090E] border border-white/15 text-xs text-white outline-none focus:border-[#E5B869] cursor-pointer"
                          >
                            <option value="new">New</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>

                          <button
                            type="button"
                            onClick={() => handleCopyEnquiry(summaryText, item.id)}
                            className="p-2 rounded-lg bg-[#07090E] border border-white/10 hover:border-[#E5B869]/40 text-[#CBD5E1] hover:text-[#E5B869] cursor-pointer"
                            title="Copy details"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteEnquiry(item.id)}
                            className="p-2 rounded-lg bg-[#07090E] border border-white/10 hover:border-rose-500/40 text-[#94A3B8] hover:text-rose-400 cursor-pointer"
                            title="Delete enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs bg-[#07090E]/80 p-3.5 rounded-xl border border-white/[0.06]">
                        <div>
                          <span className="text-[#94A3B8] block">WhatsApp / Contact</span>
                          <span className="text-white font-medium">{item.whatsappNumber}</span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] block">Email</span>
                          <span className="text-white font-medium break-all">
                            {item.email || '—'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] block">Timeline</span>
                          <span className="text-white font-medium">{item.timeline}</span>
                        </div>
                        <div>
                          <span className="text-[#94A3B8] block">Project Tier</span>
                          <span className="text-white font-medium">{item.budgetRange}</span>
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-[#CBD5E1] leading-relaxed whitespace-pre-wrap">
                        {item.projectDetails}
                      </p>

                      {item.referenceLink && (
                        <a
                          href={item.referenceLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-[#E5B869] hover:underline"
                        >
                          <span>Reference: {item.referenceLink}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===============================================================
            TAB 2: PORTFOLIO MANAGER
           =============================================================== */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-display font-semibold text-white">
                  Manage Showcase Projects
                </h2>
                <p className="text-xs text-[#94A3B8]">
                  Add real client work or update demo placeholders. Changes sync instantly.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewProjectForm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 cursor-pointer shadow-lg"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>

            {showProjectForm && (
              <form
                onSubmit={handleSaveProject}
                className="p-6 rounded-3xl bg-[#111520] border border-[#E5B869]/35 space-y-4 shadow-2xl"
              >
                <div className="flex items-center justify-between pb-2 border-b border-white/10">
                  <h3 className="text-base font-display font-semibold text-white">
                    {editingItemId ? 'Edit Project' : 'New Portfolio Project'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setShowProjectForm(false)}
                    className="text-xs text-[#94A3B8] hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={projTitle}
                      onChange={(e) => setProjTitle(e.target.value)}
                      placeholder="e.g. Modern Cafe Website"
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Category *
                    </label>
                    <select
                      value={projCategory}
                      onChange={(e) =>
                        setProjCategory(e.target.value as PortfolioItem['category'])
                      }
                      className={inputClasses}
                    >
                      <option value="website-design">Website Projects</option>
                      <option value="video-editing">Video Editing Projects</option>
                      <option value="graphic-design">Graphic Design Projects</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Short Description *
                  </label>
                  <input
                    type="text"
                    required
                    value={projDesc}
                    onChange={(e) => setProjDesc(e.target.value)}
                    placeholder="Concise 1-line project summary"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Detailed Overview
                  </label>
                  <textarea
                    rows={3}
                    value={projDetails}
                    onChange={(e) => setProjDetails(e.target.value)}
                    placeholder="Full details shown inside the preview modal..."
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Image URL or Upload
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={projImageUrl}
                        onChange={(e) => setProjImageUrl(e.target.value)}
                        placeholder="Image URL"
                        className={inputClasses}
                      />
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 border border-white/15 hover:border-[#E5B869]/50 text-xs text-white cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5 text-[#E5B869]" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={projTags}
                      onChange={(e) => setProjTags(e.target.value)}
                      placeholder="Responsive UI, Landing Page"
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div>
                    <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Tools Used (comma separated)
                    </label>
                    <input
                      type="text"
                      value={projTools}
                      onChange={(e) => setProjTools(e.target.value)}
                      placeholder="React, Tailwind CSS"
                      className={inputClasses}
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-5">
                    {projCategory === 'video-editing' && (
                      <input
                        type="text"
                        value={projDuration}
                        onChange={(e) => setProjDuration(e.target.value)}
                        placeholder="0:45"
                        className="w-24 px-3 py-2 rounded-xl bg-[#07090E] border border-white/12 text-xs text-white"
                      />
                    )}
                    <label className="inline-flex items-center gap-2 text-xs text-[#CBD5E1] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={projIsDemo}
                        onChange={(e) => setProjIsDemo(e.target.checked)}
                        className="accent-[#E5B869]"
                      />
                      <span>Label as Demo Concept</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold text-[#07090E] bg-[#E5B869] hover:bg-[#F3D18E] cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingItemId ? 'Update Project' : 'Save Project'}</span>
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolio.map((item) => (
                <div
                  key={item.id}
                  className="group rounded-2xl bg-[#111520]/90 border border-white/[0.08] hover:border-[#E5B869]/35 overflow-hidden flex flex-col justify-between transition-all shadow-lg"
                >
                  <div>
                    <div className="aspect-[16/10] bg-[#07090E] relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#07090E]/80 via-transparent to-transparent" />
                      <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/75 backdrop-blur-md text-[10px] font-medium text-[#E5B869] border border-white/10">
                        {item.categoryLabel}
                      </span>
                    </div>
                    <div className="p-4 sm:p-5">
                      <h3 className="text-base font-display font-semibold text-white mb-1">
                        {item.title}
                      </h3>
                      <p className="text-xs text-[#94A3B8] line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="px-4 sm:px-5 py-3 border-t border-white/[0.06] flex items-center justify-between bg-[#0B0E16]/50">
                    <span
                      className={`text-[11px] font-mono ${
                        item.isDemo ? 'text-[#94A3B8]' : 'text-emerald-400'
                      }`}
                    >
                      {item.isDemo ? 'Demo Concept' : 'Live Project'}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openEditProjectForm(item)}
                        className="p-1.5 rounded-lg bg-[#07090E] border border-white/10 hover:border-[#E5B869]/40 text-[#CBD5E1] hover:text-[#E5B869] cursor-pointer"
                        title="Edit project"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deletePortfolioItem(item.id)}
                        className="p-1.5 rounded-lg bg-[#07090E] border border-white/10 hover:border-rose-500/40 text-[#94A3B8] hover:text-rose-400 cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===============================================================
            TAB 3: SITE SETTINGS & STATUS
           =============================================================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-6">
            {/* Website ON / OFF Visibility Control Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111520]/90 border border-white/[0.08] space-y-5 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Power
                      className={`w-4 h-4 ${
                        draftSettings.siteEnabled ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    />
                    <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
                      Website Power & Public Visibility
                    </h2>
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Switch your public website ON (Live) or OFF (Maintenance Screen) anytime.
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={draftSettings.siteEnabled}
                  onClick={handleToggleSiteStatus}
                  className={`inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl border text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                    draftSettings.siteEnabled
                      ? 'bg-emerald-500/10 border-emerald-400/35 text-emerald-300'
                      : 'bg-rose-500/10 border-rose-400/35 text-rose-300'
                  }`}
                >
                  <span>{draftSettings.siteEnabled ? 'Website ON (Live)' : 'Website OFF (Offline)'}</span>
                  <span
                    className={`w-11 h-6 rounded-full p-0.5 transition-colors flex items-center ${
                      draftSettings.siteEnabled
                        ? 'bg-emerald-500 justify-end'
                        : 'bg-white/20 justify-start'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full bg-white shadow" />
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Offline Screen Headline
                  </label>
                  <input
                    type="text"
                    value={draftSettings.maintenanceTitle}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, maintenanceTitle: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Offline Screen Message
                  </label>
                  <input
                    type="text"
                    value={draftSettings.maintenanceMessage}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, maintenanceMessage: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>
            </div>

            {/* GitHub Live Auto-Sync Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-[#111520]/90 border border-white/[0.08] space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CloudUpload className="w-4 h-4 text-[#E5B869]" />
                    <h2 className="text-lg sm:text-xl font-display font-semibold text-white">
                      GitHub Auto-Sync (Live Website → GitHub)
                    </h2>
                  </div>
                  <p className="text-xs text-[#94A3B8]">
                    Status: <span className="text-[#E5B869] font-medium">{syncMessage}</span> · Saves
                    all Site ON/OFF changes, Portfolio edits, Settings, and Enquiries to{' '}
                    <span className="font-mono text-white/80">public/site-data.json</span> on
                    GitHub.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    const ok = await manualSyncToGithub();
                    showToastMessage(
                      ok
                        ? 'Saved & committed to GitHub!'
                        : 'Add a GitHub repo token below or set GITHUB_TOKEN in Vercel.'
                    );
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 transition-all cursor-pointer shrink-0"
                >
                  <CloudUpload className="w-3.5 h-3.5" />
                  <span>Sync Now to GitHub</span>
                </button>
              </div>

              {!githubServerConfigured && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                  <div className="sm:col-span-9">
                    <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Optional Browser GitHub Token (if <span className="font-mono">GITHUB_TOKEN</span>{' '}
                      is not yet added in Vercel Environment Variables)
                    </label>
                    <input
                      type="password"
                      value={githubSyncToken}
                      onChange={(e) => setGithubSyncToken(e.target.value)}
                      placeholder="Paste Classic Token with 'repo' scope (saved only in your browser)"
                      className={inputClasses}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <button
                      type="button"
                      onClick={() => {
                        setGithubSyncToken(githubSyncToken);
                        showToastMessage(
                          githubSyncToken
                            ? 'GitHub Sync Token saved on this device'
                            : 'GitHub Sync Token cleared'
                        );
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-[#E5B869]/50 text-xs font-medium text-white transition-colors cursor-pointer"
                    >
                      {githubSyncToken ? 'Update Token' : 'Save Token'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Brand & Content Settings Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[#111520]/90 border border-white/[0.08] space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div>
                  <h2 className="text-xl font-display font-semibold text-white">
                    Brand & Content Settings
                  </h2>
                  <p className="text-xs text-[#94A3B8]">
                    Edit your contact info, hero copy, and about introduction live.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs text-[#94A3B8] hover:text-white border border-white/10 hover:border-white/25 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Defaults</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={draftSettings.brandName}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, brandName: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Availability Badge
                  </label>
                  <input
                    type="text"
                    value={draftSettings.availabilityText}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, availabilityText: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={draftSettings.email}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, email: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    value={draftSettings.instagramHandle}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, instagramHandle: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Instagram Profile URL
                  </label>
                  <input
                    type="url"
                    value={draftSettings.instagramUrl}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, instagramUrl: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Instagram DM Link
                  </label>
                  <input
                    type="url"
                    value={draftSettings.instagramDmUrl}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, instagramDmUrl: e.target.value })
                    }
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Hero Headline (White Text)
                    </label>
                    <input
                      type="text"
                      value={draftSettings.heroHeadlinePrefix}
                      onChange={(e) =>
                        setDraftSettings({
                          ...draftSettings,
                          heroHeadlinePrefix: e.target.value,
                        })
                      }
                      className={inputClasses}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                      Hero Headline (Gold Accent)
                    </label>
                    <input
                      type="text"
                      value={draftSettings.heroHeadlineAccent}
                      onChange={(e) =>
                        setDraftSettings({
                          ...draftSettings,
                          heroHeadlineAccent: e.target.value,
                        })
                      }
                      className={inputClasses}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    Hero Supporting Text
                  </label>
                  <textarea
                    rows={2}
                    value={draftSettings.heroSubtext}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, heroSubtext: e.target.value })
                    }
                    className={`${inputClasses} resize-none`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#E2E8F0] mb-1.5">
                    About Introduction
                  </label>
                  <textarea
                    rows={3}
                    value={draftSettings.aboutDescription}
                    onChange={(e) =>
                      setDraftSettings({ ...draftSettings, aboutDescription: e.target.value })
                    }
                    className={`${inputClasses} resize-none`}
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                {settingsSaved ? (
                  <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Changes saved to live site!</span>
                  </span>
                ) : (
                  <span />
                )}
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-[#07090E] bg-gradient-to-r from-[#F3D18E] via-[#E5B869] to-[#C6903C] hover:brightness-110 cursor-pointer shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Settings</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
