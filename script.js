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
  currentPosition = [0, 0];
  previousPositions = [];
  generateBoard();
  renderBoard();
}

function generateBoard() {
  board = Array.from({ length: boardSize }, () => Array(boardSize).fill(0));
  let i = 0;
  let j = 0;
  let done = false;
  while (!done)
  {
    let rv = randomValidNumber(bound);
    board[i][j] = rv;
    let nextMove = nextPathElement(board, i, j);
    i = nextMove.i;
    j = nextMove.j;
    done = nextMove.done;
  }
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
  if (i0 === boardSize-1 && j0 === boardSize-1)
  {
    return {i0,j0, done:true};
  }

  do
  {
    i = i0;
    j = j0;
    r = Math.random() * 2;
    if (r < 1)
    {
      i++;
    }
    else 
    {
      j++;
    }
  } while ( i === boardSize || j === boardSize || board[i][j] !== 0)
  return {i,j, done:false};

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
  let result = -100;
  switch (numberType)
  {
    case 'evens':
      result =  2 * (1 + Math.floor(Math.random() * bound / 2) );
    break;

    case 'odds':
      result =  1 + 2 * Math.floor(Math.random() * bound / 2);
    break;

    case 'Threepls':
      result =  3 * (1 + Math.floor(Math.random() * bound / 3) );
    break;

    case 'Fifths':
      result =  5 * (1 + Math.floor(Math.random() * bound / 5) );
    break;
  }

  return result;
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