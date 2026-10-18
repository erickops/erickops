# Footprinting dan Reconnaissance: Seni Mengumpulkan Informasi

Sebelum seorang attacker menyerang sebuah target, mereka tidak langsung terjun. Mereka observasi dulu — mengumpulkan sebanyak mungkin informasi tentang target tanpa membuat kegaduhan. Fase ini disebut **reconnaissance** atau **footprinting**.

Sebagai ethical hacker atau security professional, memahami fase ini sangat penting. Kamu perlu tahu apa yang bisa ditemukan tentang target kamu sebelum orang lain menemukannya.

---

## Apa Itu Footprinting?

**Footprinting** adalah proses mengumpulkan informasi sebanyak mungkin tentang target sebelum melakukan pengujian keamanan. Tujuannya adalah memahami "jejak digital" target — apa yang mereka expose ke dunia luar.

Informasi yang dikumpulkan meliputi:
- Domain dan subdomain
- IP address dan range jaringan
- Teknologi yang digunakan
- Karyawan dan email address
- Informasi DNS
- Port dan service yang terbuka

---

## Passive vs Active Reconnaissance

### Passive Reconnaissance
Mengumpulkan informasi **tanpa berinteraksi langsung** dengan target. Target tidak menyadari adanya pengumpulan informasi.

Contoh: mencari di Google, membaca LinkedIn, menggunakan Shodan.

### Active Reconnaissance
Berinteraksi **langsung** dengan target untuk mengumpulkan informasi.

Contoh: ping, port scan, DNS query langsung ke server target.

> Passive reconnaissance lebih aman secara legal dan operasional — tidak meninggalkan jejak di log target.

---

## Teknik Passive Reconnaissance

### 1. Google Hacking (Google Dorking)

Google menyimpan banyak informasi yang tidak sengaja di-expose. Dengan operator khusus, kamu bisa menemukan hal-hal yang menarik:

```
# Cari file sensitif
site:target.com filetype:pdf
site:target.com filetype:xlsx "confidential"

# Cari halaman login
site:target.com inurl:login
site:target.com inurl:admin

# Cari informasi di subdomain
site:*.target.com

# Cari konfigurasi yang ter-expose
site:target.com ext:env
site:target.com ext:config
site:target.com "DB_PASSWORD"

# Cari dokumen internal
site:target.com intitle:"index of"
```

Database Google Dork lengkap: [exploit-db.com/google-hacking-database](https://www.exploit-db.com/google-hacking-database)

### 2. WHOIS Lookup

WHOIS memberikan informasi registrasi domain: pemilik, registrar, nameserver, tanggal registrasi.

```bash
whois target.com

# Output berisi:
# Domain Name: TARGET.COM
# Registrant: John Doe
# Email: admin@target.com
# Name Server: ns1.target.com
# Created: 2015-01-15
# Expires: 2027-01-15
```

Tool online: [who.is](https://who.is), [whois.domaintools.com](https://whois.domaintools.com)

### 3. DNS Enumeration

```bash
# Basic DNS lookup
nslookup target.com
dig target.com

# Cari semua record DNS
dig target.com ANY

# Cek record MX (email server)
dig target.com MX

# Cari subdomain via brute force (passive — pakai wordlist)
# Tool: dnsrecon, sublist3r, amass

# Sublist3r
python sublist3r.py -d target.com

# Amass
amass enum -d target.com
```

### 4. theHarvester — Kumpulkan Email dan Subdomain

```bash
# Install
pip install theHarvester

# Cari email, subdomain, IP dari berbagai sumber
theHarvester -d target.com -b google
theHarvester -d target.com -b bing
theHarvester -d target.com -b linkedin

# Pakai semua sumber
theHarvester -d target.com -b all
```

### 5. Shodan — "Google untuk Perangkat"

Shodan adalah search engine yang mengindex perangkat yang terhubung ke internet beserta port dan service-nya.

```bash
# Install
pip install shodan

# Via CLI
shodan search "apache target.com"
shodan host 203.0.113.5

# Query berguna
hostname:target.com                    # semua perangkat target
org:"Target Company"                   # berdasarkan organisasi
ssl.cert.subject.cn:target.com         # berdasarkan SSL cert
http.title:"Dashboard" org:"Target"    # cari dashboard terbuka
```

Website: [shodan.io](https://shodan.io)

### 6. Wayback Machine — Lihat Versi Lama Website

Website bisa berisi informasi sensitif yang sudah dihapus, tapi masih tersimpan di archive.

```
https://web.archive.org/web/*/target.com
```

Berguna untuk menemukan:
- Halaman yang sudah dihapus
- Struktur direktori lama
- Email address yang pernah ter-expose
- Teknologi yang pernah digunakan

### 7. LinkedIn dan Social Media

Informasi karyawan sangat berguna untuk:
- **Social engineering** — tahu nama, jabatan, departemen
- **Email format** — kalau tahu `john.doe@target.com`, kamu bisa tebak format email perusahaan
- **Teknologi yang digunakan** — job listing sering menyebutkan stack teknologi

---

## Teknik Active Reconnaissance

### 1. DNS Zone Transfer

Zone transfer adalah fitur DNS untuk sinkronisasi antar nameserver. Kalau misconfigured, bisa expose **seluruh DNS record** suatu domain.

```bash
# Coba zone transfer
dig axfr target.com @ns1.target.com

# Kalau berhasil, output akan berisi semua record DNS
# Ini adalah misconfiguration serius
```

### 2. Ping Sweep — Cari Host yang Aktif

```bash
# Pakai nmap untuk host discovery
nmap -sn 192.168.1.0/24

# Output:
# Nmap scan report for 192.168.1.1 (router)
# Nmap scan report for 192.168.1.100 (PC-1)
# Nmap scan report for 192.168.1.105 (Server)
```

### 3. Port Scanning Dasar

```bash
# Scan port umum
nmap target.com

# Scan lebih detail dengan deteksi versi
nmap -sV target.com

# Scan semua port (lebih lambat)
nmap -p- target.com
```

---

## Merangkum Hasil Reconnaissance

Setelah mengumpulkan informasi, buat **target profile**:

```
TARGET: target.com
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IP Range    : 203.0.113.0/24
Nameserver  : ns1.target.com (203.0.113.5)
              ns2.target.com (203.0.113.6)
Mail Server : mail.target.com (203.0.113.10)
Subdomain   : www, mail, vpn, admin, dev
Tech Stack  : Apache 2.4, PHP 7.4, MySQL
Employees   : John Doe (IT Manager), Jane Smith (Dev)
Email format: firstname.lastname@target.com
Open Ports  : 22 (SSH), 80 (HTTP), 443 (HTTPS), 3306 (MySQL - exposed!)
```

---

## Penutup

Reconnaissance adalah fase yang sering diremehkan tapi justru paling menentukan. Semakin baik informasi yang dikumpulkan di fase ini, semakin terarah dan efektif serangan (atau pertahanan) yang bisa dilakukan.

Dari sudut pandang defender: lakukan reconnaissance terhadap infrastruktur kamu sendiri secara berkala. Temukan apa yang bisa dilihat oleh orang luar sebelum orang lain menemukannya.

Artikel selanjutnya: **Vulnerability Scanning: Menemukan Celah Sebelum Attacker**.
