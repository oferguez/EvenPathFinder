import { loadPreferences } from './settings.js';

let CongratulationMessages = [];
let fallBackCongratulations = [
  'Great job, _childName_!',
  'Well done, _childName_!',
  'Awesome work, _childName_',
  'You nailed it, _childName_',
  'Bravo, _childName_!',
  'Fantastic, _childName_!',
  'Keep it up, _childName_!',
  'Amazing effort, _childName_!',
  'Way to go, _childName_!',
  'Impressive, _childName_!'
];

export function getCongratulationMessage() {
  if (CongratulationMessages.length === 0) {
    console.info('Fetching congratulation messages');
    try {
      getCongratulationMessages();
    } 
    catch (error) {
      console.error('Error fetching congratulation messages:', error);
      message = fallBackCongratulations[Math.floor(Math.random() * fallBackCongratulations.length)];
      message.replace('_childName_', childName);
      return message;
    }
  }
  const message = CongratulationMessages.shift();
  return message;
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

function getCongratulationMessages() {

  const preferences = loadPreferences();
  const childName = preferences.name;
  const apiKey =  preferences.apiKey;
  const apiUrl = 'https://api.openai.com/v1/chat/completions';
  const prompt = 
        `Create 10 warm and funny congratulation messages for a child named ${childName}. 
         Try to keep them short, between 3 to 5-7 words each.
         Make them suitable for kids and full of joy.
         Have the list in choices[0].message.content be a json list that can be easily extracted by code.
         For example:  ... message:["congratulation1", "congratulation2", ... , "congratulation10"]`;

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
      const messages = parseResponseString(respMessages);
      console.log('Fetched Congratulation Messages:\n', messages);
      CongratulationMessages = messages;
    })
    .catch(error => {
      console.error('Error fetching congratulation messages:', error);
    });
}

getCongratulationMessages('Shira');