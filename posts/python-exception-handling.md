# Python: Exception Handling dan Debugging

Program yang bagus bukan yang tidak pernah error — tapi yang tahu cara menghadapi error dengan elegan. Di artikel ini kita bahas dua skill yang sering diabaikan pemula tapi sangat penting: **exception handling** dan **debugging**.

---

## Apa Itu Exception?

**Exception** adalah error yang terjadi saat runtime — saat program sedang berjalan. Berbeda dengan syntax error yang langsung ketahuan sebelum program jalan.

```python
# Syntax error — ketahuan sebelum jalan
print("hello"   # missing closing parenthesis

# Exception — terjadi saat runtime
angka = int("bukan angka")  # ValueError
print(1 / 0)                # ZeroDivisionError
open("tidak_ada.txt")       # FileNotFoundError
```

---

## Exception yang Paling Sering Ditemui

```python
# ValueError — nilai tidak valid
int("abc")           # ValueError: invalid literal for int()
int("3.14")          # ValueError juga

# TypeError — tipe data salah
"hello" + 5          # TypeError: can only concatenate str to str
len(42)              # TypeError: object of type 'int' has no len()

# IndexError — index di luar range
lst = [1, 2, 3]
lst[10]              # IndexError: list index out of range

# KeyError — key tidak ada di dictionary
d = {"a": 1}
d["b"]               # KeyError: 'b'

# AttributeError — attribute tidak ada
"hello".upper()      # OK
"hello".terbang()    # AttributeError: 'str' has no attribute 'terbang'

# FileNotFoundError
open("ghost.txt")    # FileNotFoundError

# ZeroDivisionError
10 / 0               # ZeroDivisionError

# ImportError
import tidak_ada     # ModuleNotFoundError

# NameError
print(variabel_belum_didefinisi)  # NameError
```

---

## try / except — Handle Exception

```python
# Bentuk dasar
try:
    angka = int(input("Masukkan angka: "))
    print(f"Hasilnya: {10 / angka}")
except ValueError:
    print("Itu bukan angka!")
except ZeroDivisionError:
    print("Tidak bisa dibagi nol!")

# Handle multiple exception sekaligus
try:
    result = int("abc") / 0
except (ValueError, ZeroDivisionError) as e:
    print(f"Error: {e}")

# Catch semua exception (gunakan dengan hati-hati)
try:
    risky_operation()
except Exception as e:
    print(f"Unexpected error: {type(e).__name__}: {e}")
```

### else dan finally

```python
try:
    file = open("data.txt", "r")
    content = file.read()
except FileNotFoundError:
    print("File tidak ditemukan!")
else:
    # Jalan kalau try BERHASIL (tidak ada exception)
    print(f"Berhasil baca {len(content)} karakter")
finally:
    # SELALU jalan, exception atau tidak
    # Cocok untuk cleanup: tutup file, tutup koneksi DB
    print("Selesai")
    try:
        file.close()
    except:
        pass
```

---

## raise — Lempar Exception Sendiri

```python
def bagi(a, b):
    if not isinstance(a, (int, float)) or not isinstance(b, (int, float)):
        raise TypeError(f"Input harus angka, dapat {type(a)} dan {type(b)}")
    if b == 0:
        raise ValueError("Pembagi tidak boleh nol")
    return a / b

try:
    print(bagi(10, 0))
except ValueError as e:
    print(f"ValueError: {e}")

try:
    print(bagi("10", 2))
except TypeError as e:
    print(f"TypeError: {e}")
```

### Custom Exception

```python
# Buat exception class sendiri
class InsufficientFundsError(Exception):
    def __init__(self, amount, balance):
        self.amount  = amount
        self.balance = balance
        super().__init__(
            f"Tidak cukup saldo. Butuh: {amount}, Ada: {balance}"
        )

class BankAccount:
    def __init__(self, balance):
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            raise InsufficientFundsError(amount, self.balance)
        self.balance -= amount
        return self.balance

# Penggunaan
account = BankAccount(100000)
try:
    account.withdraw(500000)
except InsufficientFundsError as e:
    print(e)   # Tidak cukup saldo. Butuh: 500000, Ada: 100000
```

