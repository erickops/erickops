# Password Attacks: Teknik dan Cara Bertahan

Password masih jadi mekanisme autentikasi paling umum di dunia — dan juga salah satu yang paling sering berhasil dibobol. Memahami bagaimana attacker menyerang password adalah langkah pertama untuk bisa mempertahankan diri.

---

## Kenapa Password Masih Jadi Target?

Meskipun ada teknologi autentikasi yang lebih canggih (biometrik, hardware key, dll), sebagian besar sistem masih bergantung pada password karena:
- Murah dan mudah diimplementasikan
- Familiar untuk semua orang
- Tidak butuh hardware tambahan

Dan masalahnya: manusia membuat password yang buruk. "123456", "password", nama hewan peliharaan, tanggal lahir — ini semua mudah ditebak atau di-crack.

---

## Jenis Password Attack

### 1. Brute Force
Mencoba **semua kemungkinan kombinasi** sampai menemukan yang benar.

```
Mencoba: a, b, c, ... z, aa, ab, ... zz, aaa, ...
```

- Efektif untuk password pendek
- Makin panjang password, makin lama (secara eksponensial)
- Password 8 karakter alfanumerik: ~218 triliun kombinasi

```bash
# Contoh dengan Hydra (brute force online)
hydra -l admin -P /usr/share/wordlists/rockyou.txt ssh://192.168.1.100

# Brute force web form
hydra -l admin -P rockyou.txt http-post-form \
  "/login:username=^USER^&password=^PASS^:Invalid credentials"
```

### 2. Dictionary Attack
Menggunakan **wordlist** — daftar kata umum, password yang pernah bocor, dan variasi populer.

```bash
# Wordlist terkenal
/usr/share/wordlists/rockyou.txt  # 14 juta password bocor

# John the Ripper dengan wordlist
john --wordlist=/usr/share/wordlists/rockyou.txt hash.txt

# Hashcat dengan wordlist
hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt
```

### 3. Credential Stuffing
Menggunakan **kombinasi username:password dari data breach** sebelumnya untuk mencoba login ke layanan lain.

Ini bekerja karena banyak orang pakai password yang sama di banyak tempat.

```
Data breach site A → username:password bocor
Attacker coba kombinasi itu di Gmail, Facebook, Bank, dll
Kalau ada yang sama → berhasil masuk
```

### 4. Password Spraying
Kebalikan dari brute force — coba **satu password ke banyak akun**.

```
Coba "Spring2026!" ke 1000 akun berbeda
Berguna karena banyak sistem block setelah X percobaan gagal
tapi per-akun hanya dicoba sekali
```

### 5. Rainbow Table Attack
Menggunakan tabel pre-computed hash untuk reverse lookup.

```
Hash: 5f4dcc3b5aa765d61d8327deb882cf99
Rainbow table lookup → "password"
```

Ini hanya efektif kalau hash tidak di-**salt**.

### 6. Phishing
Manipulasi korban untuk **secara sukarela memberikan** passwordnya ke halaman palsu.

---

## Hash Cracking

Sistem yang baik tidak menyimpan password plaintext — mereka menyimpan **hash**-nya. Tapi hash bisa di-crack.

```bash
# Identifikasi tipe hash
hash-identifier "5f4dcc3b5aa765d61d8327deb882cf99"
# → MD5

# Hashcat — GPU-accelerated cracker
# Mode: -m 0=MD5, 100=SHA1, 1800=SHA512crypt, 3200=bcrypt

# Dictionary attack
hashcat -m 0 hash.txt rockyou.txt

# Brute force (mask attack)
hashcat -m 0 hash.txt -a 3 ?l?l?l?l?l?l?l?l  # 8 huruf kecil
hashcat -m 0 hash.txt -a 3 ?u?l?l?l?d?d?d?s   # Upper+lower+digit+special

# Rule-based attack (modifikasi wordlist)
hashcat -m 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule
```

### Mask Characters

| Mask | Karakter |
|------|---------|
| `?l` | a-z (lowercase) |
| `?u` | A-Z (uppercase) |
| `?d` | 0-9 (digit) |
| `?s` | spesial (!@#$...) |
| `?a` | semua printable |

---

## Cara Bertahan

### Untuk User

1. **Pakai password manager** — Bitwarden (gratis, open source), 1Password, KeePassXC
2. **Password unik untuk setiap layanan** — jangan pakai ulang password
3. **Password panjang** — 16+ karakter lebih aman dari yang pendek tapi kompleks
4. **Aktifkan 2FA/MFA** — bahkan kalau password bocor, attacker masih butuh faktor kedua
5. **Cek apakah email kamu pernah bocor** — [haveibeenpwned.com](https://haveibeenpwned.com)

### Untuk Developer / SysAdmin

```python
# Hashing password yang benar — gunakan bcrypt/argon2
import bcrypt

# Hash
password = b"SuperSecretPassword123!"
salt     = bcrypt.gensalt(rounds=12)  # cost factor
hashed   = bcrypt.hashpw(password, salt)

# Verify
bcrypt.checkpw(b"SuperSecretPassword123!", hashed)  # True

# JANGAN pakai MD5/SHA1 untuk password!
# SELALU pakai salt!
```

```bash
# Konfigurasi rate limiting di Nginx
limit_req_zone $binary_remote_addr zone=login:10m rate=5r/m;

location /login {
    limit_req zone=login burst=3 nodelay;
    # ... rest of config
}
```

---

## Account Lockout Policy

```
Rekomendasi NIST (SP 800-63B):
- Lockout setelah 5-10 percobaan gagal
- Lockout duration: minimal 30 menit
- Alerting untuk brute force yang terdeteksi
- Tidak ada kompleksitas password wajib (justru kontraproduktif)
- Fokus pada panjang password (minimum 8, rekomendasikan 15+)
- Cek password baru terhadap database password yang sudah diketahui bocor
```

---

## Penutup

Password attacks adalah salah satu vektor serangan yang paling sukses bukan karena teknologinya canggih, tapi karena manusianya membuat password yang buruk dan menggunakannya di mana-mana. Password manager + MFA adalah kombinasi paling efektif untuk pertahanan pribadi.

Artikel selanjutnya: **Network Attacks & Defense** — teknik serangan jaringan umum dan bagaimana mendeteksi serta mencegahnya.
