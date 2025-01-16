// Utility functions to manage localStorage for per-user settings
function getUserConfigKey(username) {
  return `userConfig_${username}`;
}

export function loadPreferences(username = null) {
  if (!username) {
    username = currentUser;
  }
  const configKey = getUserConfigKey(username);
  const preferences = localStorage.getItem(configKey);
  return preferences ? JSON.parse(preferences) : getDefaultPreferences();
}

function savePreferences(username, preferences) {
  const configKey = getUserConfigKey(username);
  localStorage.setItem(configKey, JSON.stringify(preferences));
}

function settingsChanged(userName, preferences) {
  let existingPreferences = loadPreferences(userName);
  return ! JSON.stringify(existingPreferences) !== JSON.stringify(preferences);
}

function getDefaultPreferences() {
  return {
    name: 'Shira',
    boardSize: 5,
    numberType: 'Evens',
    apiKey: '...'
  };
}

// Example logged-in user (replace with real login info in a real app)
const currentUser = 'exampleUser';

// DOM Elements
const settingsButton = document.getElementById('settingsButton');
const settingsModal = document.getElementById('settingsModal');
const saveSettings = document.getElementById('saveSettings');
const cancelSettings = document.getElementById('cancelSettings');
const openAboutDialog = document.getElementById('aboutSettings');
const closeAboutDialog = document.getElementById('closeAboutDialog');
const aboutDialog = document.getElementById('aboutDialog');
const newGameButton = document.getElementById('newGame');
const branch = document.getElementById('branch');
const commit = document.getElementById('commit');
const buildDate = document.getElementById('buildDate');

// Form elements
const nameInput = document.getElementById('name');
const boardSizeInput = document.getElementById('boardSize');
const numberTypeInput = document.getElementById('numberType');
const apiKeyInput = document.getElementById('apiKey');
let versionInfo = {};

function updateMainScreen() {
  let preferences = loadPreferences();
  document.getElementById('greetPlayer').textContent = `Hello ${preferences.name}! You need to get to the bottom right square, clicking on ${preferences.numberType}`;
}

// Open settings modal
settingsButton.addEventListener('click', () => {
  fetch('version.json')
  .then(response => response.json())
  .then(data => {
    versionInfo = data;
  })
  .catch(error => {
    console.error('Failed to fetch version info:', error);
    versionInfo = { commit: 'unknown commit', branch: 'unknown branch', date: 'unknown date' };
  });  

  const preferences = loadPreferences(currentUser);

  // Populate the form with current preferences
  nameInput.value = preferences.name;
  boardSizeInput.value = preferences.boardSize;
  numberTypeInput.value = preferences.numberType;
  apiKeyInput.value = preferences.apiKey;

  // Show modal
  settingsModal.classList.add('active');
  updateMainScreen();
});

// Save preferences
saveSettings.addEventListener('click', () => {
  const preferences = {
    name: nameInput.value,
    boardSize: parseInt(boardSizeInput.value, 10) || 5,
    numberType: numberTypeInput.value,
    apiKey: apiKeyInput.value
  };

  if (settingsChanged(currentUser, preferences))
  {
    savePreferences(currentUser, preferences);
    updateMainScreen();
    newGameButton.click();
  }

  settingsModal.classList.remove('active');
});

// Cancel changes
cancelSettings.addEventListener('click', () => {
  settingsModal.classList.remove('active');
});

openAboutDialog.addEventListener('click', () => {
  branch.textContent = `Branch: ${versionInfo.branch}`;
  commit.textContent = `Commit: ${versionInfo.commit}`;
  buildDate.textContent = `Date of build: ${versionInfo.dateOfBuild}`
  aboutDialog.showModal();
});
    
closeAboutDialog.addEventListener('click', () => {
  aboutDialog.close();
});

updateMainScreen();