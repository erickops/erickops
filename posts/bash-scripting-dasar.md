# Bash Scripting Dasar: Automasi Hal-Hal Kecil yang Bikin Hidup Lebih Mudah

Salah satu hal yang paling mengubah cara aku bekerja di Linux adalah mulai menulis bash script. Bukan yang kompleks — cukup script-script kecil yang otomasi tugas berulang yang dulu aku lakukan manual setiap hari.

Ini fondasi yang perlu kamu tahu.

---

## Kenapa Bash?

- Sudah tersedia di hampir semua sistem Linux/Unix
- Tidak perlu install apapun
- Cepat untuk tugas-tugas system administration
- Bisa dijalankan langsung dari terminal

---

## Struktur Dasar Script

```bash
#!/bin/bash
# Baris pertama ini disebut "shebang" — memberitahu sistem ini adalah script bash

echo "Hello, World!"
```

Simpan sebagai `hello.sh`, lalu beri izin eksekusi:

```bash
chmod +x hello.sh
./hello.sh
```

---

## Variabel

```bash
#!/bin/bash

# Deklarasi variabel (tidak ada spasi di sekitar =)
nama="erickops"
umur=20

# Menggunakan variabel
echo "Nama: $nama"
echo "Umur: $umur"

# Variabel dari output command
tanggal=$(date +%Y-%m-%d)
echo "Hari ini: $tanggal"
```

---

## Input dari User

```bash
#!/bin/bash

read -p "Masukkan nama kamu: " nama
echo "Halo, $nama!"

# Read dengan silent (untuk password)
read -sp "Password: " pass
echo ""
echo "Password diterima."
```

---

## Kondisi (If/Else)

```bash
#!/bin/bash

angka=10

if [ $angka -gt 5 ]; then
    echo "$angka lebih besar dari 5"
elif [ $angka -eq 5 ]; then
    echo "$angka sama dengan 5"
else
    echo "$angka lebih kecil dari 5"
fi

# Perbandingan untuk string
nama="erick"
if [ "$nama" == "erick" ]; then
    echo "Halo, Erick!"
fi

# Cek apakah file ada
if [ -f "/etc/passwd" ]; then
    echo "File /etc/passwd ada"
fi
```

### Operator perbandingan angka:

| Operator | Arti              |
|----------|-------------------|
| `-eq`    | equal (sama)      |
| `-ne`    | not equal         |
| `-gt`    | greater than      |
| `-lt`    | less than         |
| `-ge`    | greater or equal  |
| `-le`    | less or equal     |

---

## Loop

```bash
#!/bin/bash

# For loop
for i in 1 2 3 4 5; do
    echo "Iterasi ke-$i"
done

# For loop dengan range
for i in {1..10}; do
    echo "Nomor: $i"
done

# While loop
counter=0
while [ $counter -lt 5 ]; do
    echo "Counter: $counter"
    counter=$((counter + 1))
done

# Loop melalui file
for file in /etc/*.conf; do
    echo "Config: $file"
done
```

---

## Fungsi

```bash
#!/bin/bash

# Definisi fungsi
greet() {
    local name=$1  # $1 = argumen pertama
    echo "Halo, $name!"
}

# Fungsi dengan return value
tambah() {
    local hasil=$(( $1 + $2 ))
    echo $hasil
}

# Memanggil fungsi
greet "Erick"
result=$(tambah 5 3)
echo "5 + 3 = $result"
```

---

## Contoh Script Nyata

### Backup otomatis folder

```bash
#!/bin/bash

FOLDER_SUMBER="$HOME/Documents"
FOLDER_BACKUP="$HOME/Backup"
TANGGAL=$(date +%Y%m%d_%H%M%S)
NAMA_FILE="backup_$TANGGAL.tar.gz"

# Buat folder backup kalau belum ada
mkdir -p "$FOLDER_BACKUP"

# Buat backup
tar -czf "$FOLDER_BACKUP/$NAMA_FILE" "$FOLDER_SUMBER"

if [ $? -eq 0 ]; then
    echo "✅ Backup berhasil: $NAMA_FILE"
else
    echo "❌ Backup gagal!"
    exit 1
fi
```

### Cek koneksi internet

```bash
#!/bin/bash

check_connection() {
    if ping -c 1 8.8.8.8 &>/dev/null; then
        echo "✅ Internet terhubung"
        return 0
    else
        echo "❌ Internet tidak terhubung"
        return 1
    fi
}

check_connection
```

---

## Tips

1. **Selalu test dulu** sebelum jalankan script yang destructive
2. **Gunakan `set -e`** di awal script supaya berhenti jika ada error
3. **Quote variabel**: tulis `"$nama"` bukan `$nama` untuk hindari masalah spasi
4. **Baca output perintah** dengan `$(command)` bukan backtick
5. **Gunakan `shellcheck`** untuk validasi syntax script kamu

```bash
# Install shellcheck
sudo apt install shellcheck

# Cek script
shellcheck script.sh
```

---

## Penutup

Bash scripting adalah skill yang worth it untuk dipelajari. Mulai dari script sederhana, perlahan tambahkan logika. Nanti tanpa sadar kamu sudah punya koleksi script yang beneran menghemat waktu setiap hari.

Kalau ada yang ingin aku bahas lebih dalam — kondisi kompleks, regex di bash, atau integrasi dengan tools lain — drop di komentar.
