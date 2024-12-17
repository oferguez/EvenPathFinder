import FireWorkExtravaganza from './FireworkExtravaganza.js';

function setupHandlers() {
  document.getElementById('newGame').addEventListener('click', newGame);
  document.getElementById('resetGame').addEventListener('click', resetGame);
  document.getElementById('testEffect').addEventListener('click', triggerValidMoveEffect);
}

setupHandlers();

// New game
function newGame() {
  initGame();
}

// Reset game
function resetGame() {
  currentPosition = [0, 0];
  previousPositions = [];
  movesTaken = 0;
  renderBoard();
  showFactMessage('', '');
}

// defaults
let boardSize = 6;
let board = [];
let currentPosition = [0, 0];
let previousPositions = [];
let movesTaken = 0;

// Start the game
initGame();

function CongratEffect()
{
  const congrats = document.getElementById('congratulationMessage');
  console.log(`Congrating: congrats=${congrats}`);
  congrats.textContent = getRandomCongratulation();
  const anima = congrats.getAnimations()[0];
  anima.cancel();
  anima.play();
}

function FireworksEffect()
{
  
  // const fireworks_container = document.getElementById('fireworks_container');
  const effectContainer =  document.querySelector('body');
  let fw = new FireWorkExtravaganza(effectContainer, 20, 2);
  fw.fireAll();
}


// Initialize the game
function initGame() {
  boardSize = parseInt(document.getElementById('boardSize').value);
  if (isNaN(boardSize) || boardSize < 4 || boardSize > 12) {
    showFactMessage('Please enter a valid board size between 4 and 12.', 'red');
    return;
  }
  generateBoard();
  renderBoard();
}

// Generate a new board with at least one valid path
function generateBoard() {
  do {
    board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
    for (let i = 0; i < boardSize; i++) {
      for (let j = 0; j < boardSize; j++) {
        if (i + j === 0)
        {
          board[i][j] = 2 * Math.floor(Math.random() * 51);
        }
        else
        {
          board[i][j] = Math.floor(Math.random() * 101);
        }
      }
    }
  } while (!hasValidPath());
  currentPosition = [0, 0];
  previousPositions = [];
  movesTaken = 0;
}

// Check if there's at least one valid path from start to finish
function hasValidPath() {
  const visited = Array.from({ length: boardSize }, () => Array(boardSize).fill(false));
  return dfs(0, 0, visited);
}

// Depth-first search to find a valid path
function dfs(x, y, visited) {
  if (x === boardSize - 1 && y === boardSize - 1) return true;
  visited[x][y] = true;
  const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  for (const [dx, dy] of directions) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && !visited[nx][ny] && board[nx][ny] % 2 === 0) {
      if (dfs(nx, ny, visited)) return true;
    }
  }
  return false;
}

// Render the board
function renderBoard() {
  const gameBoard = document.getElementById('gameBoard');
  const currentBoard = gameBoard.querySelectorAll('div, br');
  Array.from(currentBoard).forEach(e => e.remove());
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      cell.textContent = board[i][j];
      if (i === currentPosition[0] && j === currentPosition[1]) {
        cell.classList.add('highlight-current');
      } else if (previousPositions.some(pos => pos[0] === i && pos[1] === j)) {
        cell.classList.add('highlight-previous');
      }
      if (isNeighbour(i, j))
      {
        cell.addEventListener('click', () => makeMove(i, j));
      }
      else
      {
        cell.classList.add('illegal-move');
      }
      gameBoard.appendChild(cell);
    }
    gameBoard.appendChild(document.createElement('br'));  
  }

  showMoveMessages(`Moves taken: ${movesTaken}`,'blue');
}

function isNeighbour(x, y)
{
  if (x < 0 || x >= boardSize || y < 0 || y >= boardSize)
  {
    return false;
  }

  // one step horizontally or vertically
  const [currentX, currentY] = currentPosition;
  const deltaX = Math.abs(x - currentX);
  const deltaY = Math.abs(y - currentY);
  if (deltaX > 1 || deltaY > 1 || Math.abs(deltaX - deltaY) !== 1)
  {
    return false;
  }

  return true;
}

// Validate if a move is possible
function isValidMove(x, y) {
  if (!isNeighbour(x,y))
  {
    return false;
  }

  if (board[x][y] % 2 !== 0) 
  {
    return false;
  }

  return true;
}

// Make a move
function makeMove(x, y) {
  if (!isValidMove(x, y)) {
    showMoveMessages('Oops! That move is not allowed.', 'red');
    showJokeMessage();
    showFactMessage(null, null);
    triggerWrongMoveEffect();
    return;
  }
  previousPositions.push(currentPosition.slice());
  currentPosition = [x, y];
  movesTaken++;
  if (x === boardSize - 1 && y === boardSize - 1) {
    showFactMessage(`Congratulations! You reached the end in ${movesTaken} moves.`, 'green');
    return;
  }
  showFactMessage(`Very well Shira!! Did you know ${getMathFact(board[x][y])}?`, 'green');
  showJokeMessage('#FF00FF');

  renderBoard();
  console.log(`makemove: ${x} ${y}`);
  triggerValidMoveEffect();

}

// Get a simple math fact about a number
function getMathFact(num) {
  if (num === 0) return '0 times any number is 0';
  if (num === 1) return '1 times any number is that number';
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return `${num} is ${i} times ${num / i}`;
  }
  return `${num} is a prime number`;
}

// Show a message for moves taken
function showMoveMessages(text, color) {
  const moveMessages = document.getElementById('moveMessages');
  moveMessages.style.color = color;
  moveMessages.textContent = text;
}

// Show a message for math facts and other notifications
function showFactMessage(text, color) {
  const factMessages = document.getElementById('factMessages');
  factMessages.style.color = color;
  factMessages.textContent = text;
}

function showJokeMessage(color = null) {
  const jokeMessages = document.getElementById('jokeMessages');
  if (color === null)
  {
    jokeMessages.textContent = null;
    return;
  }

  const hamsterJokes = [
    "Why did the hamster go to the doctor? Because it was feeling a little squirrelly!",
    "Why did the hamster join a band? To play the drums, of course!",
    "Why did the hamster go to the gym? To get wheel-toned!",
    "Why did the hamster become a detective? It wanted to catch a sneaky mouse!",
    "Why did the hamster go to the beach? To suntan its tiny hamster cheeks!"
  ];
  const randomJoke = hamsterJokes[Math.floor(Math.random() * hamsterJokes.length)];
  jokeMessages.style.color = color;
  jokeMessages.textContent = randomJoke;
}

// Array of congratulatory messages
const congratulations = [
  "Great job, Shira!",
  "Well done, Shira!",
  "Awesome work, Shira!",
  "You nailed it, Shira!",
  "Bravo, Shira!",
  "Fantastic, Shira!",
  "Keep it up, Shira!",
  "Amazing effort, Shira!",
  "Way to go, Shira!",
  "Impressive, Shira!"
];

// Function to select a random message
function getRandomCongratulation() {
  const randomIndex = Math.floor(Math.random() * congratulations.length);
  return congratulations[randomIndex];
}
  
let EffectSelector = 0;
function triggerValidMoveEffect() 
{
  if (EffectSelector !== 1)
  {
    CongratEffect();
  }
  if (EffectSelector !== 2)
  {
    FireworksEffect()
  }
  EffectSelector = (EffectSelector + 1) % 3;
}

function triggerWrongMoveEffect() {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.classList.add('shake');

  // Remove the shake effect after 0.5s
  setTimeout(() => {
    gameBoard.classList.remove('shake');
  }, 1500);
}
