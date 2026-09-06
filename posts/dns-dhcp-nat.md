# DNS, DHCP, dan NAT: Tiga Layanan yang Bekerja Diam-Diam

Setiap kali kamu konek ke WiFi dan langsung bisa browsing internet — ada tiga layanan yang bekerja di balik layar tanpa kamu sadari: **DNS**, **DHCP**, dan **NAT**. Mari kenalan satu per satu.

---

## DNS (Domain Name System)

### Masalah yang Dipecahkan

Komputer berkomunikasi menggunakan IP address, bukan nama. Tapi manusia lebih mudah mengingat `google.com` daripada `142.250.4.102`. DNS adalah "buku telepon" internet yang mengubah nama domain menjadi IP address.

### Cara Kerja DNS

```
1. Kamu ketik: google.com di browser
2. Browser tanya ke DNS Resolver (biasanya dari ISP atau 8.8.8.8)
3. DNS Resolver cek cache-nya
4. Kalau tidak ada, tanya ke Root DNS Server
5. Root Server arahkan ke TLD Server (.com)
6. TLD Server arahkan ke Authoritative DNS google.com
7. Authoritative DNS jawab: "142.250.4.102"
8. Browser konek ke 142.250.4.102
```

Proses ini terjadi dalam **milidetik** dan hasilnya di-cache supaya tidak perlu diulang terus.

### Jenis Record DNS

| Record | Fungsi |
|--------|--------|
| **A** | Domain → IPv4 address |
| **AAAA** | Domain → IPv6 address |
| **CNAME** | Alias domain ke domain lain |
| **MX** | Server email untuk domain |
| **NS** | Name server untuk domain |
| **TXT** | Data teks (verifikasi, SPF, dll) |

### Cek DNS dari Terminal

```bash
# Cek IP dari domain
nslookup google.com

# Lebih detail
dig google.com

# Cek record MX (email server)
dig google.com MX

# Pakai DNS server tertentu (Google: 8.8.8.8)
nslookup google.com 8.8.8.8
```

### DNS Publik yang Populer

| Provider | DNS Primary | DNS Secondary |
|----------|-------------|---------------|
| Google | 8.8.8.8 | 8.8.4.4 |
| Cloudflare | 1.1.1.1 | 1.0.0.1 |
| OpenDNS | 208.67.222.222 | 208.67.220.220 |

---

## DHCP (Dynamic Host Configuration Protocol)

### Masalah yang Dipecahkan

Bayangkan kamu harus setting IP address secara manual di setiap perangkat yang konek ke jaringan. Di kantor dengan 200 komputer, itu mimpi buruk. DHCP mengotomasi proses ini.

### Apa yang DHCP Berikan?

Ketika perangkat konek ke jaringan, DHCP server otomatis memberikan:
- **IP Address** — alamat unik untuk perangkat
- **Subnet Mask** — pembagian network/host
- **Default Gateway** — alamat router
- **DNS Server** — untuk resolusi nama domain
- **Lease Time** — berapa lama IP dipinjamkan

### Proses DHCP (DORA)

```
Client                    DHCP Server
  |                            |
  |── DISCOVER ───────────────>|  "Ada DHCP server tidak?"
  |                            |
  |<── OFFER ─────────────────|  "Ada! Nih IP 192.168.1.50"
  |                            |
  |── REQUEST ────────────────>|  "Oke, aku pakai itu ya"
  |                            |
  |<── ACK ───────────────────|  "Deal, valid 24 jam"
```

> **D**iscover → **O**ffer → **R**equest → **A**ck = **DORA**

### DHCP Static vs Dynamic

- **Dynamic** — IP diberikan dari pool, bisa berubah setiap koneksi
- **Static (Reservation)** — IP tertentu selalu diberikan ke MAC address tertentu. Berguna untuk printer, server, atau perangkat yang harus punya IP tetap.

---

## NAT (Network Address Translation)

### Masalah yang Dipecahkan

IPv4 hanya punya ~4.3 miliar address. Di dunia dengan miliaran perangkat, itu tidak cukup. NAT memungkinkan **banyak perangkat berbagi satu IP publik**.

### Cara Kerja NAT

```
Jaringan Rumah (IP Private)        Internet (IP Public)

HP:      192.168.1.10  ─┐
Laptop:  192.168.1.11  ─┤── Router ──── 203.0.113.5 ───> Google
TV:      192.168.1.12  ─┘  (NAT)         (IP Publik)
```

Router menyimpan tabel translasi:

| IP Private | Port Private | IP Public | Port Public | Tujuan |
|------------|-------------|-----------|-------------|--------|
| 192.168.1.10 | 54321 | 203.0.113.5 | 10001 | 142.250.4.102:443 |
| 192.168.1.11 | 54322 | 203.0.113.5 | 10002 | 142.250.4.102:443 |

### Jenis NAT

- **SNAT (Source NAT)** — mengubah IP sumber. Yang paling umum dipakai di rumah/kantor.
- **DNAT (Destination NAT)** — mengubah IP tujuan. Dipakai untuk port forwarding — misalnya buka akses server dari luar.
- **PAT (Port Address Translation)** — NAT dengan port mapping. Inilah yang dipakai router rumahan.

---

## Ketiga Layanan Ini Bekerja Bersama

Simulasi: Laptop baru konek ke WiFi kantor dan buka website.

```
1. DHCP  → Laptop dapat IP 192.168.1.50, gateway 192.168.1.1, DNS 8.8.8.8
2. DNS   → Laptop tanya 8.8.8.8: "IP-nya github.com apa?"
           DNS jawab: "140.82.121.4"
3. NAT   → Request dari 192.168.1.50 ditranslasi ke IP publik kantor
4. Data balik → NAT translasi balik ke 192.168.1.50
5. Halaman    → muncul di browser laptop
```

---

## Penutup

DNS, DHCP, dan NAT adalah trio layanan yang membuat jaringan modern bisa berjalan dengan nyaman. Mereka bekerja begitu mulus sampai kita sering tidak sadar mereka ada — sampai salah satunya bermasalah.

Kalau internet tiba-tiba tidak jalan, cek tiga hal ini dulu sebelum panik: IP address (DHCP), resolusi DNS, dan koneksi ke gateway (NAT/Router).
