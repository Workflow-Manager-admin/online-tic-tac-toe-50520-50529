import React, { useState, useEffect } from "react";
import "./App.css";

// Color palette as CSS variables for easy styling
const COLORS = {
  primary: "#2196F3",
  accent: "#FF9800",
  secondary: "#FFFFFF",
};

// PUBLIC_INTERFACE
function App() {
  // Game state: 3x3 board (represented as array of 9), X goes first by convention
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [status, setStatus] = useState("");
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    // Set document background to match light minimal theme requirement
    document.body.style.background = COLORS.secondary;
  }, []);

  // Compute winner, draw, and status message whenever board changes
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setStatus(`Winner: ${winner === "X" ? "Player 1 (X)" : "Player 2 (O)"}`);
      setGameOver(true);
    } else if (board.every((cell) => cell !== null)) {
      setStatus("Draw!");
      setGameOver(true);
    } else {
      setStatus(
        `Turn: ${xIsNext ? "Player 1" : "Player 2"} (${xIsNext ? "X" : "O"})`
      );
      setGameOver(false);
    }
  }, [board, xIsNext]);

  // PUBLIC_INTERFACE
  function handleClick(idx) {
    if (gameOver || board[idx]) return;
    const boardCopy = board.slice();
    boardCopy[idx] = xIsNext ? "X" : "O";
    setBoard(boardCopy);
    setXIsNext((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleRestart() {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  }

  // Environment variable template usage example (for demonstration)
  // e.g., public URL for branding, if needed: process.env.REACT_APP_PUBLIC_URL

  return (
    <div className="ttt-root">
      <h1 className="ttt-title" data-testid="ttt-title">
        Tic Tac Toe
      </h1>
      <div className="ttt-center">
        <Board board={board} onClick={handleClick} />
      </div>
      <div className="ttt-status" aria-live="polite">
        {status}
      </div>
      <button
        className="ttt-restart-btn"
        onClick={handleRestart}
        aria-label="Restart game"
      >
        Restart
      </button>
      <Footer />
    </div>
  );
}

// PUBLIC_INTERFACE
function Board({ board, onClick }) {
  // Render 3x3 grid using array map
  return (
    <div className="ttt-board" role="grid" data-testid="ttt-board">
      {board.map((cell, idx) => (
        <Square
          key={idx}
          value={cell}
          onClick={() => onClick(idx)}
          row={Math.floor(idx / 3)}
          col={idx % 3}
        />
      ))}
    </div>
  );
}

// PUBLIC_INTERFACE
function Square({ value, onClick, row, col }) {
  return (
    <button
      className="ttt-square"
      aria-label={`Row ${row + 1} Column ${col + 1}${value ? `: ${value}` : ""}`}
      onClick={onClick}
      tabIndex={0}
      data-testid={`ttt-cell-${row}-${col}`}
      style={{
        color: value === "X" ? COLORS.primary : value === "O" ? COLORS.accent : "#888",
      }}
    >
      {value}
    </button>
  );
}

// Utility to calculate winner
function calculateWinner(b) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (let [a, bIdx, c] of lines) {
    if (b[a] && b[a] === b[bIdx] && b[a] === b[c]) {
      return b[a];
    }
  }
  return null;
}

// Minimalist footer for copyright/status
function Footer() {
  return (
    <div className="ttt-footer" style={{ color: "#aaa", marginTop: "48px", fontSize: "13px" }}>
      © {new Date().getFullYear()} Tic Tac Toe &middot; KAVIA Demo
    </div>
  );
}

export default App;
