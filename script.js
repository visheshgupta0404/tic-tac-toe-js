"use strict";
let state = TicTacToe.newGame();
let timer = null;
const scores = { X: 0, O: 0, draws: 0 };
const cells = [...document.querySelectorAll(".cell")];
const result = document.getElementById("result");
const autoRestart = document.getElementById("auto-restart");
function render() {
  const over = state.winner || state.draw;
  cells.forEach((cell, index) => {
    cell.textContent = state.board[index] || "";
    cell.disabled = Boolean(over || state.board[index]);
    cell.dataset.player = state.board[index] || "";
    cell.classList.toggle("winning", state.winningLine.includes(index));
    cell.setAttribute("aria-label", `Row ${Math.floor(index / 3) + 1}, column ${index % 3 + 1}: ${state.board[index] || "empty"}`);
  });
  const message = state.winner ? `${state.winner} wins!` : state.draw ? "It's a draw." : `${state.turn}'s turn`;
  result.textContent = message + (over && autoRestart.checked ? " Next round in 3 seconds." : "");
  document.getElementById("score-x").textContent = scores.X;
  document.getElementById("score-o").textContent = scores.O;
  document.getElementById("score-draws").textContent = scores.draws;
}
function cancelRestart() { clearTimeout(timer); timer = null; }
function nextRound(focus = false) {
  cancelRestart();
  state = TicTacToe.newGame();
  render();
  if (focus) cells[0].focus();
}
function scheduleRestart() {
  cancelRestart();
  if ((state.winner || state.draw) && autoRestart.checked) timer = setTimeout(() => nextRound(true), 3000);
}
cells.forEach((cell, index) => cell.addEventListener("click", () => {
  const next = TicTacToe.play(state, index);
  if (next === state) return;
  state = next;
  if (state.winner) scores[state.winner]++;
  else if (state.draw) scores.draws++;
  render();
  scheduleRestart();
  if (!state.winner && !state.draw) cells.find(button => !button.disabled)?.focus();
}));
document.getElementById("restart").addEventListener("click", () => nextRound(true));
autoRestart.addEventListener("change", () => { scheduleRestart(); render(); });
render();
