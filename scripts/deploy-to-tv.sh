#!/usr/bin/env bash
set -e

TV_IP="192.168.1.25"
SSH_PORT="8022"
SSH_USER="u0_a57"
ADB_PORT="5555"

echo "=== [KavlingSaaS] Memeriksa Koneksi ke TV Server ($TV_IP) ==="

# 1. Cek Ping
if ! ping -c 1 -t 2 "$TV_IP" >/dev/null 2>&1; then
  echo "❌ Error: TV Server ($TV_IP) tidak merespons (Offline / Sleep)."
  echo "👉 Silakan nyalakan TV Anda, pastikan Wi-Fi terhubung, lalu jalankan kembali script ini."
  exit 1
fi

echo "✅ TV Server ($TV_IP) aktif!"

# 2. Coba koneksi ADB
echo "🔄 Menghubungkan ADB ke $TV_IP:$ADB_PORT..."
adb connect "$TV_IP:$ADB_PORT" || true

# 3. Deploy via SSH Termux
echo "🚀 Mengirim perintah build & run ke Termux ($SSH_USER@$TV_IP:$SSH_PORT)..."
ssh -o StrictHostKeyChecking=no -p "$SSH_PORT" "$SSH_USER@$TV_IP" << 'EOF'
  set -e
  echo "--- Di dalam TV Server ---"
  command -v node >/dev/null || (pkg update -y && pkg install -y nodejs-lts git)
  
  if [ ! -d "$HOME/kavling-saas" ]; then
    echo "Cloning repository..."
    git clone https://github.com/agamabela/kavling-saas.git "$HOME/kavling-saas"
  else
    echo "Updating repository..."
    cd "$HOME/kavling-saas"
    git pull origin main
  fi

  cd "$HOME/kavling-saas"
  npm install
  npm run build
  
  # Hentikan proses lama jika ada
  pkill -f "next-server" 2>/dev/null || true
  pkill -f "next start" 2>/dev/null || true

  echo "Menjalankan KavlingSaaS di port 3000 background..."
  nohup npm run start -- -p 3000 > "$HOME/kavling-saas/server.log" 2>&1 &
  sleep 3
  curl -I http://localhost:3000 || cat "$HOME/kavling-saas/server.log"
  echo "KavlingSaaS aktif di http://192.168.1.25:3000"
EOF

# 4. Buka tampilan di layar TV jika ADB terhubung
echo "📺 Membuka aplikasi di browser TV..."
adb -s "$TV_IP:$ADB_PORT" shell am start -a android.intent.action.VIEW -d "http://192.168.1.25:3000" 2>/dev/null || true

echo "🎉 Selesai! KavlingSaaS kini berjalan di TV Server: http://192.168.1.25:3000"
