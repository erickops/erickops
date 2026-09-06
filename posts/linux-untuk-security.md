# Linux untuk Security: Kenapa Wajib dan Cara Mulainya

Hampir semua tools cybersecurity yang serius berjalan di Linux. Kalau kamu serius mau masuk ke dunia security, menguasai Linux bukan opsional — ini wajib.

---

## Kenapa Linux?

### 1. Open Source
Kamu bisa lihat, modifikasi, dan memahami cara kerja sistem dari dalam. Ini krusial dalam security — kamu harus tahu apa yang terjadi di balik layar.

### 2. Semua Tools Ada di Sini
Wireshark, Nmap, Metasploit, Burp Suite, Aircrack-ng, Hashcat — semua berjalan native di Linux. Di Windows, banyak yang tidak tersedia atau perlu workaround.

### 3. Terminal yang Powerful
Linux terminal jauh lebih powerful untuk security work. Automasi, scripting, piping output antar tools — semua jadi jauh lebih mudah.

### 4. Distro Khusus Security
Ada distro Linux yang memang dirancang khusus untuk security testing — sudah pre-installed dengan ratusan tools.

---

## Distro Linux untuk Security

### Kali Linux
Distro paling populer untuk penetration testing. Dibuat oleh Offensive Security, pre-installed dengan 600+ tools security.

```bash
# Download: https://www.kali.org/downloads/
# Bisa dijalankan via:
# - Instalasi langsung (dual boot)
# - Virtual Machine (VirtualBox/VMware)
# - WSL2 di Windows
# - Live USB (tanpa install)
```

### Parrot OS
Alternatif Kali yang lebih ringan. Cocok untuk laptop dengan spesifikasi terbatas.

### Ubuntu/Debian
Bisa diinstall tools security secara manual. Bagus untuk belajar karena kamu setup sendiri satu per satu.

---

## Perintah Linux Dasar yang Wajib Dikuasai

### Navigasi Filesystem

```bash
pwd              # tampilkan direktori saat ini
ls               # list isi direktori
ls -la           # list detail termasuk file hidden
cd /etc          # pindah ke direktori /etc
cd ~             # kembali ke home directory
cd ..            # naik satu level
```

### Manajemen File

```bash
cat file.txt           # tampilkan isi file
less file.txt          # tampilkan dengan scroll
grep "error" log.txt   # cari teks dalam file
grep -r "password" /etc # cari rekursif
find / -name "*.conf"  # cari file
cp file.txt backup.txt # copy file
mv old.txt new.txt     # rename/move file
rm file.txt            # hapus file
```

### Permissions

```bash
ls -l file.txt
# -rwxr-xr-- 1 user group 1234 Aug 16 file.txt
#  ↑↑↑ ↑↑↑ ↑↑↑
#  user group others

chmod 755 script.sh    # ubah permission
chmod +x script.sh     # tambahkan execute permission
chown user:group file  # ubah owner
```

### Networking

```bash
ip addr show           # lihat IP address
ip route show          # lihat routing table
ss -tuln               # lihat port yang terbuka
netstat -an            # semua koneksi aktif
ping google.com        # test koneksi
curl https://url.com   # HTTP request dari terminal
wget https://url.com   # download file
```

### Process Management

```bash
ps aux                 # lihat semua process
ps aux | grep nginx    # filter process
kill -9 PID            # paksa kill process
top                    # monitor resource real-time
htop                   # top yang lebih cantik
```

### User Management

```bash
whoami                 # siapa kamu saat ini
id                     # UID, GID, dan groups
sudo command           # jalankan sebagai root
su - username          # switch user
cat /etc/passwd        # daftar user
cat /etc/shadow        # password hash (butuh root)
```

---

## Struktur Direktori Linux

```
/
├── etc/        ← konfigurasi sistem
├── var/        ← data variabel (log, cache)
│   └── log/    ← log sistem
├── home/       ← home directory user
├── root/       ← home directory root
├── tmp/        ← file sementara
├── usr/        ← program dan library
│   ├── bin/    ← executable user
│   └── sbin/   ← executable admin
├── bin/        ← essential commands
├── sbin/       ← essential system commands
├── dev/        ← device files
└── proc/       ← info proses (virtual)
```

**File penting untuk security:**

```bash
/etc/passwd          # info user
/etc/shadow          # password hash (root only)
/etc/sudoers         # siapa yang bisa sudo
/var/log/auth.log    # log autentikasi
/var/log/syslog      # log sistem
/etc/crontab         # scheduled tasks
/etc/hosts           # DNS lokal
```

---

## Tools Security Dasar di Linux

```bash
# Network scanning
nmap -sV -sC target.com

# Packet capture
tcpdump -i eth0 -w capture.pcap

# Web requests
curl -I https://target.com     # lihat response headers
curl -X POST -d "data" url     # POST request

# Password cracking
john hash.txt                  # John the Ripper
hashcat -m 0 hash.txt wordlist.txt

# File analysis
file suspicious.exe            # identifikasi tipe file
strings suspicious.exe         # extract strings
xxd suspicious.exe | head      # hex dump
```

---

## Tips Belajar Linux untuk Security

1. **Install Kali di VM** — bisa eksperimen tanpa takut merusak sistem utama
2. **Praktik di TryHackMe/HackTheBox** — banyak room yang mengajarkan Linux sekaligus security
3. **Baca man pages** — `man nmap`, `man tcpdump` — dokumentasi lengkap ada di sana
4. **Buat script sendiri** — mulai dari yang simpel, bash script untuk automasi task berulang
5. **Jangan takut rusak** — VM bisa di-snapshot, reset, dan restore. Eksperimen sebanyak mungkin.

---

## Penutup

Linux dan cybersecurity adalah dua hal yang tidak bisa dipisahkan. Semakin dalam kamu masuk ke dunia security, semakin banyak waktu yang akan kamu habiskan di terminal Linux.

Mulai dari yang dasar, bangun terbiasa dulu. Artikel selanjutnya: **Pengenalan Ethical Hacking dan Metodologinya**.
