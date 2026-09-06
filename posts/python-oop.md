# Python OOP: Berpikir dalam Objek

Object-Oriented Programming (OOP) adalah paradigma pemrograman yang mengorganisir kode ke dalam **objek** — entitas yang punya data (atribut) dan perilaku (method). OOP membuat kode lebih terstruktur, reusable, dan mudah dipelihara.

---

## Konsep Dasar OOP

### Class dan Object

**Class** adalah blueprint atau cetakan. **Object** adalah instance dari class — hasil cetakannya.

```
Class: Kucing          Object: sipit
-------------------    -------------------
Atribut:               nama = "Sipit"
  - nama               warna = "putih"
  - warna              umur = 3
  - umur
                       Method:
Method:                sipit.makan()
  - makan()            sipit.bersuara()
  - bersuara()
  - tidur()
```

### Membuat Class

```python
class Kucing:
    # Class attribute — sama untuk semua instance
    spesies = "Felis catus"

    # Constructor — dipanggil saat object dibuat
    def __init__(self, nama, warna, umur):
        # Instance attributes — unik tiap object
        self.nama  = nama
        self.warna = warna
        self.umur  = umur

    # Method
    def bersuara(self):
        return f"{self.nama}: Meow!"

    def info(self):
        return f"{self.nama} ({self.warna}, {self.umur} tahun)"

    def ulang_tahun(self):
        self.umur += 1
        print(f"Selamat ulang tahun {self.nama}! Sekarang {self.umur} tahun.")


# Buat object (instance)
sipit = Kucing("Sipit", "putih", 3)
cakep = Kucing("Cakep", "oranye", 2)

# Akses atribut
print(sipit.nama)          # Sipit
print(cakep.warna)         # oranye
print(Kucing.spesies)      # Felis catus

# Panggil method
print(sipit.bersuara())    # Sipit: Meow!
print(cakep.info())        # Cakep (oranye, 2 tahun)
sipit.ulang_tahun()        # Selamat ulang tahun Sipit! Sekarang 4 tahun.
```

---

## 4 Pilar OOP

### 1. Encapsulation (Enkapsulasi)

Menyembunyikan detail implementasi dan hanya expose yang perlu. Gunakan `_` (protected) atau `__` (private) untuk konvensi:

```python
class BankAccount:
    def __init__(self, nama, saldo):
        self.nama     = nama
        self.__saldo  = saldo   # private attribute

    def deposit(self, jumlah):
        if jumlah > 0:
            self.__saldo += jumlah
            print(f"Deposit {jumlah}. Saldo: {self.__saldo}")

    def withdraw(self, jumlah):
        if jumlah > self.__saldo:
            print("Saldo tidak cukup!")
        else:
            self.__saldo -= jumlah
            print(f"Tarik {jumlah}. Saldo: {self.__saldo}")

    def get_saldo(self):  # getter — akses saldo dengan aman
        return self.__saldo


rekening = BankAccount("Erick", 1000000)
rekening.deposit(500000)
rekening.withdraw(200000)
print(rekening.get_saldo())  # 1300000
# print(rekening.__saldo)    # AttributeError! Tidak bisa akses langsung
```

### 2. Inheritance (Pewarisan)

Class anak bisa mewarisi atribut dan method dari class induk:

```python
class Hewan:
    def __init__(self, nama, umur):
        self.nama = nama
        self.umur = umur

    def makan(self):
        return f"{self.nama} sedang makan."

    def info(self):
        return f"{self.nama}, {self.umur} tahun"


# Kucing mewarisi dari Hewan
class Kucing(Hewan):
    def __init__(self, nama, umur, warna):
        super().__init__(nama, umur)  # panggil constructor induk
        self.warna = warna

    def bersuara(self):  # method baru khusus Kucing
        return f"{self.nama}: Meow!"

    def info(self):  # override method induk
        return f"{self.nama} (kucing {self.warna}, {self.umur} tahun)"


class Anjing(Hewan):
    def bersuara(self):
        return f"{self.nama}: Woof!"


sipit  = Kucing("Sipit", 3, "putih")
buddy  = Anjing("Buddy", 5)

print(sipit.makan())       # Sipit sedang makan. (inherited)
print(sipit.bersuara())    # Sipit: Meow!
print(sipit.info())        # Sipit (kucing putih, 3 tahun)
print(buddy.bersuara())    # Buddy: Woof!

# Cek inheritance
print(isinstance(sipit, Kucing))  # True
print(isinstance(sipit, Hewan))   # True juga!
```

### 3. Polymorphism (Polimorfisme)

Objek berbeda bisa digunakan dengan cara yang sama melalui interface yang konsisten:

```python
hewan_list = [
    Kucing("Sipit", 3, "putih"),
    Anjing("Buddy", 5),
    Kucing("Cakep", 2, "oranye"),
]

# Setiap hewan diperlakukan sama, tapi bersuara berbeda
for hewan in hewan_list:
    print(hewan.bersuara())

# Output:
# Sipit: Meow!
# Buddy: Woof!
# Cakep: Meow!
```

### 4. Abstraction (Abstraksi)

Menyederhanakan kompleksitas dengan menyembunyikan detail implementasi:

```python
from abc import ABC, abstractmethod

class Shape(ABC):  # Abstract class
    @abstractmethod
    def luas(self):  # Abstract method — wajib diimplementasi child class
        pass

    @abstractmethod
    def keliling(self):
        pass

    def describe(self):  # Concrete method — bisa diwarisi
        return f"Luas: {self.luas():.2f}, Keliling: {self.keliling():.2f}"


class Lingkaran(Shape):
    def __init__(self, r):
        self.r = r

    def luas(self):
        return 3.14159 * self.r ** 2

    def keliling(self):
        return 2 * 3.14159 * self.r


class Persegi(Shape):
    def __init__(self, sisi):
        self.sisi = sisi

    def luas(self):
        return self.sisi ** 2

    def keliling(self):
        return 4 * self.sisi


l = Lingkaran(5)
p = Persegi(4)

print(l.describe())  # Luas: 78.54, Keliling: 31.42
print(p.describe())  # Luas: 16.00, Keliling: 16.00
```

---

## Magic Methods (Dunder Methods)

Method khusus dengan double underscore yang mendefinisikan perilaku built-in:

```python
class Vektor:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __str__(self):          # print(obj)
        return f"Vektor({self.x}, {self.y})"

    def __repr__(self):         # representasi debug
        return f"Vektor(x={self.x}, y={self.y})"

    def __add__(self, other):   # v1 + v2
        return Vektor(self.x + other.x, self.y + other.y)

    def __len__(self):          # len(obj)
        return int((self.x**2 + self.y**2) ** 0.5)

    def __eq__(self, other):    # v1 == v2
        return self.x == other.x and self.y == other.y


v1 = Vektor(3, 4)
v2 = Vektor(1, 2)

print(v1)          # Vektor(3, 4)
print(v1 + v2)     # Vektor(4, 6)
print(len(v1))     # 5
print(v1 == v2)    # False
```

---

## Penutup

OOP membuat kode lebih mudah diorganisir terutama untuk program yang besar dan kompleks. Di Python, hampir segalanya adalah objek — string, list, bahkan fungsi pun adalah objek.

Artikel selanjutnya: **Python untuk Cybersecurity** — cara pakai Python untuk automasi security task, dari port scanning sampai analisis log.
