// api/delete.js
// POST /api/delete — delete article .md file + remove entry from index.json

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

  const { password, slug } = req.body || {};

  if (!password || password !== process.env.OWNER_PASSWORD) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }
  if (!slug) {
    return res.status(400).json({ ok: false, error: 'slug is required' });
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

  async function deleteFile(path, message, sha) {
    const r = await fetch(`${apiBase}/contents/${path}`, {
      method:  'DELETE',
      headers: ghHeaders,
      body:    JSON.stringify({ message, sha }),
    });
    if (!r.ok) {
      const err = await r.text();
      throw new Error(`GitHub DELETE ${path} failed: ${r.status} — ${err}`);
    }
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
    // 1. Get index.json to find the article
    const indexFile = await getFile('posts/index.json');
    if (!indexFile) {
      return res.status(404).json({ ok: false, error: 'posts/index.json not found' });
    }

    const indexData = JSON.parse(Buffer.from(indexFile.content, 'base64').toString('utf-8'));
    const entryIdx  = indexData.findIndex(e => e.slug === slug);

    if (entryIdx === -1) {
      return res.status(404).json({ ok: false, error: `Article "${slug}" not found` });
    }

    const entry    = indexData[entryIdx];
    const filename = entry.file;
    const title    = entry.title;

    // 2. Delete the .md file
    const mdFile = await getFile(`posts/${filename}`);
    if (mdFile) {
      await deleteFile(
        `posts/${filename}`,
        `Delete post: ${title}`,
        mdFile.sha
      );
    }

    // 3. Remove entry from index.json
    indexData.splice(entryIdx, 1);
    const indexB64 = Buffer.from(JSON.stringify(indexData, null, 2), 'utf-8').toString('base64');
    await putFile(
      'posts/index.json',
      `Update index: remove ${slug}`,
      indexB64,
      indexFile.sha
    );

    return res.status(200).json({
      ok:      true,
      slug,
      file:    filename,
      message: `"${title}" deleted. Vercel will redeploy in ~30 seconds.`,
    });

  } catch (err) {
    console.error('POST /api/delete error:', err);
    return res.status(500).json({ ok: false, error: err.message });
  }
}
