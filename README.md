<p align="center">
  <img src="gamelet-icon.png" alt="Gamelet Logo" width="84" height="84" />
</p>

<h1 align="center">Gamelet</h1>

<p align="center">
  <em>Tiny games. Right on your desktop.</em>
</p>

<p align="center">
  <a href="https://github.com/AbijithT7/gamelet/raw/main/Gamelet-Setup.exe"><b>⬇️ Direct Download: Gamelet-Setup.exe</b></a>
</p>

Gamelet is a lightweight Windows desktop application inspired by classic desktop gadgets and executive desktop toys. It delivers small, offline mini-games in an ultra-compact widget window (**260 × 295 px**), without opening a browser or launching a heavy gaming client.

---

## 📥 Direct Download (Windows)

Click any link below to download directly in your browser:

| File | Type | Size | Direct Download |
| :--- | :--- | :--- | :--- |
| **Gamelet-Setup.exe** | **NSIS Installer** | ~1.4 MB | **[Download Gamelet-Setup.exe (Direct)](https://github.com/AbijithT7/gamelet/raw/main/Gamelet-Setup.exe)** |
| **gamelet.exe** | **Portable Standalone** | ~4.1 MB | **[Download gamelet.exe (Direct)](https://github.com/AbijithT7/gamelet/raw/main/installer/gamelet.exe)** |
| **Gamelet MSI** | **Windows Installer Package** | ~2.0 MB | **[Download Gamelet MSI (Direct)](https://github.com/AbijithT7/gamelet/raw/main/installer/Gamelet_0.1.0_x64_en-US.msi)** |

> [!TIP]
> **Downloading from GitHub**:
> - Clicking the **Direct Download** links above will automatically start the file download.
> - If you click on `Gamelet-Setup.exe` directly in the GitHub file browser list, GitHub opens the file preview page — simply click the **Download** button on the right side of the file header.

---

## Current Status

Gamelet is currently in early development (**v0.1.0**).

The initial playable widget is a modern-retro **15-Puzzle (sliding tile puzzle)** crafted with a tactile desktop-toy aesthetic.

### Highlights & Features

- **Ultra-Compact Widget Size**: Precision-milled **260 × 295 px** frameless window with zero scrolling and optimal screen real-estate usage.
- **Modern-Retro Desktop Toy Aesthetic**:
  - Smoked walnut / bronze satin chassis with subtle honey-gold accents.
  - Deep recessed matte board tray (**246 × 246 px**).
  - Tactile warm ivory physical tiles (**56 × 56 px**) with bold espresso numerals.
  - Minimal vector SVG controls for pause, reset, shuffle, and close.
- **15-Puzzle Mechanics**:
  - Guaranteed solvable shuffle logic (200 simulated valid moves from solved state).
  - Interactive click and keyboard slide controls.
  - Live move counter and digital stopwatch timer capsule.
  - Automatic win detection with a vector trophy completion card.
- **Native Windows Desktop Experience**:
  - Borderless window with smooth dragging from anywhere on the chassis/header.
  - Runs 100% offline with minimal memory usage (powered by Tauri 2 + WebView2).

---

## Controls & Keyboard Shortcuts

| Input | Action |
| :--- | :--- |
| **Click / Tap** | Slide adjacent tile into empty space |
| **Arrow Keys** (<kbd>↑</kbd> <kbd>↓</kbd> <kbd>←</kbd> <kbd>→</kbd>) | Slide tile into empty space from that direction |
| <kbd>P</kbd> | Pause / Resume game & timer |
| <kbd>R</kbd> | Reset current puzzle back to its start configuration |
| <kbd>N</kbd> | Shuffle a new solvable puzzle |
| **Drag Header / Frame** | Reposition widget anywhere on your desktop |
| **Close Button** | Exit Gamelet |

---

## Tech Stack

- **Desktop Framework**: [Tauri 2](https://v2.tauri.app/) (Rust native backend)
- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: Pure CSS with modular design tokens (`--chassis-bg`, `--gold-accent`, `--tile-bg`, etc.)

---

## Project Structure

```text
gamelet/
├── .github/
│   └── workflows/ci.yml           # Automated build & typecheck CI
├── installer/
│   ├── Gamelet-Setup.exe          # Standalone Windows NSIS setup installer
│   ├── Gamelet_0.1.0_x64_en-US.msi # Windows MSI installer package
│   └── gamelet.exe                # Portable 64-bit standalone executable
├── public/                        # Static web assets & favicons
├── src/
│   ├── assets/                    # Project graphics & logo copies
│   ├── core/                      # Reusable widget layout metrics & types
│   ├── games/                     # Mini-game modules
│   ├── App.tsx                    # Gamelet widget root component
│   ├── App.css                    # Modern-retro toy CSS theme & tokens
│   ├── main.tsx                   # React entry point
│   └── vite-env.d.ts
├── src-tauri/
│   ├── capabilities/              # Tauri permission sets
│   ├── icons/                     # Native icon suite (ICO, ICNS, PNGs)
│   ├── src/                       # Rust entry points (main.rs, lib.rs)
│   ├── Cargo.toml                 # Rust dependencies
│   ├── Cargo.lock
│   ├── build.rs
│   └── tauri.conf.json            # Tauri window (260x295) & bundle config
├── .gitignore
├── Gamelet-Setup.exe              # Direct-access installer at repository root
├── gamelet-icon.png               # Official application logo & icon source
├── index.html
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Development Setup

### Prerequisites

1. **Node.js** (v20+ recommended) and **npm**
2. **Rust** and **Cargo** (latest stable release): Install via [rustup.rs](https://rustup.rs/)
3. **Windows Dependencies**:
   - [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (pre-installed on Windows 10/11)

### Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/AbijithT7/gamelet.git
   cd gamelet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode (starts Vite and launches the native Tauri widget):
   ```bash
   npm run tauri dev
   ```

   To test only the web frontend in your browser:
   ```bash
   npm run dev
   ```

---

## Building from Source

To compile both the web frontend and generate the native Windows executable and installers:

```bash
# 1. Type-check and build frontend
npm run build

# 2. Package release executable and installers
npm run tauri build
```

Generated outputs will be located in `src-tauri/target/release/` and `src-tauri/target/release/bundle/`.

---

## Planned Direction

- [ ] **Multi-Game Architecture**: Modular game switcher for additional mini-games (Snake, Memory Match, 2048) within the same 260 × 295 frame.
- [ ] **Local Records**: Persistent tracking for best times and minimum moves via local storage.
- [ ] **Always-on-Top & Docking**: Optional toggle to pin the widget above windows or snap to screen edges.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
