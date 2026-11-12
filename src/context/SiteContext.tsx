import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  brand as defaultBrand,
  services as defaultServices,
  portfolioItems as defaultPortfolio,
  PortfolioItem,
  ServiceItem,
} from '../data/config';
import webDesignMockup from '../assets/images/web_design_mockup_1794468444528.jpg';
import videoEditingSuite from '../assets/images/video_editing_pro.jpg';
import graphicDesignPortfolio from '../assets/images/graphic_design_pro.jpg';

const GITHUB_OWNER = 'mandeepkaur97823-netizen';
const GITHUB_REPO = 'mkdigitalcraft';
const GITHUB_BRANCH = 'main';
const GITHUB_FILE_PATH = 'public/site-data.json';
const ADMIN_PASSCODE = '12345678';

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
export type SyncState = 'idle' | 'syncing' | 'synced' | 'local-only' | 'error';

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
  syncState: SyncState;
  syncMessage: string;
  githubServerConfigured: boolean;
  githubSyncToken: string;
  setGithubSyncToken: (token: string) => void;
  manualSyncToGithub: () => Promise<boolean>;
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
  githubToken: 'mk_dc_gh_sync_token_v1',
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

function encodeUtf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const slice = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }
  return btoa(binary);
}

function normalizePortfolioAssets(items: PortfolioItem[]): PortfolioItem[] {
  return items.map((item) => {
    const img = item.imageUrl || '';
    if (
      img === 'asset://web_design_mockup' ||
      img.includes('web_design_mockup_1794468444528')
    ) {
      return { ...item, imageUrl: webDesignMockup };
    }
    if (
      img === 'asset://video_editing_pro' ||
      img.includes('video_editing_pro') ||
      img.includes('video_editing_suite_1794468446182')
    ) {
      return { ...item, imageUrl: videoEditingSuite };
    }
    if (
      img === 'asset://graphic_design_pro' ||
      img.includes('graphic_design_pro') ||
      img.includes('graphic_design_portfolio_1794468446640')
    ) {
      return { ...item, imageUrl: graphicDesignPortfolio };
    }
    return item;
  });
}

function serializePortfolioAssets(items: PortfolioItem[]): PortfolioItem[] {
  return items.map((item) => {
    const img = item.imageUrl || '';
    if (img === webDesignMockup || img.includes('web_design_mockup_1794468444528')) {
      return { ...item, imageUrl: 'asset://web_design_mockup' };
    }
    if (img === videoEditingSuite || img.includes('video_editing_pro')) {
      return { ...item, imageUrl: 'asset://video_editing_pro' };
    }
    if (img === graphicDesignPortfolio || img.includes('graphic_design_pro')) {
      return { ...item, imageUrl: 'asset://graphic_design_pro' };
    }
    return item;
  });
}

