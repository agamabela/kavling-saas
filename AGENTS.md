# AI Agent Instructions & Memory Protocol

You are pairing with **agamabela** on projects in this repository.

## 🧠 Permanent Memory Protocol
- **Always read [`MEMORY.md`](file:///Users/deyanihif/Documents/trae_projects/notes/MEMORY.md)** at the start of any conversation to regain context on projects, active tasks, user preferences, and previous architectural decisions.
- **Always update [`MEMORY.md`](file:///Users/deyanihif/Documents/trae_projects/notes/MEMORY.md)** whenever:
  1. A new feature, app, or bugfix is implemented.
  2. The user expresses a preference or rule.
  3. A key architectural decision is made.
  4. Work is paused, noting current progress and next steps.
- **Never wipe existing historical memory**: Append or update relevant sections instead of replacing the entire file.

---

## 📂 Multi-App Repository Index
This repository contains several apps and toolsets:

1. **Lofi Music Player (Chrome Extension)**
   - **Root directory**: `manifest.json`, `background.js`, `popup.*`, `offscreen.*`, `player.*`
   - **Native Host**: `host/lofi_downloader.py`, `host/install.py`, `host/lofi_downloader.sh`
   - **Stack**: Chrome MV3, Vanilla JS/HTML/CSS, Python 3.10+, `yt-dlp`, `ffmpeg`.
   - **Purpose**: Paste YouTube links into popup, download/convert to MP3 via native messaging host, play via offscreen document.

2. **Kavling SaaS (`kavling-saas/`)**
   - **Stack**: Next.js (App Router), TypeScript, Tailwind CSS, Prisma ORM.
   - **Purpose**: Property / kavling management SaaS platform.
   - **Git remote**: `https://github.com/agamabela/kavling-saas.git`

3. **Rubik's Cube Solver (`rubik/`)**
   - **Stack**: Three.js, Vanilla JavaScript, HTML5 Canvas.
   - **Purpose**: 3D interactive Rubik's cube visualizer and solver (`cube.js`, `solve.js`, `index.html`).

4. **WordPress Malware Scanner Utilities**
   - **Files**: `wp_batch_scan.py`, `wp_detailed_scan.py`, `wp_malware_scan.py`, `wp_batch_injection_scan.py`, `malware_db_check.php`
   - **Purpose**: Batch scanning and malware database verification for WordPress installations.

5. **Android TV Home Micro-Server**
   - **Host Target**: Android TV running Termux at `192.168.1.25`
   - **Access**: SSH (`u0_a57@192.168.1.25:8022`), ADB (`192.168.1.25:5555`)
   - **Scripts**: `kavling-saas/scripts/` (`tv_start.sh`, `deploy-to-tv.sh`, `run_tv.sh`, `stop_tv.sh`, `watchdog_tv.sh`, `nginx_tv.conf`)
   - **Services Running**:
     - Nginx (Port 80 reverse proxy for `/`, `/rubik`, `/tracker/`, `/kavling/`)
     - TV Remote Server (Port 8080, Python hardware mouse controller)
     - DroidVNC-NG (Port 5900, VNC screen mirror)
     - Multiapss Web App (Port 3000)
     - Kavling SaaS & Cloudflare Tunnel (Port 3001)
     - Family Finance Bot (Termux background bot + watchdog)
     - 24/7 YouTube Live Streams (Pax Dei & Lofi streams)

---

## 🛠️ General Working Guidelines
- **Preserve working configurations**: Don't break existing setups or dependencies without explicit instruction.
- **Cross-device sync**: All changes to memory and documentation must be kept git-friendly so running `git push` on one machine and `git pull` on the other transfers full context seamlessly.
- **Clean code & documentation**: Keep code modular, preserve non-obvious rationale in comments, and avoid generic boilerplate.
