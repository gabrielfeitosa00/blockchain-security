let prompt = require('prompt-sync')({sigint: true});
const {generateKeyPair} = require("./utils/publicKeyUtil")
const {publicKey,privateKey} = generateKeyPair()
const { Blockchain } = require('./classes/chain');
const { Transaction } = require('./classes/transactions');
console.log("Bem vindo ao sistema de blockchain!\n")
console.log("Essa é a chave publica: " + publicKey+"\n")
console.log("Essa é a chave privada: " + privateKey +"\n")
let guard = true
let chain
while(guard){
    let temp
    console.log("1-Gerar nova Blockchain!\n")
    console.log("2-Minerar novo bloco!\n")
    console.log("3-Checar Validade da blockchain!\n")
    console.log("4-Mudar Dificuldade!\n")
    console.log("5-Adicionar Transação!\n")
    console.log("6-Mostrar Blocos!\n")
    console.log("7-Mostrar Saldo Atual!\n")
    console.log("8-Corromper Bloco aleatório!\n")

    let input = prompt("Selecione uma das opções: ")
    switch(input){
        case "1":
       
            chain = new Blockchain()
            console.log("Blockchain criada!\n")
            console.log("Bloco gênese:\n")
            chain.getCurrentBlocks()
            temp =prompt("Precione qualquer tecla para continuar")
            break;
        case "2":
            if(!(chain instanceof Blockchain)){
                console.log("A blockchain não foi inicializada!")
                temp =prompt("Precione qualquer tecla para continuar")
                break;
            }
            chain.minePendingTransactions(publicKey)
        case "3":
            if(!(chain instanceof Blockchain)){
                console.log("A blockchain não foi inicializada!")
                temp =prompt("Precione qualquer tecla para continuar")
                break;
            }
            
            if(chain.isChainValid()){
                console.log("A block chain é valida!")
            } else {
                console.log("A block chain não é  valida!")
            }
            temp =prompt("Precione qualquer tecla para continuar")
            break;
       
        case "4":
            if(!(chain instanceof Blockchain)){
                console.log("A blockchain não foi inicializada!")
                let temp =prompt("Precione qualquer tecla para continuar")
                break;
            }
            
            let dificuldade = prompt("Digite a dificuldade: ")
    
            if(!Number.isInteger(+dificuldade)){
                console.log("A dificuldade deve ser um número inteiro!")
                let temp =prompt("Precione qualquer tecla para continuar")
                break;
            }

            chain.setDificulty(+dificuldade)
            console.log(`Dificuldade da corrente alterada para: ${dificuldade}\n`)
             temp =prompt("Precione qualquer tecla para continuar")
             break;
        
        case "5":
            if(!(chain instanceof Blockchain)){
                console.log("A blockchain não foi inicializada!")
                temp =prompt("Precione qualquer tecla para continuar")
                break;
            }
            let valor = prompt("Digite o valor da transação: ")
            if(typeof +valor !== "number"){
                console.log("O valor da transação deve ser um número!\n")
                temp =prompt("Precione qualquer tecla para continuar")
                break;
            }
            let destino = prompt("Digite o endereço destino da transação: ")

            let trx = new Transaction(publicKey,destino,valor)
            trx.signTransaction(publicKey,privateKey)
            chain.addTransaction(trx)

            console.log("Transação assinada adicionada a blockchain!\n")
            temp =prompt("Precione qualquer tecla para continuar")
        break;
        case "6":
            if(!(chain instanceof Blockchain)){
                console.log("A blockchain não foi inicializada!")
                temp =prompt("Precione qualquer tecla para continuar")
                break;
            }
            chain.getCurrentBlocks()
            temp =prompt("Precione qualquer tecla para continuar")
            break;
        case "7":
            if(!(chain instanceof Blockchain)){
                console.log("A blockchain não foi inicializada!")
                temp =prompt("Precione qualquer tecla para continuar")
                break;
            }
            chain.getBalanceOfAddress(publicKey)
            temp =prompt("Precione qualquer tecla para continuar")
            break;
        
        case "8":
            if(!(chain instanceof Blockchain)){
                console.log("A blockchain não foi inicializada!")
                temp =prompt("Precione qualquer tecla para continuar")
                break;
            }
            chain.corruptChain()
            temp =prompt("Precione qualquer tecla para continuar")
            break;
            
        case "-1":
            guard = false
            break;
        default:
            break;
    }


}
