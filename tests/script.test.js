import { setupHandlers, newGame, resetGame, gameState } from '../script';

// Mock DOM structure
beforeEach(() => {
  document.body.innerHTML = `
<body>

  <h1>Math Adventure Game</h1>

  <div id="win-effect"></div> 

  <div id="controls">
    <label for="board-size">Board Size (4-12):</label>
    <input type="number" id="board-size" min="4" max="12" value="8">
    <button id="new-game">New Game</button>
    <button id="reset-game">Reset Game</button>
    <label for="number-type">Choose a number type</label>
      <select id="number-type" name="numType">
        <option value="Evens">Evens</option>
        <option value="Odds">Odds</option>
        <option value="Threepls">Multiples of 3</option>
        <option value="Fifths">Multiples of 5</option>
      </select>
  </div>
  <div id="game-board">
    <!-- <button id="testEffect">TE</button>  -->
  </div>
  <div id="move-messages"></div>
  <div id="joke-messages"></div>
  <div id="fact-messages"></div>
  <div id="congratulation-message"></div>
</body>`;
  jest.resetModules(); // Clear module cache to ensure fresh import
});

expect.extend({
  toBePositive(received) {
    const pass = typeof received === 'number' && received > 0;
    if (pass) {
      return {
        message: () => `expected ${received} not to be positive`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be positive`,
        pass: false,
      };
    }
  },
});

test('setupHandlers attaches event listeners correctly', () => {

  console.log('test called');

  // Run the function to attach event handlers
  setupHandlers();

  // Trigger events and verify handlers are called
  document.getElementById('new-game').click();

  const N = gameState.boardSize;
  expect(N).toBePositive();
  expect(Array.isArray(gameState.board)).toBe(true);
  expect(gameState.board.length).toBe(N);
  gameState.board.forEach((innerArray) => {
    expect(Array.isArray(innerArray)).toBe(true);
  });
});