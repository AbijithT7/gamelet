# Gamelet

Tiny games. Right on your desktop.

Gamelet is a lightweight Windows desktop application inspired by classic desktop gadgets. The goal is to make small, offline mini-games available in compact windows, without opening a browser or a full gaming application.

---

## Current Status

Gamelet is currently in early development (**v0.1.0 prototype**). 

The initial playable widget is a classic **15-Puzzle (sliding tile puzzle)** packaged in a frameless, compact desktop window.

### What Works Today

- **15-Puzzle Game**: 4x4 sliding tile puzzle with solvable shuffle logic (guaranteed solvable via move simulation).
- **Interactive Controls**: Move tiles by clicking adjacent positions, shuffle/reset the board, and pause/resume gameplay.
- **Stats Tracking**: Live move counter and elapsed time stopwatch.
- **Win Detection**: Automatically detects when tiles are correctly ordered 1 through 15 and displays a completion banner.
- **Gadget Window**: Lightweight borderless window with draggable title bar and close control.
- **Offline & Standalone**: Operates completely offline with minimal resource overhead.

---

## Tech Stack

- **Desktop Framework**: [Tauri 2](https://v2.tauri.app/) (Rust native backend)
- **Frontend**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 8](https://vitejs.dev/)
- **Styling**: Pure CSS (custom widget theme inspired by classic desktop gadgets)

---

## Project Structure

```text
gamelet/
├── .github/
│   └── workflows/ci.yml       # Automated build & typecheck CI
├── public/                    # Static assets
├── src/
│   ├── assets/                # Frontend graphics and icons
│   ├── core/                  # Core types and widget registry
│   ├── games/                 # Mini-game modules
│   ├── App.tsx                # Gamelet widget root component
│   ├── App.css                # Widget styling
│   ├── main.tsx               # React entry point
│   └── vite-env.d.ts
├── src-tauri/
│   ├── capabilities/          # Tauri permission sets
│   ├── icons/                 # Application icons
│   ├── src/                   # Rust entry points (main.rs, lib.rs)
│   ├── Cargo.toml             # Rust dependencies
│   ├── Cargo.lock
│   ├── build.rs
│   └── tauri.conf.json        # Tauri window and build configuration
├── .gitignore
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Prerequisites

Before running or developing Gamelet locally, ensure you have the following installed:

1. **Node.js** (v20+ recommended) and **npm**
2. **Rust** and **Cargo** (latest stable release): Install via [rustup.rs](https://rustup.rs/)
3. **Windows Dependencies**: 
   - [Microsoft Visual Studio C++ Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/)
   - [WebView2 Runtime](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) (pre-installed on Windows 10/11)

---

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/AbijithT7/gamelet.git
   cd gamelet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run in development mode (starts Vite and launches the Tauri widget window):
   ```bash
   npm run tauri dev
   ```

   To run only the web frontend in the browser:
   ```bash
   npm run dev
   ```

---

## Building for Production

To compile both the web frontend and the native Windows executable:

```bash
# 1. Type check and compile the frontend
npm run build

# 2. Package the native desktop binary
npm run tauri build
```

The compiled binary and installers will be generated under `src-tauri/target/release/`.

---

## Planned Direction

- [ ] **Game Architecture**: Modular game registry to allow easy addition of new mini-games without modifying core window code.
- [ ] **Local Storage**: Save best times and fewest-moves records locally via Tauri storage or localStorage.
- [ ] **Game Selector**: Compact selector interface to switch between different mini-games from the title bar or menu.
- [ ] **Additional Mini-Games**: Memory match, minesweeper-style puzzle, and reaction mini-games.
- [ ] **Gadget Behavior**: Optional "always on top" and snap-to-edge docking options for desktop gadget workflows.

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.
