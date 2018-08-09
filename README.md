# wordGame

This is a word game that I created as part of a code challenge while on the job hunt. It's a simple word game that only uses Javascript, HTML/CSS, and some Firebase. There was a set of rules I was given which need to fulfill in order to meet the requirements of the challenge.

## The rules.
1.Players should be able to start a new game and be given an invitation link to share with other players. The links can be simply copy-and-pasted to other players outside the application.

2.The game creator should be able to press a play button whenever they are ready, and all players should be able to compete in real-time. It's fine to assume players will not reload the page once they go to it.

3.Once a word is entered, it cannot be entered again by anyone including other players (i.e. only the first person to enter it gets credit).

4.The game ends after one minute.

5.Each game has nine randomly generated letters, with a minimum of two vowels and two consonants each time.
Scoring of your choice.

6.You can choose your own additional rules.

7.A dictionary reference is not necessary for this exercise.

8.Security of any kind is not necessary, but we may ask you afterwards about security holes and how you would handle them in the real world.

## Walkthrough

A player starts a new game, and a selection of nin random letters is displayed on the board.
![alt text](https://github.com/TheRickestRick/wordGame/blob/master/screenShots/Screen%20Shot%202018-08-09%20at%203.57.46%20PM.png)

## How I took on this challenge.

I felt it was going to be a challenge creating a multiplayer game using just vanilla Javascript and no server side code. I have not actually made any multiplayer games before, so this was a completely new challenge for me. I did have experience with Firebase, and I knew I could use firebase to update and read data that people could input from the browser.

I started by creating a game that ran just locally in my own browser. Once I managed to get the general design and layout of my vision, I started diving into the actual functionality. I set up functions to validate the words, and update the score using local variables. I made sure that I got random letters everytime a new game was started that met the requirements for the amount of vowels, consonants, and miscellaneous letters. I created the functions that checked to make sure that letters were not used more than the amount of times they showed up, and that words that had already been entered could not be used again.

After I got a local version of my game to work. I started setting up my Firebase database, and creating the functions that would push the local data up to the database. I found out that Firebase has a cool function that will read data when data is changed. This way I was able to create a function that would check the database every time there was a change, and update the local version of the data. This way both players would see real time what was happening, and if they refresh the browser they will not affect the game. I think having persistent data is really important in any kind of application, so I was very happy once I got this to work. 

## Problems I encountered

I had problems getting the word list to properly update when a new word would be appended. I was also getting duplicate words, and words being added more than once time. I solved this by clearing all of the HTML children whenever I wanted to run through the word array and add the new word, because I am pushing an updated word array to Firebase, the entire array was being added every time a new word was pushed to it. When I started testing the game on multiple computers, I also realized that the word arrays were being stored in the browser, and not being pulled from Firebase. So players could only see their own word lists, and not the other players.

I also had a problem with the game time function being run every second. Because the game time changes data on the server, the function would be called every second. I solved this by creating a function that would only run one time when a new game is created. This made the time the same between multiple computers, and upon browser refresh.

The code I wrote can be refactored, and made into a more streamlined program. As with anything, it can always be improved. There is redundancy in my functions, and I could have solidified some of my code into a more abstract render function for all of the game data. Since this was my first experience building a multiplayer game, without authentication and a server, I'm pretty happy that I managed to meet my personal goal of getting persistent game data, and met all of the rules for the challenge.
