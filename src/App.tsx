import { useEffect, useState, useCallback } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";

const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

function generateShuffledBoard(): number[] {
  const board = [...solvedBoard];
  let emptyIndex = 15;

  // Perform 200 valid random moves from solved state to guarantee solvability
  for (let i = 0; i < 200; i++) {
    const row = Math.floor(emptyIndex / 4);
    const col = emptyIndex % 4;

    const possibleMoves: number[] = [];
    if (row > 0) possibleMoves.push(emptyIndex - 4);
    if (row < 3) possibleMoves.push(emptyIndex + 4);
    if (col > 0) possibleMoves.push(emptyIndex - 1);
    if (col < 3) possibleMoves.push(emptyIndex + 1);

    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    [board[emptyIndex], board[move]] = [board[move], board[emptyIndex]];
    emptyIndex = move;
  }

  return board;
}

function isSolved(board: number[]): boolean {
  return board.every((value, index) => value === solvedBoard[index]);
}

export default function App() {
  const [board, setBoard] = useState<number[]>(() => generateShuffledBoard());
  const [initialBoard, setInitialBoard] = useState<number[]>(() => [...board]);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [won, setWon] = useState(false);

  // Synchronize initialBoard when board is initialized once on mount
  useEffect(() => {
    setInitialBoard([...board]);
  }, []);

  // Timer effect
  useEffect(() => {
    if (paused || won) return;

    const timer = setInterval(() => {
      setSeconds((curr) => curr + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [paused, won]);

  const moveTile = useCallback(
    (index: number) => {
      if (paused || won) return;

      const emptyIndex = board.indexOf(0);
      const sameRow = Math.floor(index / 4) === Math.floor(emptyIndex / 4);
      const adjacent =
        (sameRow && Math.abs(index - emptyIndex) === 1) ||
        Math.abs(index - emptyIndex) === 4;

      if (!adjacent) return;

      const newBoard = [...board];
      [newBoard[index], newBoard[emptyIndex]] = [
        newBoard[emptyIndex],
        newBoard[index],
      ];

      setBoard(newBoard);
      setMoves((curr) => curr + 1);

      if (isSolved(newBoard)) {
        setWon(true);
      }
    },
    [board, paused, won]
  );

  const shuffle = useCallback(() => {
    const newBoard = generateShuffledBoard();
    setBoard(newBoard);
    setInitialBoard([...newBoard]);
    setMoves(0);
    setSeconds(0);
    setPaused(false);
    setWon(false);
  }, []);

  const reset = useCallback(() => {
    setBoard([...initialBoard]);
    setMoves(0);
    setSeconds(0);
    setPaused(false);
    setWon(false);
  }, [initialBoard]);

  const togglePause = useCallback(() => {
    if (won) return;
    setPaused((curr) => !curr);
  }, [won]);

  // Keyboard navigation (Arrow keys to slide, P to pause, R to reset, N for new puzzle)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === "INPUT") return;

      if (e.key === "p" || e.key === "P") {
        e.preventDefault();
        togglePause();
        return;
      }
      if (e.key === "r" || e.key === "R") {
        e.preventDefault();
        reset();
        return;
      }
      if (e.key === "n" || e.key === "N") {
        e.preventDefault();
        shuffle();
        return;
      }

      if (paused || won) return;

      const emptyIndex = board.indexOf(0);
      const emptyRow = Math.floor(emptyIndex / 4);
      const emptyCol = emptyIndex % 4;

      let targetIndex = -1;

      if (e.key === "ArrowUp") {
        // Slide tile below empty space up into it
        if (emptyRow < 3) targetIndex = emptyIndex + 4;
      } else if (e.key === "ArrowDown") {
        // Slide tile above empty space down into it
        if (emptyRow > 0) targetIndex = emptyIndex - 4;
      } else if (e.key === "ArrowLeft") {
        // Slide tile to right of empty space left into it
        if (emptyCol < 3) targetIndex = emptyIndex + 1;
      } else if (e.key === "ArrowRight") {
        // Slide tile to left of empty space right into it
        if (emptyCol > 0) targetIndex = emptyIndex - 1;
      }

      if (targetIndex !== -1) {
        e.preventDefault();
        moveTile(targetIndex);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, paused, won, togglePause, reset, shuffle, moveTile]);

  const formatTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");

    if (hours > 0) {
      return `${hours}:${minutes}:${secs}`;
    }
    return `${minutes}:${secs}`;
  };

  const handleDrag = async (e: React.MouseEvent) => {
    if (e.button === 0 && !(e.target as HTMLElement).closest("button, .tile, .board-overlay")) {
      try {
        if ("__TAURI_INTERNALS__" in window) {
          const appWindow = getCurrentWindow();
          await appWindow.startDragging();
        }
      } catch (err) {
        console.error("Window drag error:", err);
      }
    }
  };

  const handleClose = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if ("__TAURI_INTERNALS__" in window) {
        const appWindow = getCurrentWindow();
        await appWindow.close();
      } else {
        window.close();
      }
    } catch (err) {
      console.error("Failed to close window:", err);
      try {
        if ("__TAURI_INTERNALS__" in window) {
          const appWindow = getCurrentWindow();
          await appWindow.destroy();
        }
      } catch (destroyErr) {
        console.error("Failed to destroy window:", destroyErr);
      }
    }
  };

  return (
    <main
      className="gadget-window"
      data-tauri-drag-region
      onMouseDown={handleDrag}
    >
      {/* Widget Header: Compact Smoked-Bronze Bar with Stats & Controls */}
      <header
        className="gadget-header"
        data-tauri-drag-region
        onMouseDown={handleDrag}
      >
        <div className="header-left" data-tauri-drag-region>
          <div className="timer-badge" title="Elapsed Time" data-tauri-drag-region>
            <svg
              className="clock-icon"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="6" />
              <polyline points="8 4.5 8 8 10.5 9.5" />
            </svg>
            <span className="timer-digits">{formatTime()}</span>
          </div>

          <div className="moves-badge" title="Move Count" data-tauri-drag-region>
            <span className="moves-label">M:</span>
            <span className="moves-count">{moves}</span>
          </div>
        </div>

        <div className="header-controls">
          <button
            type="button"
            className={`gadget-btn ${paused ? "btn-active" : ""}`}
            onClick={togglePause}
            onMouseDown={(e) => e.stopPropagation()}
            title={paused ? "Resume (P)" : "Pause (P)"}
            aria-label={paused ? "Resume" : "Pause"}
          >
            {paused ? (
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path d="M5.5 3.5a.6.6 0 0 1 .93-.5l6 4.5a.6.6 0 0 1 0 1l-6 4.5a.6.6 0 0 1-.93-.5V3.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="currentColor">
                <rect x="4.5" y="3.5" width="2.2" height="9" rx="0.75" />
                <rect x="9.3" y="3.5" width="2.2" height="9" rx="0.75" />
              </svg>
            )}
          </button>

          <button
            type="button"
            className="gadget-btn"
            onClick={reset}
            onMouseDown={(e) => e.stopPropagation()}
            title="Reset Puzzle (R)"
            aria-label="Reset Puzzle"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 8a5.5 5.5 0 1 0 1.6-3.9L2 6" />
              <polyline points="2 2.5 2 6 5.5 6" />
            </svg>
          </button>

          <button
            type="button"
            className="gadget-btn"
            onClick={shuffle}
            onMouseDown={(e) => e.stopPropagation()}
            title="Shuffle New Puzzle (N)"
            aria-label="Shuffle New Puzzle"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.5 3.5h3v3" />
              <path d="M2.5 13.5l4-4m2-2l5-5" />
              <path d="M10.5 12.5h3v-3" />
              <path d="M2.5 2.5l11 11" />
            </svg>
          </button>

          <button
            type="button"
            className="gadget-btn btn-close"
            onClick={handleClose}
            onMouseDown={(e) => e.stopPropagation()}
            title="Close"
            aria-label="Close"
          >
            <svg
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            >
              <line x1="4.5" y1="4.5" x2="11.5" y2="11.5" />
              <line x1="11.5" y1="4.5" x2="4.5" y2="11.5" />
            </svg>
          </button>
        </div>
      </header>

      {/* 4x4 Puzzle Tray: Recessed dark board with warm ivory tiles */}
      <section className="gadget-body" data-tauri-drag-region>
        <div className="puzzle-board">
          {board.map((tile, index) => (
            <button
              key={index}
              type="button"
              className={`tile ${tile === 0 ? "empty" : ""}`}
              onClick={() => moveTile(index)}
              disabled={tile === 0 || paused || won}
              aria-label={tile === 0 ? "Empty space" : `Tile ${tile}`}
            >
              {tile !== 0 && tile}
            </button>
          ))}

          {/* Paused Overlay */}
          {paused && !won && (
            <div
              className="board-overlay"
              onClick={togglePause}
              title="Click to resume"
            >
              <div className="overlay-badge">
                <span className="overlay-title">PAUSED</span>
                <span className="overlay-subtitle">Click anywhere to resume</span>
              </div>
            </div>
          )}

          {/* Solved Celebration Overlay */}
          {won && (
            <div className="board-overlay victory-overlay">
              <div className="victory-card">
                <svg
                  className="victory-trophy"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                  <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                  <path d="M4 4h16v6a8 8 0 0 1-16 0V4z" />
                  <path d="M12 18v3" />
                  <path d="M8 21h8" />
                </svg>
                <div className="victory-title">SOLVED!</div>
                <div className="victory-stats">
                  <span>{moves} moves</span> • <span>{formatTime()}</span>
                </div>
                <button
                  type="button"
                  className="victory-btn"
                  onClick={shuffle}
                >
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
