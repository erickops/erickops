// api/publish.js
// POST /api/publish — publish new article via GitHub API

const CORS_HEADERS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    return res.status(200).set(CORS_HEADERS).end();
  }

  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const { password, title, category, tags, content, date, readTime } = req.body || {};

  /* ── Auth ── */
  if (!password || password !== process.env.OWNER_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  /* ── Validate required fields ── */
  if (!title || !category || !content) {
    return res.status(400).json({ ok: false, error: 'title, category, and content are required' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO  = process.env.GITHUB_REPO; // erickops/erickops

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ ok: false, error: 'GitHub credentials not configured' });
  }

  /* ── Generate slug ── */
  const slug = title
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')   // strip accents
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);

  const filename  = `${slug}.md`;
  const postDate  = date || new Date().toISOString().split('T')[0];
  const tagsArray = tags
    ? tags.split(',').map(t => t.trim()).filter(Boolean)
    : [];

  /* ── Auto read time ── */
  const wordCount    = content.trim().split(/\s+/).length;
  const calcReadTime = readTime || `${Math.max(1, Math.round(wordCount / 200))} min read`;

  /* ── GitHub API helpers ── */
  const ghHeaders = {
    'Authorization': `token ${GITHUB_TOKEN}`,
    'Content-Type':  'application/json',
    'User-Agent':    'erickops-blog',
  };
  const apiBase = `https://api.github.com/repos/${GITHUB_REPO}`;

  async function getFile(path) {
    const r = await fetch(`${apiBase}/contents/${path}`, { headers: ghHeaders });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`GitHub GET ${path} failed: ${r.status}`);
    return r.json();
  }

  async function putFile(path, message, contentB64, sha) {
    const body = { message, content: contentB64 };
    if (sha) body.sha = sha;
    const r = await fetch(`${apiBase}/contents/${path}`, {
      method:  'PUT',
      headers: ghHeaders,
      body:    JSON.stringify(body),
    });
    if (!r.ok) {
      const err = await r.text();
      throw new Error(`GitHub PUT ${path} failed: ${r.status} — ${err}`);
    }
    return r.json();
  }

  try {
    /* ── 1. Commit the .md file ── */
    const mdContent   = content;
    const mdB64       = Buffer.from(mdContent, 'utf-8').toString('base64');
    const existingMd  = await getFile(`posts/${filename}`);

    await putFile(
      `posts/${filename}`,
      `Add post: ${title}`,
      mdB64,
      existingMd?.sha || undefined
    );

    /* ── 2. Update posts/index.json ── */
    const indexFile = await getFile('posts/index.json');
    let   indexData = [];

    if (indexFile) {
      const decoded = Buffer.from(indexFile.content, 'base64').toString('utf-8');
      indexData = JSON.parse(decoded);
    }

    // Build new entry
    const newEntry = {
      slug,
      title,
      excerpt: content
        .replace(/^#.*$/m, '')           // strip first heading
        .replace(/[#*`>\-_\[\]()!]/g, '') // strip markdown chars
        .trim()
        .split('\n')
        .filter(l => l.trim().length > 20)
        [0]
        ?.trim()
        ?.substring(0, 160) || title,
      category,
      date:     postDate,
      readTime: calcReadTime,
      file:     filename,
      tags:     tagsArray,
    };

    // Add to top of array
    indexData.unshift(newEntry);

    const indexB64 = Buffer.from(JSON.stringify(indexData, null, 2), 'utf-8').toString('base64');
    await putFile(
      'posts/index.json',
      `Update index: add ${slug}`,
      indexB64,
      indexFile?.sha || undefined
    );

    return res.status(200).json({
      ok:   true,
      slug,
      file: filename,
      message: 'Article published! Vercel will redeploy in ~30 seconds.',
    });

  } catch (err) {
    console.error('POST /api/publish error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
