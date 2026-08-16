/* ============================================================
   ERICKOPS.SPACE — Main Script
   ============================================================ */

/* ── POSTS METADATA FALLBACK ──────────────────────────────────
   Dipakai saat fetch() gagal (buka via file:// lokal).
   Di GitHub Pages, data tetap diambil dari posts/index.json.
   ─────────────────────────────────────────────────────────── */
const POSTS_FALLBACK = [
  {
    slug: "subnetting-untuk-pemula",
    title: "Subnetting untuk Pemula: Dari Bingung Sampai Paham",
    excerpt: "Subnetting itu salah satu topik yang bikin pusing hampir semua orang yang baru belajar jaringan. Tapi sebenarnya kalau udah ngerti konsep dasarnya, it clicks. Kita bahas dari awal.",
    category: "network", date: "2026-08-10", readTime: "8 min read",
    file: "subnetting-untuk-pemula.md", tags: ["networking","subnetting","ipv4","writeup"]
  },
  {
    slug: "nmap-cheatsheet",
    title: "Nmap Cheatsheet: Command yang Sering Aku Pakai",
    excerpt: "Nmap adalah teman terbaik siapapun yang ngulik jaringan atau security. Ini kumpulan command yang paling sering aku pakai sehari-hari, dari basic scan sampai yang lebih advance.",
    category: "security", date: "2026-08-05", readTime: "6 min read",
    file: "nmap-cheatsheet.md", tags: ["nmap","security","networking","tools"]
  },
  {
    slug: "kenapa-aku-suka-linux",
    title: "Kenapa Aku Suka Linux (dan Susah Move On ke Windows)",
    excerpt: "Ada yang nanya kenapa aku lebih sering pakai Linux. Jawabannya panjang. Tapi singkatnya: karena Linux itu jujur. Dia tidak pura-pura simple padahal di dalamnya ribet.",
    category: "coding", date: "2026-07-28", readTime: "5 min read",
    file: "kenapa-aku-suka-linux.md", tags: ["linux","opinion","coding"]
  },
  {
    slug: "kucing-mengajarkan-sabar",
    title: "20 Kucing Mengajarkanku Arti Sabar",
    excerpt: "Dulu aku pikir sabar itu bisa dipelajari dari buku. Ternyata guru terbaik sabar ada di rumah, berbulu, dan terkadang suka muntah di atas keyboard.",
    category: "life", date: "2026-07-20", readTime: "4 min read",
    file: "kucing-mengajarkan-sabar.md", tags: ["cats","life","random"]
  },
  {
    slug: "tentang-cinta-yang-diam",
    title: "Tentang Cinta yang Diam",
    excerpt: "Ada cinta yang tidak perlu diucapkan. Tidak perlu diumumkan. Cukup ada, diam, dan terus dijaga dalam sunyi. Ini tentang cinta yang aku simpan sendiri.",
    category: "love", date: "2026-07-15", readTime: "3 min read",
    file: "tentang-cinta-yang-diam.md", tags: ["love","life","curhat"]
  },
  {
    slug: "bash-scripting-dasar",
    title: "Bash Scripting Dasar: Automasi Hal-Hal Kecil yang Bikin Hidup Lebih Mudah",
    excerpt: "Banyak hal yang bisa diotomasi dengan bash script sederhana. Mulai dari backup file, rename batch, sampai notifikasi. Berikut fondasi yang perlu kamu tahu.",
    category: "coding", date: "2026-07-08", readTime: "7 min read",
    file: "bash-scripting-dasar.md", tags: ["bash","scripting","linux","automation"]
  }
];

/* ── ARTICLE CONTENT FALLBACK ─────────────────────────────────
   Konten markdown di-embed di sini agar artikel tetap bisa
   dibaca saat dibuka via file:// (tanpa web server).
   Saat di GitHub Pages, konten diambil dari file .md langsung.
   ─────────────────────────────────────────────────────────── */
