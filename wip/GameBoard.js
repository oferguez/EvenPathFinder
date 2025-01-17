import FireWorkExtravaganza from './FireworkExtravaganza.js';
import { loadPreferences } from './settings.js';

class Game {
  constructor() {
    this.boardSize = 6;
    this.board = [];
    this.currentPosition = [0, 0];
    this.previousPositions = [];
    this.movesTaken = 0;
    this.numberType = 'Evens';
    this.bound = 100;
    this.effectSelector = 0;
  }

  setupHandlers() {
    const newGameButton = document.getElementById('newGame');
    const resetGameButton = document.getElementById('resetGame');

    if (!newGameButton || !resetGameButton) {
      console.warn('Required DOM elements are missing. Cannot set up handlers at this time.');
      return;
    }

    console.log('Setting up game');

    newGameButton.addEventListener('click', () => this.newGame());
    resetGameButton.addEventListener('click', () => this.resetGame());

    // Save the original methods
    const originalGetElementById = document.getElementById;
    const originalQuerySelector = document.querySelector;

    // Override document.getElementById
    document.getElementById = function(id) {
      const element = originalGetElementById.call(document, id);
      if (!element) {
        throw new Error(`Element with ID "${id}" not found`);
      }
      return element;
    };

    // Override document.querySelector
    document.querySelector = function(selector) {
      const element = originalQuerySelector.call(document, selector);
      if (!element) {
        throw new Error(`Element with selector "${selector}" not found`);
      }
      return element;
    };

    this.newGame();
  }

  newGame() {
    this.initGame();
  }

  resetGame() {
    this.currentPosition = [0, 0];
    this.previousPositions = [];
    this.movesTaken = 0;
    this.renderBoard();
    this.showFactMessage('', '');
  }

  initGame() {
    let preferences = loadPreferences();
    this.boardSize = preferences.boardSize;
    if (isNaN(this.boardSize) || this.boardSize < 4 || this.boardBize > 12) {
      this.showFactMessage('Please enter a valid board size between 4 and 12.', 'red');
      return;
    }

    this.numberType = preferences.numberType;
    this.movesTaken = 0;
    this.name = preferences.name;
    this.currentPosition = [0, 0];
    this.previousPositions = [];
    this.generateBoard();
    this.renderBoard();
  }

  generateBoard() {
    this.board = Array.from({ length: this.boardSize }, () =>
      Array(this.boardSize).fill(0)
    );

    let i = 0, j = 0, done = false;
    while (!done) {
      const rv = this.randomValidNumber();
      this.board[i][j] = rv;
      const nextMove = this.nextPathElement(i, j);
      i = nextMove.i;
      j = nextMove.j;
      done = nextMove.done;
    }

    for (i = 0; i < this.boardSize; i++) {
      for (j = 0; j < this.boardSize; j++) {
        if (this.board[i][j] === 0) {
          this.board[i][j] = this.randomNumber();
        }
      }
    }
  }

  nextPathElement(i0, j0) {
    let i, j, r;
    if (i0 === this.boardSize - 1 && j0 === this.boardSize - 1) {
      return { i: i0, j: j0, done: true };
    }

    do {
      i = i0;
      j = j0;
      r = Math.random() * 2;
      if (r < 1) i++;
      else j++;
    } while (
      i === this.boardSize ||
      j === this.boardSize ||
      this.board[i][j] !== 0
    );

    return { i, j, done: false };
  }

  renderBoard() {
    const gameBoard = document.getElementById('game-board');
    const currentBoard = gameBoard.querySelectorAll('div, br');
    Array.from(currentBoard).forEach((e) => e.remove());

    for (let i = 0; i < this.boardSize; i++) {
      for (let j = 0; j < this.boardSize; j++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = this.board[i][j];

        if (i === this.currentPosition[0] && j === this.currentPosition[1]) {
          cell.classList.add('highlight-current');
        } else if (
          this.previousPositions.some((pos) => pos[0] === i && pos[1] === j)
        ) {
          cell.classList.add('highlight-previous');
        }

        if (this.isNeighbour(i, j)) {
          cell.addEventListener('click', () => this.makeMove(i, j));
        } else {
          cell.classList.add('blocked-move');
        }

        gameBoard.appendChild(cell);
      }
      gameBoard.appendChild(document.createElement('br'));
    }

    this.showMoveMessages(`Moves taken: ${this.movesTaken}`, 'blue');
  }

  isNeighbour(x, y) {
    const [currentX, currentY] = this.currentPosition;
    const deltaX = Math.abs(x - currentX);
    const deltaY = Math.abs(y - currentY);
    return deltaX + deltaY === 1;
  }

