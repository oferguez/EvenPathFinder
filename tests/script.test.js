import { add } from 'script.js';

test('adds 1 + 2 to equal 3', () => {
  expect(add(1, 2)).toBe(3);
});

test('reset() sets global variables to default values', () => {
  // Clear module cache
  jest.resetModules();
  
  // Dynamically import the module to get fresh state
  const module = require('../src/exampleModule');
  
  // Call the reset function
  module.reset();
  
  // Access private variables through the cached module
  const board = module.__get__('board');
  const currentPosition = module.__get__('globalVariable2');
  
  // Assertions
  expect(board).toBe([]);
  expect(currentPosition).toBe([0,0]);
});
  