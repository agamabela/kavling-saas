#!/system/bin/sh
PIDFILE="/data/local/tmp/kavling_saas.pid"
WATCHDOG_PIDFILE="/data/local/tmp/kavling_saas_watchdog.pid"

if [ -f "$WATCHDOG_PIDFILE" ]; then
    kill -9 $(cat "$WATCHDOG_PIDFILE" 2>/dev/null) 2>/dev/null || true
    rm -f "$WATCHDOG_PIDFILE"
fi

if [ -f "$PIDFILE" ]; then
    kill -9 $(cat "$PIDFILE" 2>/dev/null) 2>/dev/null || true
    rm -f "$PIDFILE"
fi

# Fallback kill
pkill -f "kavling-saas/server.js" 2>/dev/null || true
echo "KavlingSaaS stopped."
