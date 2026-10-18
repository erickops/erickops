# Python: Working with APIs

Hampir semua aplikasi modern berkomunikasi dengan API — dari mengambil data cuaca, integrasi payment gateway, sampai mengotomasi task di GitHub. Python, dengan library `requests`-nya, membuat kerja dengan API menjadi sangat simpel.

---

## Apa Itu API?

**API (Application Programming Interface)** adalah cara dua program berkomunikasi satu sama lain. **REST API** adalah yang paling umum — menggunakan HTTP sebagai protokol dan JSON sebagai format data.

```
Kamu (client)           Server API
      |                      |
      |── GET /users ────────>|
      |                      |
      |<── 200 OK + JSON ────|
      |   [{id:1, name:...}] |
```

---

## HTTP Methods

| Method | Kegunaan |
|--------|---------|
| **GET** | Ambil data |
| **POST** | Kirim/buat data baru |
| **PUT** | Update data (replace penuh) |
| **PATCH** | Update sebagian data |
| **DELETE** | Hapus data |

---

## Library requests

```bash
pip install requests
```

### GET Request — Ambil Data

```python
import requests

# Request sederhana
response = requests.get("https://api.github.com/users/erickops")

# Cek status code
print(response.status_code)   # 200 = OK, 404 = Not Found, 500 = Error

# Ambil data JSON
data = response.json()
print(data["name"])
print(data["public_repos"])

# Tambah query parameters
params = {
    "q":       "python",
    "sort":    "stars",
    "order":   "desc",
    "per_page": 5
}
r = requests.get("https://api.github.com/search/repositories", params=params)
repos = r.json()["items"]
for repo in repos:
    print(f"{repo['full_name']}: ⭐ {repo['stargazers_count']}")
```

### POST Request — Kirim Data

```python
import requests

# POST dengan JSON body
payload = {
    "title":  "Test Todo",
    "body":   "Testing POST request",
    "userId": 1
}

r = requests.post(
    "https://jsonplaceholder.typicode.com/posts",
    json=payload   # otomatis set Content-Type: application/json
)

print(r.status_code)   # 201 Created
print(r.json())
```

### Headers dan Authentication

```python
# Custom headers
headers = {
    "User-Agent":    "MyApp/1.0",
    "Accept":        "application/json",
    "Authorization": "Bearer YOUR_TOKEN_HERE"
}

r = requests.get("https://api.example.com/data", headers=headers)

# Basic Auth
r = requests.get(
    "https://api.example.com/private",
    auth=("username", "password")
)

# API Key di query param
r = requests.get(
    "https://api.openweathermap.org/data/2.5/weather",
    params={"q": "Jakarta", "appid": "YOUR_API_KEY", "units": "metric"}
)
```

---

## Contoh Nyata: GitHub API

```python
import requests

class GitHubAPI:
    BASE_URL = "https://api.github.com"

    def __init__(self, token=None):
        self.session = requests.Session()
        self.session.headers.update({
            "Accept": "application/vnd.github.v3+json"
        })
        if token:
            self.session.headers.update({"Authorization": f"token {token}"})

    def get_user(self, username):
        r = self.session.get(f"{self.BASE_URL}/users/{username}")
        r.raise_for_status()  # raise exception kalau status >= 400
        return r.json()

    def get_repos(self, username):
        r = self.session.get(f"{self.BASE_URL}/users/{username}/repos")
        r.raise_for_status()
        return r.json()

    def search_repos(self, query, sort="stars", limit=10):
        params = {"q": query, "sort": sort, "per_page": limit}
        r = self.session.get(f"{self.BASE_URL}/search/repositories", params=params)
        r.raise_for_status()
        return r.json()["items"]


# Penggunaan
github = GitHubAPI()

# Info user
user = github.get_user("torvalds")
print(f"Nama: {user['name']}")
print(f"Followers: {user['followers']:,}")
print(f"Repos: {user['public_repos']}")

# Cari repo Python populer
repos = github.search_repos("python security", limit=5)
for repo in repos:
    print(f"⭐ {repo['stargazers_count']:>6,} — {repo['full_name']}")
```

---

## Error Handling untuk API

