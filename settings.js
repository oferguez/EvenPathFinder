// Utility functions to manage localStorage for per-user settings
function getUserConfigKey(username) {
    return `userConfig_${username}`;
}

function loadPreferences(username) {
    const configKey = getUserConfigKey(username);
    const preferences = localStorage.getItem(configKey);
    return preferences ? JSON.parse(preferences) : getDefaultPreferences();
}

function savePreferences(username, preferences) {
    const configKey = getUserConfigKey(username);
    localStorage.setItem(configKey, JSON.stringify(preferences));
}

function getDefaultPreferences() {
    return {
        name: "Shira",
        boardSize: 5,
        numberType: "Evens",
        apiKey: "..."
    };
}

// Example logged-in user (replace with real login info in a real app)
const currentUser = "exampleUser";

// DOM Elements
const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const saveSettings = document.getElementById("saveSettings");
const cancelSettings = document.getElementById("cancelSettings");

// Form elements
const nameInput = document.getElementById("name");
const boardSizeInput = document.getElementById("boardSize");
const numberTypeInput = document.getElementById("numberType");
const apiKeyInput = document.getElementById("apiKey");

// Open settings modal
settingsButton.addEventListener("click", () => {
    const preferences = loadPreferences(currentUser);

    // Populate the form with current preferences
    nameInput.value = preferences.name;
    boardSizeInput.value = preferences.boardSize;
    numberTypeInput.value = preferences.numberType;
    apiKeyInput.value = preferences.apiKey;

    // Show modal
    settingsModal.classList.add("active");
});

// Save preferences
saveSettings.addEventListener("click", () => {
    const preferences = {
        name: nameInput.value,
        boardSize: parseInt(boardSizeInput.value, 10) || 5,
        numberType: numberTypeInput.value,
        apiKey: apiKeyInput.value
    };

    savePreferences(currentUser, preferences);

    alert("Settings saved successfully!");
    settingsModal.classList.remove("active");
});

// Cancel changes
cancelSettings.addEventListener("click", () => {
    // Simply close the modal without saving
    settingsModal.classList.remove("active");
});