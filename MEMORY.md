# 🧠 Project Memory Bank

*Last updated: 2026-10-16*

This file serves as the persistent cross-session and cross-device memory for all projects in this workspace.

---

## 💻 Cross-Laptop Sync Instructions
To make sure you never lose anything between your laptops:
1. **On your current laptop after working:**
   ```bash
   git add AGENTS.md GEMINI.md MEMORY.md
   git commit -m "Update project memory and agent state"
   git push
   ```
2. **On your other laptop before starting:**
   ```bash
   git pull
   ```
The AI agent will immediately read this file and know everything you worked on.

---

## 📱 App Inventory & Architecture

### 1. Lofi Music Player
- **Type**: Chrome MV3 Extension + Native Messaging Host
- **Location**: Root directory (`manifest.json`, `background.js`, `popup.*`, `offscreen.*`, `player.*`, `host/`)
- **Git Repo**: `https://github.com/agamabela/audioplayer.git`
- **Key Concepts**:
  - Offscreen audio playback: Audio keeps playing even after the extension popup closes.
  - Native Host (`host/lofi_downloader.py`): Wraps `yt-dlp` and `ffmpeg` to download audio from YouTube URLs and convert them to MP3.
  - Storage: Files stored in `music/` with a `tracks.json` index.
- **Setup Command**:
  ```bash
  python3 host/install.py <CHROME_EXTENSION_ID>
  ```

### 2. Kavling SaaS
- **Type**: Property / Kavling Management Web App
- **Location**: `kavling-saas/`
- **Git Repo**: `https://github.com/agamabela/kavling-saas.git`
- **Stack**: Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM
- **Key Files**:
  - `kavling-saas/app/`: Next.js pages and API routes
  - `kavling-saas/components/`: UI components
  - `kavling-saas/prisma/`: Database schema and migrations
  - `kavling-saas/DESIGN.md`: Product architecture and design doc

### 3. Rubik's Cube Solver
- **Type**: 3D Interactive Rubik's Cube Game & Algorithm Solver
- **Location**: `rubik/`
- **Stack**: Three.js, Vanilla JavaScript (`cube.js`, `solve.js`), HTML5 Canvas
- **Entry Point**: `rubik/index.html`

### 4. WordPress Malware Scanners
- **Type**: Python security analysis tools
- **Location**: Root (`wp_batch_scan.py`, `wp_detailed_scan.py`, `wp_malware_scan.py`, `wp_batch_injection_scan.py`, `malware_db_check.php`)
- **Purpose**: Detect malware, suspicious backdoors, and database injections in WordPress sites.

### 5. Android TV Home Micro-Server (Termux Environment)
- **Target Device**: Android TV on local network (`192.168.1.25`)
- **Connection Details**:
  - SSH: `ssh -p 8022 u0_a57@192.168.1.25`
  - ADB: `adb connect 192.168.1.25:5555`
- **Main Deployment & Control Scripts**: `kavling-saas/scripts/`
  - `tv_start.sh`: Master startup script run on Android TV boot.
  - `deploy-to-tv.sh`: Local automated deploy script (pings TV, establishes ADB/SSH, pulls repo, builds, restarts server).
  - `run_tv.sh` / `stop_tv.sh`: PID-managed process lifecycle scripts.
  - `watchdog_tv.sh`: Auto-recovery watchdog ensuring 24/7 uptime.
  - `nginx_tv.conf`: Reverse proxy configuration.
- **Port Mapping & Ecosystem on the TV**:
  - **Port 80 (Nginx)**:
    - `/` & `/api/` & `/rubik` ➡️ `http://127.0.0.1:8080` (TV Remote & Rubik solver)
    - `/tracker/` ➡️ `http://127.0.0.1:3000` (`multiapss` web app)
    - `/kavling/` ➡️ `http://127.0.0.1:3001` (Kavling SaaS portal)
  - **Port 8080**: TV Remote Server (`/data/local/tv_remote/server.py` with Python + hardware mouse input emulation).
  - **Port 8022**: OpenSSH Server (`sshd`).
  - **Port 5900**: DroidVNC-NG screen mirroring server.
  - **Port 3001**: Kavling SaaS production build (`node server.js`) + Cloudflare Tunnel for public access.
  - **Background Bot**: Family Finance Bot (`/data/data/com.termux/files/home/family-finance-bot`) with quiet recovery watchdog.
  - **Background Streams**: 24/7 YouTube live streams (`Pax Dei` & `Lofi`) via `start1.sh` and `start2.sh`.

---

## 👤 User Preferences & Habits
- **Cross-device workflow**: Works across multiple laptops — memory and context must always be recorded in this repository.
- **Workflow style**: Builds distinct applications and tools in focused subdirectories.
- **Rule for Agent**: Never wipe `MEMORY.md`. Always review `MEMORY.md` first and append new milestones, decisions, or issues.

---

## 📝 Recent Progress & Notes
- **2026-10-16**: Initialized persistent memory system (`AGENTS.md`, `GEMINI.md`, `MEMORY.md`). Documented all 4 active apps (Lofi Music Player, Kavling SaaS, Rubik Solver, WordPress Scanners) to prevent context loss across sessions and between laptops.