---

## Context Manager: with Statement

`with` statement memastikan resource dibersihkan dengan benar meskipun terjadi exception:

```python
# Tanpa with — berisiko file tidak ter-close kalau ada error
file = open("data.txt")
content = file.read()   # kalau ini error, file.close() tidak dipanggil
file.close()

# Dengan with — auto close
with open("data.txt") as file:
    content = file.read()
    # file.close() dipanggil otomatis di sini, exception atau tidak

# Custom context manager
from contextlib import contextmanager

@contextmanager
def timer():
    import time
    start = time.time()
    try:
        yield
    finally:
        elapsed = time.time() - start
        print(f"Waktu eksekusi: {elapsed:.3f}s")

with timer():
    # operasi yang mau diukur waktunya
    sum(range(1000000))
```

---

## Debugging dengan Python

### print() Debugging — Cara Paling Sederhana

```python
def hitung_diskon(harga, persen):
    print(f"DEBUG: harga={harga}, persen={persen}")  # debug
    diskon = harga * (persen / 100)
    print(f"DEBUG: diskon={diskon}")                  # debug
    return harga - diskon

hasil = hitung_diskon(100000, 20)
```

### logging Module — Lebih Proper dari print()

```python
import logging

# Konfigurasi
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s [%(levelname)s] %(message)s',
    handlers=[
        logging.FileHandler("app.log"),  # simpan ke file
        logging.StreamHandler()          # juga tampilkan di console
    ]
)

logger = logging.getLogger(__name__)

# Level: DEBUG < INFO < WARNING < ERROR < CRITICAL
logger.debug("Nilai variabel x = 42")
logger.info("Proses berhasil")
logger.warning("Disk hampir penuh")
logger.error("Koneksi database gagal")
logger.critical("Server down!")
```

### pdb — Python Debugger

```python
import pdb

def fungsi_bermasalah(data):
    hasil = []
    for item in data:
        pdb.set_trace()  # breakpoint — program berhenti di sini
        proses = item * 2
        hasil.append(proses)
    return hasil

# Perintah pdb:
# n (next)     — jalankan baris berikutnya
# s (step)     — masuk ke dalam fungsi
# c (continue) — lanjut sampai breakpoint berikutnya
# p x          — print nilai variabel x
# l            — tampilkan kode sekitar
# q (quit)     — keluar dari debugger
```

### Python 3.7+: breakpoint()

```python
# Cara modern — tidak perlu import pdb
def proses(data):
    breakpoint()  # langsung pause di sini
    return data * 2
```

---

## Pola Exception Handling yang Baik

```python
# ✅ BAIK: Spesifik, informatif, ada recovery
def baca_config(filepath):
    try:
        with open(filepath) as f:
            return json.load(f)
    except FileNotFoundError:
        logger.warning(f"Config {filepath} tidak ada, pakai default")
        return DEFAULT_CONFIG
    except json.JSONDecodeError as e:
        logger.error(f"Config {filepath} tidak valid JSON: {e}")
        raise  # re-raise karena ini error serius

# ❌ BURUK: Terlalu broad, sembunyikan error
def baca_config(filepath):
    try:
        with open(filepath) as f:
            return json.load(f)
    except:
        pass  # Diam-diam gagal — sangat berbahaya!
```

---

## Penutup

Exception handling yang baik adalah tanda kode yang matang. Program tidak harus selalu berjalan mulus — yang penting, ketika ada masalah, program bisa memberitahu kita dengan jelas apa yang terjadi dan kenapa.

Artikel selanjutnya: **Python: Working with APIs** — cara berinteraksi dengan web API menggunakan library `requests`.
