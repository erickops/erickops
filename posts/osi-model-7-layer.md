# OSI Model: Memahami 7 Layer Jaringan

OSI Model adalah salah satu konsep paling fundamental dalam jaringan komputer. Hampir semua topik jaringan yang lebih advanced akan merujuk ke model ini. Jadi, pahami ini dengan baik.

---

## Apa Itu OSI Model?

**OSI (Open Systems Interconnection) Model** adalah kerangka konseptual yang membagi proses komunikasi jaringan menjadi **7 lapisan (layer)**. Setiap layer punya tugas spesifik dan berkomunikasi dengan layer di atas dan bawahnya.

Tujuannya: membuat standar universal supaya perangkat dari vendor yang berbeda tetap bisa berkomunikasi satu sama lain.

---

## 7 Layer OSI

```
┌─────────────────────────────┐
│  7. Application Layer       │  ← yang kita lihat (HTTP, FTP, DNS)
├─────────────────────────────┤
│  6. Presentation Layer      │  ← format data, enkripsi
├─────────────────────────────┤
│  5. Session Layer           │  ← manajemen sesi komunikasi
├─────────────────────────────┤
│  4. Transport Layer         │  ← TCP/UDP, port
├─────────────────────────────┤
│  3. Network Layer           │  ← IP address, routing
├─────────────────────────────┤
│  2. Data Link Layer         │  ← MAC address, switch
├─────────────────────────────┤
│  1. Physical Layer          │  ← kabel, sinyal fisik
└─────────────────────────────┘
```

> **Tips hafal:** "**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing" (Application, Presentation, Session, Transport, Network, Data Link, Physical)

---

## Penjelasan Tiap Layer

### Layer 7 — Application
Layer yang paling dekat dengan pengguna. Ini bukan aplikasi yang kita jalankan, tapi **protokol** yang digunakan aplikasi untuk komunikasi.

Contoh protokol: `HTTP/HTTPS`, `FTP`, `SMTP`, `DNS`, `SSH`

Ketika kamu buka browser dan ketik `google.com`, Layer 7 yang handle request HTTP-nya.

### Layer 6 — Presentation
Bertugas mengubah format data supaya bisa dipahami oleh Application Layer. Termasuk:
- **Enkripsi/dekripsi** (SSL/TLS)
- **Kompresi** data
- **Konversi format** (JPEG, MP4, ASCII)

### Layer 5 — Session
Mengatur, memulai, dan mengakhiri sesi komunikasi antara dua perangkat. Kalau kamu buka 3 tab browser sekaligus, Session Layer yang track masing-masing koneksinya.

### Layer 4 — Transport
Bertanggung jawab atas **pengiriman data end-to-end** yang reliable.

| Protokol | Karakteristik |
|----------|---------------|
| **TCP** | Reliable, ada konfirmasi penerimaan, lambat |
| **UDP** | Tidak reliable, tidak ada konfirmasi, cepat |

TCP dipakai untuk: web browsing, email, file transfer.
UDP dipakai untuk: video streaming, gaming online, DNS.

Layer ini juga menggunakan **port number** untuk identifikasi layanan:
- Port 80 → HTTP
- Port 443 → HTTPS
- Port 22 → SSH

### Layer 3 — Network
Bertugas menentukan **jalur terbaik** untuk mengirim data dari sumber ke tujuan. Ini tempat **IP address** bekerja.

- Protokol utama: **IP (Internet Protocol)**
- Perangkat: **Router**
- Data unit: **Packet**

### Layer 2 — Data Link
Mengatur komunikasi antar perangkat dalam **satu jaringan lokal (LAN)**. Menggunakan **MAC address** sebagai identifikasi.

- Perangkat: **Switch**
- Data unit: **Frame**
- Protokol: Ethernet, Wi-Fi (802.11)

### Layer 1 — Physical
Layer paling bawah. Bertugas transmisi bit (0 dan 1) secara fisik.

- Media: kabel UTP, fiber optic, sinyal WiFi
- Perangkat: Hub, kabel, konektor, NIC
- Data unit: **Bit**

---

## Contoh Nyata: Kamu Buka Website

```
Browser kirim request ke google.com

Layer 7  → HTTP request dibuat
Layer 6  → data dienkrip (HTTPS/TLS)
Layer 5  → sesi TCP dibuka
Layer 4  → data dibagi per segment, pakai port 443
Layer 3  → ditambahkan IP source & destination
Layer 2  → ditambahkan MAC address
Layer 1  → dikirim sebagai sinyal listrik/cahaya/radio

... perjalanan melalui jaringan ...

Di sisi server, prosesnya terbalik (Layer 1 → Layer 7)
```

---

## OSI vs TCP/IP Model

Di dunia nyata, yang lebih sering dipakai adalah **TCP/IP Model** yang hanya punya 4 layer. Tapi OSI tetap dipakai sebagai referensi konseptual karena lebih detail.

| TCP/IP Model | OSI Layer |
|-------------|-----------|
| Application | Layer 5, 6, 7 |
| Transport | Layer 4 |
| Internet | Layer 3 |
| Network Access | Layer 1, 2 |

---

## Penutup

OSI Model mungkin terasa abstrak di awal, tapi semakin kamu belajar jaringan, semakin sering kamu akan kembali ke model ini. Setiap kali troubleshoot masalah jaringan, berpikir dalam konteks "layer mana yang bermasalah?" sangat membantu.

Artikel selanjutnya: **IP Address dan Subnetting** — dua hal yang wajib dikuasai siapapun yang serius belajar jaringan.
