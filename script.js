import FireWorkExtravaganza from './FireworkExtravaganza.js';

function setupHandlers() {
  document.getElementById('newGame').addEventListener('click', newGame);
  document.getElementById('resetGame').addEventListener('click', resetGame);
  document.getElementById('numberType').addEventListener("change", newGame);
}

setupHandlers();

window.S = triggerShakeEffect;
window.R = triggerRainbowEffect;

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
let numberType = 'evens';
let bound = 100;

// Start the game
initGame();

function CongratEffect(message = null, msLen = null)
{
  const congrats = document.getElementById('congratulationMessage');
  console.log(`Congrating: congrats=${congrats}`);

  if (message === null) {
    congrats.textContent = getRandomCongratulation();
  }
  else {
    congrats.textContent = message;
  }
  const anima = congrats.getAnimations()[0];
  anima.cancel();
  anima.play();
}

function FireworksEffect(msLen = null)
{
  // const fireworks_container = document.getElementById('fireworks_container');
  const effectContainer =  document.querySelector('body');
  if (msLen === null) {
    msLen = 2000;  
  }
  let fw = new FireWorkExtravaganza(effectContainer, 20, msLen);
  fw.fireAll();
}


// Initialize the game
function initGame() {
  boardSize = parseInt(document.getElementById('boardSize').value);
  if (isNaN(boardSize) || boardSize < 4 || boardSize > 12) {
    showFactMessage('Please enter a valid board size between 4 and 12.', 'red');
    return;
  }
  numberType = document.getElementById('numberType').value;
  generateBoard();
  renderBoard();
}

function generateBoard() {
  console.log(`1 ${boardSize}`);
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  console.log(`2 ${boardSize}`);
  let i = 0;
  let j = 0;
  console.log(`3 ${boardSize}`);
  console.log(`4 ${(i < boardSize)}`);
  console.log(`5 ${(j < boardSize)}`);
  while ((i < boardSize) && (j < boardSize))
  {
    console.log('yoyo');
    board[i][j] = randomValidNumber(bound);
    let nextMove = nextPathElement(board, i, j);
    i = nextMove.i;
    j = nextMove.j;
    console.log(`nm: ${i} ${j}`);
  }
  console.log('w_f');
  for (i = 0; i < boardSize; i++) {
    for (j = 0; j < boardSize; j++) {
      if (board[i][j] === 0) {
        board[i][j] = randomInvalidNumber(bound);
      }
    }
  }
}

function nextPathElement(board, i0, j0)
{
  let i = 0;
  let j = 0;
  let r = 0;
  do
  {
    i = i0;
    j = j0;
    r = Math.random() * 4;
    if (r < 1)              // up
    {
      j--;
    }
    else if (r < 2)        // down
    {
      j++;
    }
    else if (r < 3)        // left
    {
      i--
    }
    else                  // right
    {
      i++;
    }
    if (i === boardSize-1 && j === boardSize-1)
    {
      break;
    }
    console.log('npe');
    console.log(`npe: ${i} ${j}`);
  } while ( i >= 0 && i < boardSize && j >= 0 && j < boardSize && board[i][j] > 0)
  return {i,j};

}

// Generate a new board with at least one valid path
function generateBoard1() {
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
    if (nx >= 0 && nx < boardSize && ny >= 0 && ny < boardSize && !visited[nx][ny] && isValidNumber(board[nx][ny])) {
      if (dfs(nx, ny, visited)) return true;
    }
  }
  return false;
}

// Render the board
export function renderBoard() {
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
        cell.classList.add('blocked-move');
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

  return isValidNumber(board[x][y]);
}

function randomValidNumber(bound) {
  console.log('rvn');
  switch (numberType)
  {
    case 'evens':
      return 2 * Math.floor(Math.random() * (bound+1) / 2);
    break;

    case 'odds':
      return 1 + 2 * Math.floor(Math.random() * bound / 2);
    break;

    case 'Threepls':
      return 3 * (Math.floor(Math.random()) * bound / 3);
    break;

    case 'Fifths':
      return 5 * (Math.floor(Math.random()) * bound / 5);
    break;
  }
}

function randomInvalidNumber(bound) {
  let r = 0;
  do
  { 
    r = Math.floor(Math.random() * bound);
  } while (isValidNumber(r));

  return r;
}

function isValidNumber(num) {
  switch (numberType)
  {
    case 'evens':
    if (num % 2 !== 0)
      {
        return false;
      }
    break;

    case 'odds':
      if (num % 2 !== 1) 
      {
        return false;
      }
    break;

    case 'Threepls':
      if (num % 3 !== 0) 
      {
        return false;
      }
    break;

    case 'Fifths':
      if (num % 5 !== 0) 
      {
        return false;
      }
    break;
  }
  return true;
}

// Make a move
function makeMove(x, y) {
  if (!isValidMove(x, y)) {
    showMoveMessages('Oops! That move is not allowed.', 'red');
    // showJokeMessage();
    // showFactMessage(null, null);
    triggerWrongMoveEffect();
    return;
  }
  previousPositions.push(currentPosition.slice());
  currentPosition = [x, y];
  movesTaken++;
  renderBoard();
  if (x === boardSize - 1 && y === boardSize - 1) {
    showFactMessage(`Congratulations! You reached the end in ${movesTaken} moves.`, 'green');
    triggerWinEffect();
    return;
  }
  showFactMessage(`Very well Shira!! Did you know ${getMathFact(board[x][y])}?`, 'green');
  // showJokeMessage('#FF00FF');

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

function triggerWinEffect() {
  triggerRainbowEffect(2500);
  triggerShakeEffect(2500);
  FireworksEffect(2500);
  CongratEffect('Well Done Shira!!!', 2500);
}

function triggerWrongMoveEffect() {
  triggerShakeEffect(1000);
}

function triggerShakeEffect(msLength)
{
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.classList.remove('shake');
  gameBoard.classList.add('shake');

  setTimeout(() => {
    gameBoard.classList.remove('shake');
  }, msLength);
}

function triggerRainbowEffect(msLength)
{
  var we = document.getElementById('winEffect');
  we.classList.add('rainbow-dance-background');

  setTimeout(() => {
    we.classList.remove('rainbow-dance-background');
  }, msLength);
}