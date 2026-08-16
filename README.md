# erickops.space

Blog pribadi erickops — tulisan tentang networking, coding, cybersecurity, kehidupan, dan hal-hal random lainnya.

---

## Cara Tambah Artikel Baru

Cukup 2 langkah, tanpa perlu install apapun.

### Langkah 1 — Buat file markdown

Buat file baru di folder `posts/` dengan nama sesuai slug artikel.

Contoh: `posts/belajar-wireshark.md`

Tulis artikelmu dalam format Markdown biasa:

```markdown
# Judul Artikel

Isi artikel di sini. Bisa pakai **bold**, *italic*, `code`, dll.

## Sub Heading

Paragraf lanjutan...

## Code Block

```bash
nmap -sV 192.168.1.1
```

```

### Langkah 2 — Daftarkan di `posts/index.json`

Buka file `posts/index.json` dan tambahkan entry baru di **paling atas array** (supaya muncul sebagai artikel terbaru):

```json
{
  "slug": "belajar-wireshark",
  "title": "Belajar Wireshark dari Nol",
  "excerpt": "Wireshark adalah tool packet analysis terbaik. Begini cara mulai menggunakannya.",
  "category": "network",
  "date": "2026-08-16",
  "readTime": "7 min read",
  "file": "belajar-wireshark.md",
  "tags": ["wireshark", "networking", "tools"]
}
```

**Field yang wajib diisi:**
| Field | Keterangan |
|-------|-----------|
| `slug` | URL-friendly name, huruf kecil, pakai `-` bukan spasi |
| `title` | Judul artikel |
| `excerpt` | Deskripsi singkat (1-2 kalimat) |
| `category` | Pilih: `network`, `security`, `coding`, `life`, `love`, `random` |
| `date` | Format `YYYY-MM-DD` |
| `readTime` | Estimasi waktu baca |
| `file` | Nama file `.md` di folder `posts/` |
| `tags` | Array kata kunci (opsional tapi berguna buat search) |

### Selesai!

Push ke GitHub, website otomatis update. Tidak perlu build process, tidak perlu deploy manual.

---

## Struktur Folder

```
/
├── index.html       ← Landing page
├── blog.html        ← Daftar semua artikel
├── post.html        ← Template render artikel
├── cats.html        ← Sistem absensi kucing
├── about.html       ← About page
├── style.css        ← Semua styling
├── script.js        ← Shared JS utilities
└── posts/
    ├── index.json   ← DAFTAR ARTIKEL (edit ini untuk tambah artikel)
    ├── artikel-1.md
    ├── artikel-2.md
    └── ...
```

---

## Deploy ke GitHub Pages

1. Buat repository baru di GitHub, nama: `<username>.github.io`
2. Push semua file ke branch `main`
3. Pergi ke Settings → Pages → Source: `main` branch, folder `/ (root)`
4. Website aktif di `https://<username>.github.io`

**Update artikel selanjutnya:**
```bash
git add posts/artikel-baru.md posts/index.json
git commit -m "Add: judul artikel baru"
git push
```

Atau langsung edit via GitHub web editor — tidak perlu buka terminal sama sekali.

---

## Kategori yang Tersedia

| Category | Label | Warna |
|----------|-------|-------|
| `network` | 📡 Network | Biru muda |
| `security` | 🔐 Security | Merah |
| `coding` | 💻 Coding | Hijau |
| `life` | 🌱 Kehidupan | Pink |
| `love` | 💙 Cinta | Rose |
| `random` | ✨ Random | Ungu |
