# push.ps1 — shortcut push ke GitHub
# Cara pakai: klik kanan → Run with PowerShell
#             atau di terminal: .\push.ps1

$msg = Read-Host "Pesan commit (contoh: update about page)"
if (-not $msg) { $msg = "update" }

git add .
git commit -m $msg
git push origin main

Write-Host "`nDone! Vercel akan redeploy dalam ~30 detik." -ForegroundColor Green
Read-Host "Tekan Enter untuk keluar"
