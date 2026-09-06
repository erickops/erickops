# Python untuk Cybersecurity: Dari Scripting sampai Automasi

Python adalah bahasa pilihan utama di dunia cybersecurity. Hampir semua tools security modern ditulis dalam Python — Metasploit modules, exploit scripts, network scanners, log analyzers. Di artikel ini kita bahas bagaimana Python digunakan secara nyata dalam konteks security.

---

## Kenapa Python untuk Security?

- **Library lengkap** — `socket`, `requests`, `scapy`, `paramiko` tersedia
- **Cepat dibuat** — scripting cepat untuk automasi task repetitif
- **Cross-platform** — jalan di Linux, Windows, Mac
- **Komunitas besar** — banyak exploit dan tool yang sudah dibuat
- **Readable** — kode mudah dipahami dan dimodifikasi

---

## 1. Network Programming dengan Socket

Socket adalah fondasi komunikasi jaringan di Python:

```python
import socket

# Resolve hostname ke IP
ip = socket.gethostbyname("google.com")
print(f"google.com → {ip}")

# Buat simple port scanner
def scan_port(host, port):
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    sock.settimeout(1)  # timeout 1 detik
    result = sock.connect_ex((host, port))
    sock.close()
    return result == 0  # 0 = berhasil connect = port terbuka

# Scan range port
target = "127.0.0.1"
print(f"\nScanning {target}...")
for port in range(1, 1025):
    if scan_port(target, port):
        print(f"  Port {port}: OPEN")
```

### Simple TCP Server & Client

```python
# server.py
import socket

server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind(("0.0.0.0", 9999))
server.listen(5)
print("Server listening on port 9999...")

conn, addr = server.accept()
print(f"Connected from {addr}")
data = conn.recv(1024).decode()
print(f"Received: {data}")
conn.send("Message received!".encode())
conn.close()

# client.py
import socket

client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
client.connect(("127.0.0.1", 9999))
client.send("Hello, Server!".encode())
response = client.recv(1024).decode()
print(f"Server says: {response}")
client.close()
```

---

## 2. HTTP Requests dengan `requests`

```bash
pip install requests
```

```python
import requests

# GET request
response = requests.get("https://httpbin.org/get")
print(response.status_code)   # 200
print(response.json())        # response body sebagai dict
print(response.headers)       # response headers

# POST request (login simulation)
payload = {"username": "admin", "password": "password123"}
r = requests.post("https://httpbin.org/post", data=payload)
print(r.status_code)

# Custom headers (bypass simple checks)
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "text/html,application/xhtml+xml"
}
r = requests.get("https://example.com", headers=headers)

# Cek redirect
r = requests.get("https://httpbin.org/redirect/3", allow_redirects=False)
print(r.headers.get("Location"))  # URL redirect tujuan

# Session untuk maintain cookies
session = requests.Session()
session.get("https://httpbin.org/cookies/set?session=abc123")
r = session.get("https://httpbin.org/cookies")
print(r.json())  # cookies tersimpan otomatis
```

---

## 3. Parsing dan Analisis

### Parsing HTML dengan BeautifulSoup

```bash
pip install beautifulsoup4
```

```python
from bs4 import BeautifulSoup
import requests

r = requests.get("https://example.com")
soup = BeautifulSoup(r.text, "html.parser")

# Ambil semua link
links = soup.find_all("a")
for link in links:
    print(link.get("href"))

# Ambil judul halaman
print(soup.title.text)

# Cari form (berguna untuk recon)
forms = soup.find_all("form")
for form in forms:
    print(f"Action: {form.get('action')}")
    inputs = form.find_all("input")
    for inp in inputs:
        print(f"  Input: name={inp.get('name')}, type={inp.get('type')}")
```

### Analisis Log dengan Regex

