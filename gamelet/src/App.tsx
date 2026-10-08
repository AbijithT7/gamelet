import { useEffect, useState } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import "./App.css";

const solvedBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];

function shuffleBoard() {
  const board = [...solvedBoard];

  // Perform valid random moves instead of randomly arranging
  // tiles, guaranteeing the puzzle is solvable.
  let emptyIndex = 15;

  for (let i = 0; i < 200; i++) {
    const row = Math.floor(emptyIndex / 4);
    const col = emptyIndex % 4;

    const possibleMoves: number[] = [];

    if (row > 0) possibleMoves.push(emptyIndex - 4);
    if (row < 3) possibleMoves.push(emptyIndex + 4);
    if (col > 0) possibleMoves.push(emptyIndex - 1);
    if (col < 3) possibleMoves.push(emptyIndex + 1);

    const move =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

    [board[emptyIndex], board[move]] = [board[move], board[emptyIndex]];
    emptyIndex = move;
  }

  return board;
}

function isSolved(board: number[]) {
  return board.every((value, index) => value === solvedBoard[index]);
}

function App() {
  const [board, setBoard] = useState<number[]>(shuffleBoard);
  const [moves, setMoves] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [paused, setPaused] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    if (paused || won) return;

    const timer = setInterval(() => {
      setSeconds((current) => current + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [paused, won]);

  const moveTile = (index: number) => {
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
    setMoves((current) => current + 1);

    if (isSolved(newBoard)) {
      setWon(true);
    }
  };

  const shuffle = () => {
    setBoard(shuffleBoard());
    setMoves(0);
    setSeconds(0);
    setPaused(false);
    setWon(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60).toString().padStart(2, "0");

    return `${minutes}:${secs}`;
  };

  const handleTitleBarMouseDown = async (e: React.MouseEvent) => {
    if (e.button === 0 && !(e.target as HTMLElement).closest("button")) {
      try {
        const appWindow = getCurrentWindow();
        await appWindow.startDragging();
      } catch (err) {
        console.error("Failed to start dragging:", err);
      }
    }
  };

  const handleClose = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const appWindow = getCurrentWindow();
      await appWindow.close();
    } catch (err) {
      console.error("Failed to close window:", err);
      try {
        const appWindow = getCurrentWindow();
        await appWindow.destroy();
      } catch (destroyErr) {
        console.error("Failed to destroy window:", destroyErr);
      }
    }
  };

  return (
    <main className="game-window">
      <header
        className="title-bar"
        data-tauri-drag-region
        onMouseDown={handleTitleBarMouseDown}
      >
        <div className="title" data-tauri-drag-region>
          <span className="title-icon" data-tauri-drag-region>❖</span>
          <span className="title-text" data-tauri-drag-region>Gamelet</span>
        </div>

        <button
          type="button"
          className="close-button"
          onClick={handleClose}
          onMouseDown={(e) => e.stopPropagation()}
          title="Close"
          aria-label="Close"
        >
          ✕
        </button>
      </header>

      <section className="game-content">
        <div className="puzzle-board">
          {board.map((tile, index) => (
            <button
              key={tile}
              type="button"
              className={`tile ${tile === 0 ? "empty" : ""}`}
              onClick={() => moveTile(index)}
              disabled={tile === 0 || paused || won}
              aria-label={tile === 0 ? "Empty slot" : `Tile ${tile}`}
            >
              {tile !== 0 && tile}
            </button>
          ))}
        </div>

        <div className="stats">
          <span className="stat-item">
            Moves: <strong>{moves}</strong>
          </span>

          <span className="stat-item">
            Time: <strong>{formatTime()}</strong>
          </span>
        </div>

        <div className="controls">
          <button type="button" onClick={shuffle}>
            Shuffle
          </button>

          <button
            type="button"
            className={paused ? "active" : ""}
            onClick={() => setPaused((current) => !current)}
          >
            {paused ? "Resume" : "Pause"}
          </button>
        </div>

        {won && <div className="win-message">Puzzle solved! 🎉</div>}
      </section>
    </main>
  );
}

export default App;