const CONTENT_FALLBACK = {

"subnetting-untuk-pemula.md": `# Subnetting untuk Pemula: Dari Bingung Sampai Paham

Subnetting adalah salah satu topik yang hampir selalu bikin pusing orang yang baru belajar jaringan. Kelihatannya ribet, penuh angka, dan susah dibayangin. Tapi sebenarnya kalau sudah ngerti konsep dasarnya — semuanya jatuh ke tempatnya masing-masing.

Ini catatan dari cara aku belajar subnetting sendiri. Bukan cara tercepat, tapi cara yang paling masuk ke kepala.

---

## Apa Itu Subnetting?

Subnetting adalah proses membagi satu jaringan besar menjadi beberapa jaringan kecil (subnet). Tujuannya:

- **Efisiensi penggunaan IP** — biar tidak buang-buang address
- **Keamanan** — memisahkan segmen jaringan
- **Manajemen** — lebih mudah dikelola

---

## Dulu Pahami Dulu: Struktur IP Address

IP address (IPv4) adalah angka 32-bit yang ditulis dalam 4 oktet:

\`\`\`
192.168.1.100
 |   |  | |
 8   8  8 8 bit
\`\`\`

Tiap oktet bisa bernilai 0–255. Jadi total kombinasi ada **2^32 = ~4.3 miliar** address.

### Binary itu kunci

Sebelum subnetting, harus nyaman dulu konversi desimal ke biner:

| Desimal | Biner    |
|---------|----------|
| 192     | 11000000 |
| 168     | 10101000 |
| 1       | 00000001 |
| 100     | 01100100 |

---

## Subnet Mask

Subnet mask menentukan bagian mana dari IP yang adalah **network** dan mana yang **host**.

| CIDR | Subnet Mask     | Jumlah Host |
|------|-----------------|-------------|
| /8   | 255.0.0.0       | 16,777,214  |
| /16  | 255.255.0.0     | 65,534      |
| /24  | 255.255.255.0   | 254         |
| /30  | 255.255.255.252 | 2           |

### CIDR Notation

\`/24\` artinya 24 bit pertama adalah bagian network. Sisanya (8 bit) untuk host.

\`\`\`
192.168.1.0/24
             ^
             8 bit untuk host = 2^8 - 2 = 254 usable hosts
\`\`\`

---

## Cara Hitung Subnet

**Contoh soal:** Kamu punya network \`192.168.10.0/24\`. Bagi jadi 4 subnet yang sama besar.

**Langkah 1:** Butuh 4 subnet → perlu **2 bit tambahan** (2² = 4) → New prefix: \`/26\`

**Langkah 2:** \`/26\` = 64 address per subnet (2^6)

| Subnet | Network Address   | Broadcast         | Usable Range           |
|--------|-------------------|-------------------|------------------------|
| 1      | 192.168.10.0/26   | 192.168.10.63     | .1 – .62 (62 hosts)    |
| 2      | 192.168.10.64/26  | 192.168.10.127    | .65 – .126 (62 hosts)  |
| 3      | 192.168.10.128/26 | 192.168.10.191    | .129 – .190 (62 hosts) |
| 4      | 192.168.10.192/26 | 192.168.10.255    | .193 – .254 (62 hosts) |

---

## Rumus Cepat

\`\`\`
Jumlah subnet  = 2^n      (n = bit yang dipinjam)
Jumlah host    = 2^h - 2  (h = bit yang tersisa)
Block size     = 256 - nilai oktet subnet mask
\`\`\`

---

## Tips Belajar

> "Latihan 10 soal sehari selama seminggu lebih efektif dari baca teori sehari penuh."

1. Hafal nilai bit per posisi: \`128, 64, 32, 16, 8, 4, 2, 1\`
2. Latihan konversi desimal-biner sampai otomatis
3. Kerjakan soal dari yang mudah (\`/24\`, \`/25\`) lalu naik ke \`/27\`, \`/28\`, \`/30\`

\`\`\`bash
sudo apt install ipcalc
ipcalc 192.168.10.0/26
\`\`\`

---

## Penutup

Subnetting bukan sihir. Ini matematika sederhana yang perlu waktu untuk jadi otomatis. Kalau kamu merasa bingung sekarang, itu normal.

Yang penting: jangan stop. Ulangi, latihan, dan suatu hari akan ada momen di mana semuanya tiba-tiba jelas.`,

"nmap-cheatsheet.md": `# Nmap Cheatsheet: Command yang Sering Aku Pakai

Nmap (Network Mapper) adalah tool reconnaissance yang hampir selalu jadi langkah pertama waktu aku perlu tahu apa yang ada di suatu jaringan. Ini catatan perintah yang paling sering aku butuhkan.

---

## Basic Scan

\`\`\`bash
# Scan satu host
nmap 192.168.1.1

# Scan subnet
nmap 192.168.1.0/24

# Scan dari file
nmap -iL targets.txt

# Ping scan (host discovery saja)
nmap -sn 192.168.1.0/24
\`\`\`

---

## Port Scan

\`\`\`bash
# Scan port spesifik
nmap -p 80,443,22 192.168.1.1

# Scan semua 65535 port
nmap -p- 192.168.1.1

# Scan top 100 port paling umum
nmap --top-ports 100 192.168.1.1
\`\`\`

---

## Scan Types

\`\`\`bash
# TCP SYN scan (default, butuh root/sudo)
nmap -sS 192.168.1.1

# TCP Connect scan (tidak butuh root)
nmap -sT 192.168.1.1

# UDP scan
nmap -sU 192.168.1.1
\`\`\`

---

## Service & Version Detection

\`\`\`bash
# Deteksi versi service
nmap -sV 192.168.1.1

# Deteksi OS
nmap -O 192.168.1.1

# Aggressive scan (sV + O + sC + traceroute)
nmap -A 192.168.1.1
\`\`\`

---

## Scripts (NSE)

\`\`\`bash
# Default scripts
nmap -sC 192.168.1.1

# Script spesifik
nmap --script=http-title 192.168.1.1

# Vuln scan
nmap --script=vuln 192.168.1.1

# SMB vulnerability check
nmap --script=smb-vuln* -p 445 192.168.1.1
\`\`\`

---

## Output

\`\`\`bash
nmap -oN output.txt 192.168.1.1    # teks
nmap -oX output.xml 192.168.1.1    # XML
nmap -oA output 192.168.1.1        # semua format
\`\`\`

---

## Kombinasi yang Sering Aku Pakai

\`\`\`bash
# Initial recon cepat
nmap -sn 192.168.1.0/24

# Full scan target spesifik
nmap -sV -sC -p- -T4 -oA full_scan 192.168.1.100

# CTF / HackTheBox
nmap -sV -sC -oN nmap_initial.txt 10.10.10.X
\`\`\`

---

## Catatan Penting

> **Gunakan Nmap hanya pada jaringan yang kamu miliki atau sudah mendapat izin eksplisit.** Scanning tanpa izin adalah ilegal di banyak yurisdiksi.`,

"kenapa-aku-suka-linux.md": `# Kenapa Aku Suka Linux (dan Susah Move On ke Windows)

Ini bukan artikel "Linux vs Windows yang mana lebih baik". Ini cuma tulisan tentang kenapa aku sendiri lebih nyaman di Linux dan apa yang bikin aku balik terus ke sana.

---

## Awalnya Karena Terpaksa

Jujur, pertama kali kenal Linux bukan karena pilihan. Waktu itu lagi belajar networking dan semua tutorial mengasumsikan kamu pakai terminal Linux. Windows CMD terasa seperti berbicara dengan tembok.

Jadi aku install Ubuntu di VirtualBox. Terus dual boot. Terus suatu hari boot ke Windows cuma buat gaming, selain itu semua di Linux.

Sekarang Windows-nya sudah lama tidak dibuka.

---

## Yang Paling Aku Suka

### 1. Terminal yang Jujur

Di Linux, terminal itu warga kelas satu. Hampir semua hal bisa dilakukan dari command line, dan hasilnya bisa diprediksi.

\`\`\`bash
# Mau tahu process apa yang makan RAM?
ps aux --sort=-%mem | head -10

# Cari file yang dimodifikasi 7 hari terakhir
find / -mtime -7 -type f 2>/dev/null

# Monitor network real-time
watch -n 1 'ss -tuln'
\`\`\`

### 2. Package Manager

\`\`\`bash
# Install Nmap, Wireshark, Python sekaligus
sudo apt install nmap wireshark python3

# Update semua software dalam satu perintah
sudo apt update && sudo apt upgrade
\`\`\`

Di Windows: download installer, next-next-next, kadang ada bloatware. Beda dunia.

### 3. Resource yang Ringan

Laptop lamaku yang sudah ngos-ngosan di Windows 10 jalan mulus pakai Xubuntu. Memory usage idle bisa di bawah 500MB. Beda dengan Windows yang idle pun sudah 2-3GB duluan.

### 4. Transparan

Di Linux, kamu bisa tahu dengan pasti apa yang sistem kamu lakukan. File konfigurasi ada di \`/etc/\`, log ada di \`/var/log/\`, process ada di \`/proc/\`.

---

## Yang Tidak Aku Suka dari Linux (Jujur)

- **Driver hardware** — masih sering jadi masalah
- **Gaming** — sudah jauh lebih baik dengan Proton, tapi belum sempurna
- **Software khusus** — beberapa tools profesional tidak ada versi Linux-nya
- **Learning curve** — untuk orang yang belum terbiasa, curve-nya curam

---

## Distro yang Aku Pakai

Saat ini: **Kali Linux** untuk kebutuhan security dan **Ubuntu** untuk daily use.

Kalau baru mulai, aku sarankan:

1. **Ubuntu** — paling banyak dokumentasi, paling ramah pemula
2. **Linux Mint** — lebih familiar buat yang dari Windows
3. **Kali Linux** — kalau memang fokus ke security/networking

---

## Kesimpulan

Linux itu bukan untuk semua orang. Tapi kalau kamu seseorang yang suka tahu cara kerja sesuatu dari dalam, yang lebih suka command daripada klik — coba deh.

Mungkin akan butuh waktu. Tapi ada juga momen di mana semuanya klik, dan kamu tidak akan mau balik.`,

"kucing-mengajarkan-sabar.md": `# 20 Kucing Mengajarkanku Arti Sabar

Dulu aku pikir sabar itu bisa dipelajari dari buku. Dari kata-kata bijak yang di-screenshot lalu dijadikan wallpaper. Dari meditasi lima menit sebelum tidur.

Ternyata guru terbaik sabar ada di rumah. Berbulu. Dan terkadang suka muntah di atas keyboard.

---

## Awal Mulanya

Tidak ada yang namanya "rencana punya 20 kucing". Itu tidak pernah ada dalam roadmap hidup aku.

Awalnya ada satu — Sipit. Namanya dari matanya yang sipit. Dia datang sendiri, kurus, di depan pintu, hujan-hujanan. Siapa yang bisa menolak?

Lalu ada Cakep. Lalu Koala yang lucu seperti beruang. Lalu yang lain datang dengan caranya masing-masing — ada yang memang sengaja aku ambil, ada yang datang sendiri dan memutuskan rumah ini cocok untuk mereka.

Sekarang ada 20.

---

## Hal-Hal yang Mereka Ajarkan

### Sabar dengan Proses

Luna tidak langsung mau dipegang. Butuh tiga bulan sebelum dia mau duduk di pangkuanku. Tiga bulan pendekatan perlahan, tidak memaksa, menghormati jaraknya.

Di dunia manusia, kita sering mau semuanya sekarang. Luna mengajarkan bahwa kepercayaan itu dibangun, bukan diminta.

### Sabar dengan Kekacauan

Oyen pernah menumpahkan segelas kopi di atas laptop. Saat itu aku sedang deadline. Dia tidak minta maaf — karena dia kucing.

Pilihan aku di momen itu: marah pada makhluk yang tidak mengerti kenapa aku marah, atau bernapas, lap laptopnya, dan move on.

Aku pilih yang kedua. Dan sejak saat itu, banyak situasi dalam hidup yang terasa lebih mudah dihadapi.

### Sabar dengan Kekhasan Masing-Masing

Kribo tidak bisa tidur tanpa bunyi kipas angin. Ndut tidak mau makan kalau mangkoknya bukan yang biru. Loki suka menggigit kaki orang yang baru masuk rumah — bukan untuk menyakiti, hanya cara dia menyapa.

Dua puluh kucing, dua puluh kebiasaan berbeda, dua puluh cara unik untuk menunjukkan kasih sayang.

---

## Absensi Harian

Ini mungkin terdengar lebay, tapi aku benar-benar absen mereka setiap hari.

Karena dengan dua puluh kucing, mudah sekali tidak menyadari kalau ada yang tidak muncul hari ini. Mungkin sedang sakit. Mungkin perlu perhatian lebih.

Absensi itu caraku bilang: aku lihat kamu. Kamu ada. Kamu penting.

---

## Penutup

Orang mungkin pikir punya 20 kucing itu gila. Dan mungkin iya, sedikit.

Tapi di antara chaos itu — bulu di mana-mana, bunyi makan bersamaan — ada ketenangan yang sulit aku jelaskan.

Mereka tidak peduli aku gagal hari ini. Mereka hanya ada, dan kehadirannya saja sudah cukup untuk mengingatkan aku bahwa tidak semua hal perlu diselesaikan sekarang.

Sabar, kata mereka dengan cara mereka sendiri. Sabar.`,

"tentang-cinta-yang-diam.md": `# Tentang Cinta yang Diam

Ada cinta yang tidak perlu diucapkan.

Tidak perlu diumumkan. Tidak perlu dibuktikan dengan kata-kata panjang atau gesture dramatis. Cukup ada — diam, tetap, seperti bintang di malam yang tidak selalu bisa kamu lihat tapi kamu tahu dia di sana.

Ini tentang cinta semacam itu.

---

## Yang Tidak Terkatakan

Aku tidak pandai mengungkapkan perasaan secara langsung. Kata-kataku selalu terasa kurang tepat di momen yang paling penting. Yang ingin aku sampaikan besar, tapi yang keluar kecil — atau malah tidak keluar sama sekali.

Jadi aku simpan.

Bukan karena takut ditolak — walaupun itu juga ada. Lebih karena ada hal-hal yang rasanya terlalu berharga untuk dibuka sembarangan. Seperti buku catatan yang kamu jaga rapi, tidak semua orang perlu baca isinya.

---

## Cinta yang Tidak Butuh Balasan

Yang paling aneh dari cinta diam adalah ini: dia tidak selalu butuh balasan untuk tetap ada.

Kamu bisa mencintai seseorang dari jauh — melihat mereka bahagia dan ikut bahagia tanpa mereka tahu kamu ada di sudut yang mengamati. Kamu bisa mendoakan seseorang setiap malam tanpa pernah bilang namanya ke mereka.

Itu bukan kelemahan. Itu justru bentuk cinta yang paling murni menurut aku — yang tidak butuh apa-apa untuk bertahan, yang tidak meminta, yang hanya memberi tanpa tagihan.

---

## Tapi Ada Harganya

Cinta diam itu juga berat.

Karena kamu menanggungnya sendiri. Tidak ada yang tahu, jadi tidak ada yang bisa membantumu ketika beratnya mulai terasa.

Dan ada momen-momen tertentu — ketika dia pergi, ketika dia bahagia dengan orang lain — di mana sunyi itu terasa lebih bising dari kata-kata manapun.

---

## Mengapa Aku Tetap Memilihnya

Kadang ada situasi di mana mengungkapkan cinta justru akan merusak sesuatu yang lebih berharga. Persahabatan. Kepercayaan. Dinamika yang sudah terbentuk dan berjalan dengan baik.

Dan kadang — ini yang paling susah diakui — kamu belum siap. Untuk hadir sepenuhnya, untuk bertanggung jawab atas perasaan orang lain.

Jadi kamu tunggu. Atau kamu diam untuk selamanya. Dan kedua-duanya sama-sama valid.

---

## Satu Hal yang Aku Pelajari

Cinta tidak selalu harus berakhir dengan dua orang bersama.

Kadang dia berakhir dengan kamu menjadi lebih baik. Dengan kamu belajar bahwa kamu mampu mencintai dengan tulus, bahkan ketika tidak ada yang minta.

Dan itu, menurut aku, bukan hal yang kecil.

---

*Untuk siapapun yang sedang membawa cinta diam di dadanya — kamu tidak sendiri.*`,

"bash-scripting-dasar.md": `# Bash Scripting Dasar: Automasi Hal-Hal Kecil yang Bikin Hidup Lebih Mudah

Salah satu hal yang paling mengubah cara aku bekerja di Linux adalah mulai menulis bash script. Bukan yang kompleks — cukup script-script kecil yang otomasi tugas berulang.

---

## Kenapa Bash?

- Sudah tersedia di hampir semua sistem Linux/Unix
- Tidak perlu install apapun
- Cepat untuk tugas-tugas system administration

---

## Struktur Dasar Script

\`\`\`bash
#!/bin/bash
echo "Hello, World!"
\`\`\`

\`\`\`bash
chmod +x hello.sh
./hello.sh
\`\`\`

---

## Variabel

\`\`\`bash
#!/bin/bash
nama="erickops"
umur=20
echo "Nama: $nama"
tanggal=$(date +%Y-%m-%d)
echo "Hari ini: $tanggal"
\`\`\`

---

## Kondisi (If/Else)

\`\`\`bash
#!/bin/bash
angka=10
if [ $angka -gt 5 ]; then
    echo "$angka lebih besar dari 5"
else
    echo "$angka lebih kecil dari 5"
fi
\`\`\`

| Operator | Arti             |
|----------|------------------|
| \`-eq\`  | equal (sama)     |
| \`-ne\`  | not equal        |
| \`-gt\`  | greater than     |
| \`-lt\`  | less than        |

---

## Loop

\`\`\`bash
for i in {1..10}; do
    echo "Nomor: $i"
done

counter=0
while [ $counter -lt 5 ]; do
    echo "Counter: $counter"
    counter=$((counter + 1))
done
\`\`\`

---

## Fungsi

\`\`\`bash
greet() {
    local name=$1
    echo "Halo, $name!"
}
greet "Erick"
\`\`\`

---

## Contoh Script: Backup Otomatis

\`\`\`bash
#!/bin/bash
FOLDER_SUMBER="$HOME/Documents"
FOLDER_BACKUP="$HOME/Backup"
TANGGAL=$(date +%Y%m%d_%H%M%S)
mkdir -p "$FOLDER_BACKUP"
tar -czf "$FOLDER_BACKUP/backup_$TANGGAL.tar.gz" "$FOLDER_SUMBER"
if [ $? -eq 0 ]; then
    echo "✅ Backup berhasil"
else
    echo "❌ Backup gagal!"
fi
\`\`\`

---

## Tips

1. **Selalu test dulu** sebelum jalankan script yang destructive
2. **Gunakan \`set -e\`** supaya berhenti jika ada error
3. **Quote variabel**: tulis \`"$nama"\` bukan \`$nama\`
4. **Gunakan \`shellcheck\`** untuk validasi syntax

\`\`\`bash
sudo apt install shellcheck
shellcheck script.sh
\`\`\`

---

## Penutup

Bash scripting adalah skill yang worth it untuk dipelajari. Mulai dari script sederhana, perlahan tambahkan logika. Nanti tanpa sadar kamu sudah punya koleksi script yang beneran menghemat waktu setiap hari.`

};

