# Troubleshooting Jaringan: Pendekatan Sistematis

Jaringan bermasalah adalah salah satu hal paling frustrasi di dunia IT. Tapi dengan pendekatan yang sistematis, hampir semua masalah jaringan bisa didiagnosa dan diperbaiki — bahkan tanpa harus tebak-tebakan.

---

## Prinsip Dasar: Top-Down atau Bottom-Up

Ada dua pendekatan utama dalam troubleshooting jaringan, keduanya mengacu pada **OSI Model**:

### Bottom-Up (Layer 1 → Layer 7)
Mulai dari fisik: cek kabel, lampu indikator, koneksi. Lalu naik ke layer yang lebih tinggi.

**Cocok untuk:** masalah yang tidak diketahui sama sekali, atau masalah fisik yang dicurigai.

### Top-Down (Layer 7 → Layer 1)
Mulai dari aplikasi: apakah website bisa dibuka? Email bisa terkirim? Lalu turun ke layer yang lebih rendah.

**Cocok untuk:** masalah yang spesifik pada aplikasi atau layanan tertentu.

---

## Langkah-Langkah Troubleshooting

### Langkah 1: Define the Problem (Definisikan Masalahnya)

Sebelum melakukan apapun, kumpulkan informasi:

- Apa yang tidak bisa dilakukan? (tidak bisa internet? tidak bisa akses server tertentu?)
- Kapan masalah mulai terjadi?
- Apakah ini hanya di satu perangkat atau semua perangkat?
- Adakah perubahan yang dilakukan sebelum masalah muncul?

### Langkah 2: Gather Information (Kumpulkan Data)

```bash
# Cek IP address kamu
ip addr show          # Linux
ipconfig              # Windows

# Cek routing table
ip route show         # Linux
route print           # Windows

# Cek koneksi aktif
ss -tuln              # Linux
netstat -an           # Windows
```

### Langkah 3: Consider Possible Causes (Pertimbangkan Kemungkinan)

Buat daftar kemungkinan penyebab dari yang paling sederhana ke yang paling kompleks. Biasanya masalah paling sederhana yang jadi penyebabnya.

---

## Tools Troubleshooting Penting

### ping — Test Konektivitas Dasar

```bash
# Test ke Google DNS
ping 8.8.8.8

# Test ke domain (melibatkan DNS juga)
ping google.com

# Ping dengan jumlah tertentu
ping -c 4 8.8.8.8      # Linux (4 kali)
ping -n 4 8.8.8.8      # Windows

# Ping dengan packet size besar (test MTU)
ping -s 1400 8.8.8.8   # Linux
ping -l 1400 8.8.8.8   # Windows
```

Interpretasi hasil:
- **Reply received** → koneksi ke host itu OK
- **Request timeout** → host tidak merespons (bisa diblokir firewall atau tidak ada)
- **Destination unreachable** → tidak ada route ke tujuan

### traceroute / tracert — Lacak Jalur Packet

```bash
traceroute 8.8.8.8     # Linux/Mac
tracert 8.8.8.8        # Windows

# Output:
# 1  192.168.1.1    1 ms   ← router kamu
# 2  10.0.0.1       5 ms   ← router ISP
# 3  * * *                 ← hop yang tidak merespons
# 4  8.8.8.8       15 ms  ← tujuan
```

`* * *` artinya router di hop itu tidak merespons ICMP — tidak selalu berarti bermasalah.

### nslookup / dig — Test DNS

```bash
# Test resolusi DNS
nslookup google.com
dig google.com

# Pakai DNS server spesifik
nslookup google.com 8.8.8.8
dig @8.8.8.8 google.com

# Cek apakah masalah ada di DNS atau koneksi
ping 8.8.8.8          # jika ini berhasil tapi ping google.com gagal
                       # → masalah ada di DNS, bukan koneksi
```

### netstat / ss — Cek Port dan Koneksi

```bash
# Lihat port yang sedang listen
ss -tuln              # Linux
netstat -an | findstr LISTENING   # Windows

# Cek apakah service tertentu jalan
ss -tuln | grep :80   # cek apakah port 80 terbuka
ss -tuln | grep :443  # cek port 443

# Lihat koneksi aktif
ss -tn                # Linux
netstat -n            # Windows
```

### tcpdump / Wireshark — Packet Analysis

```bash
# Capture semua traffic di interface eth0
sudo tcpdump -i eth0

# Filter hanya traffic ke/dari IP tertentu
sudo tcpdump -i eth0 host 8.8.8.8

# Filter berdasarkan port
sudo tcpdump -i eth0 port 80

# Simpan ke file untuk dianalisis di Wireshark
sudo tcpdump -i eth0 -w capture.pcap
```

---

## Skenario dan Solusi Umum

### "Tidak bisa internet, tapi LAN masih jalan"

```
Diagnosa:
1. ping default gateway (192.168.1.1)
   → berhasil? gateway OK
   → gagal? cek kabel ke router, restart router

2. ping IP publik (8.8.8.8)
   → berhasil? koneksi internet OK, masalah di DNS
   → gagal? masalah di router/ISP

3. ping google.com
   → berhasil? semua OK
   → gagal tapi ping 8.8.8.8 OK? masalah DNS
     → coba ganti DNS ke 8.8.8.8

Solusi DNS:
# Windows
netsh interface ip set dns "Ethernet" static 8.8.8.8

# Linux
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
```

### "Bisa ping IP tapi tidak bisa buka website"

```
Kemungkinan masalah:
1. DNS tidak resolve dengan benar
   → nslookup google.com → cek hasilnya

2. Port 80/443 diblokir
   → curl -I https://google.com
   → telnet google.com 443

3. Proxy setting di browser
   → cek setting browser
```

### "Koneksi lambat"

```bash
# Cek latency ke berbagai titik
ping 192.168.1.1      # latency ke router (harusnya <1ms)
ping 8.8.8.8          # latency ke internet
traceroute 8.8.8.8    # cari hop mana yang lambat

# Cek packet loss
ping -c 100 8.8.8.8   # kirim 100 packet, lihat % loss

# Cek bandwidth usage
iftop                  # real-time bandwidth per koneksi (Linux)
nethogs                # bandwidth per process (Linux)
```

---

## Checklist Troubleshooting Cepat

```
Layer 1 — Physical:
  □ Kabel terhubung?
  □ Lampu indikator nyala?
  □ Port switch tidak error?

Layer 2 — Data Link:
  □ MAC address terdaftar di switch? (show mac address-table)
  □ VLAN konfigurasi benar?
  □ Duplex/speed mismatch?

Layer 3 — Network:
  □ IP address terkonfigurasi?
  □ Subnet mask benar?
  □ Default gateway terkonfigurasi?
  □ Routing table benar?

Layer 4-7 — Transport/Application:
  □ Firewall memblokir port?
  □ Service/daemon jalan?
  □ DNS resolve dengan benar?
  □ Aplikasi terkonfigurasi benar?
```

---

## Penutup

Troubleshooting jaringan adalah skill yang diasah lewat pengalaman. Semakin banyak masalah yang kamu selesaikan, semakin cepat kamu bisa identifikasi pola dan menemukan solusi.

Kunci utamanya: **jangan panik, be systematic**. Mulai dari layer paling bawah, eliminasi satu per satu, dan dokumentasikan apa yang kamu temukan.
