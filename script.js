// every consonant happens 3 times (21 x 3 = 63 consonants)
// every vowel happens 6 times with 3 extras (33 vowels)

const letters = [ "E", "B", "O", "C", "A", "D", "F", "G", "H", "J", "U", "K", "L", "E", "I", "N", "U", "O", "P", "Q", "A", "R", "S", "T","V", "W", "X", "Y", "E", "I", "Z", "B", "U", "C", "D", "O", "F", "I", "G", "H", "A", "J", "K", "L", "E", "N", "P", "U", "Q", "R", "E", "S", "O", "T","V", "A", "W", "X", "Y", "A", "Z", "I", "B", "U", "I", "C", "D", "A", "F", "O", "G", "H", "J", "E", "K", "L", "N", "P", "U", "O", "E", "Q", "R", "S", "T","V", "I", "W", "X", "E", "Y", "Z", "A"];

// const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const innerFrame = document.querySelector('#inner-frame');

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

const removeOldLetters = () => {
  while(innerFrame.hasChildNodes()) {
    innerFrame.removeChild(innerFrame.firstChild);
  }
}

const shakeBtn = document.getElementById('shakeBtn');

shakeBtn.addEventListener('click', () => {
  removeOldLetters();
  shakeDice(letters);
});

shakeDice(letters);

// Select die to make a word
innerFrame.addEventListener('click', (e) => {
  let die = document.getElementById(e.target.id);
  die.classList.add('selected');
})



// API to check word submitted
const addWord = document.getElementById('addWordBtn');

addWord.addEventListener('click', () => {
  return collectData();
});

function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

function collectData() {
  fetch('https://montanaflynn-spellcheck.p.rapidapi.com/check/?text=frgo', {
    method: 'GET',
    headers:{
      "X-RapidAPI-Key": ""
    }
  })
    .then(response => checkStatus(response))
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(`Oops! ${error}`))
}
