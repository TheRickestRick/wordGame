// Initialize Firebase
var config = {
  apiKey: "AIzaSyDYfz147ptuA52ZGI5eo7M4fZu1sxDORBk",
  authDomain: "wordgame-15bbf.firebaseapp.com",
  databaseURL: "https://wordgame-15bbf.firebaseio.com",
  projectId: "wordgame-15bbf",
  storageBucket: "",
  messagingSenderId: "86330825043"
};
firebase.initializeApp(config);

const consonant = document.getElementsByClassName('consonant');
const vowel = document.getElementsByClassName('vowel');
const letter = document.getElementsByClassName('letter');

var vowels = [
    'A',
    'E',
    'I',
    'O',
    'U'
];

var letters = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Y',
  'Z'
];

var consonants = [
   'B',
   'C',
   'D',
   'F',
   'G',
   'H',
   'J',
   'K',
   'L',
   'M',
   'N',
   'P',
   'Q',
   'R',
   'S',
   'T',
   'V',
   'X',
   'Z'
];



function newLetter(){
  for(let x = 0; x < letter.length; x++){
    let i = (Math.random() * letters.length) | 0;
    letter[x].innerText = letters[i];
  }
}

function newVowel () {
  for(let x = 0; x < vowel.length; x++){
    let i = (Math.random() * vowels.length) | 0;
    vowel[x].innerText = vowels[i];
  }
}

function newConsonant(){
  for(let x = 0; x < consonant.length; x++){
    let i = (Math.random() * consonants.length) | 0;
    consonant[x].innerText = consonants[i];
  }
}


function getLetters (){
  newLetter();
  newVowel();
  newConsonant();
}

getLetters();


const gameLetters = document.querySelectorAll("td");
const gameLettersArray = [];
const player_one_Word = document.getElementById('player1_word_input');
const p1_wordList = document.getElementById('p1_wordList');
const p1_wordArray = [];
const p1_Score = document.getElementById('p1_Score');
const player_two_Word = document.getElementById('player2_word_input');
const p2_wordList = document.getElementById('p2_wordList');
const p2_wordArray = [];
const p2_Score = document.getElementById('p2_Score');

for(let count = 0; count < gameLetters.length; count++){
  gameLettersArray.push(gameLetters[count].innerText);
}

player_one_Word.onkeydown = function(event) {
    if (event.keyCode == 13) {
      let wordValidated = validateWord(player_one_Word.value);
      let wordNotUsedAlready = whoSaidItFirst(player_one_Word.value)
      // console.log(wordValidated);
      if(wordValidated && wordNotUsedAlready){
        let newWord = document.createElement('li')
        newWord.innerText = player_one_Word.value
        p1_wordList.appendChild(newWord)
        p1_wordArray.push(player_one_Word.value);
        player_one_Word.value = '';
        raiseScore(p1_Score);
      }else{
        console.log('Invalid Word');
        player_one_Word.value = '';
      }
    }
}

player_two_Word.onkeydown = function(event) {
    if (event.keyCode == 13) {
      let wordValidated = validateWord(player_two_Word.value);
      let wordNotUsedAlready = whoSaidItFirst(player_two_Word.value)
      // console.log(wordValidated);
      if(wordValidated && wordNotUsedAlready){
        let newWord = document.createElement('li')
        newWord.innerText = player_two_Word.value
        p2_wordList.appendChild(newWord)
        p2_wordArray.push(player_two_Word.value);
        player_two_Word.value = '';
        raiseScore(p2_Score);
      }else{
        console.log('Invalid Word');
        player_two_Word.value = '';
      }
    }
}

function validateWord(word){
  let wordArr = word.split('')
  let wordObj = {};

  for(let y = 0; y < gameLettersArray.length; y++){
    if(wordObj.hasOwnProperty(gameLettersArray[y])){
      wordObj[gameLettersArray[y]]++
    }else{
      wordObj[gameLettersArray[y]] = 1;
    }
  }

  // console.log(wordArr);
  for(let x = 0; x < wordArr.length; x++){
    if(wordObj.hasOwnProperty(wordArr[x])){
      if(wordObj[wordArr[x]] <= 0){
        return false;
      }else{
        wordObj[wordArr[x]]--
      }
    }else{
      return false;
    }
    // console.log(wordObj);
  }
  return true;
}

function whoSaidItFirst(word){
  console.log(word)
  console.log(p2_wordArray);
  console.log(p1_wordArray);
  if (p2_wordArray.indexOf(word) > -1 || p1_wordArray.indexOf(word) > -1) {
    return false;
    //In the array!
  } else {
    return true;
      //Not in the array
  }
}

function raiseScore(playerScore){
  let score = parseInt(playerScore.innerHTML)
  score++
  playerScore.innerHTML = score;
}
