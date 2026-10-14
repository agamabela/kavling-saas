#!/system/bin/sh
APP_DIR="/data/data/com.termux/files/home/kavling-saas"
PIDFILE="/data/local/tmp/kavling_saas.pid"
LOGFILE="$APP_DIR/server.log"

export PATH=/data/data/com.termux/files/usr/bin:/system/bin:/system/xbin:$PATH
export PORT=3001
export HOSTNAME=0.0.0.0

if [ -f "$PIDFILE" ]; then
    OLD_PID=$(cat "$PIDFILE" 2>/dev/null)
    if [ -n "$OLD_PID" ] && kill -0 "$OLD_PID" 2>/dev/null; then
        kill "$OLD_PID" 2>/dev/null || true
    fi
    rm -f "$PIDFILE"
fi

cd "$APP_DIR"
nohup node server.js > "$LOGFILE" 2>&1 &
echo $! > "$PIDFILE"
echo "KavlingSaaS started with PID $(cat "$PIDFILE") on port $PORT"
