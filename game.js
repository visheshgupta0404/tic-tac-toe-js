"use strict";
const WIN_LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
function newGame() { return { board: Array(9).fill(null), turn: "X", winner: null, draw: false, winningLine: [] }; }
function play(state, index) {
  if (!Number.isInteger(index) || index < 0 || index > 8 || state.winner || state.draw || state.board[index]) return state;
  const board = state.board.slice();
  board[index] = state.turn;
  const winningLine = WIN_LINES.find(([a,b,c]) => board[a] && board[a] === board[b] && board[a] === board[c]) || [];
  const winner = winningLine.length ? state.turn : null;
  const draw = !winner && board.every(Boolean);
  return { board, turn: winner || draw ? state.turn : (state.turn === "X" ? "O" : "X"), winner, draw, winningLine };
}
const TicTacToe = { newGame, play };
if (typeof module !== "undefined") module.exports = TicTacToe;
if (typeof window !== "undefined") window.TicTacToe = TicTacToe;
