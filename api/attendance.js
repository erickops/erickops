// api/attendance.js
// GET  /api/attendance        — fetch all entries (public)
// POST /api/attendance        — save new entry (owner only)

import { Redis } from '@upstash/redis';

const redis = new Redis({
  url:   process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const REDIS_KEY     = 'cat_attendance';
const MAX_ENTRIES   = 500;
const CORS_HEADERS  = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).set(CORS_HEADERS).end();
  }

  // Add CORS to every response
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  /* ── GET — return all entries ── */
  if (req.method === 'GET') {
    try {
      const raw = await redis.get(REDIS_KEY);
      const entries = raw ? (Array.isArray(raw) ? raw : JSON.parse(raw)) : [];
      return res.status(200).json({ ok: true, entries });
    } catch (err) {
      console.error('GET /api/attendance error:', err);
      return res.status(500).json({ ok: false, error: 'Failed to fetch attendance' });
    }
  }

  /* ── POST — save new entry ── */
  if (req.method === 'POST') {
    const { password, entry } = req.body || {};

    // Validate password server-side
    if (!password || password !== process.env.OWNER_PASSWORD) {
      return res.status(401).json({ ok: false, error: 'Unauthorized' });
    }

    // Validate entry shape
    if (!entry || !entry.id || !entry.dateKey || !entry.cats) {
      return res.status(400).json({ ok: false, error: 'Invalid entry format' });
    }

    try {
      const raw = await redis.get(REDIS_KEY);
      let entries = raw ? (Array.isArray(raw) ? raw : JSON.parse(raw)) : [];

      // Append new entry
      entries.push(entry);

      // Keep max 500 entries (prune oldest)
      if (entries.length > MAX_ENTRIES) {
        entries = entries.slice(entries.length - MAX_ENTRIES);
      }

      await redis.set(REDIS_KEY, JSON.stringify(entries));

      return res.status(200).json({ ok: true, total: entries.length });
    } catch (err) {
      console.error('POST /api/attendance error:', err);
      return res.status(500).json({ ok: false, error: 'Failed to save attendance' });
    }
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
