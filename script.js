let currentPlayer = "O";

let playerTurn = document.getElementById("playerTurn");
let result = document.getElementById("result");
let restart = document.getElementById("restart");

let array = Array(9).fill(null);
// console.log(array);

function checkWinner() {
  if (
    (array[0] !== null && array[0] === array[3] && array[0] === array[6]) ||
    (array[0] !== null && array[0] === array[4] && array[0] === array[8]) ||
    (array[0] !== null && array[0] === array[1] && array[0] === array[2]) ||
    (array[1] !== null && array[1] === array[4] && array[1] === array[7]) ||
    (array[2] !== null && array[2] === array[5] && array[2] === array[8]) ||
    (array[2] !== null && array[2] === array[4] && array[2] === array[6]) ||
    (array[3] !== null && array[3] === array[4] && array[3] === array[5]) ||
    (array[6] !== null && array[6] === array[7] && array[6] === array[8])
  ) {
    result.style.color = "red";
    result.innerText = `Winner is ${currentPlayer}`;
  } else if (!array.includes(null)) {
    result.style.color = "red";
    result.innerText = "Draw";
  }
}

function handleClick(el) {
  if (array[el.id] !== null) return;
  playerTurn.innerText = currentPlayer;
  currentPlayer === "X" ? (currentPlayer = "O") : (currentPlayer = "X");
  array[el.id] = currentPlayer;
  console.log(array);
  el.innerText = currentPlayer;
  checkWinner();
}

restart.addEventListener("click", () => {
  window.location.reload();
});
