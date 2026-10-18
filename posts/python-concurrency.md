# Python: Concurrency dengan Threading dan asyncio

Kalau kamu pernah nulis script yang harus fetch data dari 100 URL secara satu per satu dan nunggu lama banget — ini solusinya. **Concurrency** memungkinkan program menjalankan multiple task "bersamaan", tanpa harus nunggu satu selesai dulu baru mulai yang lain.

---

## Konsep Dasar: Concurrency vs Parallelism

```
Concurrency:
Task A: ████░░░░████░░░░████
Task B: ░░░░████░░░░████░░░░
(bergantian dengan cepat, terasa bersamaan)

Parallelism:
Task A: ████████████████████  (CPU core 1)
Task B: ████████████████████  (CPU core 2)
(benar-benar bersamaan di core berbeda)
```

Python punya **GIL (Global Interpreter Lock)** yang membatasi true parallelism untuk CPU-bound tasks di threading. Tapi untuk **I/O-bound tasks** (network, file, database), concurrency sangat efektif.

---

## I/O-bound vs CPU-bound

```
I/O-bound (concurrency sangat membantu):
- Fetch 100 URL dari internet
- Baca/tulis banyak file
- Query database berkali-kali
- Operasi yang banyak "menunggu"

CPU-bound (butuh multiprocessing):
- Komputasi matematika berat
- Image/video processing
- Machine learning training
- Enkripsi/dekripsi file besar
```

---

## Threading — Concurrency untuk I/O-bound

### Thread Dasar

```python
import threading
import time

def download_file(url, nama):
    print(f"Mulai download: {nama}")
    time.sleep(2)  # simulasi download
    print(f"Selesai: {nama}")

# Tanpa threading: 6 detik total
for i in range(3):
    download_file(f"http://example.com/file{i}", f"file{i}")

# Dengan threading: ~2 detik (semua jalan bersamaan)
threads = []
for i in range(3):
    t = threading.Thread(
        target=download_file,
        args=(f"http://example.com/file{i}", f"file{i}")
    )
    threads.append(t)
    t.start()

# Tunggu semua thread selesai
for t in threads:
    t.join()

print("Semua selesai!")
```

### ThreadPoolExecutor — Cara Modern

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
import time

def fetch_url(url):
    start = time.time()
    r = requests.get(url, timeout=10)
    elapsed = time.time() - start
    return url, r.status_code, f"{elapsed:.2f}s"

urls = [
    "https://httpbin.org/delay/1",
    "https://httpbin.org/delay/2",
    "https://httpbin.org/delay/1",
    "https://httpbin.org/get",
    "https://httpbin.org/ip",
]

# Tanpa concurrency: ~7 detik
start = time.time()
with ThreadPoolExecutor(max_workers=5) as executor:
    # Submit semua task sekaligus
    futures = {executor.submit(fetch_url, url): url for url in urls}

    # as_completed: process yang selesai duluan
    for future in as_completed(futures):
        url, status, elapsed = future.result()
        print(f"{status} | {elapsed} | {url}")

print(f"Total: {time.time()-start:.2f}s")  # ~2 detik!
```

### Thread Safety dengan Lock

Kalau multiple thread mengakses shared data, bisa terjadi **race condition**:

```python
import threading

counter = 0
lock = threading.Lock()

def increment(n):
    global counter
    for _ in range(n):
        # RACE CONDITION: tanpa lock, hasil bisa salah
        # counter += 1  ← tidak aman

        # AMAN: dengan lock
        with lock:
            counter += 1

threads = [threading.Thread(target=increment, args=(10000,)) for _ in range(10)]
for t in threads: t.start()
for t in threads: t.join()

print(counter)  # harus 100000
```

---

## asyncio — Concurrency Modern Python

`asyncio` adalah cara modern untuk menulis concurrent code dengan syntax `async/await`. Lebih efisien dari threading untuk I/O-bound karena berjalan dalam satu thread.

### Konsep Dasar

```python
import asyncio

# Fungsi async dideklarasikan dengan 'async def'
async def sapa(nama, delay):
    print(f"Halo {nama}!")
    await asyncio.sleep(delay)  # 'await' = tunggu tanpa blocking
    print(f"Sampai jumpa {nama}!")

# Jalankan satu coroutine
asyncio.run(sapa("Erick", 1))

# Jalankan multiple coroutine bersamaan
async def main():
    await asyncio.gather(
        sapa("Erick", 1),
        sapa("Sipit", 2),
        sapa("Cakep", 1),
    )

asyncio.run(main())
# Output: ketiga sapa mulai bersamaan, selesai sesuai delay-nya
```

### Fetch URL dengan aiohttp

```python
import asyncio
import aiohttp
import time

# pip install aiohttp

async def fetch(session, url):
    async with session.get(url) as response:
        content = await response.text()
        return url, response.status, len(content)

async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results

urls = [
    "https://httpbin.org/get",
    "https://httpbin.org/ip",
    "https://httpbin.org/user-agent",
    "https://httpbin.org/headers",
    "https://api.github.com",
]

start = time.time()
results = asyncio.run(fetch_all(urls))

for url, status, size in results:
    print(f"{status} | {size:>6} bytes | {url}")

print(f"\nTotal: {time.time()-start:.2f}s")
```

---

## Multiprocessing — True Parallelism untuk CPU-bound

Kalau task kamu CPU-bound, gunakan `multiprocessing` yang bypass GIL:

```python
from multiprocessing import Pool
import time

def hitung_berat(n):
    """Simulasi komputasi berat"""
    return sum(i * i for i in range(n))

angka = [10**7, 10**7, 10**7, 10**7]

# Serial: 4x lebih lambat
start = time.time()
hasil = [hitung_berat(n) for n in angka]
print(f"Serial: {time.time()-start:.2f}s")

# Parallel: pakai semua CPU core
start = time.time()
with Pool() as pool:
    hasil = pool.map(hitung_berat, angka)
print(f"Parallel: {time.time()-start:.2f}s")
```

---

## Kapan Pakai Apa?

```
I/O-bound + simple:      ThreadPoolExecutor
I/O-bound + banyak task: asyncio + aiohttp
CPU-bound:               multiprocessing.Pool
Mix I/O + CPU:           asyncio + ProcessPoolExecutor
```

---

## Contoh Nyata: Port Scanner Concurrent

```python
import asyncio
import socket

async def scan_port(host, port):
    try:
        # Coba connect dengan timeout
        _, writer = await asyncio.wait_for(
            asyncio.open_connection(host, port),
            timeout=0.5
        )
        writer.close()
        await writer.wait_closed()
        return port, True
    except (asyncio.TimeoutError, ConnectionRefusedError, OSError):
        return port, False

async def scan_host(host, ports):
    print(f"Scanning {host}...")
    tasks = [scan_port(host, port) for port in ports]
    results = await asyncio.gather(*tasks)

    open_ports = [port for port, is_open in results if is_open]
    return open_ports

# Scan port 1-1024
ports = range(1, 1025)
open_ports = asyncio.run(scan_host("127.0.0.1", ports))
print(f"Open ports: {open_ports}")
```

---

## Penutup

Concurrency adalah salah satu topik yang membedakan programmer pemula dari yang lebih senior. Di dunia nyata — scraping data, monitoring server, tools security — kemampuan menjalankan task secara concurrent bisa membuat program kamu 10x-100x lebih cepat.

Mulai dari `ThreadPoolExecutor` untuk use case sederhana, lalu eksplorasi `asyncio` untuk program yang lebih kompleks.
