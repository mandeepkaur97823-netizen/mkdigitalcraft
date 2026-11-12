import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import type { IncomingMessage, ServerResponse } from 'http';
import { defineConfig, type Plugin } from 'vite';

const LOCAL_DB_PATH = path.resolve(__dirname, 'public', 'site-data.json');

function attachAdminApiMiddleware(middlewares: {
  use: (
    route: string,
    handler: (req: IncomingMessage, res: ServerResponse, next: () => void) => void
  ) => void;
}) {
  middlewares.use('/api/site-data', (req, res, next) => {
    if (req.method === 'GET') {
      try {
        const raw = fs.existsSync(LOCAL_DB_PATH)
          ? fs.readFileSync(LOCAL_DB_PATH, 'utf-8')
          : '{}';
        const parsed = JSON.parse(raw || '{}') as Record<string, unknown>;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.end(JSON.stringify({ ...parsed, localServerSync: true }));
      } catch {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Failed to read local admin data.' }));
      }
      return;
    }

    if (req.method === 'POST') {
      const chunks: Buffer[] = [];
      let totalBytes = 0;
      const MAX_BYTES = 10 * 1024 * 1024; // 10MB for optional local image uploads

      req.on('data', (chunk: Buffer) => {
        totalBytes += chunk.length;
        if (totalBytes <= MAX_BYTES) {
          chunks.push(chunk);
        }
      });

      req.on('end', () => {
        if (totalBytes > MAX_BYTES) {
          res.statusCode = 413;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Payload too large.' }));
          return;
        }
        try {
          const bodyStr = Buffer.concat(chunks).toString('utf-8');
          const parsed = JSON.parse(bodyStr) as Record<string, unknown>;
          const existing = fs.existsSync(LOCAL_DB_PATH)
            ? (JSON.parse(fs.readFileSync(LOCAL_DB_PATH, 'utf-8') || '{}') as Record<
                string,
                unknown
              >)
            : {};
          const merged: Record<string, unknown> = { ...existing };
          if (parsed.settings !== undefined) merged.settings = parsed.settings;
          if (parsed.portfolio !== undefined) merged.portfolio = parsed.portfolio;
          if (parsed.enquiries !== undefined) merged.enquiries = parsed.enquiries;
          if (parsed.appendEnquiry !== undefined) {
            const current = Array.isArray(merged.enquiries) ? merged.enquiries : [];
            merged.enquiries = [parsed.appendEnquiry, ...current];
          }
          fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(merged, null, 2) + '\n', 'utf-8');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: true, localServerSync: true }));
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
        }
      });
      return;
    }

    next();
  });
}

function localAdminApiPlugin(): Plugin {
  return {
    name: 'mk-local-admin-api',
    configureServer(server) {
      attachAdminApiMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachAdminApiMiddleware(server.middlewares);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), localAdminApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch:
        process.env.DISABLE_HMR === 'true'
          ? null
          : {
              ignored: ['**/.local-admin-db.json', '**/public/site-data.json'],
            },
    },
  };
});
