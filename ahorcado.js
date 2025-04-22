let points=0;
let wordList=[
    "Abanico",
    "Barco",
    "Sueño",
    "Hurraca",
    "Dificil",
    "Jinete"
];

let option=1;

let playWord=randomWord(wordList);
console.log(playWord);
let maxTries=Math.floor(playWord.length+playWord.length/2);
console.log(tries);

let tries=0;
let guess=board(playWord); /*Crea la palabra en blanco*/ 
do {
    console.log("Intentos restantes: "+(maxTries-tries));
    showBoard(guess);
    tries++;

}while(tries<maxTries);




function randomWord(wordList){
    let randomIndex=Math.floor(Math.random()*wordList.length);
    return wordList[randomIndex];
}

function convertToArray(word){
    let array=[];
    for(let i=0;i<word.length;i++){
        array[i]=word.charAt(i);
    }
    return array;
}

function board(word){
    let board=[];
    for (let i=0;i<word.length;i++){
        board[i]="_";
    }
    return board;
}

function showBoard(guess){
    console.log(guess.toString());
}

