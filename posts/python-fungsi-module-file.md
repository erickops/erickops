# Python: Fungsi, Module, dan File Handling

Setelah paham variabel, tipe data, dan struktur data — saatnya belajar cara membuat kode yang lebih terorganisir. Di artikel ini kita bahas tiga hal penting: **fungsi yang lebih dalam**, **module**, dan **cara baca-tulis file**.

---

## Fungsi Lanjutan

### Parameter dan Return Value

```python
# Fungsi dengan multiple return
def hitung_statistik(angka):
    total   = sum(angka)
    rata    = total / len(angka)
    minimum = min(angka)
    maksimum = max(angka)
    return total, rata, minimum, maksimum  # return tuple

data = [85, 90, 78, 92, 88]
total, rata, min_val, max_val = hitung_statistik(data)
print(f"Total: {total}, Rata-rata: {rata:.2f}")
```

### *args dan **kwargs

```python
# *args — terima argumen positional tak terbatas
def jumlahkan(*angka):
    return sum(angka)

print(jumlahkan(1, 2, 3))        # 6
print(jumlahkan(1, 2, 3, 4, 5))  # 15

# **kwargs — terima keyword argument tak terbatas
def buat_profil(**data):
    for key, value in data.items():
        print(f"{key}: {value}")

buat_profil(nama="Erick", umur=20, kota="Jakarta")
# nama: Erick
# umur: 20
# kota: Jakarta
```

### Lambda Function

Lambda adalah fungsi anonim (tanpa nama) untuk operasi sederhana satu baris:

```python
# Fungsi biasa
def kuadrat(x):
    return x ** 2

# Versi lambda
kuadrat = lambda x: x ** 2
print(kuadrat(5))  # 25

# Berguna dengan sorted(), map(), filter()
angka = [3, 1, 4, 1, 5, 9, 2, 6]
terurut = sorted(angka, key=lambda x: -x)  # sort descending
print(terurut)  # [9, 6, 5, 4, 3, 2, 1, 1]

# map — apply fungsi ke setiap elemen
kuadrat_semua = list(map(lambda x: x**2, angka))

# filter — filter elemen berdasarkan kondisi
genap = list(filter(lambda x: x % 2 == 0, angka))
```

### Docstring

```python
def hitung_luas_lingkaran(r):
    """
    Menghitung luas lingkaran.

    Args:
        r (float): jari-jari lingkaran

    Returns:
        float: luas lingkaran
    """
    import math
    return math.pi * r ** 2

help(hitung_luas_lingkaran)  # tampilkan docstring
```

---

## Module dan Package

### Import Module Built-in

Python punya banyak module bawaan yang siap dipakai:

```python
import math
print(math.pi)          # 3.14159...
print(math.sqrt(16))    # 4.0
print(math.floor(3.7))  # 3
print(math.ceil(3.2))   # 4

import random
print(random.randint(1, 10))       # angka random 1-10
print(random.choice(["a", "b"]))   # pilih random dari list
random.shuffle(["a", "b", "c"])    # acak urutan list

import datetime
sekarang = datetime.datetime.now()
print(sekarang)                    # 2026-08-16 10:30:45.123456
print(sekarang.strftime("%d/%m/%Y"))  # 16/08/2026

import os
print(os.getcwd())                 # direktori saat ini
print(os.listdir("."))             # isi direktori
os.makedirs("folder_baru", exist_ok=True)

import sys
print(sys.version)                 # versi Python
print(sys.argv)                    # argument command line
```

### Import Spesifik

```python
# Import hanya yang dibutuhkan
from math import pi, sqrt, floor
print(pi)           # bisa langsung pakai, tanpa math.
print(sqrt(25))     # 5.0

# Import dengan alias
import numpy as np
import pandas as pd
```

### Buat Module Sendiri

Setiap file `.py` adalah module. Buat file `utils.py`:

```python
# utils.py
def sapa(nama):
    return f"Halo, {nama}!"

def hitung_bmi(berat, tinggi_cm):
    tinggi_m = tinggi_cm / 100
    bmi = berat / (tinggi_m ** 2)
    return round(bmi, 2)

PI = 3.14159
```

Pakai di file lain:

```python
# main.py
import utils

print(utils.sapa("Erick"))
print(utils.hitung_bmi(65, 170))
print(utils.PI)
```

### Install Package External (pip)

```bash
# Install package
pip install requests
pip install pandas numpy matplotlib

# Lihat yang terinstall
pip list

# Install dari requirements.txt
pip install -r requirements.txt
```

---

## File Handling

### Baca File

```python
# Cara 1: open() dan close() manual
file = open("data.txt", "r")   # "r" = read mode
isi = file.read()
print(isi)
file.close()

# Cara 2: with statement (RECOMMENDED — auto close)
with open("data.txt", "r") as file:
    isi = file.read()           # baca semua
    print(isi)

# Baca per baris
with open("data.txt", "r") as file:
    for baris in file:
        print(baris.strip())    # strip() hapus whitespace/newline

# Baca sebagai list of lines
with open("data.txt", "r") as file:
    baris_list = file.readlines()
```

### Tulis File

```python
# Tulis ke file baru (overwrite jika sudah ada)
with open("output.txt", "w") as file:
    file.write("Baris pertama\n")
    file.write("Baris kedua\n")

# Append — tambahkan ke file yang sudah ada
with open("log.txt", "a") as file:
    file.write("Log baru ditambahkan\n")

# Tulis multiple lines sekaligus
baris = ["baris 1\n", "baris 2\n", "baris 3\n"]
with open("output.txt", "w") as file:
    file.writelines(baris)
```

### Baca dan Tulis File JSON

```python
import json

# Data Python
data = {
    "nama": "Erick",
    "kucing": ["Sipit", "Cakep", "Koala"],
    "umur": 20
}

# Tulis ke JSON
with open("data.json", "w") as file:
    json.dump(data, file, indent=2)

# Baca dari JSON
with open("data.json", "r") as file:
    data_loaded = json.load(file)

print(data_loaded["nama"])    # Erick
print(data_loaded["kucing"])  # ['Sipit', 'Cakep', 'Koala']
```

### Cek File / Direktori

```python
import os

# Cek apakah file/direktori ada
print(os.path.exists("data.txt"))     # True/False
print(os.path.isfile("data.txt"))     # True jika file
print(os.path.isdir("folder"))        # True jika direktori

# Info file
print(os.path.getsize("data.txt"))    # ukuran dalam bytes
print(os.path.basename("/path/file.txt"))  # file.txt
print(os.path.dirname("/path/file.txt"))   # /path
```

---

## Error Handling

```python
# try/except untuk handle error
try:
    file = open("tidak_ada.txt", "r")
    isi = file.read()
except FileNotFoundError:
    print("File tidak ditemukan!")
except PermissionError:
    print("Tidak punya izin akses!")
except Exception as e:
    print(f"Error: {e}")
finally:
    print("Ini selalu dijalankan")

# Raise exception sendiri
def bagi(a, b):
    if b == 0:
        raise ValueError("Tidak bisa dibagi nol!")
    return a / b
```

---

## Penutup

Fungsi, module, dan file handling adalah tiga pilar penting dalam menulis kode Python yang berguna di dunia nyata. Dengan ini kamu sudah bisa membuat program yang terorganisir dan bisa berinteraksi dengan data di luar program.

Artikel selanjutnya: **Python OOP (Object-Oriented Programming)** — cara berpikir dalam objek untuk menulis kode yang lebih terstruktur.
