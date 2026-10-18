# Python: Regular Expressions (Regex)

Kalau kamu pernah perlu mencari pola tertentu dalam teks — semua email di sebuah file, semua nomor telepon di database, semua IP address di log server — **regular expression** adalah alat yang kamu butuhkan.

---

## Apa Itu Regex?

**Regular expression (regex)** adalah pola (pattern) yang digunakan untuk mencocokkan, mencari, dan memanipulasi teks. Satu baris regex bisa menggantikan puluhan baris kode manual.

Python punya modul bawaan `re` untuk regex.

```python
import re

teks = "Hubungi kami di support@erickops.space atau 08123456789"

# Tanpa regex: ribet, banyak kondisi
# Dengan regex: satu baris
emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', teks)
phones = re.findall(r'0\d{9,12}', teks)

print(emails)  # ['support@erickops.space']
print(phones)  # ['08123456789']
```

---

## Karakter Spesial Regex

### Basic Metacharacters

| Pattern | Arti |
|---------|------|
| `.` | Sembarang karakter (kecuali newline) |
| `^` | Awal string |
| `$` | Akhir string |
| `*` | 0 atau lebih kali |
| `+` | 1 atau lebih kali |
| `?` | 0 atau 1 kali (opsional) |
| `\|` | Atau (OR) |
| `()` | Grouping |
| `[]` | Character class |
| `{}` | Quantifier spesifik |
| `\` | Escape karakter spesial |

### Character Classes

```python
# \d = digit [0-9]
# \D = bukan digit
# \w = word character [a-zA-Z0-9_]
# \W = bukan word character
# \s = whitespace (spasi, tab, newline)
# \S = bukan whitespace
# \b = word boundary

# Custom character class
[abc]      # a, b, atau c
[a-z]      # semua huruf kecil
[A-Z]      # semua huruf besar
[0-9]      # semua digit
[^abc]     # bukan a, b, atau c (negasi)
[a-zA-Z]   # semua huruf
```

### Quantifiers

```python
a*      # 0 atau lebih 'a'
a+      # 1 atau lebih 'a'
a?      # 0 atau 1 'a' (opsional)
a{3}    # tepat 3 'a'
a{3,}   # minimal 3 'a'
a{3,5}  # antara 3 sampai 5 'a'

# Greedy vs Non-greedy
<.*>    # greedy: ambil sebanyak mungkin
<.*?>   # non-greedy: ambil sesedikit mungkin

teks = "<tag1>konten</tag1>"
re.findall(r'<.*>',  teks)   # ['<tag1>konten</tag1>']  (greedy)
re.findall(r'<.*?>', teks)   # ['<tag1>', '</tag1>']     (non-greedy)
```

---

## Fungsi-Fungsi re Module

```python
import re

teks = "Python 3.11 dirilis November 2022. Python 3.12 dirilis Oktober 2023."

# re.search() — cari pertama kali
match = re.search(r'Python \d+\.\d+', teks)
if match:
    print(match.group())    # Python 3.11
    print(match.start())    # index mulai
    print(match.end())      # index akhir
    print(match.span())     # (start, end)

# re.findall() — cari semua, return list of strings
versi = re.findall(r'Python \d+\.\d+', teks)
print(versi)  # ['Python 3.11', 'Python 3.12']

# re.finditer() — cari semua, return iterator of match objects
for match in re.finditer(r'Python (\d+\.\d+)', teks):
    print(f"Versi: {match.group(1)} di posisi {match.start()}")

# re.sub() — replace
hasil = re.sub(r'Python \d+\.\d+', 'Python X.XX', teks)
print(hasil)

# re.split() — split berdasarkan pattern
parts = re.split(r'[,;\s]+', "kata1, kata2;kata3   kata4")
print(parts)  # ['kata1', 'kata2', 'kata3', 'kata4']

# re.fullmatch() — harus cocok seluruhnya
print(re.fullmatch(r'\d{5}', '12345'))  # Match
print(re.fullmatch(r'\d{5}', '1234'))   # None
```

---

## Groups dan Named Groups

```python
import re

# Grouping dengan ()
teks = "2026-08-16"
match = re.search(r'(\d{4})-(\d{2})-(\d{2})', teks)
if match:
    print(match.group(0))   # '2026-08-16' (seluruh match)
    print(match.group(1))   # '2026' (group 1)
    print(match.group(2))   # '08'   (group 2)
    print(match.group(3))   # '16'   (group 3)
    print(match.groups())   # ('2026', '08', '16')