async function commitSnapshotToGithubDirect(
  token: string,
  snapshot: {
    settings: SiteSettings;
    portfolio: PortfolioItem[];
    enquiries: EnquiryRecord[];
  },
  commitMessage: string
) {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
  const getRes = await fetch(`${apiUrl}?ref=${GITHUB_BRANCH}`, {
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });

  let sha: string | undefined;
  if (getRes.ok) {
    const existing = (await getRes.json()) as { sha?: string };
    sha = existing.sha;
  }

  const cleanSnapshot = {
    settings: snapshot.settings,
    portfolio: serializePortfolioAssets(snapshot.portfolio),
    enquiries: snapshot.enquiries,
  };

  const putRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: encodeUtf8ToBase64(JSON.stringify(cleanSnapshot, null, 2) + '\n'),
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!putRes.ok) {
    const errText = await putRes.text();
    throw new Error(`GitHub rejected save (${putRes.status}): ${errText}`);
  }
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

  const [githubSyncToken, setGithubSyncTokenState] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.githubToken) || '';
    } catch {
      return '';
    }
  });
  const [githubServerConfigured, setGithubServerConfigured] = useState<boolean>(false);
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [syncMessage, setSyncMessage] = useState<string>('Ready');

  const setGithubSyncToken = (token: string) => {
    const cleaned = token.trim();
    setGithubSyncTokenState(cleaned);
    try {
      if (cleaned) {
        localStorage.setItem(STORAGE_KEYS.githubToken, cleaned);
      } else {
        localStorage.removeItem(STORAGE_KEYS.githubToken);
      }
    } catch {
      // Ignore storage errors
    }
  };

  useEffect(() => {
    let active = true;
    const applyLoadedData = (data: Record<string, unknown>) => {
      if (!active || !data || typeof data !== 'object') return;
      if (data.githubConfigured === true) {
        setGithubServerConfigured(true);
        setSyncState('synced');
        setSyncMessage('Connected to GitHub via Vercel API');
      } else if (data.localServerSync === true) {
        setSyncState('synced');
        setSyncMessage('Saved to localhost public/site-data.json');
      }
      if (data.settings && typeof data.settings === 'object') {
        setSettings({ ...DEFAULT_SETTINGS, ...(data.settings as Partial<SiteSettings>) });
      }
      if (Array.isArray(data.portfolio)) {
        setPortfolio(normalizePortfolioAssets(data.portfolio as PortfolioItem[]));
      }
      if (Array.isArray(data.enquiries)) {
        setEnquiries(data.enquiries as EnquiryRecord[]);
      }
    };

    fetch('/api/site-data', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && (data.settings || data.portfolio || data.enquiries)) {
          applyLoadedData(data as Record<string, unknown>);
          return null;
        }
        return fetch('/site-data.json', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((staticData) => {
            if (staticData) applyLoadedData(staticData as Record<string, unknown>);
          });
      })
      .catch(() => {
        fetch('/site-data.json', { cache: 'no-store' })
          .then((r) => (r.ok ? r.json() : null))
          .then((staticData) => {
            if (staticData) applyLoadedData(staticData as Record<string, unknown>);
          })
          .catch(() => {
            // Fallback to localStorage defaults
          });
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

  const persistSnapshot = useCallback(
    async (
      nextSnapshot: {
        settings: SiteSettings;
        portfolio: PortfolioItem[];
        enquiries: EnquiryRecord[];
      },
      options?: { isPublicEnquiry?: EnquiryRecord; commitMessage?: string }
    ): Promise<boolean> => {
      setSyncState('syncing');
      setSyncMessage('Saving changes...');

      const serializedPortfolio = serializePortfolioAssets(nextSnapshot.portfolio);
      const apiBody = options?.isPublicEnquiry
        ? { appendEnquiry: options.isPublicEnquiry }
        : {
            settings: nextSnapshot.settings,
            portfolio: serializedPortfolio,
            enquiries: nextSnapshot.enquiries,
          };

      try {
        const res = await fetch('/api/site-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(options?.isPublicEnquiry ? {} : { 'x-admin-passcode': ADMIN_PASSCODE }),
          },
          body: JSON.stringify(apiBody),
        });

        const resJson = (await res.json().catch(() => ({}))) as {
          ok?: boolean;
          syncedToGithub?: boolean;
          localServerSync?: boolean;
          githubConfigured?: boolean;
          error?: string;
        };

        if (res.ok && resJson.syncedToGithub) {
          setGithubServerConfigured(true);
          setSyncState('synced');
          setSyncMessage('Saved & pushed to GitHub');
          return true;
        }

        if (res.ok && resJson.localServerSync) {
          setSyncState('synced');
          setSyncMessage('Saved to localhost public/site-data.json');
          // Also push directly to GitHub if admin provided a sync token locally
          if (githubSyncToken) {
            await commitSnapshotToGithubDirect(
              githubSyncToken,
              nextSnapshot,
              options?.commitMessage || 'Update MK Digital Craft data'
            );
            setSyncMessage('Saved locally & pushed to GitHub');
          }
          return true;
        }
      } catch {
        // Fall through to optional direct browser GitHub sync
      }

      if (githubSyncToken) {
        try {
          await commitSnapshotToGithubDirect(
            githubSyncToken,
            nextSnapshot,
            options?.commitMessage || 'Update MK Digital Craft live site data'
          );
          setSyncState('synced');
          setSyncMessage('Saved & pushed directly to GitHub');
          return true;
        } catch (err) {
          setSyncState('error');
          setSyncMessage(
            err instanceof Error ? err.message : 'GitHub sync failed — check token.'
          );
          return false;
        }
      }

      setSyncState('local-only');
      setSyncMessage('Saved in browser (add GITHUB_TOKEN to sync live to GitHub)');
      return false;
    },
    [githubSyncToken]
  );

  const manualSyncToGithub = async () => {
    return persistSnapshot(
      { settings, portfolio, enquiries },
      { commitMessage: 'Sync MK Digital Craft live site data to GitHub' }
    );
  };

  const updateSettings = (next: SiteSettings) => {
    setSettings(next);
    void persistSnapshot(
      { settings: next, portfolio, enquiries },
      { commitMessage: 'Update website settings via Admin Portal' }
    );
  };

  const addPortfolioItem = (item: Omit<PortfolioItem, 'id'>) => {
    const newItem: PortfolioItem = {
      ...item,
      id: `proj-${Date.now()}`,
    };
    const nextPortfolio = [newItem, ...portfolio];
    setPortfolio(nextPortfolio);
    void persistSnapshot(
      { settings, portfolio: nextPortfolio, enquiries },
      { commitMessage: `Add portfolio project: ${newItem.title}` }
    );
  };

  const updatePortfolioItem = (updated: PortfolioItem) => {
    const nextPortfolio = portfolio.map((item) => (item.id === updated.id ? updated : item));
    setPortfolio(nextPortfolio);
    void persistSnapshot(
      { settings, portfolio: nextPortfolio, enquiries },
      { commitMessage: `Update portfolio project: ${updated.title}` }
    );
  };

  const deletePortfolioItem = (id: string) => {
    const nextPortfolio = portfolio.filter((item) => item.id !== id);
    setPortfolio(nextPortfolio);
    void persistSnapshot(
      { settings, portfolio: nextPortfolio, enquiries },
      { commitMessage: 'Remove portfolio project via Admin Portal' }
    );
  };

  const addEnquiry = (entry: Omit<EnquiryRecord, 'id' | 'createdAt' | 'status'>) => {
    const record: EnquiryRecord = {
      ...entry,
      id: `enq-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'new',
    };
    const nextEnquiries = [record, ...enquiries];
    setEnquiries(nextEnquiries);
    void persistSnapshot(
      { settings, portfolio, enquiries: nextEnquiries },
      { isPublicEnquiry: record, commitMessage: 'Save new client enquiry' }
    );
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus) => {
    const nextEnquiries = enquiries.map((e) => (e.id === id ? { ...e, status } : e));
    setEnquiries(nextEnquiries);
    void persistSnapshot(
      { settings, portfolio, enquiries: nextEnquiries },
      { commitMessage: 'Update enquiry status via Admin Portal' }
    );
  };

  const deleteEnquiry = (id: string) => {
    const nextEnquiries = enquiries.filter((e) => e.id !== id);
    setEnquiries(nextEnquiries);
    void persistSnapshot(
      { settings, portfolio, enquiries: nextEnquiries },
      { commitMessage: 'Delete enquiry via Admin Portal' }
    );
  };

  const resetSiteDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    setPortfolio(defaultPortfolio);
    void persistSnapshot(
      { settings: DEFAULT_SETTINGS, portfolio: defaultPortfolio, enquiries },
      { commitMessage: 'Restore default website settings and portfolio' }
    );
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
