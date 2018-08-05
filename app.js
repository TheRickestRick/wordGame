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
const player_one_Word = document.getElementById('word_input');
const p1_wordList = document.getElementById('p1_wordList')

for(let count = 0; count < gameLetters.length; count++){
  gameLettersArray.push(gameLetters[count].innerText);
}

player_one_Word.onkeydown = function(event) {
    if (event.keyCode == 13) {
      validateWord(player_one_Word.value)
      let newWord = document.createElement('li')
      newWord.innerText = player_one_Word.value
      p1_wordList.appendChild(newWord)

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
      console.log(gameLettersArray[y]);
    }
  }

  for(let x = 0; x < wordArr.length; x++){
    // console.log(wordArr[x]);
  }

  console.log(wordObj);

}

// console.log(gameLettersArray);