/* ── Fetch posts with local fallback ── */
async function fetchPosts() {
  try {
    const res = await fetch('./posts/index.json');
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.json();
  } catch (e) {
    return POSTS_FALLBACK;
  }
}

/* ── Fetch markdown with local fallback ── */
async function fetchMarkdown(filename) {
  try {
    const res = await fetch(`./posts/${filename}`);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return await res.text();
  } catch (e) {
    // Fallback: pakai konten yang sudah di-embed
    return CONTENT_FALLBACK[filename] || null;
  }
}

/* ── Typewriter Effect ── */
function typeWriterLoop(element, text, speed, onDone) {
  element.innerHTML = '';
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
      if (typeof onDone === 'function') onDone();
    }
  }, speed);
  return timer;
}

/* ── Mobile Nav Toggle ── */
function toggleNav() {
  const nav = document.getElementById('navLinks');
  if (nav) nav.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.navbar-links a').forEach(link => {
    link.addEventListener('click', () => {
      const nav = document.getElementById('navLinks');
      if (nav) nav.classList.remove('open');
    });
  });
  document.addEventListener('click', (e) => {
    const nav = document.getElementById('navLinks');
    const hamburger = document.getElementById('hamburger');
    if (nav && nav.classList.contains('open')) {
      if (!nav.contains(e.target) && hamburger && !hamburger.contains(e.target)) {
        nav.classList.remove('open');
      }
    }
  });
});

