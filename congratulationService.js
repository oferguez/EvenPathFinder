import { loadPreferences } from './settings.js';

let CongratulationMessages = [];
let fallBackCongratulations = [
  'Great job, <ChildNamePlaceHolder>!',
  'Well done, <ChildNamePlaceHolder>!',
  'Awesome work, <ChildNamePlaceHolder>',
  'You nailed it, <ChildNamePlaceHolder>',
  'Bravo, <ChildNamePlaceHolder>!',
  'Fantastic, <ChildNamePlaceHolder>!',
  'Keep it up, <ChildNamePlaceHolder>!',
  'Amazing effort, <ChildNamePlaceHolder>!',
  'Way to go, <ChildNamePlaceHolder>!',
  'Impressive, <ChildNamePlaceHolder>!'
];

export function getCongratulationMessage() {
  const preferences = loadPreferences();
  const childName = preferences.name;
  let message = '';
  if (CongratulationMessages.length > 0) {
    message = CongratulationMessages.shift();
  }
  else {
    console.info('Fetching congratulation messages');
    try {
      loadAiCongratulationMessages(preferences);
      message = CongratulationMessages.shift();
    } 
    catch (error) {
      console.error('Error fetching congratulation messages:', error);
      message = fallBackCongratulations[Math.floor(Math.random() * fallBackCongratulations.length)];
    }
  }

  return message.replace('<ChildNamePlaceHolder>', childName);
}

function parseResponseString(responseString) {
  // Step 1: Remove formatting (triple backticks and surrounding text)
  const cleanedString = responseString
    .replace(/```json\n/, '') // Remove opening ```json
    .replace(/\n```/, '')     // Remove closing ```
    .trim();                  // Remove extra whitespace

  // Step 2: Parse the cleaned JSON string
  try {
    const jsonObject = JSON.parse(cleanedString);
    return jsonObject.choices[0].message;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return null;
  }
}

function loadAiCongratulationMessages(preferences) {

  if (!preferences?.apiKey || preferences.apiKey.length <= 10) {

    console.error('API Key is missing or invalid');
    throw new Error('API Key is missing or invalid');
  }

  const apiKey =  preferences.apiKey;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const prompt = 
          `Create 10 warm and funny congratulation messages for a child. 
          Please use the string "<ChildNamePlaceHolder>" as a place holder for the child's name. 
          Try to keep them short, between 3 to 5-7 words each.
          Make them suitable for kids and full of joy.
          Have the list in the response's choices[0].message.content be a json list that can be easily extracted by code.
          Do not append anything to that list, so that choices[0].message.content can be parsed as a json list.
          For example:  ["congratulation1", "congratulation2", ... , "congratulation10"]`;
  fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      // eslint-disable-next-line camelcase
      max_tokens: 300,
      temperature: 0.7
    })
  })
    .then(response => response.json())
    .then(data => {
      // Parse the response
      const respMessages = data.choices[0].message.content;
      const greetingMessages = parseResponseString(respMessages);
      const messages = greetingMessages.content;
      console.log('Fetched Congratulation Messages:\n', messages);
      CongratulationMessages = messages;
    })
    .catch(error => {
      console.error('Error fetching congratulation messages:', error);
    });
}

try {
  loadAiCongratulationMessages(loadPreferences());
} catch (error) {
  console.error('Can not load AI congratulation messages:', error);
}
