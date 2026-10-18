# Python: Automasi dengan os, subprocess, dan schedule

Salah satu kekuatan Python yang sering diremehkan adalah kemampuannya mengotomasi task yang biasanya kamu lakukan secara manual — rename file, backup folder, jalankan command, kirim notifikasi, sampai jadwalkan task berulang. Semuanya bisa dilakukan dengan beberapa modul bawaan Python.

---

## Modul os — Interaksi dengan Sistem File

Modul `os` memberikan akses ke fungsi-fungsi sistem operasi — manipulasi file, direktori, environment variable, dan lainnya.

```python
import os

# ── Navigasi Direktori ──────────────────────
print(os.getcwd())              # direktori saat ini
os.chdir("/tmp")                # pindah direktori
os.makedirs("folder/sub", exist_ok=True)  # buat nested folder
os.rmdir("folder_kosong")       # hapus folder kosong

# ── Operasi File ────────────────────────────
os.rename("lama.txt", "baru.txt")    # rename file
os.remove("file.txt")                # hapus file
os.path.exists("file.txt")           # cek apakah ada
os.path.getsize("file.txt")          # ukuran dalam bytes

# ── Info Path ───────────────────────────────
path = "/home/user/dokumen/laporan.pdf"
print(os.path.basename(path))    # laporan.pdf
print(os.path.dirname(path))     # /home/user/dokumen
print(os.path.splitext(path))    # ('/home/user/dokumen/laporan', '.pdf')
print(os.path.join("/home", "user", "file.txt"))  # /home/user/file.txt

# ── List Direktori ──────────────────────────
for item in os.listdir("."):
    print(item)

# Rekursif dengan os.walk
for root, dirs, files in os.walk("/home/user/dokumen"):
    for file in files:
        full_path = os.path.join(root, file)
        print(full_path)

# ── Environment Variable ────────────────────
print(os.environ.get("HOME"))         # /home/user
print(os.environ.get("API_KEY", ""))  # kosong kalau tidak ada
os.environ["MY_VAR"] = "nilai"        # set env var (sesi ini saja)
```

---

## Modul shutil — Operasi File Tingkat Tinggi

`shutil` (shell utilities) untuk copy, move, dan archive:

```python
import shutil

# Copy file
shutil.copy("sumber.txt", "tujuan.txt")
shutil.copy2("sumber.txt", "tujuan.txt")  # termasuk metadata

# Copy direktori
shutil.copytree("folder_sumber", "folder_tujuan")

# Move file/folder
shutil.move("file.txt", "/backup/file.txt")

# Hapus direktori beserta isinya
shutil.rmtree("folder_tidak_perlu")

# Kompresi
shutil.make_archive("backup_2026", "zip", "folder_yang_dibackup")
shutil.make_archive("backup_2026", "tar", "folder_yang_dibackup")

# Ekstrak
shutil.unpack_archive("backup_2026.zip", "hasil_ekstrak")
```

---

## Contoh Nyata: Script Backup Otomatis

```python
import os
import shutil
from datetime import datetime

def backup(source_dir, backup_dir):
    """
    Backup folder source ke backup_dir dengan timestamp.
    """
    # Validasi
    if not os.path.exists(source_dir):
        raise FileNotFoundError(f"Source tidak ditemukan: {source_dir}")

    # Buat nama backup dengan timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_name = f"backup_{timestamp}"
    backup_path = os.path.join(backup_dir, backup_name)

    # Pastikan backup dir ada
    os.makedirs(backup_dir, exist_ok=True)

    # Buat backup
    shutil.copytree(source_dir, backup_path)
    print(f"✅ Backup berhasil: {backup_path}")

    # Prune backup lama — simpan hanya 7 terakhir
    backups = sorted([
        d for d in os.listdir(backup_dir)
        if d.startswith("backup_")
    ])
    while len(backups) > 7:
        old = os.path.join(backup_dir, backups.pop(0))
        shutil.rmtree(old)
        print(f"🗑️  Hapus backup lama: {old}")

    return backup_path

# Jalankan
backup("/home/user/Documents", "/home/user/Backups")
```

---

## Modul subprocess — Jalankan Command Sistem

`subprocess` memungkinkan Python menjalankan command terminal/shell, menangkap output, dan mengirim input.

