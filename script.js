
const homePage = document.getElementById("home-page");
const gameContainer = document.getElementById("game-container");
const wipModal = document.getElementById("wip-modal");

const btnComputer = document.getElementById("btn-computer");
const btnOffline = document.getElementById("btn-offline");
const btnOnline = document.getElementById("btn-online");
const restartBtn = document.getElementById("restart");
const backToHomeBtn = document.getElementById("back-to-home");
const closeModalBtn = document.getElementById("close-modal");

let playerTurn = document.getElementById("playerTurn");
let result = document.getElementById("result");
const cells = document.querySelectorAll(".col");

let currentPlayer = "O";
let array = Array(9).fill(null);
let gameActive = false;
let isComputerMode = false;



function createBackground() {
    const bgContainer = document.getElementById("background-animation");
    const width = window.innerWidth;
    const height = window.innerHeight;
    

    const columns = Math.ceil(width / 40);
    const rows = Math.ceil(height / 40);
    const totalItems = columns * rows;

    let html = "";
    
    for (let i = 0; i < totalItems; i++) {
    
        const char = Math.random() > 0.5 ? "X" : "O";
        
        html += `<div class="bg-symbol">${char}</div>`;
    }

    bgContainer.innerHTML = html;
}


createBackground();


let resizeTimeout;
window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(createBackground, 200);
});

btnOffline.addEventListener("click", () => {
    isComputerMode = false;
    startGame();
});

btnComputer.addEventListener("click", () => {
    isComputerMode = true;
    startGame();
});


btnOnline.addEventListener("click", () => {
    wipModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    wipModal.classList.add("hidden");
});


function startGame() {
    homePage.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    resetGame();
}


backToHomeBtn.addEventListener("click", () => {
    gameContainer.classList.add("hidden");
    homePage.classList.remove("hidden");
});




function resetGame() {
    array.fill(null); 
    currentPlayer = "O";
    gameActive = true;
    
    result.style.color = "white";
  
    result.innerHTML = `Player <span id="playerTurn">X</span>'s Turn`;

   
    playerTurn = document.getElementById("playerTurn");


    cells.forEach(cell => {
        cell.innerText = "";
        cell.style.color = ""; 
        cell.style.backgroundColor = "";
    });
}


function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (array[a] && array[a] === array[b] && array[a] === array[c]) {
            gameActive = false;
            result.style.color = "#F59E0B";
            result.innerHTML = `<h3>Winner is ${array[a]}!</h3>`;
            return;
        }
    }

   
    if (!array.includes(null)) {
        gameActive = false;
        result.style.color = "lightgray";
        result.innerHTML = `<h3>It's a Draw!</h3>`;
    }
}


function handleClick(el) {
    const id = Number(el.id);

    
    if (!gameActive || array[id] !== null) return;

  
    makeMove(id, el);


    if (gameActive && isComputerMode && playerTurn.innerText === "O") {
        setTimeout(computerMove, 500); // 0.5s delay for realism
    }
}


function makeMove(id, element) {
   
    let current = playerTurn.innerText;
    
     array[id] = current;
    element.innerText = current;


    if (current === "X") {
        element.style.color = "#3B82F6"; 
        playerTurn.innerText = "O"; 
    } else {
        element.style.color = "#EF4444"; 
        playerTurn.innerText = "X"; 
    }

    checkWinner();
}




function computerMove() {
    if (!gameActive) return;

    let bestMoveIndex = null;

    bestMoveIndex = findBestSpot("O");

  
    if (bestMoveIndex === null) {
        bestMoveIndex = findBestSpot("X");
    }


    if (bestMoveIndex === null && array[4] === null) {
        bestMoveIndex = 4;
    }

 
    if (bestMoveIndex === null) {
        let emptySpots = [];
        array.forEach((cell, index) => {
            if (cell === null) emptySpots.push(index);
        });

        if (emptySpots.length > 0) {
            let randomIndex = Math.floor(Math.random() * emptySpots.length);
            bestMoveIndex = emptySpots[randomIndex];
        }
    }

    
    if (bestMoveIndex !== null) {
        let targetCell = document.getElementById(bestMoveIndex);
        makeMove(bestMoveIndex, targetCell);
    }
}


function findBestSpot(player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        
        
        const valA = array[a];
        const valB = array[b];
        const valC = array[c];

       
        if (valA === player && valB === player && valC === null) return c;
        
       
        if (valA === player && valC === player && valB === null) return b;
        
       
        if (valB === player && valC === player && valA === null) return a;
    }
    
    return null; 
}


restartBtn.addEventListener("click", resetGame);