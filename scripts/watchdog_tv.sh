#!/system/bin/sh
DIR="/data/data/com.termux/files/home/kavling-saas"
PIDFILE="/data/local/tmp/kavling_saas.pid"
WATCHDOG_PIDFILE="/data/local/tmp/kavling_saas_watchdog.pid"
WATCHDOG_LOG="$DIR/watchdog.log"

export PATH=/data/data/com.termux/files/usr/bin:/system/bin:$PATH

is_matching_pid() {
    [ -n "$1" ] && [ -r "/proc/$1/cmdline" ] && \
        tr '\000' ' ' < "/proc/$1/cmdline" | grep -F "server.js" >/dev/null 2>&1
}

if [ -f "$WATCHDOG_PIDFILE" ]; then
    OLD_PID=$(cat "$WATCHDOG_PIDFILE" 2>/dev/null)
    if is_matching_pid "$OLD_PID" "$0" && kill -0 "$OLD_PID" 2>/dev/null; then
        exit 0
    fi
fi

echo $$ > "$WATCHDOG_PIDFILE"
trap 'rm -f "$WATCHDOG_PIDFILE"; exit 0' INT TERM EXIT

while true; do
    APP_PID=""
    [ -f "$PIDFILE" ] && APP_PID=$(cat "$PIDFILE" 2>/dev/null)
    if ! is_matching_pid "$APP_PID" || ! kill -0 "$APP_PID" 2>/dev/null; then
        printf '%s KavlingSaaS tidak aktif; mencoba restart\n' "$(date '+%Y-%m-%d %H:%M:%S')" >> "$WATCHDOG_LOG"
        "$DIR/run_tv.sh" >> "$WATCHDOG_LOG" 2>&1
    fi
    sleep 30
done
