# Routing dan Switching: Cara Data Menemukan Jalannya

Setelah paham IP address, DNS, dan TCP/IP — pertanyaan selanjutnya adalah: bagaimana data tahu harus lewat mana untuk sampai ke tujuan? Di sinilah **routing** dan **switching** berperan.

---

## Perbedaan Router vs Switch

Ini pertanyaan yang sering membingungkan pemula. Keduanya adalah perangkat jaringan, tapi tugasnya berbeda:

| | Switch | Router |
|--|--------|--------|
| **Beroperasi di** | Layer 2 (Data Link) | Layer 3 (Network) |
| **Menggunakan** | MAC Address | IP Address |
| **Menghubungkan** | Perangkat dalam satu LAN | Jaringan yang berbeda |
| **Contoh** | PC ↔ Printer dalam satu kantor | LAN kantor ↔ Internet |

Analogi sederhana:
- **Switch** = resepsionis gedung — tahu siapa ada di ruangan mana dalam gedung itu
- **Router** = kantor pos — tahu bagaimana mengirim paket ke gedung/kota yang berbeda

---

## Switching: Bagaimana Switch Bekerja

### MAC Address Table

Switch menyimpan tabel yang memetakan **MAC address** ke **port fisik**-nya. Tabel ini dibangun secara dinamis saat pertama kali perangkat mengirim data.

```
MAC Address Table Switch:
┌──────────────────────┬──────┐
│ MAC Address          │ Port │
├──────────────────────┼──────┤
│ AA:BB:CC:DD:EE:01    │  1   │  ← PC-1
│ AA:BB:CC:DD:EE:02    │  3   │  ← PC-2
│ AA:BB:CC:DD:EE:03    │  5   │  ← Printer
└──────────────────────┴──────┘
```

### Proses Switching

```
1. PC-1 kirim frame ke PC-2
2. Switch terima frame di port 1
3. Switch cek MAC destination: AA:BB:CC:DD:EE:02
4. Switch cari di tabel → ketemu di port 3
5. Switch forward frame HANYA ke port 3
   (bukan ke semua port — ini lebih efisien dari hub)
```

### Flooding, Forwarding, Filtering

- **Flooding** — kalau MAC tujuan belum ada di tabel, frame dikirim ke semua port kecuali port asal
- **Forwarding** — kalau MAC tujuan sudah ada di tabel, frame dikirim ke port yang tepat
- **Filtering** — frame tidak diteruskan jika MAC source dan destination di port yang sama

---

## Routing: Bagaimana Router Bekerja

### Routing Table

Router menyimpan **routing table** — daftar jaringan yang dia tahu beserta interface/next-hop untuk mencapainya.

```bash
# Lihat routing table di Linux
ip route show

# Output contoh:
# default via 192.168.1.1 dev eth0
# 192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100
# 10.0.0.0/8 via 192.168.1.254 dev eth0
```

### Proses Routing

```
PC (192.168.1.100) mau akses server (8.8.8.8)

1. PC cek: apakah 8.8.8.8 ada di network yang sama?
   → 192.168.1.0/24 tidak mencakup 8.8.8.8
   → Kirim ke default gateway: 192.168.1.1 (router)

2. Router terima packet, cek routing table:
   → 8.8.8.8 cocok dengan rule "default via ISP"
   → Forward ke router ISP

3. Router ISP teruskan ke router berikutnya
   → Sampai ke 8.8.8.8 (Google DNS)
```

### Jenis Routing

**Static Routing**
Admin manual tambahkan route ke routing table. Simpel tapi tidak scalable untuk jaringan besar.

```bash
# Tambah static route (Linux)
sudo ip route add 10.10.0.0/24 via 192.168.1.254

# Cisco IOS
ip route 10.10.0.0 255.255.0.0 192.168.1.254
```

**Dynamic Routing**
Router saling bertukar informasi routing secara otomatis menggunakan protokol routing.

| Protokol | Tipe | Penggunaan |
|----------|------|------------|
| **RIP** | Distance Vector | Jaringan kecil, legacy |
| **OSPF** | Link State | Jaringan enterprise |
| **EIGRP** | Hybrid | Cisco proprietary |
| **BGP** | Path Vector | Internet backbone, antar ISP |

---

## Default Gateway

Default gateway adalah alamat IP router yang menjadi "pintu keluar" dari jaringan lokal ke jaringan lain.

```
Konfigurasi PC:
IP Address  : 192.168.1.100
Subnet Mask : 255.255.255.0
Default GW  : 192.168.1.1   ← alamat router
DNS Server  : 8.8.8.8
```

Kalau tidak ada default gateway, perangkat hanya bisa komunikasi dalam LAN yang sama.

---

## ARP: Jembatan antara Layer 2 dan Layer 3

Sebelum router bisa mengirim paket, dia butuh tahu MAC address next-hop. Di sinilah **ARP (Address Resolution Protocol)** bekerja.

```
Router mau kirim packet ke 192.168.1.100

1. Router broadcast: "Siapa yang punya IP 192.168.1.100?"
   (ARP Request — ke semua perangkat di LAN)

2. PC dengan IP 192.168.1.100 jawab:
   "Aku! MAC address-ku AA:BB:CC:DD:EE:01"
   (ARP Reply — unicast ke router)

3. Router simpan di ARP cache, kirim frame ke MAC tadi
```

```bash
# Lihat ARP cache
arp -a               # Windows/Linux
ip neigh show        # Linux modern
```

---

## Traceroute: Melihat Jalur Routing

Traceroute adalah tool untuk melihat semua router (hop) yang dilalui packet dari sumber ke tujuan.

```bash
# Linux/Mac
traceroute google.com

# Windows
tracert google.com

# Output contoh:
# 1  192.168.1.1      1.2 ms   ← router rumah kamu
# 2  10.0.0.1         5.3 ms   ← router ISP
# 3  172.16.50.1      8.1 ms   ← backbone ISP
# 4  142.250.4.102   12.4 ms   ← Google
```

---

## Penutup

Routing dan switching adalah inti dari bagaimana data bergerak di jaringan. Switch menangani komunikasi lokal dengan efisien, router menentukan jalur terbaik ke tujuan yang jauh.

Artikel selanjutnya: **VLAN: Memisahkan Jaringan Secara Logis** — cara membagi satu jaringan fisik menjadi beberapa jaringan virtual yang terisolasi.
