#!/system/bin/sh
export PATH=/data/data/com.termux/files/usr/bin:/system/bin:/system/xbin:$PATH
export LD_LIBRARY_PATH=/data/data/com.termux/files/usr/lib
export PYTHONHOME=/data/data/com.termux/files/usr

# 1. Start TV Remote Server (Python + Hardware Mouse) on Port 8080
if ! busybox pgrep -f "server.py" > /dev/null 2>&1; then
    nohup /data/data/com.termux/files/usr/bin/python3 -u /data/local/tv_remote/server.py > /data/local/tv_remote/server.log 2>&1 &
fi

# 2. Start OpenSSH Server on Port 8022
if ! busybox pgrep -f "sshd" > /dev/null 2>&1; then
    /data/data/com.termux/files/usr/bin/sshd
fi

# Start the finance bot and its PID-aware watchdog. The watchdog stays quiet
# while healthy and only writes when it must recover the bot.
FINANCE_DIR="/data/data/com.termux/files/home/family-finance-bot"
if [ -x "$FINANCE_DIR/run_tv.sh" ]; then
    "$FINANCE_DIR/run_tv.sh" > /dev/null 2>&1
fi
if [ -x "$FINANCE_DIR/watchdog_tv.sh" ]; then
    nohup "$FINANCE_DIR/watchdog_tv.sh" > /dev/null 2>&1 </dev/null &
fi

# 3. Start DroidVNC-NG Screen Mirroring Server on Port 5900
am startservice -a net.christianbeier.droidvnc_ng.ACTION_START \
    -n net.christianbeier.droidvnc_ng/.MainService \
    --ei net.christianbeier.droidvnc_ng.EXTRA_PORT 5900 \
    --es net.christianbeier.droidvnc_ng.EXTRA_PASSWORD 451c0530 \
    --ez net.christianbeier.droidvnc_ng.EXTRA_FALLBACK_SCREEN_CAPTURE true \
    --ez net.christianbeier.droidvnc_ng.EXTRA_VIEW_ONLY false \
    --ef net.christianbeier.droidvnc_ng.EXTRA_SCALING 0.5 > /dev/null 2>&1

# 4. Start Node.js Web App (multiapss) on Port 3000
if ! busybox pgrep -f "serve.mjs" > /dev/null 2>&1; then
    cd /data/data/com.termux/files/home/multiapss
    nohup node serve.mjs > /data/data/com.termux/files/home/multiapss/server.log 2>&1 &
fi

# 5. Start Nginx Reverse Proxy on Port 80
if ! busybox pgrep -f "nginx" > /dev/null 2>&1; then
    nginx
fi

# 6. Auto-start 24/7 YouTube Live Streams (Pax Dei & Lofi) on Boot
STREAM_DIR="/data/data/com.termux/files/home/stream"
if [ -d "$STREAM_DIR" ]; then
    (
        sleep 10
        /system/bin/sh "$STREAM_DIR/start1.sh"
        sleep 3
        /system/bin/sh "$STREAM_DIR/start2.sh"
    ) &
fi

# 7. Start KavlingSaaS Housing & KPR Portal on Port 3001 with Persistent Watchdog
KAVLING_DIR="/data/data/com.termux/files/home/kavling-saas"
if [ -x "$KAVLING_DIR/run_tv.sh" ]; then
    "$KAVLING_DIR/run_tv.sh" > /dev/null 2>&1
fi
if [ -x "$KAVLING_DIR/watchdog_tv.sh" ]; then
    nohup "$KAVLING_DIR/watchdog_tv.sh" > /dev/null 2>&1 </dev/null &
fi

# 8. Start Cloudflare Tunnel for KavlingSaaS
if ! busybox pgrep -f "cloudflared tunnel" > /dev/null 2>&1; then
    nohup /data/data/com.termux/files/usr/bin/cloudflared tunnel --url http://127.0.0.1:3001 > /data/local/tmp/cloudflared.log 2>&1 &
    echo $! > /data/local/tmp/cloudflared.pid
fi
