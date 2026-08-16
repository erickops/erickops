# Kenapa Aku Suka Linux (dan Susah Move On ke Windows)

Ini bukan artikel "Linux vs Windows yang mana lebih baik". Kalau mau berdebat itu, banyak thread Reddit yang lebih seru. Ini cuma tulisan tentang kenapa aku sendiri lebih nyaman di Linux dan apa yang bikin aku balik terus ke sana.

---

## Awalnya Karena Terpaksa

Jujur, pertama kali kenal Linux bukan karena pilihan. Waktu itu lagi belajar networking dan semua tutorial mengasumsikan kamu pakai terminal Linux. Windows CMD terasa seperti berbicara dengan tembok.

Jadi aku install Ubuntu di VirtualBox. Terus dual boot. Terus suatu hari boot ke Windows cuma buat gaming, selain itu semua di Linux.

Sekarang Windows-nya sudah lama tidak dibuka.

---

## Yang Paling Aku Suka

### 1. Terminal yang Jujur

Di Linux, terminal itu warga kelas satu. Hampir semua hal bisa dilakukan dari command line, dan hasilnya bisa diprediksi.

```bash
# Mau tahu process apa yang makan RAM?
ps aux --sort=-%mem | head -10

# Cari file yang dimodifikasi 7 hari terakhir
find / -mtime -7 -type f 2>/dev/null

# Monitor network real-time
watch -n 1 'ss -tuln'
```

Di Windows, hal yang sama butuh klik sana-sini atau PowerShell yang syntaxnya berbeda setiap versi.

### 2. Package Manager

Ini yang paling aku kangen tiap kali terpaksa pakai Windows.

```bash
# Install Nmap, Wireshark, Python sekaligus
sudo apt install nmap wireshark python3

# Update semua software dalam satu perintah
sudo apt update && sudo apt upgrade
```

Di Windows: download installer, next-next-next, kadang ada bloatware, kadang butuh restart. Beda dunia.

### 3. Resource yang Ringan

Laptop lamaku yang sudah ngos-ngosan di Windows 10 jalan mulus pakai Xubuntu. Memory usage idle bisa di bawah 500MB. Beda dengan Windows yang idle pun sudah 2-3GB duluan.

### 4. Transparan

Di Linux, kamu bisa tahu dengan pasti apa yang sistem kamu lakukan. File konfigurasi ada di `/etc/`, log ada di `/var/log/`, process ada di `/proc/`.

Tidak ada proses misterius yang jalan di background tanpa kamu tahu seperti apa yang sering terjadi di Windows.

---

## Yang Tidak Aku Suka dari Linux (Jujur)

Karena ini bukan fanboy post, berikut hal yang genuinely annoying:

- **Driver hardware** — masih sering jadi masalah, terutama GPU dan WiFi adapter tertentu
- **Gaming** — sudah jauh lebih baik dengan Proton, tapi belum sempurna
- **Software khusus** — beberapa tools profesional (Adobe, dll) tidak ada versi Linux-nya
- **Learning curve** — untuk orang yang belum terbiasa, curve-nya curam

---

## Distro yang Aku Pakai

Saat ini: **Kali Linux** untuk kebutuhan security dan **Ubuntu** untuk daily use.

Kalau baru mulai, aku sarankan:

1. **Ubuntu** — paling banyak dokumentasi, paling ramah pemula
2. **Linux Mint** — lebih familiar buat yang dari Windows
3. **Kali Linux** — kalau memang fokus ke security/networking, tapi bukan untuk pemula

---

## Kesimpulan

Linux itu bukan untuk semua orang, dan aku tidak akan paksa siapapun untuk pakai. Tapi kalau kamu seseorang yang suka tahu cara kerja sesuatu dari dalam, yang lebih suka command daripada klik, yang merasa frustasi dengan hal-hal yang tersembunyi di balik GUI — coba deh.

Mungkin akan butuh waktu. Mungkin akan ada momen frustrasi. Tapi ada juga momen di mana semuanya klik, dan kamu tidak akan mau balik.

Aku tidak akan paksain. Aku cuma bilang: it's worth trying.
