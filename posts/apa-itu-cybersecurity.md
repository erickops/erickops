# Apa Itu Cybersecurity?

Di era di mana hampir semua aktivitas kita bergantung pada internet — dari belanja, bekerja, sampai menyimpan data pribadi — cybersecurity bukan lagi urusan orang IT saja. Ini urusan semua orang.

---

## Definisi Cybersecurity

**Cybersecurity** adalah praktik melindungi sistem komputer, jaringan, program, dan data dari serangan digital, kerusakan, atau akses yang tidak sah.

Tujuan utamanya dirangkum dalam tiga prinsip yang disebut **CIA Triad**:

```
┌─────────────────────────────────────────┐
│                CIA Triad                │
│                                         │
│   Confidentiality  ─  Integrity         │
│           \            /                │
│            \          /                 │
│             Availability                │
└─────────────────────────────────────────┘
```

### Confidentiality (Kerahasiaan)
Data hanya bisa diakses oleh pihak yang berhak. Contoh: password kamu tidak boleh bisa dibaca orang lain.

### Integrity (Integritas)
Data tidak boleh dimodifikasi tanpa izin. Contoh: transfer bank sebesar Rp 100.000 tidak boleh berubah jadi Rp 10.000.000 di tengah jalan.

### Availability (Ketersediaan)
Sistem dan data harus tersedia saat dibutuhkan. Contoh: ATM harus bisa diakses 24/7, bukan hanya jam kerja.

---

## Mengapa Cybersecurity Penting?

Beberapa fakta yang perlu kamu tahu:

- Rata-rata **2.200 serangan siber terjadi setiap hari** di seluruh dunia
- Biaya rata-rata sebuah data breach mencapai **$4.45 juta** (2023)
- **95% pelanggaran keamanan** disebabkan oleh human error
- Serangan ransomware terjadi setiap **11 detik**

Dampak serangan siber bisa sangat serius:
- **Finansial** — pencurian data kartu kredit, rekening bank
- **Privasi** — data pribadi bocor dan disalahgunakan
- **Operasional** — bisnis lumpuh karena sistem tidak bisa diakses
- **Reputasi** — kepercayaan pelanggan hancur

---

## Jenis Ancaman Siber yang Umum

### Malware
Software berbahaya yang dirancang untuk merusak atau mengakses sistem tanpa izin. Termasuk: virus, worm, trojan, ransomware, spyware.

### Phishing
Teknik penipuan di mana penyerang menyamar sebagai entitas terpercaya (bank, layanan populer) untuk mencuri kredensial atau data sensitif.

```
Email palsu: "Akun BCA kamu akan diblokir. Klik di sini untuk verifikasi."
                                              ↑
                                   Link ke website palsu
```

### Man-in-the-Middle (MitM)
Penyerang menyadap komunikasi antara dua pihak tanpa sepengetahuan keduanya.

### DDoS (Distributed Denial of Service)
Membanjiri server dengan traffic palsu dari ribuan perangkat sekaligus hingga server tidak bisa melayani pengguna legitimate.

### SQL Injection
Memasukkan kode SQL berbahaya ke dalam input yang tidak divalidasi untuk mengakses atau memanipulasi database.

### Zero-Day Exploit
Serangan yang memanfaatkan celah keamanan yang belum diketahui oleh vendor software.

---

## Domain dalam Cybersecurity

Cybersecurity adalah bidang yang sangat luas. Beberapa domain utamanya:

| Domain | Fokus |
|--------|-------|
| **Network Security** | Melindungi infrastruktur jaringan |
| **Application Security** | Keamanan software dan aplikasi |
| **Cloud Security** | Keamanan di lingkungan cloud |
| **Endpoint Security** | Melindungi perangkat end-user |
| **Identity & Access Management** | Manajemen identitas dan hak akses |
| **Incident Response** | Penanganan insiden keamanan |
| **Threat Intelligence** | Riset dan analisis ancaman |
| **Forensics** | Investigasi digital pasca insiden |

---

## Siapa yang Bekerja di Cybersecurity?

Dua kubu utama dalam cybersecurity:

### Red Team (Offensive)
Berperan sebagai penyerang — mencari celah keamanan sebelum orang jahat menemukannya. Pekerjaan: Penetration Tester, Ethical Hacker, Red Team Operator.

### Blue Team (Defensive)
Berperan sebagai pertahanan — membangun dan menjaga keamanan sistem. Pekerjaan: SOC Analyst, Incident Responder, Security Engineer.

### Purple Team
Gabungan keduanya — red dan blue team bekerja sama untuk memperkuat pertahanan.

---

## Langkah Awal Belajar Cybersecurity

1. **Kuasai dasar jaringan** — TCP/IP, OSI model, DNS, HTTP
2. **Pelajari Linux** — sebagian besar tools security berjalan di Linux
3. **Pahami pemrograman dasar** — Python, Bash scripting
4. **Ikuti CTF (Capture The Flag)** — platform latihan seperti HackTheBox, TryHackMe
5. **Kejar sertifikasi** — CompTIA Security+, CEH, OSCP

---

## Penutup

Cybersecurity bukan hanya tentang hacking. Ini tentang memahami bagaimana sistem bekerja, bagaimana ia bisa dieksploitasi, dan bagaimana melindunginya.

Artikel selanjutnya kita akan bedah lebih dalam tentang **Red Team vs Blue Team** — dua sisi yang saling melengkapi dalam ekosistem keamanan siber.
