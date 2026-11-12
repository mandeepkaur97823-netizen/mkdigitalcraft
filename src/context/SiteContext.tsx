import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  brand as defaultBrand,
  services as defaultServices,
  portfolioItems as defaultPortfolio,
  PortfolioItem,
  ServiceItem,
} from '../data/config';

export interface SiteSettings {
  brandName: string;
  tagline: string;
  slogan: string;
  email: string;
  instagramHandle: string;
  instagramUrl: string;
  instagramDmUrl: string;
  heroHeadlinePrefix: string;
  heroHeadlineAccent: string;
  heroSubtext: string;
  aboutHeadingPrefix: string;
  aboutHeadingAccent: string;
  aboutDescription: string;
  availabilityText: string;
  siteEnabled: boolean;
  maintenanceTitle: string;
  maintenanceMessage: string;
}

export type EnquiryStatus = 'new' | 'in-progress' | 'completed';

export interface EnquiryRecord {
  id: string;
  createdAt: string;
  name: string;
  businessName: string;
  whatsappNumber: string;
  email: string;
  service: string;
  timeline: string;
  budgetRange: string;
  referenceLink: string;
  projectDetails: string;
  channel: 'instagram' | 'email';
  status: EnquiryStatus;
}

interface SiteContextValue {
  settings: SiteSettings;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  enquiries: EnquiryRecord[];
  updateSettings: (next: SiteSettings) => void;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id'>) => void;
  updatePortfolioItem: (item: PortfolioItem) => void;
  deletePortfolioItem: (id: string) => void;
  addEnquiry: (entry: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status'>) => void;
  updateEnquiryStatus: (id: string, status: EnquiryStatus) => void;
  deleteEnquiry: (id: string) => void;
  resetSiteDefaults: () => void;
}

const DEFAULT_SETTINGS: SiteSettings = {
  brandName: defaultBrand.name,
  tagline: defaultBrand.tagline,
  slogan: defaultBrand.slogan,
  email: defaultBrand.email,
  instagramHandle: defaultBrand.instagramHandle,
  instagramUrl: defaultBrand.instagramUrl,
  instagramDmUrl: defaultBrand.instagramDmUrl,
  heroHeadlinePrefix: 'Creative Digital Solutions That',
  heroHeadlineAccent: 'Help Your Business Grow.',
  heroSubtext:
    'From modern websites to engaging videos and creative designs, we help brands build a strong digital presence.',
  aboutHeadingPrefix: 'Creativity & Modern',
  aboutHeadingAccent: 'Technology Combined.',
  aboutDescription:
    'MK Digital Craft is a creative digital service brand focused on website design, video editing, and graphic design. We combine creativity and modern technology to help businesses create a strong digital presence.',
  availabilityText: 'Open for New Projects',
  siteEnabled: true,
  maintenanceTitle: 'Studio Maintenance in Progress.',
  maintenanceMessage:
    'MK Digital Craft is temporarily offline while we refine our showcase. You can still reach us directly via Instagram DM or Email for new project enquiries.',
};

const STORAGE_KEYS = {
  settings: 'mk_dc_settings_v1',
  portfolio: 'mk_dc_portfolio_v1',
  enquiries: 'mk_dc_enquiries_v1',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function syncSectionToLocalServer(
  payload: Partial<{
    settings: SiteSettings;
    portfolio: PortfolioItem[];
    enquiries: EnquiryRecord[];
  }>
) {
  try {
    await fetch('/api/site-data', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch {
    // Local API unavailable in static production builds; localStorage remains active.
  }
}

function normalizePortfolioAssets(items: PortfolioItem[]): PortfolioItem[] {
  const defaultById = new Map(defaultPortfolio.map((item) => [item.id, item]));
  return items.map((item) => {
    const isLegacyPlaceholder =
      item.imageUrl.includes('video_editing_suite_1794468446182') ||
      item.imageUrl.includes('graphic_design_portfolio_1794468446640');
    if (isLegacyPlaceholder) {
      const updatedDefault = defaultById.get(item.id);
      if (updatedDefault) {
        return { ...item, imageUrl: updatedDefault.imageUrl };
      }
    }
    return item;
  });
}

const SiteContext = createContext<SiteContextValue | null>(null);

export const SiteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(() => ({
    ...DEFAULT_SETTINGS,
    ...loadFromStorage(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
  }));
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>(() =>
    normalizePortfolioAssets(loadFromStorage(STORAGE_KEYS.portfolio, defaultPortfolio))
  );
  const [enquiries, setEnquiries] = useState<EnquiryRecord[]>(() =>
    loadFromStorage(STORAGE_KEYS.enquiries, [])
  );

  useEffect(() => {
    let active = true;
    fetch('/api/site-data', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!active || !data || typeof data !== 'object') return;
        if (data.settings) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        if (Array.isArray(data.portfolio)) setPortfolio(normalizePortfolioAssets(data.portfolio));
        if (Array.isArray(data.enquiries)) setEnquiries(data.enquiries);
      })
      .catch(() => {
        // Ignore when running without localhost dev server middleware
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } catch {
      // Ignore storage quota errors
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.portfolio, JSON.stringify(portfolio));
    } catch {
      // Ignore storage quota errors
    }
  }, [portfolio]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.enquiries, JSON.stringify(enquiries));
    } catch {
      // Ignore storage quota errors
    }
  }, [enquiries]);

  const updateSettings = (next: SiteSettings) => {
    setSettings(next);
    void syncSectionToLocalServer({ settings: next });
  };

  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `proj-${Date.now()}`,
    };
    setPortfolio((prev) => {
      const next = [newItem, ...prev];
      void syncSectionToLocalServer({ portfolio: next });
      return next;
    });
  };

  const updatePortfolioItem = (updated: PortfolioItem) => {
    setPortfolio((prev) => {
      const next = prev.map((item) => (item.id === updated.id ? updated : item));
      void syncSectionToLocalServer({ portfolio: next });
      return next;
    });
  };

  const deletePortfolioItem = (id: string) => {
    setPortfolio((prev) => {
      const next = prev.filter((item) => item.id !== id);
      void syncSectionToLocalServer({ portfolio: next });
      return next;
    });
  };

  const addEnquiry = (entry: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status'>) => {
    const record: EnquiryRecord = {
      ...entry,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    setEnquiries((prev) => {
      const next = [record, ...prev];
      void syncSectionToLocalServer({ enquiries: next });
      return next;
    });
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    setEnquiries((prev) => {
      const next = prev.map((e) => (e.id === id ? { ...e, status } : e));
      void syncSectionToLocalServer({ enquiries: next });
      return next;
    });
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => {
      const next = prev.filter((e) => e.id !== id);
      void syncSectionToLocalServer({ enquiries: next });
      return next;
    });
  };

  const resetSiteDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setPortfolio(defaultPortfolio);
    void syncSectionToLocalServer({
      settings: DEFAULT_SETTINGS,
      portfolio: defaultPortfolio,
    });
    try {
      localStorage.removeItem(STORAGE_KEYS.settings);
      localStorage.removeItem(STORAGE_KEYS.portfolio);
    } catch {
      // Ignore
    }
  };

  return (
    <SiteContext.Provider
      value={{
        settings,
        services: defaultServices,
        portfolio,
        enquiries,
        updateSettings,
        addPortfolioItem,
        updatePortfolioItem,
        deletePortfolioItem,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        resetSiteDefaults,
      }}
    >
      {children}
    </SiteContext.Provider>
  );
};

export function useSiteData(): SiteContextValue {
  const ctx = useContext(SiteContext);
  if (!ctx) {
    throw new Error('useSiteData must be used inside SiteProvider');
  }
  return ctx;
}

