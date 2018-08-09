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

//I created variables for all of the HTML elements I want to manipulate.

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
let p1_error = document.getElementById('p1_error');
let p2_error = document.getElementById('p2_error');

//These local variables are used to store data that will be updated to firebase
let gameLettersArray = [];
let p1_wordArray = [];
let p2_wordArray = [];
let gameTime;

/*
This database function pulls data when it changes from firebase so each session
has the most recent data. I wanted the game data to persist through browser refresh.
It was a challenge, but was fun after I got it to work.
*/
database.ref('games').on('value', function(snapshot) {

    if(snapshot.val().inProgress === true){
      p1_wordArray = snapshot.val().playerOne.words
      p2_wordArray = snapshot.val().playerTwo.words
      //The Game letters are pulled from the database and used to validate players words
      gameLettersArray = [];

      for(let x = 0; x < gameLetters.length; x++){
        gameLetters[x].innerHTML = snapshot.val().gameLetters[x];
        if(gameLettersArray.length !== 9){
          gameLettersArray.push(snapshot.val().gameLetters[x])
        }
      }
      //We keep track of the players score and set the value to the HTML elements
      p1_Score.innerHTML = snapshot.val().playerOne.score;
      p2_Score.innerHTML = snapshot.val().playerTwo.score;
      gameTime = snapshot.val().gameTime
      timer.innerHTML = gameTime;
      //This renders the players most up to date word list for the other player to see.
      renderWords()
      //This time keeper function runs once a game is started and keeps track of the time between computers, and upon refresh.
      theTime()

    }
    else{
      //The game scores are evaluated and each player is alerted to the winner.
      if(p1_Score.innerHTML > p2_Score.innerHTML){
        alert('Player One Wins!')
      }else if(p2_Score.innerHTML > p1_Score.innerHTML){
        alert('Player Two Wins!')
      }else if(p2_Score.innerHTML != 0 && p1_Score.innerHTML != 0 && p1_Score.innerHTML === p2_Score.innerHTML){
        alert('The Game is a Tie!')
      }
    }
});

//My time function that will only run once upon start.
//I had a problem with the timer wanting to run more than once if the browser was refreshed or data was changed.
//This caused the game time to run down VERY fast. It also wasn't consistent between players.
var theTime = (function() {
    let executed = false;
    return function() {
        if (!executed) {
            executed = true;
            onTimer();
        }
    };
})();

//These variables store the valid letters to be used as game letters.
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

//This function clears the HTML children, and re-writes them whenever a new valid word is added to the players list.
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

//The time function that updates firebase every second.
function onTimer() {
  database.ref('games').update({gameTime: gameTime--});

  if (gameTime < 0) {
    database.ref('games').update({inProgress: false})

  }
  else {
    setTimeout(onTimer, 1000);
  }
}

//This function creates a new game object in firebase.
function createGame(letters, playerOneName, playerTwoName) {
  database.ref('games').set({
    gameLetters: letters,
    gameTime: 60,
    inProgress: true,
    playerOne: {name:playerOneName, score:0, words:['word']},
    playerTwo: {name:playerTwoName, score:0, words:['word']}
  });
}

//locally starts a new game and gets new game letters. These letters are pushed to firebase via the game object.
//Players word lists are reset, as well as scores.
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
    p1_error.innerHTML = "";
    p1_error.className = "";
    p2_error.innerHTML = "";
    p2_error.className = "";

  }else{
    getLetters();
    for(let count = 0; count < gameLetters.length; count++){
      gameLettersArray.push(gameLetters[count].innerText);
    }
    createGame(gameLettersArray, "Player One", "Player Two")
    clearWordChildren(p1_wordList)
    clearWordChildren(p2_wordList)
    p1_error.innerHTML = "";
    p1_error.className = "";
    p2_error.innerHTML = "";
    p2_error.className = "";
  }
}

//These functions pick random letters from the letter arrays for use in the game object.
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

//These two functions validate, and submit players words via the input upon hitting the return key on the keyboard.
//They run several validation functions on the input word, and if it passes the word is added to that players word list.
//There are also feedback boxs that will tell the player if the word they tried to enter is valid or invalid based on the game rules.
player_one_Word.onkeydown = function(event) {
    if (event.keyCode == 13) {
      let word = player_one_Word.value.toUpperCase()
      let wordValidated = validateWord(word);
      let wordNotUsedAlready = whoSaidItFirst(word)
      if(wordValidated && wordNotUsedAlready && word.length > 1 && word !== ''){
        p1_wordArray.push(word);
        database.ref('games').child("playerOne").child('words').set(p1_wordArray)
        player_one_Word.value = '';
        p1_error.innerHTML = 'Valid Word!'
        p1_error.className = 'success active';
        raiseScore(p1_Score, "playerOne");
      }else{
        player_one_Word.value = '';
        p1_error.innerHTML = "Invalid Word!";
        p1_error.className = "error active";
        event.preventDefault();
      }
    }
}

player_two_Word.onkeydown = function(event) {
    if (event.keyCode == 13) {
      let word = player_two_Word.value.toUpperCase()
      let wordValidated = validateWord(word);
      let wordNotUsedAlready = whoSaidItFirst(word)
      if(wordValidated && wordNotUsedAlready && word.length > 1 && word !== ''){
        p2_wordArray.push(word);
        database.ref('games').child("playerTwo").child('words').set(p2_wordArray)
        player_two_Word.value = '';
        p2_error.innerHTML = 'Valid Word!'
        p2_error.className = 'success active';
        raiseScore(p2_Score, "playerTwo");
      }else{
        player_two_Word.value = '';
        p2_error.innerHTML = "Invalid Word!";
        p2_error.className = "error active";
        event.preventDefault();
      }
    }
}

//Clears word children on the HTML list so that the new word list can be applied.
//I had the problem that multiple of the same word would be added everytime someone typed a new word.
function clearWordChildren(player){
  while (player.firstChild) {
    player.removeChild(player.firstChild);
  }
}

//This function makes sure that no letters are used more than once in a word, unless the letter shows up more than one time in the game letters list.
//I figured it would be fair to use the letter no more than the amount of times it randomly showed up in the game letters array.
//So I created an object that kept track of the letters, and the amount of times they could be used. If the key value reached zero then you can not use that letter anymore.
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

//This function makes sure that the word has not already been said by a player. It checks through the entered words by both players, and if the word was used it returns false.
function whoSaidItFirst(word){
  if (p2_wordArray.indexOf(word) > -1 || p1_wordArray.indexOf(word) > -1) {
    return false;
    //In the array!
  } else {
    return true;
      //Not in the array
  }
}

//This function will raise the players score in firebase if their entered word passes all of the validation functions.
function raiseScore(playerScore, player){
  let score = parseInt(playerScore.innerHTML)
  score++
  playerScore.innerHTML = score;
  database.ref('games').child(player).update({score: score})
}
