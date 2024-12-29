import { setupHandlers, newGame, resetGame, boardSize } from '../script';

console.log('yoyo');

// Mock DOM structure
beforeEach(() => {
  // Set up the DOM structure required for your test
  console.log('yaya');
  document.body.innerHTML = `
<body>

  <h1>Math Adventure Game</h1>

  <div id="winEffect"></div> 

  <div id="controls">
    <label for="boardSize">Board Size (4-12):</label>
    <input type="number" id="boardSize" min="4" max="12" value="8">
    <button id="newGame">New Game</button>
    <button id="resetGame">Reset Game</button>
    <label for="numberType">Choose a number type</label>
      <select id="numberType" name="numType">
        <option value="evens">Evens</option>
        <option value="odds">Odds</option>
        <option value="Threepls">Multiples of 3</option>
        <option value="Fifths">Multiples of 5</option>
      </select>
  </div>
  <div id="gameBoard">
    <!-- <button id="testEffect">TE</button>  -->
  </div>
  <div id="moveMessages"></div>
  <div id="jokeMessages"></div>
  <div id="factMessages"></div>
  <div id="congratulationMessage"></div>
</body>`;
  jest.resetModules(); // Clear module cache to ensure fresh import
});

test('setupHandlers attaches event listeners correctly', () => {

  console.log('test called');

  // Run the function to attach event handlers
  setupHandlers();

  // Trigger events and verify handlers are called
  document.getElementById('newGame').click();

  //const boardSize = script.__get__('boardSize');

  expect(boardSize).toBe(8);
});