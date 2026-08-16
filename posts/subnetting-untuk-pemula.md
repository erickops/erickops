# Subnetting untuk Pemula: Dari Bingung Sampai Paham

Subnetting adalah salah satu topik yang hampir selalu bikin pusing orang yang baru belajar jaringan. Kelihatannya ribet, penuh angka, dan susah dibayangin. Tapi sebenarnya kalau sudah ngerti konsep dasarnya — semuanya jatuh ke tempatnya masing-masing.

Ini catatan dari cara aku belajar subnetting sendiri. Bukan cara tercepat, tapi cara yang paling masuk ke kepala.

---

## Apa Itu Subnetting?

Subnetting adalah proses membagi satu jaringan besar menjadi beberapa jaringan kecil (subnet). Tujuannya:

- **Efisiensi penggunaan IP** — biar tidak buang-buang address
- **Keamanan** — memisahkan segmen jaringan
- **Manajemen** — lebih mudah dikelola

---

## Dulu Pahami Dulu: Struktur IP Address

IP address (IPv4) adalah angka 32-bit yang ditulis dalam 4 oktet:

```
192.168.1.100
 |   |  | |
 8   8  8 8 bit
```

Tiap oktet bisa bernilai 0–255. Jadi total kombinasi ada **2^32 = ~4.3 miliar** address.

### Binary itu kunci

Sebelum subnetting, harus nyaman dulu konversi desimal ke biner:

| Desimal | Biner    |
|---------|----------|
| 192     | 11000000 |
| 168     | 10101000 |
| 1       | 00000001 |
| 100     | 01100100 |

---

## Subnet Mask

Subnet mask menentukan bagian mana dari IP yang adalah **network** dan mana yang **host**.

Contoh subnet mask umum:

| CIDR | Subnet Mask     | Jumlah Host |
|------|-----------------|-------------|
| /8   | 255.0.0.0       | 16,777,214  |
| /16  | 255.255.0.0     | 65,534      |
| /24  | 255.255.255.0   | 254         |
| /30  | 255.255.255.252 | 2           |

### CIDR Notation

`/24` artinya 24 bit pertama adalah bagian network. Sisanya (8 bit) untuk host.

```
192.168.1.0/24
             ^
             8 bit untuk host = 2^8 - 2 = 254 usable hosts
             (dikurangi 2 karena network address & broadcast)
```

---

## Cara Hitung Subnet

### Contoh soal:

> Kamu punya network `192.168.10.0/24`. Bagi jadi 4 subnet yang sama besar.

**Langkah 1:** Kita butuh 4 subnet → perlu **2 bit tambahan** (2² = 4)

New prefix: `/24 + 2 = /26`

**Langkah 2:** Hitung range tiap subnet:

`/26` = 64 address per subnet (2^6)

| Subnet | Network Address   | Broadcast         | Usable Range              |
|--------|-------------------|-------------------|---------------------------|
| 1      | 192.168.10.0/26   | 192.168.10.63     | .1 – .62 (62 hosts)       |
| 2      | 192.168.10.64/26  | 192.168.10.127    | .65 – .126 (62 hosts)     |
| 3      | 192.168.10.128/26 | 192.168.10.191    | .129 – .190 (62 hosts)    |
| 4      | 192.168.10.192/26 | 192.168.10.255    | .193 – .254 (62 hosts)    |

---

## Rumus Cepat

```
Jumlah subnet  = 2^n      (n = bit yang dipinjam)
Jumlah host    = 2^h - 2  (h = bit yang tersisa)
Block size     = 256 - nilai oktet subnet mask
```

---

## Tips Belajar

> "Latihan 10 soal sehari selama seminggu lebih efektif dari baca teori sehari penuh."

Cara yang aku pakai:

1. Hafal nilai bit per posisi: `128, 64, 32, 16, 8, 4, 2, 1`
2. Latihan konversi desimal-biner sampai otomatis
3. Kerjakan soal dari yang mudah (`/24`, `/25`) lalu naik ke `/27`, `/28`, `/30`
4. Gunakan tools seperti `ipcalc` atau `sipcalc` di Linux untuk verifikasi

```bash
# install ipcalc
sudo apt install ipcalc

# contoh penggunaan
ipcalc 192.168.10.0/26
```

---

## Penutup

Subnetting bukan sihir. Ini matematika sederhana yang perlu waktu untuk jadi otomatis. Kalau kamu merasa bingung sekarang, itu normal — semua orang yang pernah belajar ini merasakan hal yang sama.

Yang penting: jangan stop. Ulangi, latihan, dan suatu hari akan ada momen di mana semuanya tiba-tiba jelas.

Kalau ada yang mau ditanya atau ada bagian yang kurang jelas, drop di sini.
