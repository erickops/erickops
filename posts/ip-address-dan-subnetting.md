# IP Address dan Subnetting: Dari Nol Sampai Paham

IP address adalah alamat yang digunakan setiap perangkat dalam jaringan untuk saling kenal dan berkomunikasi. Tanpa IP address, router tidak tahu harus mengirim data ke mana.

---

## Apa Itu IP Address?

**IP Address (Internet Protocol Address)** adalah identitas numerik yang diberikan ke setiap perangkat dalam jaringan. Seperti alamat rumah — supaya paket data tahu harus dikirim ke mana.

Ada dua versi IP address yang digunakan saat ini:
- **IPv4** — format lama, 32-bit, contoh: `192.168.1.100`
- **IPv6** — format baru, 128-bit, contoh: `2001:0db8:85a3::8a2e:0370:7334`

Di artikel ini kita fokus ke **IPv4** karena masih paling banyak digunakan.

---

## Struktur IPv4

IPv4 terdiri dari **4 oktet** yang dipisahkan titik, masing-masing bernilai 0–255:

```
192  .  168  .   1   .  100
 ↑        ↑       ↑      ↑
oktet1  oktet2  oktet3  oktet4
(8 bit) (8 bit) (8 bit) (8 bit)
         total = 32 bit
```

Setiap oktet dalam bentuk biner:

```
192 = 11000000
168 = 10101000
  1 = 00000001
100 = 01100100
```

---

## Kelas IP Address

IPv4 dibagi menjadi beberapa kelas berdasarkan rentang nilai oktet pertama:

| Kelas | Range | Default Subnet Mask | Penggunaan |
|-------|-------|---------------------|------------|
| A | 1–126 | 255.0.0.0 (/8) | Jaringan sangat besar |
| B | 128–191 | 255.255.0.0 (/16) | Jaringan menengah |
| C | 192–223 | 255.255.255.0 (/24) | Jaringan kecil |

---

## IP Private vs IP Public

### IP Private
Digunakan di dalam jaringan lokal (LAN), tidak bisa diakses langsung dari internet.

| Range | Kelas |
|-------|-------|
| 10.0.0.0 – 10.255.255.255 | A |
| 172.16.0.0 – 172.31.255.255 | B |
| 192.168.0.0 – 192.168.255.255 | C |

### IP Public
Digunakan untuk komunikasi di internet. Diberikan oleh ISP (Internet Service Provider).

---

## Subnet Mask

Subnet mask menentukan bagian mana dari IP address yang merupakan **network** dan bagian mana yang merupakan **host**.

```
IP Address  : 192.168.1.100
Subnet Mask : 255.255.255.0
              ↑↑↑↑↑↑↑↑↑↑↑↑  ← bagian network
                           ↑  ← bagian host
```

Dalam notasi CIDR: `192.168.1.100/24` berarti 24 bit pertama adalah network.

---

## Subnetting

Subnetting adalah proses memecah satu jaringan besar menjadi beberapa jaringan kecil (subnet).

### Kenapa Perlu Subnetting?
- **Efisiensi** — tidak buang-buang IP address
- **Keamanan** — memisahkan segmen jaringan
- **Manajemen** — lebih mudah dikelola

### Contoh Subnetting

**Soal:** Punya network `192.168.10.0/24`, bagi jadi 4 subnet.

**Langkah 1:** 4 subnet = 2² → butuh 2 bit tambahan → prefix baru: `/26`

**Langkah 2:** Tiap subnet punya 2⁶ = 64 address (62 host yang bisa dipakai)

| Subnet | Network | Broadcast | Host Range |
|--------|---------|-----------|------------|
| 1 | 192.168.10.0/26 | 192.168.10.63 | .1 – .62 |
| 2 | 192.168.10.64/26 | 192.168.10.127 | .65 – .126 |
| 3 | 192.168.10.128/26 | 192.168.10.191 | .129 – .190 |
| 4 | 192.168.10.192/26 | 192.168.10.255 | .193 – .254 |

### Rumus Cepat

```
Jumlah subnet  = 2^n     (n = bit yang dipinjam)
Jumlah host    = 2^h - 2 (h = bit yang tersisa)
Block size     = 256 - nilai oktet subnet mask
```

---

## Cek IP Address di Komputer

```bash
# Linux / Mac
ip addr show
# atau
ifconfig

# Windows (CMD)
ipconfig

# Windows (PowerShell)
Get-NetIPAddress
```

---

## Penutup

IP address dan subnetting adalah topik yang perlu waktu untuk benar-benar melekat. Cara terbaik belajarnya: **latihan soal setiap hari**. Mulai dari /24, /25, lalu naik ke /27, /28, /30.

Artikel selanjutnya: **Protokol TCP/IP** — bagaimana data benar-benar berpindah dari satu perangkat ke perangkat lain.
