# Network Attacks & Defense

Memahami bagaimana jaringan diserang adalah fondasi dari network security yang efektif. Kamu tidak bisa mempertahankan sesuatu yang cara kerjanya tidak kamu pahami. Di artikel ini kita bahas serangan jaringan yang paling umum dan cara mendeteksi serta mencegahnya.

---

## 1. ARP Spoofing / ARP Poisoning

### Cara Kerja

ARP (Address Resolution Protocol) tidak punya mekanisme autentikasi. Siapapun di jaringan lokal bisa kirim ARP reply palsu untuk mengklaim IP address tertentu.

```
Normal:
PC-A tanya: "Siapa yang punya IP 192.168.1.1?"
Router jawab: "Aku! MAC: AA:BB:CC:DD:EE:01"

ARP Spoofing:
Attacker kirim ARP reply palsu ke semua orang:
"IP 192.168.1.1 → MAC: ATTACKER:MAC"
"IP 192.168.1.100 → MAC: ATTACKER:MAC"

Semua traffic PC-A → Router sekarang lewat Attacker
(Man-in-the-Middle)
```

### Tools

```bash
# Arpspoof (dsniff package)
sudo arpspoof -i eth0 -t 192.168.1.100 192.168.1.1
sudo arpspoof -i eth0 -t 192.168.1.1 192.168.1.100

# Bettercap (lebih modern)
sudo bettercap -iface eth0
# > net.probe on
# > arp.spoof.targets 192.168.1.100
# > arp.spoof on
# > net.sniff on
```

### Deteksi

```bash
# Cek ARP table untuk entri duplikat
arp -a | sort -k4

# Tools monitoring
sudo arpwatch -i eth0

# Di switch Cisco: Dynamic ARP Inspection (DAI)
ip arp inspection vlan 10
```

### Pencegahan

- **Dynamic ARP Inspection (DAI)** di switch managed
- **Static ARP entries** untuk gateway penting
- **HTTPS everywhere** — bahkan kalau MitM, data tetap terenkripsi

---

## 2. DNS Poisoning / DNS Spoofing

### Cara Kerja

Mengisi DNS cache dengan record palsu — sehingga korban diarahkan ke server attacker meskipun mengetik URL yang benar.

```
Normal:
Browser → "IP google.com?" → DNS → "142.250.4.102"
Browser konek ke 142.250.4.102

DNS Poisoning:
Browser → "IP google.com?" → DNS (poisoned) → "attacker.ip"
Browser konek ke attacker.ip (halaman phishing)
```

### Deteksi

```bash
# Bandingkan hasil DNS dari multiple server
dig google.com @8.8.8.8
dig google.com @1.1.1.1
dig google.com @208.67.222.222

# Kalau hasilnya berbeda → kemungkinan poisoning
```

### Pencegahan

- **DNSSEC** — DNS Security Extensions, menambahkan tanda tangan kriptografi ke record DNS
- **DNS over HTTPS (DoH)** atau **DNS over TLS (DoT)**
- Pakai DNS resolver terpercaya (8.8.8.8, 1.1.1.1)

---

## 3. DDoS (Distributed Denial of Service)

### Cara Kerja

Membanjiri target dengan traffic palsu dari ribuan perangkat (botnet) sampai server kewalahan dan tidak bisa melayani request legitimate.

```
Attacker
  ↓ command
Botnet (ribuan perangkat yang terinfeksi)
  ↓ traffic flood
Target Server → Overwhelmed → Down
```

### Jenis DDoS

**Volume-based** — Flood bandwidth target
- UDP Flood
- ICMP Flood (Ping Flood)
- DNS Amplification

**Protocol-based** — Exploit kelemahan protokol
- SYN Flood — kirim ribuan SYN tanpa ACK, habisin tabel koneksi server
- Ping of Death

