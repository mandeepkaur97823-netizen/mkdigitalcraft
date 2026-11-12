import type { IncomingMessage, ServerResponse } from 'http';

const GITHUB_OWNER = process.env.GITHUB_OWNER || 'mandeepkaur97823-netizen';
const GITHUB_REPO = process.env.GITHUB_REPO || 'mkdigitalcraft';
const GITHUB_BRANCH = process.env.GITHUB_BRANCH || 'main';
const GITHUB_FILE_PATH = 'public/site-data.json';
const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || '12345678';

interface ReqWithBody extends IncomingMessage {
  body?: unknown;
}

interface SiteDataPayload {
  settings?: Record<string, unknown>;
  portfolio?: unknown[];
  enquiries?: unknown[];
  appendEnquiry?: Record<string, unknown>;
}

async function readJsonBody(req: ReqWithBody): Promise<SiteDataPayload> {
  if (req.body && typeof req.body === 'object') {
    return req.body as SiteDataPayload;
  }
  if (typeof req.body === 'string') {
    return JSON.parse(req.body) as SiteDataPayload;
  }

  const chunks: Buffer[] = [];
  let total = 0;
  const MAX_BYTES = 10 * 1024 * 1024;
  for await (const chunk of req) {
    const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
    total += buf.length;
    if (total > MAX_BYTES) {
      throw new Error('Payload too large');
    }
    chunks.push(buf);
  }
  const raw = Buffer.concat(chunks).toString('utf-8');
  return (raw ? JSON.parse(raw) : {}) as SiteDataPayload;
}

function sendJson(res: ServerResponse, statusCode: number, data: unknown) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(data));
}

async function fetchGithubSiteData(token?: string): Promise<{
  content: Record<string, unknown>;
  sha?: string;
}> {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=${GITHUB_BRANCH}&_t=${Date.now()}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'mk-digital-craft-vercel',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(apiUrl, { headers, cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`GitHub read failed with status ${response.status}`);
  }
  const fileJson = (await response.json()) as { content?: string; sha?: string };
  const decoded = fileJson.content
    ? Buffer.from(fileJson.content.replace(/\n/g, ''), 'base64').toString('utf-8')
    : '{}';
  return {
    content: JSON.parse(decoded || '{}') as Record<string, unknown>,
    sha: fileJson.sha,
  };
}

async function commitGithubSiteData(
  token: string,
  nextData: Record<string, unknown>,
  sha: string | undefined,
  commitMessage: string
) {
  const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`;
  const encoded = Buffer.from(JSON.stringify(nextData, null, 2) + '\n', 'utf-8').toString('base64');

  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      'User-Agent': 'mk-digital-craft-vercel',
    },
    body: JSON.stringify({
      message: commitMessage,
      content: encoded,
      branch: GITHUB_BRANCH,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`GitHub commit failed (${response.status}): ${errText}`);
  }
  return response.json();
}

export default async function handler(req: ReqWithBody, res: ServerResponse) {
  const serverToken = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;

  if (req.method === 'GET') {
    try {
      const { content } = await fetchGithubSiteData(serverToken);
      return sendJson(res, 200, { ...content, githubConfigured: Boolean(serverToken) });
    } catch {
      return sendJson(res, 200, { githubConfigured: Boolean(serverToken) });
    }
  }

  if (req.method === 'POST') {
    let payload: SiteDataPayload;
    try {
      payload = await readJsonBody(req);
    } catch {
      return sendJson(res, 400, { error: 'Invalid JSON payload.' });
    }

    const isAdminMutation =
      payload.settings !== undefined ||
      payload.portfolio !== undefined ||
      payload.enquiries !== undefined;

    if (isAdminMutation) {
      const providedPasscode = req.headers['x-admin-passcode'];
      if (providedPasscode !== ADMIN_PASSCODE) {
        return sendJson(res, 401, { error: 'Unauthorized admin update.' });
      }
    }

    if (!serverToken) {
      return sendJson(res, 503, {
        error: 'GITHUB_TOKEN is not configured on Vercel.',
        githubConfigured: false,
      });
    }

    try {
      const { content: existing, sha } = await fetchGithubSiteData(serverToken);
      const nextData: Record<string, unknown> = { ...existing };

      if (payload.settings !== undefined) nextData.settings = payload.settings;
      if (payload.portfolio !== undefined) nextData.portfolio = payload.portfolio;
      if (payload.enquiries !== undefined) nextData.enquiries = payload.enquiries;
      if (payload.appendEnquiry !== undefined) {
        const currentEnquiries = Array.isArray(nextData.enquiries) ? nextData.enquiries : [];
        nextData.enquiries = [payload.appendEnquiry, ...currentEnquiries];
      }

      const commitMsg = payload.appendEnquiry
        ? 'Save new visitor enquiry from live website'
        : 'Update live website settings and portfolio via Admin Portal';

      try {
        await commitGithubSiteData(serverToken, nextData, sha, commitMsg);
      } catch (firstErr) {
        // Retry once on SHA conflict (409)
        if (String(firstErr).includes('(409)')) {
          const latest = await fetchGithubSiteData(serverToken);
          const mergedRetry: Record<string, unknown> = { ...latest.content };
          if (payload.settings !== undefined) mergedRetry.settings = payload.settings;
          if (payload.portfolio !== undefined) mergedRetry.portfolio = payload.portfolio;
          if (payload.enquiries !== undefined) mergedRetry.enquiries = payload.enquiries;
          if (payload.appendEnquiry !== undefined) {
            const currentEnquiries = Array.isArray(mergedRetry.enquiries)
              ? mergedRetry.enquiries
              : [];
            mergedRetry.enquiries = [payload.appendEnquiry, ...currentEnquiries];
          }
          await commitGithubSiteData(serverToken, mergedRetry, latest.sha, commitMsg);
        } else {
          throw firstErr;
        }
      }

      return sendJson(res, 200, { ok: true, syncedToGithub: true, githubConfigured: true });
    } catch (err) {
      return sendJson(res, 500, {
        error: err instanceof Error ? err.message : 'Failed to save changes to GitHub.',
      });
    }
  }

  res.statusCode = 405;
  res.end('Method Not Allowed');
}
