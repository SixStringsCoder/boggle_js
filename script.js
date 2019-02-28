// every consonant happens 3 times (21 x 3 = 63 consonants)
// every vowel happens 6 times with 3 extras (33 vowels)

const letters = [ "E", "B", "O", "C", "A", "D", "F", "G", "H", "J", "U", "K", "L", "E", "I", "N", "U", "O", "P", "Q", "A", "R", "S", "T","V", "W", "X", "Y", "E", "I", "Z", "B", "U", "C", "D", "O", "F", "I", "G", "H", "A", "J", "K", "L", "E", "N", "P", "U", "Q", "R", "E", "S", "O", "T","V", "A", "W", "X", "Y", "A", "Z", "I", "B", "U", "I", "C", "D", "A", "F", "O", "G", "H", "J", "E", "K", "L", "N", "P", "U", "O", "E", "Q", "R", "S", "T","V", "I", "W", "X", "E", "Y", "Z", "A"];

// const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const innerFrame = document.querySelector('#inner-frame');
const gameboard = document.querySelector('#gameboard-container');
const shakeBtn = document.getElementById('shakeBtn');
const wordlistDOM = document.querySelector('#word-list');
const scoreboard = document.querySelector('#points');
const addWord = document.getElementById('addWordBtn');
const word = [];
const wordList = [];
let isShaking = false;
let points = 0;


const shakeDice = (arrOfLetters) => {
  const numbOfDice = 16;
  for(let i = 0; i < numbOfDice; i += 1) {
    let number = Math.floor(Math.random() * arrOfLetters.length);
    let htmlPattern = `
      <div class="die-container">
        <div class="die" id="die-${i+1}">${arrOfLetters[number]}</div>
      </div>
    `;
    innerFrame.innerHTML += htmlPattern;
  }
}

const stopShaking = () => {
  gameboard.classList.remove('shake-container');
  isShaking = false;
}
const shakeGameboard = () => {
  gameboard.classList.add('shake-container');
  setTimeout(stopShaking, 1000);
}

// Load start screen with new letters
shakeDice(letters);

const removeOldLetters = () => {
  while(innerFrame.hasChildNodes()) {
    innerFrame.removeChild(innerFrame.firstChild);
  }
}

const clearWordList = () => {
  // clear wordList array
  wordList.splice(0, wordList.length);
  // word word list from DOM
  while(wordlistDOM.hasChildNodes()) {
    wordlistDOM.removeChild(wordlistDOM.firstChild);
  }
}

shakeBtn.addEventListener('click', () => {
  clearWordList();
  resetPoints();
  removeOldLetters();
  isShaking = true;
  shakeGameboard();
  shakeDice(letters);
  timer();
});

// Select die to make a word
innerFrame.addEventListener('click', (e) => {
  let die = document.getElementById(e.target.id);
  // if die has class selected and it's the last letter
  if (die.classList.contains('selected') &&
      die.innerHTML === word[word.length-1]) {
    die.classList.toggle('selected');
    word.pop();
  } else {
    die.classList.toggle('selected');
    word.push(die.innerHTML);
  }
});

const addToWordList = (arrOfLetters) => {
  let wordtoList = arrOfLetters.join('').toLowerCase();
  collectData(wordtoList);
  let newWord = `<li class="word">${wordtoList.toLowerCase()} <span class="wordpoints"></span></li>`
  document.getElementById('word-list').innerHTML += newWord;
  wordList.push(wordtoList);
  word.splice(0, word.length);
  removeHighlight();
}

//Remove highlighted BG from dice
const removeHighlight = () => {
  const dice = document.querySelectorAll('.die');
  dice.forEach(die => {
    if (die.classList.contains('selected')) {
      die.classList.remove('selected');
    }
  });
}

// API to check if added word is good
addWord.addEventListener('click', () => {
  addToWordList(word);
});

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

const wordIsWrong = () => {
  console.log("Sorry, Not a word.");
  wordlistDOM.lastChild.classList.add('notaWord');
}

const wordIsRight = (wordLength) => {
  console.log("It's a word!");
  return addPoints(wordLength);
}

// If word is in dictionary or not
const checkWord = (dataObj) => {
  const notaWord = Object.keys(dataObj.corrections).length;
  // Length of 1 means word is wrong, 'corrections' are present
  // Length of 0 means word is right, no corrections are given
  let wordLength = dataObj.original.length
  notaWord ? wordIsWrong() : wordIsRight(wordLength);
  console.log(dataObj);
}

function collectData(word) {
  fetch(`https://montanaflynn-spellcheck.p.rapidapi.com/check/?text=${word}`, {
    method: 'GET',
    headers:{
      "X-RapidAPI-Key": "5f472caf1emshe68cb4cd081fd36p15ca42jsn96d83fadda9c"
    }
  })
    .then(response => checkStatus(response))
    .then(response => response.json())
    .then(data => checkWord(data))
    .catch(error => console.log(`Oops! ${error}`))
}



// Timer
const timer = () => {
  let startTime = 180;
  const timeDisplay = document.getElementById('timer');
  const t = setInterval(runTimer, 1000);

  function runTimer() {
    if (startTime === 0 || isShaking) {
      startTime = 180;
      clearInterval(t);
    }
    timeDisplay.innerHTML = startTime;
    startTime === 0 ? clearInterval(t) : startTime -= 1;
  }
}


// Points
const scoring = {
  1: 0,
  2: 0,
  3: 1,
  4: 1,
  5: 2,
  6: 3,
  7: 4,
  8: 11,
}

const addPoints = (wordLength) => {
  const wordpoints = document.querySelectorAll('.wordpoints');
  let lastWord = wordpoints[wordpoints.length-1];
  points += scoring[wordLength];
  scoreboard.innerHTML = points;
  lastWord.innerHTML = `+ ${scoring[wordLength]}`;
  console.log(wordpoints.length-1);
}

const resetPoints = () => {
  points = 0;
  scoreboard.innerHTML = points;
}