```python
import subprocess

# Jalankan command sederhana
result = subprocess.run(["ls", "-la"], capture_output=True, text=True)
print(result.stdout)
print(result.returncode)   # 0 = sukses

# Jalankan dan tunggu selesai
subprocess.run(["ping", "-c", "4", "8.8.8.8"])

# Tangkap output untuk diproses
result = subprocess.run(
    ["nmap", "-sn", "192.168.1.0/24"],
    capture_output=True,
    text=True,
    timeout=30
)
if result.returncode == 0:
    print(result.stdout)
else:
    print(f"Error: {result.stderr}")

# Jalankan command shell (gunakan dengan hati-hati — risiko injection)
result = subprocess.run(
    "df -h | grep /dev/sda",
    shell=True,
    capture_output=True,
    text=True
)
print(result.stdout)
```

### Popen — Untuk Process yang Berjalan Lama

```python
import subprocess

# Jalankan proses di background, baca output real-time
process = subprocess.Popen(
    ["ping", "8.8.8.8"],
    stdout=subprocess.PIPE,
    text=True
)

# Baca output baris per baris
for line in process.stdout:
    print(line.strip())
    if "5 packets" in line:
        process.terminate()
        break
```

---

## Modul pathlib — Cara Modern Manajemen Path

Python 3.4+ punya `pathlib` yang lebih elegan dari `os.path`:

```python
from pathlib import Path

# Buat path object
p = Path("/home/user/dokumen")
home = Path.home()   # home directory user

# Navigasi
config = home / ".config" / "app" / "settings.json"  # join dengan /
print(config.parent)   # .../app
print(config.stem)     # settings
print(config.suffix)   # .json
print(config.name)     # settings.json

# Operasi
config.parent.mkdir(parents=True, exist_ok=True)
config.write_text('{"theme": "dark"}')
content = config.read_text()
config.unlink()   # hapus file

# Glob — cari file dengan pattern
docs = Path("/home/user/dokumen")
for pdf in docs.glob("**/*.pdf"):   # rekursif
    print(pdf)
for py in docs.glob("*.py"):        # tidak rekursif
    print(py)

# Cek
print(config.exists())
print(config.is_file())
print(config.is_dir())
```

---

## Modul schedule — Jadwalkan Task

```bash
pip install schedule
```

```python
import schedule
import time
from datetime import datetime

def backup_harian():
    print(f"[{datetime.now()}] Menjalankan backup harian...")
    # backup logic di sini

def cek_server():
    import subprocess
    result = subprocess.run(["ping", "-c", "1", "8.8.8.8"],
                          capture_output=True)
    status = "UP" if result.returncode == 0 else "DOWN"
    print(f"[{datetime.now()}] Server status: {status}")

def kirim_laporan():
    print(f"[{datetime.now()}] Mengirim laporan mingguan...")

# Jadwalkan
schedule.every().day.at("02:00").do(backup_harian)
schedule.every(5).minutes.do(cek_server)
schedule.every().monday.at("08:00").do(kirim_laporan)
schedule.every().hour.do(lambda: print("Ping!"))

print("Scheduler jalan. Ctrl+C untuk berhenti.")
while True:
    schedule.run_pending()
    time.sleep(1)
```

---

## Mini Project: Batch File Organizer

```python
import os
import shutil
from pathlib import Path

# Kategori file berdasarkan ekstensi
CATEGORIES = {
    "Gambar":    [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".webp"],
    "Dokumen":   [".pdf", ".doc", ".docx", ".txt", ".xlsx", ".pptx"],
    "Video":     [".mp4", ".mkv", ".avi", ".mov", ".wmv"],
    "Audio":     [".mp3", ".wav", ".flac", ".aac", ".ogg"],
    "Kode":      [".py", ".js", ".html", ".css", ".java", ".cpp"],
    "Arsip":     [".zip", ".rar", ".tar", ".gz", ".7z"],
}

def organize_folder(folder_path):
    folder = Path(folder_path)
    moved = 0

    for file in folder.iterdir():
        if file.is_dir():
            continue   # skip subfolder

        ext = file.suffix.lower()
        category = "Lainnya"   # default

        for cat, extensions in CATEGORIES.items():
            if ext in extensions:
                category = cat
                break

        # Buat subfolder kategori
        dest_folder = folder / category
        dest_folder.mkdir(exist_ok=True)

        # Pindahkan file
        dest = dest_folder / file.name
        if not dest.exists():   # hindari overwrite
            shutil.move(str(file), str(dest))
            print(f"  {file.name} → {category}/")
            moved += 1

    print(f"\n✅ Selesai. {moved} file diorganisir.")

# Jalankan
organize_folder("/home/user/Downloads")
```

---

## Penutup

Automasi dengan Python bukan hanya soal menghemat waktu — ini soal mengurangi human error, memastikan konsistensi, dan membebaskan dirimu dari task repetitif yang membosankan.

Mulai dari script kecil yang solving masalah nyata di keseharian kamu. Dari satu script sederhana, kamu bisa berkembang ke sistem automasi yang lebih kompleks.