  randomValidNumber() {
    switch (this.numberType) {
    case 'Evens':
      return 2 * (1 + Math.floor(Math.random() * this.bound / 2));
    case 'Odds':
      return 1 + 2 * Math.floor(Math.random() * this.bound / 2);
    case 'Threepls':
      return 3 * (1 + Math.floor(Math.random() * this.bound / 3));
    case 'Fifths':
      return 5 * (1 + Math.floor(Math.random() * this.bound / 5));
    default:
      return 0;
    }
  }

  randomNumber() {
    return Math.floor(Math.random() * this.bound);
  }

  showFactMessage(text, color) {
    const factMessages = document.getElementById('fact-messages');
    factMessages.style.color = color;
    factMessages.textContent = text;
  }

  showMoveMessages(text, color) {
    const moveMessages = document.getElementById('moveMessages');
    moveMessages.style.color = color;
    moveMessages.textContent = text;
  }

  isValidNumber(num) {
    switch (this.numberType)
    {
    case 'Evens':
      if (num % 2 !== 0)
      {
        return false;
      }
      break;
    case 'Odds':
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
  
  isValidMove(x, y) {
    if (!this.isNeighbour(x, y))
    {
      return false;
    }
    return this.isValidNumber(this.board[x][y]);
  }

  makeMove(x, y) {
    if (!this.isValidMove(x, y)) {
      this.showMoveMessages('Oops! That move is not allowed.', 'red');
      this.triggerWrongMoveEffect();
      return;
    }
  
    this.previousPositions.push([...this.currentPosition]);
    this.currentPosition = [x, y];
    this.movesTaken++;
    this.renderBoard();
  
    if (x === this.boardSize - 1 && y === this.boardSize - 1) {
      this.showFactMessage(
        `Congratulations! You reached the end in ${this.movesTaken} moves.`,
        'green'
      );
      this.triggerWinEffect();
      return;
    }
  
    this.showFactMessage(`Did you know? ${this.getMathFact(this.board[x][y])}`, 'green');
    this.triggerValidMoveEffect(); // Trigger the valid move effect here
  }
  
  getMathFact(num) {
    if (num <= 1) return `${num} is special.`;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return `${num} is ${i} times ${num / i}.`;
    }
    return `${num} is a prime number.`;
  }

  triggerValidMoveEffect() {
    if (this.effectSelector !== 1) {
      this.congratEffect();
    }
    if (this.effectSelector !== 2) {
      this.fireworksEffect();
    }
    this.effectSelector = (this.effectSelector + 1) % 3;
  }
  
  triggerWinEffect() {
    this.triggerRainbowEffect(2500);
    this.triggerShakeEffect(2500);
    this.fireworksEffect(2500);
    this.congratEffect(`Well Done ${this.name}!!!`, 2500);
  }
  
  triggerWrongMoveEffect() {
    this.triggerShakeEffect(1000);
  }
  
  triggerShakeEffect(msLength) {
    const gameBoard = document.getElementById('game-board');
    gameBoard.classList.remove('shake');
    gameBoard.classList.add('shake');
  
    setTimeout(() => {
      gameBoard.classList.remove('shake');
    }, msLength);
  }
  
  triggerRainbowEffect(msLength) {
    const winEffect = document.getElementById('winEffect');
    winEffect.classList.add('rainbow-dance-background');
  
    setTimeout(() => {
      winEffect.classList.remove('rainbow-dance-background');
    }, msLength);
  }
  
  fireworksEffect(msLength = null) {
    msLength = msLength || 2000;
    const fw = new FireWorkExtravaganza(20, msLength);
    fw.fireAll();
  }
  
  congratEffect(message = null, msLen = null) {
    const congrats = document.getElementById('congratulation-message');
    congrats.textContent = message || this.getRandomCongratulation();
    const animation = congrats.getAnimations()[0];
    animation.cancel();
    animation.play();
  }
  
  getRandomCongratulation() {
    const congratulations = [
      `Great job, ${this.name}!`,
      `Well done, ${this.name}!`,
      `Awesome work, ${this.name}`,
      `You nailed it, ${this.name}`,
      `Bravo, ${this.name}!`,
      `Fantastic, ${this.name}!`,
      `Keep it up, ${this.name}!`,
      `Amazing effort, ${this.name}!`,
      `Way to go, ${this.name}!`,
      `Impressive, ${this.name}!`
    ];
    return congratulations[Math.floor(Math.random() * congratulations.length)];
  } 

}

// Initialize and start the game
const game = new Game();
game.setupHandlers();

// Export for use elsewhere
export default game;
