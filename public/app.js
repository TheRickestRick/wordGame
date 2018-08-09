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

var database = firebase.database();

let gameLetters = document.querySelectorAll("td");
let player_one_Word = document.getElementById('player1_word_input');
let p1_wordList = document.getElementById('p1_wordList');

let p1_Score = document.getElementById('p1_Score');
let player_two_Word = document.getElementById('player2_word_input');
let p2_wordList = document.getElementById('p2_wordList');

let p2_Score = document.getElementById('p2_Score');
let consonant = document.getElementsByClassName('consonant');
let vowel = document.getElementsByClassName('vowel');
let letter = document.getElementsByClassName('letter');
let timer = document.getElementById('mycounter');

let gameLettersArray = [];
let p1_wordArray = [];
let p2_wordArray = [];
let gameTime;


database.ref('games').on('value', function(snapshot) {
  // console.log(snapshot.val().inProgress)

    if(snapshot.val().inProgress === true){

      p1_wordArray = snapshot.val().playerOne.words
      p2_wordArray = snapshot.val().playerTwo.words


      gameLettersArray = [];
      for(let x = 0; x < gameLetters.length; x++){
        gameLetters[x].innerHTML = snapshot.val().gameLetters[x];
        if(gameLettersArray.length !== 9){
          gameLettersArray.push(snapshot.val().gameLetters[x])
        }
      }

      p1_Score.innerHTML = snapshot.val().playerOne.score;
      p2_Score.innerHTML = snapshot.val().playerTwo.score;
      gameTime = snapshot.val().gameTime
      timer.innerHTML = gameTime;

      renderWords()

      theTime()

    }
    else{
      console.log("game over")
      if(p1_Score.innerHTML > p2_Score.innerHTML){
        alert('Player One Wins!')
      }else if(p2_Score.innerHTML > p1_Score.innerHTML){
        alert('Player Two Wins!')
      }
    }
});

var theTime = (function() {
    let executed = false;
    return function() {
        if (!executed) {
            executed = true;
            onTimer();

        }
    };
})();

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

function renderWords(){
  clearWordChildren(p1_wordList);
  clearWordChildren(p2_wordList);
  for(let x =1; x < p1_wordArray.length; x++){
    let p1_Word = document.createElement('li')
    p1_Word.innerText = p1_wordArray[x]
    p1_wordList.appendChild(p1_Word)
  }
  for(let y = 1; y < p2_wordArray.length; y++){
    let p2_Word = document.createElement('li')
    p2_Word.innerText = p2_wordArray[y]
    p2_wordList.appendChild(p2_Word)
  }
}

function onTimer() {
  database.ref('games').update({gameTime: gameTime--});

  if (gameTime < 0) {
    database.ref('games').update({inProgress: false})

  }
  else {
    setTimeout(onTimer, 1000);
  }
}

function createGame(letters, playerOneName, playerTwoName) {
  database.ref('games').set({
    gameLetters: letters,
    gameTime: 60,
    inProgress: true,
    playerOne: {name:playerOneName, score:0, words:['word']},
    playerTwo: {name:playerTwoName, score:0, words:['word']}
  });
}

function startNewGame(){
  if(gameLettersArray.length >= 9){
    gameLettersArray = [];
    getLetters();
    for(let count = 0; count < gameLetters.length; count++){
      gameLettersArray.push(gameLetters[count].innerText);
    }
    createGame(gameLettersArray, "Player One", "Player Two")
    clearWordChildren(p1_wordList)
    clearWordChildren(p2_wordList)

  }else{
    console.log(gameLettersArray)
    getLetters();
    for(let count = 0; count < gameLetters.length; count++){
      gameLettersArray.push(gameLetters[count].innerText);
    }
    createGame(gameLettersArray, "Player One", "Player Two")
    clearWordChildren(p1_wordList)
    clearWordChildren(p2_wordList)

  }
}

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

player_one_Word.onkeydown = function(event) {
    if (event.keyCode == 13) {
      let word = player_one_Word.value.toUpperCase()
      let wordValidated = validateWord(word);
      let wordNotUsedAlready = whoSaidItFirst(word)
      // console.log(wordValidated);
      if(wordValidated && wordNotUsedAlready){

        p1_wordArray.push(word);
        // console.log(p1_wordArray)
        database.ref('games').child("playerOne").child('words').set(p1_wordArray)
        player_one_Word.value = '';



        raiseScore(p1_Score, "playerOne");
      }else{
        console.log('Invalid Word');
        player_one_Word.value = '';
      }
    }
}

player_two_Word.onkeydown = function(event) {
    if (event.keyCode == 13) {
      let word = player_two_Word.value.toUpperCase()
      let wordValidated = validateWord(word);
      let wordNotUsedAlready = whoSaidItFirst(word)
      // console.log(wordValidated);
      if(wordValidated && wordNotUsedAlready){

        p2_wordArray.push(word);
        database.ref('games').child("playerTwo").child('words').set(p2_wordArray)
        player_two_Word.value = '';



        raiseScore(p2_Score, "playerTwo");
      }else{
        console.log('Invalid Word');
        player_two_Word.value = '';
      }
    }
}

function clearWordChildren(player){
  while (player.firstChild) {
    player.removeChild(player.firstChild);
  }
}

function validateWord(word){
  let wordArr = word.toUpperCase().split('')
  let wordObj = {};

  for(let y = 0; y < gameLettersArray.length; y++){
    if(wordObj.hasOwnProperty(gameLettersArray[y])){
      wordObj[gameLettersArray[y]]++
    }else{
      wordObj[gameLettersArray[y]] = 1;
    }
  }

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
  }
  return true;
}

function whoSaidItFirst(word){
  if (p2_wordArray.indexOf(word) > -1 || p1_wordArray.indexOf(word) > -1) {
    return false;
    //In the array!
  } else {
    return true;
      //Not in the array
  }
}

function raiseScore(playerScore, player){
  let score = parseInt(playerScore.innerHTML)
  score++
  playerScore.innerHTML = score;
  database.ref('games').child(player).update({score: score})
}
