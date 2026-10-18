# Wireless Networking: Cara Kerja WiFi

Hampir semua perangkat yang kita pakai sekarang terhubung secara wireless. Tapi bagaimana sebenarnya WiFi bekerja? Apa yang terjadi dari kamu klik "Connect" sampai data kamu sampai ke internet?

---

## Apa Itu Wireless Networking?

**Wireless networking** adalah teknologi jaringan yang menggunakan gelombang radio sebagai media transmisi, menggantikan kabel fisik. Standar yang paling banyak digunakan adalah **IEEE 802.11** — yang kita kenal sebagai **WiFi**.

---

## Standar WiFi: Generasi ke Generasi

Standar WiFi terus berkembang, masing-masing generasi membawa peningkatan kecepatan dan efisiensi:

| Standar | Nama | Frekuensi | Kecepatan Maks | Tahun |
|---------|------|-----------|----------------|-------|
| 802.11b | WiFi 1 | 2.4 GHz | 11 Mbps | 1999 |
| 802.11a | WiFi 2 | 5 GHz | 54 Mbps | 1999 |
| 802.11g | WiFi 3 | 2.4 GHz | 54 Mbps | 2003 |
| 802.11n | WiFi 4 | 2.4/5 GHz | 600 Mbps | 2009 |
| 802.11ac | WiFi 5 | 5 GHz | 3.5 Gbps | 2013 |
| 802.11ax | WiFi 6 | 2.4/5/6 GHz | 9.6 Gbps | 2019 |
| 802.11be | WiFi 7 | 2.4/5/6 GHz | 46 Gbps | 2024 |

---

## Frekuensi: 2.4 GHz vs 5 GHz

Ini salah satu topik yang paling sering membingungkan pemula.

### 2.4 GHz
- **Jangkauan lebih jauh** — gelombang panjang menembus dinding lebih baik
- **Kecepatan lebih lambat**
- **Lebih padat** — banyak perangkat dan router tetangga pakai frekuensi ini
- **12 channel** tapi hanya **3 yang non-overlapping** (1, 6, 11)

### 5 GHz
- **Kecepatan lebih tinggi** — bandwidth lebih lebar
- **Jangkauan lebih pendek** — kurang menembus halangan
- **Lebih bersih** — lebih sedikit interferensi
- **23 channel non-overlapping**

### Kapan Pilih Mana?

```
2.4 GHz: perangkat jauh dari router, banyak dinding, IoT devices
5 GHz:   perangkat dekat router, butuh kecepatan tinggi (streaming, gaming)
```

---

## Komponen Jaringan Wireless

### Access Point (AP)
Perangkat yang mentransmisikan sinyal WiFi. Router rumahan biasanya sudah built-in AP.

### SSID (Service Set Identifier)
Nama jaringan WiFi yang tampil ketika kamu scan jaringan. SSID bisa di-*hide* tapi ini tidak membuat jaringan aman — hanya tidak terlihat di scan biasa.

### BSSID
MAC address dari Access Point. Tiap AP punya BSSID unik.

### Channel
Frekuensi spesifik dalam band 2.4 GHz atau 5 GHz yang dipakai untuk transmisi. Pilih channel yang tidak overlap dengan tetangga untuk performa optimal.

---

## Cara Kerja WiFi: Association Process

Sebelum bisa pakai WiFi, perangkat kamu harus melewati proses asosiasi:

```
1. SCANNING
   Perangkat scan semua channel untuk cari AP
   AP broadcast "Beacon Frame" setiap 100ms (berisi SSID, kapabilitas)

2. AUTHENTICATION
   Perangkat kirim Authentication Request ke AP
   AP balas dengan Authentication Response

3. ASSOCIATION
   Perangkat kirim Association Request
   AP assign Association ID (AID) dan balas Association Response

4. IP ASSIGNMENT
   DHCP assign IP address ke perangkat

5. CONNECTED ✓
```

---

## Keamanan WiFi

### WEP (Wired Equivalent Privacy) — JANGAN PAKAI
Enkripsi lama yang sudah terbukti lemah. Bisa di-crack dalam hitungan menit.

### WPA (Wi-Fi Protected Access)
Pengganti WEP dengan enkripsi lebih kuat, tapi masih ada kelemahan.

### WPA2 — Standar Minimum
Menggunakan enkripsi **AES**. Ini standar minimum yang harus dipakai. Ada dua mode:
- **WPA2-Personal (PSK)** — pakai passphrase, untuk rumah/SOHO
- **WPA2-Enterprise** — pakai server autentikasi (RADIUS), untuk korporat

### WPA3 — Standar Terbaru
Lebih aman dari WPA2, terutama untuk proteksi terhadap brute force offline.

```bash
# Cek keamanan WiFi di Linux
nmcli dev wifi list
iwlist wlan0 scan | grep -E "ESSID|Encryption|IE"
```

---

## Channel Interference

Salah satu penyebab WiFi lambat yang sering diabaikan adalah **channel interference** — banyak AP di sekitar pakai channel yang sama.

```bash
# Scan AP di sekitar dan channel yang dipakai
sudo iwlist wlan0 scan | grep -E "ESSID|Channel|Frequency"

# Linux
sudo apt install wavemon
wavemon

# Windows
netsh wlan show networks mode=bssid
```

Tips: pakai app **WiFi Analyzer** (Android) untuk visualisasi channel yang padat di sekitar kamu.

---

## Roaming Wireless

Di jaringan enterprise dengan banyak AP, perangkat bisa *roam* — berpindah dari satu AP ke AP lain tanpa putus koneksi.

```
AP-1 (lantai 1) ──── Backbone ──── AP-2 (lantai 2)
        ↑                                 ↑
    Laptop di                      Laptop pindah
    lantai 1                       ke lantai 2
                                   (seamless roam)
```

Roaming yang mulus membutuhkan konfigurasi yang tepat:
- Semua AP pakai SSID yang sama
- Channel yang berbeda antar AP berdekatan
- Overlap coverage ~15-20% antar AP

---

## Troubleshoot WiFi Umum

```bash
# Cek interface wireless
ip link show
iwconfig

# Restart network service
sudo systemctl restart NetworkManager

# Cek sinyal (Linux)
watch -n 1 "iwconfig wlan0 | grep -i quality"

# Forget dan reconnect jaringan
nmcli con delete "NamaWiFi"
nmcli dev wifi connect "NamaWiFi" password "password"
```

---

## Penutup

WiFi adalah teknologi yang kelihatannya sederhana dari sisi pengguna tapi sangat kompleks di balik layar. Memahami cara kerjanya membantu kamu troubleshoot masalah koneksi lebih efektif, dan menjadi dasar penting sebelum masuk ke topik wireless security.

Artikel selanjutnya: **Network Security Fundamentals** — konsep dasar keamanan jaringan yang wajib diketahui.