/* ── Toast ── */
let toastTimer = null;
function showToast(message, type = '') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = `toast ${type}`;
  void toast.offsetWidth;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── Category Helpers ── */
function getCategoryClass(cat) {
  return ({ network:'tag-network', security:'tag-security', coding:'tag-coding',
            life:'tag-life', love:'tag-love', random:'tag-random' })[cat] || 'tag-random';
}
function getCategoryLabel(cat) {
  return ({ network:'📡 Network', security:'🔐 Security', coding:'💻 Coding',
            life:'🌱 Life', love:'💙 Love', random:'✨ Random' })[cat] || '✨ Random';
}

/* ── Date Formatter ── */
function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

/* ── Build Post Card ── */
function buildPostCard(post, index) {
  const card = document.createElement('div');
  card.className = 'post-card';
  card.style.animationDelay = (index * 0.08) + 's';
  card.innerHTML = `
    <span class="post-tag ${getCategoryClass(post.category)}">${getCategoryLabel(post.category)}</span>
    <h3>${escapeHtml(post.title)}</h3>
    <p>${escapeHtml(post.excerpt || '')}</p>
    <div class="post-meta">
      <span class="post-date">${formatDate(post.date)}</span>
      <span class="read-time">${post.readTime || '5 min read'}</span>
    </div>
  `;
  card.addEventListener('click', () => {
    window.location.href = `post.html?slug=${encodeURIComponent(post.slug)}`;
  });
  return card;
}

/* ── HTML Escape ── */
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
}

/* ── Smooth scroll ── */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth' }); }
    });
  });
});
