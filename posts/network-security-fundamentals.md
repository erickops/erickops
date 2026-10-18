# Network Security Fundamentals

Setelah paham cara jaringan bekerja, pertanyaan selanjutnya adalah: bagaimana melindunginya? Network security adalah lapisan pertahanan yang menjaga data dan sistem dari akses tidak sah, serangan, dan gangguan.

---

## Mengapa Network Security Penting?

Jaringan adalah pintu masuk utama ke hampir semua sistem. Tanpa network security yang baik:

- Data sensitif bisa dicuri dalam perjalanan
- Attacker bisa masuk ke sistem internal
- Serangan DDoS bisa melumpuhkan operasi
- Malware bisa menyebar ke seluruh jaringan

---

## Defense in Depth

**Defense in Depth** adalah strategi keamanan berlapis — tidak bergantung pada satu mekanisme pertahanan saja. Seperti kastil abad pertengahan: parit, tembok luar, tembok dalam, menara jaga.

```
Internet
    ↓
Firewall (perimeter)
    ↓
DMZ (zona semi-terpercaya)
    ↓
IDS/IPS (deteksi intrusi)
    ↓
Internal Network
    ↓
Endpoint Security (antivirus, EDR)
    ↓
Data (enkripsi, access control)
```

---

## Firewall

Firewall adalah sistem yang mengontrol traffic jaringan berdasarkan aturan (rules) yang telah ditentukan.

### Jenis Firewall

**Packet Filter (Stateless)**
Memeriksa setiap packet secara independen berdasarkan IP, port, dan protokol. Cepat tapi tidak bisa track state koneksi.

**Stateful Firewall**
Melacak state koneksi TCP. Tahu apakah packet adalah bagian dari koneksi yang sudah established atau percobaan koneksi baru.

**Application Layer Firewall (Layer 7)**
Bisa inspect konten aplikasi — misalnya block request HTTP dengan pola tertentu.

**Next-Generation Firewall (NGFW)**
Gabungan stateful + DPI (Deep Packet Inspection) + IPS + application awareness.

### Konfigurasi Firewall Dasar (iptables Linux)

```bash
# Lihat rules yang aktif
sudo iptables -L -n -v

# Izinkan traffic yang sudah established
sudo iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT

# Izinkan SSH dari IP tertentu saja
sudo iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 22 -j ACCEPT

# Block semua traffic masuk selain yang sudah diizinkan
sudo iptables -A INPUT -j DROP

# Izinkan outbound traffic
sudo iptables -A OUTPUT -j ACCEPT

# Simpan rules
sudo iptables-save > /etc/iptables/rules.v4
```

---

## IDS dan IPS

### IDS (Intrusion Detection System)
Mendeteksi aktivitas mencurigakan dan memberikan **alert** — tapi tidak mengambil tindakan otomatis.

### IPS (Intrusion Prevention System)
Sama seperti IDS tapi bisa **memblokir** traffic yang mencurigakan secara otomatis.

### Snort — Open Source IDS/IPS

```bash
# Install Snort
sudo apt install snort

# Jalankan dalam mode IDS
sudo snort -A console -i eth0 -c /etc/snort/snort.conf

# Contoh rule Snort
# Detect port scan
alert tcp any any -> $HOME_NET any (msg:"Port Scan Detected"; flags:S; threshold:type both, track by_src, count 20, seconds 5; sid:1000001;)

# Detect SQL injection attempt
alert http any any -> $HTTP_SERVERS $HTTP_PORTS (msg:"SQL Injection Attempt"; content:"' OR '1'='1"; sid:1000002;)
```

---

## VPN (Virtual Private Network)

VPN membuat tunnel terenkripsi antara dua titik — memungkinkan akses jaringan privat melalui jaringan publik (internet).

```
Laptop (rumah) ──── [Encrypted Tunnel] ──── VPN Server ──── Jaringan Kantor
```

### Protokol VPN Umum

| Protokol | Karakteristik |
|----------|---------------|
| **OpenVPN** | Open source, sangat aman, sedikit lambat |
| **WireGuard** | Modern, cepat, kode lebih simpel |
| **IPSec/IKEv2** | Standar enterprise, stabil |
| **L2TP/IPSec** | Lama, masih banyak dipakai |

### Setup WireGuard (Simpel)

```bash
# Install
sudo apt install wireguard

# Generate key pair
wg genkey | tee privatekey | wg pubkey > publickey

# Konfigurasi /etc/wireguard/wg0.conf
[Interface]
Address = 10.0.0.1/24
PrivateKey = <private_key>
ListenPort = 51820

[Peer]
PublicKey = <client_public_key>
AllowedIPs = 10.0.0.2/32

# Aktifkan
sudo wg-quick up wg0
```

---

## Network Segmentation

Memecah jaringan besar menjadi segmen-segmen kecil yang terisolasi. Kalau satu segmen terkompromi, attacker tidak bisa langsung lompat ke segmen lain.

```
Tanpa segmentasi:
[IT] ─── [Finance] ─── [HR] ─── [Servers] (semua dalam satu flat network)
Kalau Finance terkompromi → attacker akses semua

Dengan segmentasi:
[IT VLAN] │ [Finance VLAN] │ [HR VLAN]
              ↓ (harus lewat firewall)
          [Server VLAN]
Kalau Finance terkompromi → attacker stuck di sana
```

---

## Protokol Keamanan Jaringan

### HTTPS (HTTP Secure)
HTTP yang dienkrip dengan TLS. Data antara browser dan server tidak bisa dibaca di tengah jalan.

```bash
# Cek sertifikat SSL
openssl s_client -connect google.com:443 -showcerts
curl -vI https://google.com 2>&1 | grep -E "SSL|TLS|certificate"
```

### SSH (Secure Shell)
Protokol untuk akses remote yang terenkripsi. Pengganti Telnet yang tidak aman.

```bash
# Generate SSH key pair
ssh-keygen -t ed25519 -C "email@example.com"

# Copy public key ke server
ssh-copy-id user@server

# Hardening SSH (/etc/ssh/sshd_config)
PermitRootLogin no
PasswordAuthentication no
Port 2222          # ganti dari port default 22
MaxAuthTries 3
```

---

## Network Monitoring

```bash
# Monitor traffic real-time
sudo tcpdump -i eth0 -n

# Monitor bandwidth per connection
sudo iftop -i eth0

# Lihat semua koneksi aktif
ss -tunapo

# Log DNS queries
sudo tcpdump -i eth0 port 53 -n

# Deteksi ARP spoofing
sudo arpwatch -i eth0
```

---

## Penutup

Network security bukan satu produk atau satu konfigurasi — ini adalah proses berlapis yang terus-menerus. Pasang firewall, segmentasi jaringan, monitor traffic, dan selalu update software adalah langkah-langkah dasar yang harus ada di setiap infrastruktur.

Artikel selanjutnya: **IPv6: Generasi Baru IP Address** — kenapa IPv4 tidak cukup dan bagaimana IPv6 menyelesaikan masalah itu.
