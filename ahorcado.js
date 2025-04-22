/*Importamos libreria para leer por consola y creamos la interfaz */
const readLine=require('readline');

const rl=readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
/**/

let points=0;
const wordList = [
    "luz", "camino", "montaña", "agua", "sol", "libro", "ventana", "nube", "río", "cielo",
    "lluvia", "sueño", "madera", "piedra", "sonrisa", "arena", "puerta", "luna", "silencio", "voz",
    "mar", "hoja", "flor", "noche", "tiempo", "fuego", "piel", "viento", "alma", "verso",
    "rostro", "luz", "café", "pájaro", "canción", "carta", "camisa", "espacio", "boca", "duda",
    "árbol", "barco", "estrella", "historia", "mirada", "cuerda", "espina", "fuerza", "vino", "fruta",
    "sombras", "techo", "trigo", "sendero", "destino", "roca", "frío", "calor", "mirar", "crecer",
    "nido", "cobre", "pintura", "suelo", "cosecha", "solapa", "fluir", "acento", "sombra", "llama",
    "melodía", "tristeza", "paso", "latido", "manantial", "reflejo", "jardín", "tecla", "eco", "piedra",
    "resplandor", "cascada", "barro", "vela", "sabiduría", "raíz", "grito", "abrazo", "brisa", "cumbre",
    "palabra", "reloj", "misterio", "encuentro", "claridad", "invierno", "suspiro", "templo", "encanto", "manto"
  ];


let win=false;

let playWord=randomWord(wordList).toUpperCase();
let maxTries=Math.floor(playWord.length+playWord.length/2);

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

function deleteAccent(word){
    return word.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
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
        find=compareNoAccent(letter,playWord.charAt(i));
        i++;
    }

    if (find){
        for(let i=0;i<playWord.length;i++){
            if (compareNoAccent(letter,playWord.charAt(i))){
                guess[i]=playWord.charAt(i);
            }
        }
    }

    return find;
}

function compareNoAccent(letter1,letter2){
    return (letter1.normalize("NFD").replace(/[\u0300-\u036f]/g, "")===letter2.normalize("NFD").replace(/[\u0300-\u036f]/g, ""))?true:false;
}