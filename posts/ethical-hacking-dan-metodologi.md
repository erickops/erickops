# Ethical Hacking dan Metodologinya

Hacking sering punya konotasi negatif di media — identik dengan kejahatan siber. Padahal ada sisi lain yang sama pentingnya: **ethical hacking** atau hacking yang dilakukan secara legal dan bertanggung jawab untuk memperkuat keamanan sistem.

---

## Apa Itu Ethical Hacking?

**Ethical hacking** (atau penetration testing) adalah proses menguji keamanan sistem, jaringan, atau aplikasi dengan menggunakan teknik yang sama dengan penyerang nyata — tapi dengan **izin resmi** dari pemilik sistem.

Tujuannya bukan untuk merusak, tapi untuk **menemukan celah sebelum orang jahat menemukannya**.

### Perbedaan Hacker Berdasarkan Topi

| Tipe | Deskripsi |
|------|-----------|
| **White Hat** | Ethical hacker — bekerja legal dengan izin |
| **Black Hat** | Malicious hacker — melanggar hukum, tujuan jahat |
| **Grey Hat** | Di antara keduanya — mungkin akses tanpa izin tapi tidak berniat jahat |

---

## Mengapa Ethical Hacking Diperlukan?

Bayangkan kamu punya brankas baru. Cara terbaik untuk tahu apakah brankas itu aman adalah **minta ahli untuk mencoba membukanya** sebelum kamu taruh uang di dalamnya.

Sama halnya dengan sistem keamanan digital:
- Audit keamanan biasa hanya cek konfigurasi di atas kertas
- Penetration testing **benar-benar mencoba** menembus pertahanan
- Hasilnya jauh lebih realistis dan actionable

---

## Metodologi Ethical Hacking

Penetration testing yang profesional mengikuti metodologi yang terstruktur. Yang paling umum digunakan:

### 1. Reconnaissance (Pengumpulan Informasi)
Fase pertama — kumpulkan sebanyak mungkin informasi tentang target **tanpa menyentuh sistem target secara langsung**.

**Passive Reconnaissance** — tidak ada interaksi langsung dengan target:
```bash
# OSINT (Open Source Intelligence)
whois target.com          # info registrasi domain
nslookup target.com       # info DNS
theHarvester -d target.com -b google   # email, subdomain
shodan search "target.com"             # cari di Shodan
```

**Active Reconnaissance** — interaksi langsung dengan target:
```bash
nmap -sn 192.168.1.0/24   # host discovery
nmap -sV target.com        # service version detection
```

### 2. Scanning & Enumeration
Identifikasi port terbuka, service yang berjalan, dan versinya.

```bash
# Port scan
nmap -p- -sV -sC target.com

# Web enumeration
gobuster dir -u http://target.com -w wordlist.txt
dirb http://target.com

# SMB enumeration
enum4linux target.com
```

### 3. Vulnerability Analysis
Analisis hasil scan untuk menemukan kerentanan yang bisa dieksploitasi.

```bash
# Vulnerability scanner
nikto -h http://target.com    # web vulnerability scan
nmap --script vuln target.com # NSE vulnerability scripts

# Manual check
# - versi software → cari CVE di NVD/Exploit-DB
# - konfigurasi yang salah
# - default credentials
```

### 4. Exploitation
Memanfaatkan kerentanan yang ditemukan untuk mendapatkan akses.

```bash
# Metasploit Framework
msfconsole
use exploit/multi/handler
set payload windows/meterpreter/reverse_tcp
set LHOST 192.168.1.100
exploit

# Manual exploitation
# - SQL injection
# - Buffer overflow
# - Command injection
```

### 5. Post Exploitation
Setelah dapat akses, perluas jangkauan dan kumpulkan bukti.

```bash
# Privilege escalation
whoami /priv          # cek privilege Windows
sudo -l               # cek sudo permission Linux

# Lateral movement
# - pivot ke sistem lain
# - dump credentials

# Data exfiltration (simulasi)
# - akses data sensitif
# - screenshot, keylogger (untuk bukti laporan)
```

### 6. Reporting
Fase terpenting — dokumentasikan semua temuan dengan jelas.

Laporan yang baik mencakup:
- **Executive Summary** — ringkasan non-teknis untuk manajemen
- **Technical Findings** — detail teknis setiap vulnerability
- **Risk Rating** — severity tiap temuan (Critical/High/Medium/Low)
- **Proof of Concept** — screenshot/video bukti eksploitasi
- **Remediation** — rekomendasi perbaikan yang actionable

---

## Framework & Standar yang Digunakan

| Framework | Keterangan |
|-----------|------------|
| **PTES** (Penetration Testing Execution Standard) | Standar metodologi pentest |
| **OWASP Testing Guide** | Khusus untuk web application |
| **MITRE ATT&CK** | Framework teknik serangan nyata |
| **NIST SP 800-115** | Panduan teknis security testing |

---

## Legal & Etika

> **Melakukan hacking tanpa izin adalah ILEGAL di hampir semua negara, termasuk Indonesia (UU ITE).**

Pastikan selalu:
- Ada **written authorization** (izin tertulis) dari pemilik sistem
- Scope jelas — sistem mana yang boleh ditest
- Timeline jelas — kapan testing dilakukan
- Rules of engagement jelas — apa yang boleh dan tidak boleh dilakukan

---

## Cara Mulai Belajar Ethical Hacking

```
1. Kuasai fundamental jaringan (TCP/IP, DNS, HTTP)
2. Pelajari Linux dengan serius
3. Mulai di platform legal:
   - TryHackMe (pemula) → https://tryhackme.com
   - HackTheBox (menengah) → https://hackthebox.com
   - PicoCTF (CTF pemula) → https://picoctf.org
4. Pelajari tools: Nmap, Burp Suite, Metasploit
5. Ikuti CTF competition
6. Kejar sertifikasi: CompTIA Security+, eJPT, OSCP
```

---

## Penutup

Ethical hacking adalah seni memahami cara kerja serangan untuk bisa membangun pertahanan yang lebih baik. Ini bukan soal menjadi penjahat — ini soal berpikir seperti penjahat untuk melindungi orang lain.

Artikel selanjutnya: **Pengenalan CTF (Capture The Flag)** — cara paling seru untuk belajar cybersecurity secara praktis.
