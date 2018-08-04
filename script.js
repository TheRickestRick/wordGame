Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}


let gameBoard = document.getElementById('gameBoard');
let player1 = document.getElementById('player1_Name');
let player2 = document.getElementById('player2_Name');

document.getElementById("startGame").onclick = function(){
    let player1_Name = document.createElement("p");
    let player2_Name = document.createElement("p");
    let player1_HUD = document.createElement("div");
    let player2_HUD = document.createElement("div");
    player1_Name.innerHTML = player1.value;
    player2_Name.innerHTML = player2.value;
    console.log(player1_Name.innerHTML);
    console.log(player2_Name.innerHTML);
    document.getElementById("createGame").remove();
    

}
