// Central API base resolver for the frontend.
//
// Priority:
//   1. VITE_API_URL (frontend/.env or build-time env var) — auto-prepends
//      https:// if the protocol is missing, and strips trailing slashes.
//   2. Development fallback: the Vite dev server (port 5173) talks to the
//      local backend on port 5000.
//   3. Production fallback: relative /api — only correct when the backend
//      serves the built frontend (same origin).

const rawUrl = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export const API_BASE = rawUrl
  ? `${rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`}/api`
  : window.location.port === '5173'
    ? 'http://localhost:5000/api'
    : '/api';