```python
import requests
from requests.exceptions import ConnectionError, Timeout, HTTPError

def safe_api_call(url, **kwargs):
    try:
        response = requests.get(url, timeout=10, **kwargs)
        response.raise_for_status()  # raise HTTPError untuk 4xx/5xx
        return response.json()

    except ConnectionError:
        print("Tidak bisa konek ke server. Cek internet kamu.")
    except Timeout:
        print("Request timeout. Server terlalu lambat.")
    except HTTPError as e:
        code = e.response.status_code
        if code == 401:
            print("Unauthorized. Cek API key kamu.")
        elif code == 403:
            print("Forbidden. Tidak punya akses.")
        elif code == 404:
            print("Not found. URL atau resource tidak ada.")
        elif code == 429:
            print("Rate limit. Terlalu banyak request.")
        else:
            print(f"HTTP Error {code}: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

    return None
```

---

## Rate Limiting dan Pagination

### Rate Limiting

Banyak API membatasi jumlah request per waktu tertentu. Handle dengan `time.sleep()`:

```python
import requests
import time

def fetch_with_retry(url, max_retries=3):
    for attempt in range(max_retries):
        r = requests.get(url)
        if r.status_code == 429:
            # Ambil info retry-after dari header kalau ada
            wait = int(r.headers.get("Retry-After", 60))
            print(f"Rate limited. Tunggu {wait} detik...")
            time.sleep(wait)
            continue
        r.raise_for_status()
        return r.json()
    raise Exception("Max retries exceeded")
```

### Pagination

Banyak API mengirim data dalam halaman:

```python
def get_all_pages(base_url, params=None):
    all_data = []
    page = 1
    params = params or {}

    while True:
        params["page"] = page
        r = requests.get(base_url, params=params)
        data = r.json()

        if not data:  # halaman kosong = selesai
            break

        all_data.extend(data)
        page += 1

        # Hindari hammering server
        time.sleep(0.5)

    return all_data
```

---

## Bekerja dengan JSON

```python
import json
import requests

# Parse JSON dari response
r = requests.get("https://api.example.com/data")
data = r.json()   # otomatis parse

# Simpan ke file JSON
with open("data.json", "w") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)

# Baca dari file JSON
with open("data.json") as f:
    loaded = json.load(f)

# JSON ke string
json_str = json.dumps(data, indent=2)
print(json_str)

# String ke dict
parsed = json.loads('{"name": "Erick", "age": 20}')
print(parsed["name"])
```

---

## Mini Project: Weather CLI

```python
import requests
import os

def get_weather(city, api_key):
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q":     city,
        "appid": api_key,
        "units": "metric",
        "lang":  "id"
    }
    r = requests.get(url, params=params)
    r.raise_for_status()
    return r.json()

def display_weather(data):
    city    = data["name"]
    country = data["sys"]["country"]
    temp    = data["main"]["temp"]
    feels   = data["main"]["feels_like"]
    desc    = data["weather"][0]["description"]
    humidity = data["main"]["humidity"]
    wind    = data["wind"]["speed"]

    print(f"\n{'='*35}")
    print(f"  {city}, {country}")
    print(f"{'='*35}")
    print(f"  🌡️  Suhu      : {temp}°C (terasa {feels}°C)")
    print(f"  🌤️  Cuaca     : {desc.capitalize()}")
    print(f"  💧 Kelembaban : {humidity}%")
    print(f"  💨 Angin      : {wind} m/s")
    print(f"{'='*35}\n")

if __name__ == "__main__":
    API_KEY = os.environ.get("OPENWEATHER_API_KEY", "your_api_key_here")
    city = input("Masukkan nama kota: ")
    try:
        data = get_weather(city, API_KEY)
        display_weather(data)
    except requests.HTTPError as e:
        print(f"Error: {e}")
```

---

## Penutup

Kemampuan bekerja dengan API membuka pintu ke ratusan layanan yang bisa kamu integrasikan ke project kamu — data cuaca, maps, payment, AI, dan masih banyak lagi.

Artikel selanjutnya: **Python: Automasi dengan os, subprocess, dan schedule** — cara pakai Python untuk mengotomasi task di sistem operasi.
