let prompt = require('prompt-sync')();
const {generateKeyPair} = require("./utils/publicKeyUtil")
while(true){
    console.log("Bem vindo ao sistema de blockchain!\n")
    let n = prompt("Precione qualquer tecla para continuar: ")
    console.log("Hello!")
    n = prompt("Deseja continuar? ")
    if(n == "-1"){
        break
    }
}
