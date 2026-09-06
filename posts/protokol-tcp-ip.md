# Protokol TCP/IP: Cara Data Berpindah di Internet

Setiap kali kamu browsing, streaming, atau kirim email — di balik layar ada serangkaian protokol yang bekerja untuk memastikan data sampai dengan benar. Protokol utamanya adalah **TCP/IP**.

---

## Apa Itu Protokol?

**Protokol** adalah sekumpulan aturan yang disepakati bersama untuk mengatur komunikasi antara perangkat. Sama seperti bahasa — supaya dua orang bisa ngobrol, mereka harus pakai bahasa yang sama.

Dalam jaringan, protokol menentukan:
- Format data yang dikirim
- Cara memulai dan mengakhiri koneksi
- Apa yang harus dilakukan kalau ada error

---

## TCP/IP Model

TCP/IP bukan satu protokol, tapi sekumpulan protokol yang bekerja bersama. Modelnya punya 4 layer:

```
┌──────────────────────┐
│  Application Layer   │  HTTP, FTP, DNS, SMTP
├──────────────────────┤
│  Transport Layer     │  TCP, UDP
├──────────────────────┤
│  Internet Layer      │  IP, ICMP, ARP
├──────────────────────┤
│  Network Access      │  Ethernet, WiFi
└──────────────────────┘
```

---

## TCP (Transmission Control Protocol)

TCP adalah protokol yang **reliable** — memastikan semua data sampai dengan benar dan urut.

### Cara Kerja TCP: Three-Way Handshake

Sebelum bertukar data, TCP melakukan "jabat tangan" tiga langkah:

```
Client                    Server
  |                          |
  |──── SYN ────────────────>|  "Hei, aku mau konek"
  |                          |
  |<─── SYN-ACK ────────────|  "Oke, aku siap"
  |                          |
  |──── ACK ────────────────>|  "Siap, mulai kirim data"
  |                          |
  |<═══ DATA ═══════════════>|  (komunikasi berlangsung)
```

### Fitur TCP
- **Guaranteed delivery** — ada konfirmasi tiap paket diterima
- **Ordering** — data diurutkan kembali kalau datang tidak berurutan
- **Flow control** — mencegah pengirim terlalu cepat membanjiri penerima
- **Error checking** — deteksi dan retransmit paket yang hilang

### Kapan Pakai TCP?
Gunakan TCP ketika **akurasi lebih penting daripada kecepatan**:
- Web browsing (HTTP/HTTPS)
- Email (SMTP, IMAP)
- Transfer file (FTP)
- SSH

---

## UDP (User Datagram Protocol)

UDP adalah protokol yang **cepat tapi tidak reliable** — tidak ada konfirmasi, tidak ada jaminan data sampai.

### Karakteristik UDP
- Tidak ada handshake
- Tidak ada konfirmasi penerimaan
- Tidak ada ordering
- **Jauh lebih cepat dari TCP**

### Kapan Pakai UDP?
Gunakan UDP ketika **kecepatan lebih penting daripada akurasi**:
- Video streaming (Netflix, YouTube)
- Video call (Zoom, Google Meet)
- Online gaming
- DNS lookup

> Kalau kamu nonton YouTube dan ada frame yang skip — itu UDP. Data yang hilang tidak di-retransmit, langsung lanjut ke frame berikutnya.

---

## Protokol Penting Lainnya

### IP (Internet Protocol)
Bertugas mengalamati dan me-routing paket dari sumber ke tujuan. Setiap paket punya IP header yang berisi IP source dan destination.

### ICMP (Internet Control Message Protocol)
Digunakan untuk diagnostik dan error reporting. Tool `ping` menggunakan ICMP.

```bash
# Test koneksi ke google.com
ping google.com

# Output:
# PING google.com: 56 data bytes
# 64 bytes from 142.250.4.102: icmp_seq=0 ttl=117 time=12.3 ms
```

### ARP (Address Resolution Protocol)
Mengubah IP address menjadi MAC address. Ketika router tahu IP tujuan, dia perlu tahu MAC address perangkat itu untuk pengiriman di layer 2.

### DNS (Domain Name System)
Mengubah nama domain menjadi IP address.

```
kamu ketik: google.com
DNS resolve: 142.250.4.102
browser konek ke: 142.250.4.102
```

---

## Port Number

Port adalah angka yang mengidentifikasi layanan spesifik dalam sebuah perangkat. Satu IP address bisa punya ribuan layanan berbeda yang berjalan lewat port berbeda.

| Port | Protokol | Layanan |
|------|----------|---------|
| 20, 21 | TCP | FTP |
| 22 | TCP | SSH |
| 25 | TCP | SMTP (email) |
| 53 | TCP/UDP | DNS |
| 80 | TCP | HTTP |
| 443 | TCP | HTTPS |
| 3306 | TCP | MySQL |

---

## Penutup

TCP/IP adalah bahasa universal internet. Memahami cara kerjanya membuat kamu bisa troubleshoot masalah koneksi dengan lebih sistematis, dan jadi fondasi penting sebelum masuk ke topik keamanan jaringan.

Artikel selanjutnya: **DNS, DHCP, dan NAT** — tiga layanan yang diam-diam bekerja keras di balik setiap koneksi kamu.
