// api/edit.js
// POST /api/edit — update existing article content + optionally update index.json metadata

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

  const { password, slug, title, category, tags, content, date, readTime } = req.body || {};

  if (!password || password !== process.env.OWNER_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  if (!slug || !content) {
    return res.status(400).json({ ok: false, error: 'slug and content are required' });
  }

  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const GITHUB_REPO  = process.env.GITHUB_REPO;

  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    return res.status(500).json({ ok: false, error: 'GitHub credentials not configured' });
  }

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
    // Get current index.json to find the file name for this slug
    const indexFile = await getFile('posts/index.json');
    if (!indexFile) {
      return res.status(404).json({ ok: false, error: 'posts/index.json not found' });
    }

    const indexData = JSON.parse(Buffer.from(indexFile.content, 'base64').toString('utf-8'));
    const entryIdx  = indexData.findIndex(e => e.slug === slug);

    if (entryIdx === -1) {
      return res.status(404).json({ ok: false, error: `Article with slug "${slug}" not found` });
    }

    const entry    = indexData[entryIdx];
    const filename = entry.file;

    // 1. Update the .md file
    const mdFile = await getFile(`posts/${filename}`);
    const mdB64  = Buffer.from(content, 'utf-8').toString('base64');

    await putFile(
      `posts/${filename}`,
      `Edit post: ${title || entry.title}`,
      mdB64,
      mdFile?.sha
    );

    // 2. Update index.json metadata if any fields changed
    let indexChanged = false;

    if (title    && title    !== entry.title)    { entry.title    = title;    indexChanged = true; }
    if (category && category !== entry.category) { entry.category = category; indexChanged = true; }
    if (date     && date     !== entry.date)     { entry.date     = date;     indexChanged = true; }
    if (readTime && readTime !== entry.readTime) { entry.readTime = readTime; indexChanged = true; }
    if (tags !== undefined) {
      const newTags = tags.split(',').map(t => t.trim()).filter(Boolean);
      if (JSON.stringify(newTags) !== JSON.stringify(entry.tags)) {
        entry.tags = newTags;
        indexChanged = true;
      }
    }

    if (indexChanged) {
      indexData[entryIdx] = entry;
      const indexB64 = Buffer.from(JSON.stringify(indexData, null, 2), 'utf-8').toString('base64');
      await putFile(
        'posts/index.json',
        `Update index: edit ${slug}`,
        indexB64,
        indexFile.sha
      );
    }

    return res.status(200).json({
      ok:      true,
      slug,
      file:    filename,
      message: 'Article updated. Vercel will redeploy in ~30 seconds.',
    });

  } catch (err) {
    console.error('POST /api/edit error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
