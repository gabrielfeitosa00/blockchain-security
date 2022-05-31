let prompt = require('prompt-sync')();
const {generateKeyPair} = require("./utils/publicKeyUtil")
const {publicKey,privateKey} = generateKeyPair()
while(true){
    console.log("Bem vindo ao sistema de blockchain!\n")
    let n = prompt("Precione qualquer tecla para continuar: ")
    console.log("Hello!")
    console.log("Essa é a chave publica: " + publicKey+"\n")
    console.log("Essa é a chave privada: " + privateKey +"\n")
    n = prompt("Deseja continuar? ")
    if(n == "-1"){
        break
    }
}