```python
import re

# Contoh log access
log = """
192.168.1.100 - - [16/Aug/2026:10:23:15] "GET /admin HTTP/1.1" 403 1234
10.0.0.5 - - [16/Aug/2026:10:24:01] "POST /login HTTP/1.1" 200 567
192.168.1.100 - - [16/Aug/2026:10:24:15] "GET /wp-admin HTTP/1.1" 404 890
"""

# Extract semua IP address
ip_pattern = r'\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
ips = re.findall(ip_pattern, log)
print("IP addresses:", set(ips))

# Cari request yang return 403/404
error_pattern = r'(\d+\.\d+\.\d+\.\d+).+"(\w+\s+\S+).*"\s+(403|404)'
errors = re.findall(error_pattern, log)
for ip, path, code in errors:
    print(f"Suspicious: {ip} → {path} ({code})")
```

---

## 4. Kriptografi dengan `hashlib`

```python
import hashlib

# Hash sebuah string
text = "password123"
md5_hash    = hashlib.md5(text.encode()).hexdigest()
sha1_hash   = hashlib.sha1(text.encode()).hexdigest()
sha256_hash = hashlib.sha256(text.encode()).hexdigest()

print(f"MD5:    {md5_hash}")
print(f"SHA1:   {sha1_hash}")
print(f"SHA256: {sha256_hash}")

# Hash file
def hash_file(filepath):
    sha256 = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            sha256.update(chunk)
    return sha256.hexdigest()

# Verifikasi integritas file
# print(hash_file("malware_sample.exe"))

# Simple password cracker (dictionary attack)
def crack_md5(target_hash, wordlist_file):
    with open(wordlist_file, "r") as f:
        for word in f:
            word = word.strip()
            if hashlib.md5(word.encode()).hexdigest() == target_hash:
                return word
    return None
```

---

## 5. Automasi SSH dengan Paramiko

```bash
pip install paramiko
```

```python
import paramiko

def ssh_command(host, user, password, command):
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())

    try:
        client.connect(host, username=user, password=password, timeout=5)
        stdin, stdout, stderr = client.exec_command(command)
        output = stdout.read().decode()
        error  = stderr.read().decode()
        return output, error
    except Exception as e:
        return None, str(e)
    finally:
        client.close()

# Contoh penggunaan
output, error = ssh_command("192.168.1.10", "admin", "password", "whoami")
print(f"Output: {output}")
```

---

## 6. Script Lengkap: Simple Vulnerability Scanner

```python
import socket
import requests
import sys

def scan(target):
    print(f"\n{'='*50}")
    print(f"Scanning: {target}")
    print(f"{'='*50}\n")

    # Port scan
    print("[*] Port Scan:")
    common_ports = [21, 22, 23, 25, 53, 80, 110, 443, 445, 3306, 8080]
    open_ports = []
    for port in common_ports:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(1)
        if sock.connect_ex((target, port)) == 0:
            open_ports.append(port)
            print(f"  [OPEN] Port {port}")
        sock.close()

    # HTTP check
    if 80 in open_ports or 443 in open_ports:
        print("\n[*] HTTP Analysis:")
        proto = "https" if 443 in open_ports else "http"
        try:
            r = requests.get(f"{proto}://{target}", timeout=5, verify=False)
            print(f"  Status: {r.status_code}")
            print(f"  Server: {r.headers.get('Server', 'Hidden')}")
            print(f"  X-Powered-By: {r.headers.get('X-Powered-By', 'Not disclosed')}")

            # Cek security headers
            security_headers = [
                "Strict-Transport-Security",
                "Content-Security-Policy",
                "X-Frame-Options",
                "X-Content-Type-Options"
            ]
            print("\n  [Security Headers]:")
            for h in security_headers:
                status = "✓" if h in r.headers else "✗ MISSING"
                print(f"    {h}: {status}")
        except Exception as e:
            print(f"  Error: {e}")

if __name__ == "__main__":
    target = sys.argv[1] if len(sys.argv) > 1 else "127.0.0.1"
    scan(target)
```

---

## Penutup

Python di cybersecurity bukan tentang "belajar Python dulu baru security" — keduanya bisa dipelajari bersamaan. Setiap kali kamu butuh automasi sesuatu dalam security workflow, Python adalah alat pertama yang harus kamu ambil.

Mulai dari script kecil: port scanner, log analyzer, hash cracker. Dari situ kemampuanmu akan berkembang secara organik sesuai kebutuhan.