# Named groups (?P<name>...)
match = re.search(r'(?P<tahun>\d{4})-(?P<bulan>\d{2})-(?P<hari>\d{2})', teks)
if match:
    print(match.group('tahun'))   # 2026
    print(match.group('bulan'))   # 08
    print(match.groupdict())      # {'tahun': '2026', 'bulan': '08', 'hari': '16'}
```

---

## Flags

```python
# re.IGNORECASE (re.I) — abaikan huruf besar/kecil
re.findall(r'python', teks, re.IGNORECASE)  # temukan Python, PYTHON, python

# re.MULTILINE (re.M) — ^ dan $ berlaku per baris
re.findall(r'^\w+', teks, re.MULTILINE)

# re.DOTALL (re.S) — . cocok dengan newline juga
re.search(r'<div>.*</div>', html, re.DOTALL)

# Gabungkan flags
re.findall(r'python', teks, re.IGNORECASE | re.MULTILINE)
```

---

## Contoh Praktis

### Validasi Input

```python
import re

def validasi_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.fullmatch(pattern, email))

def validasi_ip(ip):
    pattern = r'^(\d{1,3}\.){3}\d{1,3}$'
    if not re.fullmatch(pattern, ip):
        return False
    # Cek range 0-255
    return all(0 <= int(x) <= 255 for x in ip.split('.'))

def validasi_password(pw):
    # Min 8 karakter, ada huruf besar, kecil, angka, simbol
    return bool(re.fullmatch(
        r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&*!]).{8,}$', pw
    ))

print(validasi_email("test@example.com"))    # True
print(validasi_email("bukan-email"))          # False
print(validasi_ip("192.168.1.1"))             # True
print(validasi_ip("999.0.0.1"))               # False
print(validasi_password("Abc123!@#"))         # True
```

### Log Analysis

```python
import re
from collections import Counter

log = """
192.168.1.100 - - [16/Sep/2026:10:23:15] "GET /admin HTTP/1.1" 403 1234
10.0.0.5 - - [16/Sep/2026:10:24:01] "POST /login HTTP/1.1" 200 567
192.168.1.100 - - [16/Sep/2026:10:24:15] "GET /wp-admin HTTP/1.1" 404 890
10.0.0.5 - - [16/Sep/2026:10:25:00] "GET / HTTP/1.1" 200 4567
192.168.1.100 - - [16/Sep/2026:10:25:30] "GET /etc/passwd HTTP/1.1" 404 0
"""

# Extract semua IP
ips = re.findall(r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}', log)
print("IP count:", Counter(ips))

# Cari request yang mencurigakan (403, 404 ke path sensitif)
suspicious = re.findall(
    r'(\d+\.\d+\.\d+\.\d+).+"[A-Z]+ (/\S*) HTTP/\S+" (403|404)',
    log
)
for ip, path, code in suspicious:
    print(f"Suspicious: {ip} → {path} ({code})")
```

### Extract Data dari HTML

```python
import re

html = """
<h1>Judul Halaman</h1>
<a href="https://google.com">Google</a>
<a href="/about">About</a>
<img src="photo.jpg" alt="Foto">
<p>Email: admin@site.com</p>
"""

# Extract semua link
links = re.findall(r'href=["\']([^"\']+)["\']', html)
print("Links:", links)

# Extract semua email
emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', html)
print("Emails:", emails)

# Extract text dari tag
texts = re.findall(r'<[^>]+>([^<]+)</', html)
print("Texts:", [t.strip() for t in texts if t.strip()])
```

---

## Tips Regex

1. **Test regex di regex101.com** — visualisasi interaktif, penjelasan tiap bagian
2. **Compile pattern yang sering dipakai** untuk performa lebih baik:
   ```python
   pattern = re.compile(r'\d+\.\d+\.\d+\.\d+')
   pattern.findall(teks)  # lebih cepat jika dipakai berkali-kali
   ```
3. **Jangan over-engineer** — untuk parsing HTML/XML, lebih baik pakai BeautifulSoup
4. **Escape karakter spesial** dalam input user: `re.escape(user_input)`

---

## Penutup

Regex adalah satu dari sekian tool yang terlihat rumit tapi sangat worth it untuk dipelajari. Satu pola regex yang tepat bisa menggantikan loop panjang dan kondisi yang kompleks. Praktik dengan log analisis atau data parsing adalah cara terbaik untuk mulai.

Artikel selanjutnya: **Python: Virtual Environment dan Dependency Management** — cara mengelola proyek Python yang bersih dan terisolasi.
