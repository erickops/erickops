# Python: Struktur Data yang Wajib Dikuasai

Struktur data adalah cara kita menyimpan dan mengorganisir data dalam program. Python punya empat struktur data built-in yang paling sering dipakai: **List, Dictionary, Tuple, dan Set**. Kuasai keempatnya dan kamu sudah punya fondasi yang kuat.

---

## List

List adalah koleksi data yang **terurut dan bisa diubah**. Bisa menyimpan tipe data apapun, bahkan campuran.

```python
# Membuat list
angka   = [1, 2, 3, 4, 5]
nama    = ["Sipit", "Cakep", "Koala"]
campur  = [1, "halo", True, 3.14]
kosong  = []
```

### Indexing dan Slicing

```python
buah = ["apel", "mangga", "jeruk", "pisang", "anggur"]

# Indexing (mulai dari 0)
print(buah[0])    # apel
print(buah[-1])   # anggur (dari belakang)
print(buah[-2])   # pisang

# Slicing [start:end:step]
print(buah[1:3])  # ['mangga', 'jeruk']
print(buah[:3])   # ['apel', 'mangga', 'jeruk']
print(buah[2:])   # ['jeruk', 'pisang', 'anggur']
print(buah[::2])  # ['apel', 'jeruk', 'anggur'] (setiap 2 elemen)
print(buah[::-1]) # reverse list
```

### Method List yang Penting

```python
angka = [3, 1, 4, 1, 5, 9, 2, 6]

angka.append(7)          # tambah di akhir: [3,1,4,1,5,9,2,6,7]
angka.insert(0, 0)       # sisip di index 0: [0,3,1,4,...]
angka.remove(1)          # hapus nilai pertama yang ketemu
angka.pop()              # hapus & return elemen terakhir
angka.pop(2)             # hapus & return elemen index 2
angka.sort()             # sort ascending (in-place)
angka.sort(reverse=True) # sort descending
angka.reverse()          # balik urutan
angka.count(1)           # hitung berapa kali 1 muncul
angka.index(5)           # cari index dari nilai 5
len(angka)               # panjang list

# Sort tanpa ubah original
sorted_angka = sorted(angka)
```

### List Comprehension

Cara membuat list baru dari iterasi dengan sintaks ringkas:

```python
# Cara biasa
kuadrat = []
for i in range(10):
    kuadrat.append(i ** 2)

# List comprehension (lebih Pythonic)
kuadrat = [i ** 2 for i in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Dengan kondisi
genap = [i for i in range(20) if i % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]
```

---

## Dictionary

Dictionary menyimpan data sebagai pasangan **key-value**. Key harus unik dan immutable (string, number, tuple).

```python
# Membuat dictionary
kucing = {
    "nama":   "Sipit",
    "umur":   3,
    "warna":  "putih",
    "aktif":  True
}

# Akses value
print(kucing["nama"])          # Sipit
print(kucing.get("umur"))      # 3
print(kucing.get("berat", 0))  # 0 (default kalau key tidak ada)
```

### Manipulasi Dictionary

```python
# Tambah / update
kucing["berat"] = 4.5
kucing["nama"] = "Sipit Jr."

# Hapus
del kucing["aktif"]
removed = kucing.pop("warna")   # hapus dan return value-nya

# Iterasi
for key in kucing:
    print(key, ":", kucing[key])

for key, value in kucing.items():
    print(f"{key}: {value}")

# Cek keberadaan key
if "nama" in kucing:
    print("Ada nama!")

# Keys, values, items
print(kucing.keys())    # dict_keys(['nama', 'umur', 'berat'])
print(kucing.values())  # dict_values(['Sipit Jr.', 3, 4.5])
```

### Nested Dictionary

```python
data_kucing = {
    "sipit": {"umur": 3, "warna": "putih"},
    "cakep": {"umur": 2, "warna": "oranye"},
    "koala": {"umur": 4, "warna": "hitam putih"},
}

print(data_kucing["sipit"]["warna"])  # putih

# Iterasi nested
for nama, info in data_kucing.items():
    print(f"{nama}: {info['umur']} tahun, warna {info['warna']}")
```

---

## Tuple

Tuple seperti List tapi **immutable** — tidak bisa diubah setelah dibuat. Lebih cepat dari list dan cocok untuk data yang tidak boleh berubah.

```python
# Membuat tuple
koordinat  = (10.5, -7.3)
rgb        = (255, 128, 0)
single     = (42,)    # perlu koma untuk tuple satu elemen

# Akses seperti list
print(koordinat[0])   # 10.5
print(rgb[-1])        # 0

# Unpacking
x, y = koordinat
r, g, b = rgb
print(f"x={x}, y={y}")

# Tidak bisa diubah!
# koordinat[0] = 5  # → TypeError!
```

### Kapan Pakai Tuple vs List?

| Tuple | List |
|-------|------|
| Data tidak boleh berubah | Data bisa berubah |
| Lebih cepat | Sedikit lebih lambat |
| Bisa jadi key dict | Tidak bisa jadi key dict |
| Koordinat, RGB, konstanta | Daftar item, queue, stack |

---

## Set

Set adalah koleksi yang **tidak terurut** dan **tidak ada duplikat**. Sangat cepat untuk operasi keanggotaan (cek apakah element ada).

```python
# Membuat set
buah = {"apel", "mangga", "jeruk", "apel"}  # duplikat otomatis dihapus
print(buah)   # {'apel', 'mangga', 'jeruk'}

# Tambah dan hapus
buah.add("pisang")
buah.remove("mangga")   # error kalau tidak ada
buah.discard("semangka") # tidak error kalau tidak ada
```

### Operasi Set (Matematika)

```python
A = {1, 2, 3, 4, 5}
B = {4, 5, 6, 7, 8}

print(A | B)   # Union: {1,2,3,4,5,6,7,8}
print(A & B)   # Intersection: {4,5}
print(A - B)   # Difference: {1,2,3}
print(A ^ B)   # Symmetric difference: {1,2,3,6,7,8}

# Cek keanggotaan (sangat cepat)
print(3 in A)  # True
print(9 in A)  # False
```

---

## Perbandingan Keempat Struktur Data

| | List | Dict | Tuple | Set |
|--|------|------|-------|-----|
| **Ordered** | ✅ | ✅ (Python 3.7+) | ✅ | ❌ |
| **Mutable** | ✅ | ✅ | ❌ | ✅ |
| **Duplikat** | ✅ | Key unik | ✅ | ❌ |
| **Akses** | Index | Key | Index | - |
| **Syntax** | `[...]` | `{k:v}` | `(...)` | `{...}` |

---

## Penutup

Memilih struktur data yang tepat adalah bagian dari menulis kode yang baik. Gunakan list untuk koleksi terurut, dict untuk mapping key-value, tuple untuk data immutable, dan set untuk keanggotaan unik.

Artikel selanjutnya: **Python: Fungsi, Module, dan File Handling** — cara membuat kode yang terorganisir dan bisa bekerja dengan file.