**Application-layer** — Serangan ke Layer 7
- HTTP Flood — ribuan request HTTP valid
- Slowloris — buka banyak koneksi HTTP, kirim header pelan-pelan

### Mitigasi

```bash
# Rate limiting di iptables
# Limit ping
iptables -A INPUT -p icmp --icmp-type echo-request -m limit --limit 1/s -j ACCEPT
iptables -A INPUT -p icmp --icmp-type echo-request -j DROP

# SYN flood protection
echo 1 > /proc/sys/net/ipv4/tcp_syncookies

# Limit koneksi per IP
iptables -A INPUT -p tcp --syn --dport 80 -m connlimit --connlimit-above 20 -j DROP
```

Untuk DDoS skala besar: CDN (Cloudflare, AWS Shield), BGP blackholing, upstream filtering di ISP.

---

## 4. Man-in-the-Middle (MitM)

MitM adalah kategori serangan di mana attacker posisikan diri di antara dua pihak yang berkomunikasi.

### Teknik MitM Umum

- ARP Spoofing (sudah dibahas)
- Evil Twin WiFi — buat AP palsu dengan SSID sama dengan WiFi yang ada
- SSL Stripping — downgrade HTTPS ke HTTP

### Evil Twin Attack

```bash
# Buat access point palsu dengan hostapd
# /etc/hostapd/hostapd.conf
interface=wlan0
driver=nl80211
ssid=CoffeeShop_WiFi     # sama dengan AP asli
hw_mode=g
channel=6
macaddr_acl=0

# Jalankan
sudo hostapd /etc/hostapd/hostapd.conf
```

### SSL Stripping

```bash
# Dengan bettercap
sudo bettercap -iface eth0
# > set https.proxy.sslstrip true
# > https.proxy on
# > net.sniff on
```

### Pertahanan terhadap MitM

- **HTTPS + HSTS** (HTTP Strict Transport Security) — browser tidak mau downgrade ke HTTP
- **Certificate Pinning** — app hanya percaya sertifikat tertentu
- **VPN** di jaringan publik
- **MFA** — bahkan kalau credentials dicuri, masih butuh faktor kedua

---

## 5. Port Scanning dan Network Reconnaissance

Bukan serangan langsung, tapi fase awal yang perlu dideteksi.

```bash
# Scan yang terdeteksi vs tidak terdeteksi

# Full connect scan (mudah terdeteksi)
nmap -sT target.com

# SYN scan (lebih stealth, butuh root)
nmap -sS target.com

# Idle scan (sangat stealth)
nmap -sI zombie_host target.com

# Deteksi scan di log
grep "SYN" /var/log/syslog | head -20

# Dengan snort rule
alert tcp any any -> $HOME_NET any \
  (msg:"Port Scan"; flags:S; \
  threshold:type both, track by_src, count 30, seconds 10; \
  sid:1000001;)
```

---

## Network Baseline dan Anomaly Detection

Pertahanan terbaik dimulai dari **tahu apa yang normal** — sehingga yang tidak normal langsung terdeteksi.

```bash
# Catat baseline traffic
sudo tcpdump -i eth0 -w baseline.pcap &
sleep 3600  # capture 1 jam
kill %1

# Analisis dengan tshark
tshark -r baseline.pcap -q -z io,stat,60  # statistik per menit
tshark -r baseline.pcap -q -z conv,tcp    # conversation statistics

# Monitor real-time
sudo ntopng  # web-based traffic analyzer
sudo zabbix  # full network monitoring
```

---

## Penutup

Setiap teknik serangan yang dibahas di sini punya counter-nya. Yang paling penting: **monitoring**. Serangan yang tidak terdeteksi jauh lebih berbahaya dari serangan yang terdeteksi.

Pasang IDS/IPS, monitor log, dan buat alerting untuk aktivitas yang anomali. Artikel selanjutnya: **Social Engineering: Seni Memanipulasi Manusia** — karena seringkali, manusia adalah celah keamanan terbesar.
