# Python: Virtual Environment dan Dependency Management

Bayangkan kamu punya dua project Python: Project A butuh `requests==2.26`, Project B butuh `requests==2.31`. Kalau diinstall global, pasti konflik. Solusinya: **virtual environment** — ruang terisolasi untuk tiap project.

---

## Masalah Tanpa Virtual Environment

```bash
# Install semua ke global Python
pip install requests==2.26   # untuk Project A
pip install requests==2.31   # untuk Project B → timpa yang sebelumnya!

# Project A sekarang bisa error karena versi berubah
```

Ini yang disebut **dependency hell** — dan virtual environment adalah solusinya.

---

## venv — Built-in Virtual Environment

`venv` sudah tersedia di Python 3.3+, tidak perlu install apapun.

```bash
# Buat virtual environment
python3 -m venv nama_env

# Struktur yang dibuat:
# nama_env/
# ├── bin/          (Linux/Mac)   atau Scripts/  (Windows)
# │   ├── python
# │   ├── pip
# │   └── activate
# ├── lib/
# └── pyvenv.cfg

# Aktifkan virtual environment
source nama_env/bin/activate        # Linux/Mac
nama_env\Scripts\activate           # Windows (CMD)
.\nama_env\Scripts\Activate.ps1     # Windows (PowerShell)

# Prompt berubah: (nama_env) user@host:~$

# Sekarang semua pip install masuk ke env ini, bukan global
pip install requests
pip install flask

# Cek apa yang terinstall di env ini
pip list

# Deaktifkan
deactivate
```

---

## Workflow yang Disarankan

```bash
# 1. Buat project baru
mkdir my_project && cd my_project

# 2. Buat virtual environment (nama konvensional: venv atau .venv)
python3 -m venv venv

# 3. Aktifkan
source venv/bin/activate   # Linux/Mac
.\venv\Scripts\activate    # Windows

# 4. Install dependencies
pip install requests flask sqlalchemy

# 5. Simpan dependencies ke file
pip freeze > requirements.txt

# requirements.txt:
# Flask==3.0.0
# requests==2.31.0
# SQLAlchemy==2.0.23
# ...

# 6. Kerja di project

# 7. Kalau mau share project ke orang lain
# Mereka tinggal:
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

---

## .gitignore untuk Virtual Environment

Virtual environment tidak boleh di-push ke GitHub — ukurannya besar dan tidak perlu.

```bash
# Tambahkan ke .gitignore
echo "venv/" >> .gitignore
echo ".venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
echo ".env" >> .gitignore
```

---

## pip — Package Manager Python

### Perintah pip yang Penting

```bash
# Install package
pip install requests
pip install requests==2.31.0      # versi spesifik
pip install "requests>=2.28,<3"   # range versi
pip install requests flask numpy  # multiple sekaligus

# Install dari requirements.txt
pip install -r requirements.txt

# Update package
pip install --upgrade requests

# Uninstall
pip uninstall requests

# Cari package
pip search requests  # (sudah deprecated, pakai pypi.org)

# Info package
pip show requests

# Daftar semua yang terinstall
pip list
pip list --outdated   # cek yang outdated

# Generate requirements.txt
pip freeze > requirements.txt

# Install tanpa cache (untuk troubleshoot)
pip install --no-cache-dir requests
```

---

## requirements.txt vs pyproject.toml

### requirements.txt — Cara Lama, Masih Relevan

```
# requirements.txt
requests==2.31.0
flask==3.0.0
python-dotenv==1.0.0

# Untuk development saja
# requirements-dev.txt
pytest==7.4.0
black==23.9.1
flake8==6.1.0
```

### pyproject.toml — Standar Modern

Standar baru yang direkomendasikan untuk project yang lebih serius:

```toml
[tool.poetry]
name = "my-project"
version = "0.1.0"
description = "My awesome project"

[tool.poetry.dependencies]
python = "^3.11"
requests = "^2.31"
flask = "^3.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4"
black = "^23.9"
```

---

## pipenv — Alternatif Populer

`pipenv` menggabungkan `venv` + `pip` dalam satu tool dengan `Pipfile` yang lebih readable:

```bash
# Install
pip install pipenv

# Buat environment dan install package
pipenv install requests flask

# Install dev dependency
pipenv install pytest --dev

# Aktifkan shell
pipenv shell

# Jalankan command dalam environment
pipenv run python script.py
pipenv run pytest

# Generate requirements.txt dari Pipfile.lock
pipenv requirements > requirements.txt
```

---

## Poetry — Tool Modern yang Disarankan

`poetry` adalah dependency manager modern yang handle semua aspek: environment, dependencies, versioning, dan publishing.

```bash
# Install
curl -sSL https://install.python-poetry.org | python3 -

# Buat project baru
poetry new my-project
# atau init di folder existing
poetry init

# Tambah dependency
poetry add requests flask
poetry add pytest --group dev

# Install semua dependencies
poetry install

# Aktifkan shell
poetry shell

# Update dependencies
poetry update

# Lihat dependency tree
poetry show --tree
```

---

## Environment Variables dengan python-dotenv

Jangan hardcode API keys, passwords, atau config sensitif di kode — simpan di file `.env`:

```bash
pip install python-dotenv
```

```bash
# .env (JANGAN di-push ke GitHub!)
DATABASE_URL=postgresql://user:pass@localhost/dbname
API_KEY=sk-abc123def456
DEBUG=True
SECRET_KEY=your-super-secret-key
```

```python
# config.py
from dotenv import load_dotenv
import os

load_dotenv()  # baca .env file

DATABASE_URL = os.getenv("DATABASE_URL")
API_KEY      = os.getenv("API_KEY")
DEBUG        = os.getenv("DEBUG", "False").lower() == "true"

# Gunakan di kode
print(DATABASE_URL)  # postgresql://user:pass@localhost/dbname
```

---

## Struktur Project Python yang Baik

```
my_project/
├── src/
│   └── my_project/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       └── utils.py
├── tests/
│   ├── __init__.py
│   └── test_main.py
├── venv/                  ← tidak di-push ke GitHub
├── .env                   ← tidak di-push ke GitHub
├── .env.example           ← template, di-push ke GitHub
├── .gitignore
├── requirements.txt
├── README.md
└── pyproject.toml
```

---

## Penutup

Virtual environment dan dependency management adalah skill yang sering diabaikan pemula tapi sangat penting saat bekerja di proyek nyata. Mulai dari sekarang: setiap project Python baru = virtual environment baru.

Artikel selanjutnya: **Python: Concurrency dengan Threading dan asyncio** — cara menjalankan multiple task secara bersamaan untuk performa lebih baik.
