# IPv6: Generasi Baru IP Address

IPv4 punya sekitar 4.3 miliar address. Di tahun 2011, IANA (Internet Assigned Numbers Authority) mengumumkan bahwa pool IPv4 global sudah habis. Solusinya: **IPv6** — sistem pengalamatan baru yang dirancang untuk mengatasi keterbatasan IPv4.

---

## Masalah dengan IPv4

IPv4 menggunakan 32-bit address → total **4.294.967.296** address (~4.3 miliar).

Dengan lebih dari 8 miliar manusia di bumi, ditambah miliaran perangkat IoT, smartphone, laptop, smart TV, dan lainnya — 4.3 miliar jelas tidak cukup.

Solusi sementara yang sudah dipakai:
- **NAT** — banyak perangkat berbagi satu IP publik (sudah dibahas sebelumnya)
- **Private IP** — jaringan lokal pakai range private
- **ISP** — reuse IP yang sudah tidak dipakai

Tapi solusi ini hanya menunda masalah. IPv6 adalah solusi permanennya.

---

## IPv6: Angka yang Tidak Habis Pikir

IPv6 menggunakan **128-bit** address → total **340 undecillion** address:

```
340.282.366.920.938.463.463.374.607.431.768.211.456
```

Untuk gambaran: kalau IPv4 adalah segelas air, IPv6 adalah seluruh lautan di bumi — dikalikan jutaan kali.

Cukup untuk memberikan **miliaran IP address ke setiap atom di permukaan bumi**.

---

## Format IPv6

IPv6 ditulis sebagai **8 kelompok 4 digit heksadesimal**, dipisahkan titik dua:

```
2001:0db8:85a3:0000:0000:8a2e:0370:7334
```

### Aturan Penyederhanaan

```
# Aturan 1: Hilangkan leading zeros dalam satu kelompok
2001:0db8:0000:0000:0000:0000:0000:0001
→ 2001:db8:0:0:0:0:0:1

# Aturan 2: Ganti satu grup atau lebih yang berisi 0000 dengan ::
# (hanya bisa dipakai sekali)
2001:db8:0:0:0:0:0:1
→ 2001:db8::1

# Contoh lebih lanjut
fe80:0000:0000:0000:0202:b3ff:fe1e:8329
→ fe80::202:b3ff:fe1e:8329
```

---

## Tipe Address IPv6

### Global Unicast Address
Setara dengan IP public IPv4. Bisa diakses dari internet.

```
Prefix: 2000::/3
Contoh: 2001:db8:1234:5678::1
```

### Link-Local Address
Hanya valid dalam satu link (segment jaringan). Otomatis di-generate oleh setiap interface.

```
Prefix: fe80::/10
Contoh: fe80::1
```

### Loopback
Setara 127.0.0.1 di IPv4.

```
::1
```

### Multicast
Mengirim ke banyak tujuan sekaligus (bukan broadcast seperti IPv4).

```
Prefix: ff00::/8
ff02::1  → semua node di link
ff02::2  → semua router di link
```

### Unique Local Address (ULA)
Setara IP private IPv4 — untuk komunikasi internal, tidak dirutekan ke internet.

```
Prefix: fc00::/7
Contoh: fd00::1
```

---

## Perbedaan IPv4 vs IPv6

| Aspek | IPv4 | IPv6 |
|-------|------|------|
| **Panjang address** | 32-bit | 128-bit |
| **Notasi** | Desimal bertitik | Heksadesimal titik dua |
| **Jumlah address** | ~4.3 miliar | ~340 undecillion |
| **Header** | Variabel, 20-60 byte | Fixed, 40 byte |
| **Broadcast** | Ada | Tidak ada (diganti multicast) |
| **NAT** | Diperlukan | Tidak diperlukan |
| **Auto-konfigurasi** | Butuh DHCP | SLAAC built-in |
| **IPSec** | Opsional | Didesain built-in |
| **Checksum di header** | Ada | Tidak ada (efisiensi) |

---

## SLAAC: Auto-Konfigurasi IPv6

Salah satu fitur keren IPv6 adalah **SLAAC (Stateless Address Autoconfiguration)** — perangkat bisa generate IP address-nya sendiri tanpa DHCP server!

Caranya:
1. Perangkat generate **link-local address** dari MAC address
2. Perangkat kirim **Router Solicitation** ke router
3. Router balas dengan **Router Advertisement** (berisi network prefix)
4. Perangkat combine prefix + interface ID → IP address lengkap

```
Router prefix:    2001:db8:1234::/64
Interface ID:     dari MAC address (EUI-64)
Result:           2001:db8:1234::202:b3ff:fe1e:8329
```

---

## IPv6 di Kehidupan Nyata

```bash
# Cek IPv6 address di Linux
ip -6 addr show
ifconfig | grep inet6

# Ping IPv6
ping6 ::1               # loopback
ping6 fe80::1%eth0      # link-local (butuh interface name)
ping6 2001:4860:4860::8888  # Google DNS IPv6

# Traceroute IPv6
traceroute6 ipv6.google.com

# Cek apakah koneksi kamu support IPv6
curl -6 ifconfig.me

# DNS record IPv6 (AAAA record)
dig AAAA google.com
nslookup -type=AAAA google.com
```

---

## Transisi IPv4 ke IPv6

Karena tidak bisa langsung switch semua jaringan sekaligus, ada beberapa mekanisme transisi:

### Dual Stack
Perangkat punya kedua IPv4 dan IPv6 secara bersamaan. Ini yang paling umum dipakai saat ini.

### Tunneling
IPv6 packet di-enkapsulasi dalam IPv4 packet untuk melewati jaringan yang belum support IPv6.

### Translation (NAT64)
Memungkinkan perangkat IPv6-only berkomunikasi dengan server IPv4-only.

---

## Status Adopsi IPv6

IPv6 adopsi terus meningkat:
- **Google** melaporkan ~45% traffic sudah pakai IPv6 (2024)
- Banyak ISP di Indonesia sudah support dual-stack
- Semua cloud provider major sudah support IPv6
- Mobile network (4G/5G) banyak yang native IPv6

---

## Penutup

IPv6 bukan lagi teknologi masa depan — ini teknologi sekarang yang sudah berjalan di sebagian besar infrastruktur internet. Memahami IPv6 adalah skill yang semakin penting, terutama kalau kamu bekerja di networking atau sistem administrasi.

Topik network selanjutnya akan masuk ke area yang lebih praktis: konfigurasi dan manajemen jaringan di lingkungan nyata.
