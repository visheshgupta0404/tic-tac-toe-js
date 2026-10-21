# Tic Tac Toe

A two-player browser game built with HTML, CSS, and vanilla JavaScript.

- X goes first; players alternate on a responsive 3 × 3 board.
- Rows, columns, and diagonals are checked after each valid move.
- A win or draw locks the board immediately, with winning squares highlighted.
- Session scores survive **New round** and automatic restarts.
- Automatic restart runs after three seconds and can be disabled. Starting a new round cancels the previous timer; no page reload is needed.
- Keyboard users can choose a square with Tab and play using Enter or Space. Square labels and game status are screen-reader accessible.

Open `index.html` directly or serve this directory with `python -m http.server 8000`. [Play the current published version](https://visheshgupta0404.github.io/tic-tac-toe-js/).

## Checks

Use Node.js 20 or newer, then run `npm test` and `npm run check`. No packages need installing. Regression checks cover invalid moves, terminal-state locking, ninth-move wins, draw detection, and all 255,168 possible completed games. Additional controller tests cover restart cancellation and score updates.

Scores are kept in memory and reset on reload. This is a local two-player game; no online opponent or server is involved.

By Vishesh Gupta.
