# Social Engineering: Seni Memanipulasi Manusia

Ada sebuah kutipan terkenal dari Kevin Mitnick — salah satu hacker paling terkenal dalam sejarah:

> "The human element is truly security's weakest link."

Semua firewall, enkripsi, dan sistem keamanan canggih bisa jadi tidak berguna kalau attacker bisa memanipulasi manusia yang mengoperasikannya untuk membuka pintu sendiri.

---

## Apa Itu Social Engineering?

**Social Engineering** adalah seni memanipulasi manusia — menggunakan psikologi, bukan teknologi — untuk mendapatkan informasi rahasia, akses, atau membuat korban melakukan sesuatu yang menguntungkan attacker.

Target bukan sistem, tapi manusianya.

---

## Prinsip Psikologi yang Dieksploitasi

Robert Cialdini dalam bukunya *Influence* mengidentifikasi beberapa prinsip persuasi yang sering dieksploitasi:

### 1. Authority (Otoritas)
Orang cenderung patuh pada sosok yang terlihat berkuasa.

```
"Ini dari IT Department. Ada masalah dengan akun kamu.
Kami butuh password kamu untuk verifikasi segera."
```

### 2. Urgency (Urgensi)
Tekanan waktu membuat orang tidak berpikir rasional.

```
"Akun kamu akan diblokir dalam 2 jam!
Klik link ini SEKARANG untuk mempertahankan akses."
```

### 3. Social Proof
Kalau orang lain melakukannya, pasti aman.

```
"Semua karyawan departemen kamu sudah update data mereka.
Kamu satu-satunya yang belum."
```

### 4. Reciprocity (Timbal Balik)
Kalau seseorang berbuat baik ke kita, kita merasa wajib membalas.

```
Attacker memberikan bantuan kecil ke target dulu,
lalu meminta "bantuan kecil" sebagai balasan.
```

### 5. Liking (Rasa Suka)
Kita lebih mudah percaya pada orang yang kita sukai.

---

## Teknik Social Engineering

### Phishing
Email palsu yang menyamar sebagai entitas terpercaya.

```
From: security@paypa1.com        ← domain mirip tapi beda (1 vs l)
Subject: Urgent: Akun PayPal kamu akan ditangguhkan

Kepada pelanggan yang terhormat,

Kami mendeteksi aktivitas mencurigakan di akun kamu.
Klik link di bawah untuk verifikasi identitas kamu:

http://paypa1-secure-verify.tk/login   ← domain mencurigakan

Best regards,
PayPal Security Team
```

**Tanda-tanda phishing:**
- Domain pengirim mencurigakan (huruf mirip: rn vs m, 0 vs o)
- Urgensi berlebihan
- Link tidak mengarah ke domain resmi
- Grammar/ejaan buruk
- Minta informasi sensitif via email

### Spear Phishing
Phishing yang **dipersonalisasi** untuk target spesifik menggunakan informasi yang sudah dikumpulkan dari OSINT.

```
From: budi.santoso@company.com     ← email internal yang di-spoof
Subject: Re: Laporan Q3 yang kamu minta

Hai [Nama Korban],

Sesuai diskusi kita kemarin di meeting dengan [Nama Atasan],
berikut link ke laporan Q3: [link berbahaya]

Best,
Budi
```

### Vishing (Voice Phishing)
Social engineering via telepon.

```
"Selamat siang, ini dari Bank BCA.
Kami mendeteksi transaksi mencurigakan senilai Rp 5 juta 
dari akun Anda ke rekening tidak dikenal.

Untuk membatalkan transaksi ini, saya perlu verifikasi identitas Anda.
Bisakah Anda sebutkan nomor CVV kartu dan kode OTP yang baru saja dikirim?"
```

### Smishing (SMS Phishing)

```
[BRI] Transaksi Anda sebesar Rp8.500.000 berhasil.
Bukan Anda? Batalkan di: bit.ly/bri-cancel-txn
```

### Pretexting
Membuat skenario palsu (pretext) untuk mendapatkan informasi.

```
Attacker menyamar sebagai auditor eksternal:
"Saya dari kantor akuntan publik XYZ yang ditugaskan untuk audit.
Saya perlu akses ke sistem inventory untuk keperluan audit.
Bisa tolong buatkan akun temporary untuk saya?"
```

### Baiting
Menggunakan umpan fisik atau digital.

```
USB drive "yang terlupakan" di parkiran kantor:
- Label: "Gaji Karyawan 2026 - RAHASIA"
- Isinya: malware yang auto-run saat dicolok

Download crack software:
- Berisi: trojan + software yang dijanjikan
```

### Tailgating / Piggybacking
Ikut masuk ke area terbatas tanpa izin.

```
"Permisi mas, boleh dong bantu pegang pintu? 
Tangan saya penuh bawa barang ini."
→ Masuk ke server room tanpa badge
```

---

## Red Flags yang Harus Diwaspadai

```
✗ Request mendadak untuk informasi sensitif
✗ Tekanan waktu yang tidak wajar
✗ Request yang melewati prosedur normal
✗ Orang asing yang "kebetulan" butuh akses
✗ Email/telpon dari "atasan" yang minta sesuatu tidak biasa
✗ Link yang tidak sesuai dengan teks yang ditampilkan
✗ Lampiran file dari pengirim yang tidak dikenal
```

---

## Cara Bertahan

### Untuk Individu

1. **Verifikasi identitas** — kalau ada telepon mengaku dari bank/IT, tutup dulu dan hubungi langsung lewat nomor resmi
2. **Hover link sebelum klik** — pastikan URL benar sebelum klik
3. **Jangan buka lampiran** dari pengirim tidak dikenal
4. **Prinsip zero trust** — verifikasi dulu, percaya belakangan
5. **Laporkan** email/telepon mencurigakan ke tim IT/security

### Untuk Organisasi

```
- Security awareness training berkala (minimal 1x/tahun)
- Phishing simulation (test karyawan dengan fake phishing)
- Kebijakan verifikasi identitas yang jelas
- Clear desk policy
- Prosedur untuk request sensitif (tidak via email/telpon saja)
- Multi-factor authentication di semua sistem kritis
```

### Phishing Simulation

```bash
# Gophish — open source phishing simulation framework
# Download: https://getgophish.com

# Setup
./gophish
# Akses dashboard: https://localhost:3333

# Buat campaign:
# 1. Import target list
# 2. Buat email template yang realistis
# 3. Buat landing page
# 4. Launch campaign
# 5. Analisis siapa yang klik / submit credentials
```

---

## Penutup

Social engineering adalah pengingat bahwa keamanan bukan hanya tentang teknologi — ini tentang manusia. Satu karyawan yang termanipulasi bisa membatalkan semua investasi keamanan teknis yang mahal.

Training rutin, kebijakan yang jelas, dan budaya security awareness adalah pertahanan terbaik terhadap social engineering.
