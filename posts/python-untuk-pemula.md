# Python untuk Pemula: Kenapa Python dan Cara Mulainya

Kalau kamu mau belajar programming dan bingung harus mulai dari mana, Python adalah jawaban yang hampir selalu benar. Simpel, powerful, dan dipakai di mana-mana — dari web development, data science, sampai cybersecurity.

---

## Kenapa Python?

### Sintaks yang Bersih
Python dirancang agar mudah dibaca. Bandingkan program "Hello World" di beberapa bahasa:

```java
// Java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}
```

```python
# Python
print("Hello, World!")
```

Satu baris. Langsung jalan. Itu Python.

### Serbaguna
Python dipakai di hampir semua bidang:
- **Web Development** — Django, Flask, FastAPI
- **Data Science & AI** — NumPy, Pandas, TensorFlow
- **Cybersecurity** — Scapy, Requests, Impacket
- **Automation** — scripting, bot, task automation
- **DevOps** — Ansible, SaltStack

### Komunitas Besar
Python punya komunitas yang sangat besar. Hampir semua pertanyaan sudah ada jawabannya di Stack Overflow atau dokumentasi resmi.

---

## Instalasi Python

### Windows
1. Download dari [python.org/downloads](https://python.org/downloads)
2. Saat install, centang **"Add Python to PATH"**
3. Verifikasi di terminal:

```powershell
python --version
# Python 3.12.x
```

### Linux / Mac
Biasanya sudah pre-installed. Cek versi:

```bash
python3 --version

# Install jika belum ada (Ubuntu/Debian)
sudo apt install python3 python3-pip
```

---

## Menjalankan Python

### Interactive Mode (REPL)
```bash
python3
>>> print("Hello!")
Hello!
>>> 2 + 2
4
>>> exit()
```

### Jalankan File .py
```bash
# Buat file hello.py
echo 'print("Hello, World!")' > hello.py

# Jalankan
python3 hello.py
```

---

## Tipe Data Dasar

```python
# Integer (bilangan bulat)
umur = 20
tahun = 2026

# Float (bilangan desimal)
tinggi = 170.5
berat = 65.0

# String (teks)
nama = "erickops"
kota = 'Jakarta'

# Boolean
aktif = True
selesai = False

# NoneType
data = None

# Cek tipe data
print(type(umur))    # <class 'int'>
print(type(nama))    # <class 'str'>
print(type(aktif))   # <class 'bool'>
```

---

## Operasi Dasar

```python
# Aritmatika
print(10 + 3)   # 13
print(10 - 3)   # 7
print(10 * 3)   # 30
print(10 / 3)   # 3.3333...
print(10 // 3)  # 3 (integer division)
print(10 % 3)   # 1 (modulo/sisa bagi)
print(2 ** 8)   # 256 (pangkat)

# String
nama = "Erick"
print("Halo, " + nama)         # Halo, Erick
print(f"Halo, {nama}!")        # Halo, Erick! (f-string, cara modern)
print(nama.upper())            # ERICK
print(nama.lower())            # erick
print(len(nama))               # 5
print(nama[0])                 # E (indexing)
print(nama[1:4])               # ric (slicing)
```

---

## Input dari User

```python
nama  = input("Masukkan namamu: ")
umur  = int(input("Umur: "))   # input() selalu return string, konversi ke int

print(f"Halo {nama}, kamu berumur {umur} tahun.")
```

---

## Kondisi (if/elif/else)

```python
nilai = 85

if nilai >= 90:
    print("A")
elif nilai >= 80:
    print("B")
elif nilai >= 70:
    print("C")
else:
    print("D")

# Output: B
```

---

## Loop

```python
# for loop
for i in range(5):
    print(i)   # 0, 1, 2, 3, 4

# loop dengan list
buah = ["apel", "mangga", "jeruk"]
for b in buah:
    print(b)

# while loop
counter = 0
while counter < 5:
    print(counter)
    counter += 1
```

---

## Fungsi

```python
# Definisi fungsi
def sapa(nama):
    return f"Halo, {nama}!"

# Panggil fungsi
hasil = sapa("Erick")
print(hasil)   # Halo, Erick!

# Fungsi dengan nilai default
def sapa(nama, salam="Halo"):
    return f"{salam}, {nama}!"

print(sapa("Erick"))           # Halo, Erick!
print(sapa("Erick", "Hai"))    # Hai, Erick!
```

---

## Struktur Data: List dan Dictionary

```python
# List (seperti array)
angka = [1, 2, 3, 4, 5]
angka.append(6)          # tambah elemen
angka.remove(3)          # hapus elemen
print(angka[0])          # akses elemen pertama
print(len(angka))        # panjang list

# Dictionary (key-value pairs)
kucing = {
    "nama": "Sipit",
    "umur": 3,
    "warna": "putih"
}
print(kucing["nama"])        # Sipit
kucing["berat"] = 4.5        # tambah key baru
print(kucing.keys())         # semua key
print(kucing.values())       # semua value
```

---

## Penutup

Ini hanya permukaan dari Python. Yang paling penting sekarang adalah **praktik** — tulis kode setiap hari, bahkan hanya 15-20 menit. Otak belajar programming lewat repetisi, bukan membaca.

Artikel selanjutnya: **Python: Struktur Data Lanjutan** — List, Dictionary, Tuple, dan Set secara mendalam.
