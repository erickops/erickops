# Nmap Cheatsheet: Command yang Sering Aku Pakai

Nmap (Network Mapper) adalah tool reconnaissance yang hampir selalu jadi langkah pertama waktu aku perlu tahu apa yang ada di suatu jaringan. Ini bukan tutorial lengkap — ini lebih ke catatan perintah yang paling sering aku butuhkan, biar tidak perlu Google tiap kali lupa syntax-nya.

---

## Basic Scan

```bash
# Scan satu host
nmap 192.168.1.1

# Scan subnet
nmap 192.168.1.0/24

# Scan dari file
nmap -iL targets.txt

# Ping scan (host discovery saja, tanpa port scan)
nmap -sn 192.168.1.0/24
```

---

## Port Scan

```bash
# Scan port spesifik
nmap -p 80,443,22 192.168.1.1

# Scan semua 65535 port
nmap -p- 192.168.1.1

# Scan port range
nmap -p 1-1000 192.168.1.1

# Scan top 100 port paling umum
nmap --top-ports 100 192.168.1.1
```

---

## Scan Types

```bash
# TCP SYN scan (default, butuh root/sudo)
nmap -sS 192.168.1.1

# TCP Connect scan (tidak butuh root)
nmap -sT 192.168.1.1

# UDP scan (lambat, tapi penting)
nmap -sU 192.168.1.1

# Kombinasi TCP + UDP
nmap -sS -sU 192.168.1.1
```

---

## Service & Version Detection

```bash
# Deteksi versi service
nmap -sV 192.168.1.1

# Deteksi OS
nmap -O 192.168.1.1

# Kombinasi lengkap (aggressive scan)
nmap -A 192.168.1.1
# -A = -sV -O -sC --traceroute
```

---

## Scripts (NSE)

```bash
# Jalankan default scripts
nmap -sC 192.168.1.1

# Script spesifik
nmap --script=http-title 192.168.1.1

# Multiple scripts
nmap --script=http-title,http-headers 192.168.1.1

# Semua script kategori vuln
nmap --script=vuln 192.168.1.1

# SMB vulnerability check
nmap --script=smb-vuln* -p 445 192.168.1.1
```

---

## Output

```bash
# Simpan ke file teks
nmap -oN output.txt 192.168.1.1

# Simpan ke XML (untuk tools lain)
nmap -oX output.xml 192.168.1.1

# Simpan ke semua format
nmap -oA output 192.168.1.1
# Menghasilkan: output.nmap, output.xml, output.gnmap
```

---

## Timing & Performance

```bash
# T0 = paranoid (sangat lambat, buat IDS evasion)
# T3 = default
# T4 = fast (buat lab / jaringan yang kamu kontrol)
# T5 = insane (bisa miss results)

nmap -T4 192.168.1.1
nmap -T4 -p- --min-rate 5000 192.168.1.1
```

---

## Kombinasi yang Sering Aku Pakai

### Initial recon cepat
```bash
nmap -sn 192.168.1.0/24
```

### Full scan pada target spesifik
```bash
nmap -sV -sC -p- -T4 -oA full_scan 192.168.1.100
```

### CTF / HackTheBox initial footprint
```bash
nmap -sV -sC -oN nmap_initial.txt 10.10.10.X
```

### UDP top ports
```bash
nmap -sU --top-ports 20 192.168.1.1
```

---

## Catatan Penting

> **Gunakan Nmap hanya pada jaringan yang kamu miliki atau sudah mendapat izin eksplisit untuk di-scan.** Scanning tanpa izin adalah ilegal di banyak yurisdiksi.

---

## Resources

- [Official Nmap Book](https://nmap.org/book/) — gratis online
- `man nmap` — kalau sudah install, manualnya lengkap
- `nmap --help` — quick reference
