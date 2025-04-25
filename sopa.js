/*Importamos libreria para leer por consola y creamos la interfaz */
const readLine=require('readline');

const rl=readLine.createInterface({
    input: process.stdin,
    output: process.stdout
});
/**/

let points=0;
const rowSize=20;
const colSize=20
let wordList=[
    "Abanico",
    "Barco",
    "Sueño",
    "Hurraca",
    "Dificil",
    "Jinete",
    "Sal",
    "Plomo",
    "Cafe",
    "Junta"
];

let soup=createBoard();

let agenda=insertWords();

fillBoard();

printBoard();

let tries=11;

play();

/**
 * Funcion de juego. Permite al usuario escribir la palabra y comprueba si esta en cuyo caso cambia el color de la palabra acertada y suma puntos. En caso contrario resta puntos.
 */
async function play(){
do {
    let info;
    let userWord=await readWord();
    let i=0;
    let find=false;
    while (i<wordList.length && !find){
        if(userWord.toUpperCase()==wordList[i++].toUpperCase()){
            find=true;
        }
    }

    if (find){
        points++;
        info=agenda.get(wordList[--i]);
        for (let j=0;j<wordList[i].length;j++){
            if(info[2]==true){ //horizontal
                soup[info[0]][info[1]+j]="\x1b[32m"+soup[info[0]][info[1]+j]+"\x1b[0m";
            }else {
                soup[info[0]+j][info[1]]="\x1b[32m"+soup[info[0]+j][info[1]]+"\x1b[0m";
            }
        }
        printBoard();
    }else {
        if(points>0){
            points--;
        }
    }
    console.log("Tienes "+points+" puntos");

    tries--;


}while(tries>0);

rl.close();
}

/**
 * Lee la palabra por consola, como la lectura es asincrona se realiza a traves de una promesa
 * @returns 
 */
function readWord(){
    return new Promise((resolve)=>{
        rl.question('Escribe una palabra: ',(input)=>{
            resolve(input);
        });
    });
}

/**
 * Crea la matriz del tablero en funcion del tamaño establecido rellena de 0. Devuelve la matriz creada.
 * @param {*} wordList 
 * @returns 
 */
function createBoard(){
    let board=[];
    for (let i=0;i<rowSize;i++){
        let row=[];
        for (let j=0;j<colSize;j++){
            row.push(0);
        }
        board.push(row);
    }
    return board;
}

/**
 * Inserta las palabras de la lista en el tablero y devuelve un diccionario con las palabras y un array que contiene su posicion inicial de fila y columna y la direccion de la palabra
 * @returns 
 */
function insertWords(){
    let agenda=new Map();
    for (let word of wordList){
        let indexes=findIndex(word);
        let wordChar=[...word.toUpperCase()];
        let row=indexes[0];
        let col=indexes[1];
        if (indexes[2]==true){ /*Horizontal*/
            for (let i=0;i<wordChar.length;i++){
                soup[row][col++]=wordChar[i];
            }
        }else {
            for (let i=0;i<wordChar.length;i++){
                soup[row++][col]=wordChar[i];
            }

        }
        agenda.set(word,indexes);
    }
    //se podria llamar aqui el rellenar con caracteres
    return agenda;
}


/**
 * Genera la posicion donde comienza la palabra de forma aleatorio teniendo en cuenta que no se cruce o superponga con otras palabras ya colocadas. Devuelve un array que contiene la 
 * posicion de la fila y columna de inicio y la direccion de la palabra
 * @param {*} word 
 * @returns 
 */
function findIndex(word){
    let indexes=[];
    let indexFind=false;
    let dir=wordDirection();
    do{
        if (dir==true){ /*Si es uno ES HORIZONTAL*/
            indexRow=Math.floor(Math.random()*rowSize);
            indexCol=Math.floor(Math.random()*(colSize-word.length));
        }else {
            indexRow=Math.floor(Math.random()*(rowSize-word.length));
            indexCol=Math.floor(Math.random()*colSize);
        }
        let i=0;
        let isValid=true;
        if(dir==true){ //comprobamos posicion segun la direccion
            while(i<word.length && isValid){
                if (soup[indexRow][indexCol+i]!=0){
                    isValid=false;
                }
                i++;
            }
        }else{
            while(i<word.length && isValid){
                if (soup[indexRow+i][indexCol]!=0){
                    isValid=false;
                }
                i++;
            }
        }

        if (isValid){
            indexFind=true;
            indexes.push(indexRow);
            indexes.push(indexCol);
        }

    }while(!indexFind);
    indexes.push(dir);
    return indexes;
}

/**
 * Genera aleatoriamente la direccion de la palabra
 * @returns 
 */
function wordDirection(){
    return Math.floor(Math.random()*2);
}

/**
 * Rellena el resto de posiciones del tablero con caracteres de la A-Z
 */
function fillBoard(){
    for(let i=0;i<rowSize;i++){
        for(let j=0;j<colSize;j++){
            if (soup[i][j]==0){
                soup[i][j]=String.fromCharCode(65+Math.random()*26);
            }
        }
    }
}

/**
 * Muestra el tablero por pantalla
 */
function printBoard(){
    for (let row of soup){
        console.log(row.join(' '));
    }
}

