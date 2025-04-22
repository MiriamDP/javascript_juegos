/*Importamos libreria para leer por consola y creamos la interfaz */
const readLine=require('readline');

const rl=readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
/**/

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
let win=false;

let playWord=randomWord(wordList).toUpperCase();
console.log(playWord);
let maxTries=Math.floor(playWord.length+playWord.length/2);
console.log(maxTries);

let tries=0;
let guess=board(playWord); /*Crea la palabra en blanco*/ 

play();

/*
Como vamos a leer los datos de manera asincrona necesitamos crear la funcion de juego como asincrona para poder usar el await y Promesas. Los parametros se leeran con una Promesa
*/

/**
 * Funcion de juego principal
 */
async function play(){
do {
    console.log("Intentos restantes: "+(maxTries-tries));

    /*Para evitar duplicidad del tablero ya que al estar al principio, la ultima letra tanto en caso de ganar como de perder no se mostraria en el tablero. 
    De este modo solo lo muestra al princpio la primera vez para ademas darle la pista al jugador de cuantas letras tiene*/
    if(tries==0){
        showBoard(guess);
    }

    let letter=await readLetter();

    if(isLetter(letter.toUpperCase())){
        points++;
    }else{
        if (points>0){
            points--;
        }
    }

    showBoard(guess);
    console.log("Tienes "+points+" puntos");

    if (guess.join("")==playWord){
        win=true;
        console.log("Enhorabuena has ganado")
    }else if(tries==maxTries-1){
        console.log("Lo siento, has perdido no te quedan intentos")
    }

    tries++;

    console.log();


}while(tries<maxTries && !win);

rl.close();
}


/**
 * Elige una palabra aleatoria del array de palabras precargadas
 * @param {} wordList 
 * @returns 
 */
function randomWord(wordList){
    let randomIndex=Math.floor(Math.random()*wordList.length);
    return wordList[randomIndex];
}


/**
 * Devuelve un array con los caracteres de la palabra ocultos por el caracter _
 * @param {} word 
 * @returns 
 */
function board(word){
    let board=[];
    for (let i=0;i<word.length;i++){
        board[i]="_";
    }
    return board;
}

/**
 * Muestra el tablero de juego
 * @param {*} guess 
 */
function showBoard(guess){
    console.log(guess.join(" "));
}

/**
 * Lee la letra por consola, como la lectura es asincrona se realiza a traves de una promesa
 * @returns 
 */
function readLetter(){
    return new Promise((resolve)=>{
        rl.question('Elige una letra: ',(input)=>{
            resolve(input);
        });
    });
}

/**
 * Devuelve true si la letra introducida como parametro esta en el array, en ese caso ademas la incluye en el tablero de juego. En caso contrario devuelve false
 * @param {*} letter 
 * @returns 
 */
function isLetter(letter){
    let find=false;
    let i=0;
    while(i<playWord.length && !find){
        find=(playWord.charAt(i)==letter)?true:false;
        i++;
    }

    if (find){
        for(let i=0;i<playWord.length;i++){
            if (playWord.charAt(i)==letter){
                guess[i]=letter;
            }
        }
    }

    return find;
}