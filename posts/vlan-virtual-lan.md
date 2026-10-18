# VLAN: Memisahkan Jaringan Secara Logis

Bayangkan kamu punya satu gedung kantor dengan 3 departemen: IT, Finance, dan HR. Secara fisik mereka semua terhubung ke switch yang sama. Tapi kamu tidak ingin komputer HR bisa akses data Finance, dan sebaliknya.

Solusinya: **VLAN**.

---

## Apa Itu VLAN?

**VLAN (Virtual Local Area Network)** adalah teknologi yang memungkinkan kamu membagi satu jaringan fisik menjadi beberapa jaringan logis yang terisolasi — tanpa perlu menambah switch fisik baru.

```
Tanpa VLAN:
Switch → semua perangkat bisa saling komunikasi

Dengan VLAN:
Switch → VLAN 10 (IT)      → hanya PC IT yang bisa ngobrol
       → VLAN 20 (Finance) → hanya PC Finance yang bisa ngobrol
       → VLAN 30 (HR)      → hanya PC HR yang bisa ngobrol
```

Meskipun semua terhubung ke switch yang sama secara fisik, secara logis mereka berada di jaringan yang berbeda.

---

## Kenapa Perlu VLAN?

### 1. Keamanan
Departemen yang berbeda tidak bisa saling akses tanpa melewati router/firewall. Data Finance tidak bisa dilihat dari komputer HR.

### 2. Efisiensi Bandwidth
Broadcast traffic (ARP, DHCP, dll) hanya menyebar dalam VLAN yang sama, tidak ke seluruh jaringan. Ini mengurangi beban jaringan secara signifikan.

### 3. Fleksibilitas
Organisasi perangkat berdasarkan fungsi, bukan lokasi fisik. Seorang manager di lantai 3 bisa di VLAN yang sama dengan direktur di lantai 10.

### 4. Simplifikasi Manajemen
Tidak perlu kabel tambahan atau switch baru untuk memisahkan jaringan.

---

## Cara Kerja VLAN

### VLAN Tagging (IEEE 802.1Q)

Ketika frame berpindah antar switch, switch perlu tahu frame ini milik VLAN mana. Caranya dengan menambahkan **tag 802.1Q** ke dalam Ethernet frame.

```
Frame tanpa tag:
┌────────────┬─────────┬──────┬──────────┐
│ Dest MAC   │ Src MAC │ Type │ Data     │
└────────────┴─────────┴──────┴──────────┘

Frame dengan 802.1Q tag:
┌────────────┬─────────┬──────────┬──────┬──────────┐
│ Dest MAC   │ Src MAC │ 802.1Q   │ Type │ Data     │
│            │         │ Tag+VLAN │      │          │
└────────────┴─────────┴──────────┴──────┴──────────┘
                              ↑
                         VLAN ID (1-4094)
```

### Access Port vs Trunk Port

**Access Port**
Port yang terhubung langsung ke end device (PC, printer). Frame yang masuk/keluar tidak punya tag — switch yang handle tagging-nya.

```
PC ──── (untagged) ──── Access Port (VLAN 10) ──── Switch
```

**Trunk Port**
Port yang menghubungkan dua switch, atau switch ke router. Bisa membawa traffic dari multiple VLAN sekaligus menggunakan tag 802.1Q.

```
Switch A ──── (tagged: VLAN 10, 20, 30) ──── Trunk Port ──── Switch B
```

---

## Konfigurasi VLAN (Cisco IOS)

### Buat VLAN

```bash
Switch> enable
Switch# configure terminal

# Buat VLAN
Switch(config)# vlan 10
Switch(config-vlan)# name IT
Switch(config-vlan)# exit

Switch(config)# vlan 20
Switch(config-vlan)# name Finance
Switch(config-vlan)# exit

Switch(config)# vlan 30
Switch(config-vlan)# name HR
Switch(config-vlan)# exit
```

### Set Access Port

```bash
# Port fa0/1 untuk PC IT (VLAN 10)
Switch(config)# interface fastEthernet 0/1
Switch(config-if)# switchport mode access
Switch(config-if)# switchport access vlan 10
Switch(config-if)# exit
```

### Set Trunk Port

```bash
# Port gi0/1 sebagai trunk ke switch lain
Switch(config)# interface gigabitEthernet 0/1
Switch(config-if)# switchport mode trunk
Switch(config-if)# switchport trunk allowed vlan 10,20,30
Switch(config-if)# exit
```

### Verifikasi

```bash
Switch# show vlan brief
Switch# show interfaces trunk
Switch# show interfaces fa0/1 switchport
```

---

## Inter-VLAN Routing

VLAN memisahkan traffic — artinya PC di VLAN 10 tidak bisa langsung komunikasi dengan PC di VLAN 20. Untuk komunikasi antar VLAN, dibutuhkan **router** atau **Layer 3 switch**.

### Router-on-a-Stick

Menggunakan satu interface router dengan sub-interface untuk setiap VLAN:

```
              Router
              │ (trunk port)
              │
         ─────────────
         │   Switch   │
    ─────────────────────────
    │           │           │
  VLAN 10    VLAN 20    VLAN 30
  (IT)      (Finance)   (HR)
```

```bash
# Konfigurasi sub-interface di router (Cisco)
Router(config)# interface gigabitEthernet 0/0.10
Router(config-subif)# encapsulation dot1Q 10
Router(config-subif)# ip address 192.168.10.1 255.255.255.0

Router(config)# interface gigabitEthernet 0/0.20
Router(config-subif)# encapsulation dot1Q 20
Router(config-subif)# ip address 192.168.20.1 255.255.255.0
```

---

## Native VLAN

Native VLAN adalah VLAN yang digunakan untuk traffic yang tidak ber-tag di trunk port. Default-nya VLAN 1.

> **Security tip:** Ganti native VLAN dari VLAN 1 ke VLAN lain yang tidak dipakai, karena VLAN 1 sering jadi target serangan **VLAN hopping**.

---

## Penutup

VLAN adalah fondasi dari desain jaringan yang aman dan terorganisir. Di hampir semua jaringan enterprise, VLAN digunakan untuk memisahkan traffic berdasarkan departemen, fungsi, atau tingkat keamanan.

Artikel selanjutnya: **Troubleshooting Jaringan: Pendekatan Sistematis** — bagaimana mendiagnosa dan memperbaiki masalah jaringan secara metodis.
