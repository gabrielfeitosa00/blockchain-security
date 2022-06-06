const { Block } = require('./block');
const { Transaction } = require('./transactions');
const {getRandomInt} = require("../utils/getRandomIntOnARange")

class Blockchain {
    /**
     * Método contrututor que recebe como parâmetro:
     * um array de blocos com o primeiro bloco sendo o bloco gênese,
     * a dificuladade de mineração que por padrão é 2
     * o valor de recompensa 
     */
    constructor() {
      this.chain = [this.createGenesisBlock()];
      this.difficulty = 2;
      this.miningReward = 100;
      this.pendingTransactions = [];
     
    }
  
    /**
     * Geração do bloco gênese que é o primeiro bloco da block chain
     * Sua timestamp é uma data árbitraria, um array de transações vazio
     * Por ser o primeiro bloco da blockchain ele não possuí o hash anterior
     * 
     * @returns {Block}
     */
    createGenesisBlock() {
      return new Block(Date.parse('2020-01-01'), []);
    }
  
    /**
     * Returns the latest block on our chain. Useful when you want to create a
     * new Block and you need the hash of the previous Block.
     *
     * @returns {Block}
     */
    getLatestBlock() {
      return this.chain[this.chain.length - 1];
    }
  
    /**
     * Método apra mineração do novo bloco
     * Todas as transações pendentes serão colocadas no novo bloco
     * e o valor de recompensa é enviado ao endereço do minerador
     *
     * @param {string} miningRewardAddress
     */
    minePendingTransactions(miningRewardAddress) {
      const rewardTx = new Transaction(null, miningRewardAddress, this.miningReward, true);
      this.pendingTransactions.push(rewardTx);
  
      const block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
      console.time("Bloco minerado em: ");
      block.mineBlock(this.difficulty);
  
      console.log('Bloco minerado com sucesso!');
      console.timeEnd("Bloco minerado em: ");
      this.chain.push(block);
  
      this.pendingTransactions = [];
    }
  
    /**
     * Método para adiconar uma nova transação ao array de 
     * transações pendentes que irão ser mineradas
     *
     * @param {Transaction} transaction
     */
    addTransaction(transaction) {
      if (!transaction.fromAddress || !transaction.toAddress) {
        throw new Error('A transação precisa ter  endereço de origem e destino');
      }
  
      // Verifica se a transação está assinada
      if (!transaction.isValid()) {
        throw new Error('Não é possível adicionar transações inválidas a corrente');
      }
      
      if (transaction.amount <= 0) {
        throw new Error('O valor da transação precisa ser maior que 0');
      }
      
      // Verifica os fundos da transação 
      const walletBalance = this.getBalanceOfAddress(transaction.fromAddress);
      if (walletBalance < transaction.amount) {
        throw new Error('Sem fundos');
      }
  

      const pendingTxForWallet = this.pendingTransactions
        .filter(tx => tx.fromAddress === transaction.fromAddress);
  
      /**
       * Verificação se a quantidade total de transactions pendentes
       * mais o valor das transação atual é maior que os fundos atuais
       */
      if (pendingTxForWallet.length > 0) {
        const totalPendingAmount = pendingTxForWallet
          .map(tx => tx.amount)
          .reduce((prev, curr) => prev + curr);
  
        const totalAmount = totalPendingAmount + transaction.amount;
        if (totalAmount > walletBalance) {
          throw new Error('O numero de transações pendentes é maior que os fundos atuais');
        }
      }
                                      
  
      this.pendingTransactions.push(transaction);
      console.log('transaction added: %s', transaction);
    }
  
    /**
     * Retorna o saldo atual de um dado endereço
     *
     * @param {string} address
     * @returns {number}
     */
    getBalanceOfAddress(address) {
      let balance = 0;
  
      for (const block of this.chain) {
        for (const trans of block.transactions) {
          if (trans.fromAddress === address) {
            balance -= trans.amount;
          }
  
          if (trans.toAddress === address) {
            balance += trans.amount;
          }
        }
      }
  
      console.log('Saldo da carteira: %s', balance);
      return balance;
    }
  
    /**
     * Pega todas as transações para um dado endereço
     *
     * @param  {string} address
     * @return {Transaction[]}
     */
    getAllTransactionsForWallet(address) {
      const txs = [];
  
      for (const block of this.chain) {
        for (const tx of block.transactions) {
          if (tx.fromAddress === address || tx.toAddress === address) {
            txs.push(tx);
          }
        }
      }
  
      console.log('get transactions for wallet count: %s', txs.length);
      return txs;
    }
  
    /**
     * Verifica a autenticidade da blockchain levando em consideração:
     * 1- Se calcula novamente o bloco gênese e ele é comparado com o bloco na posição 0
     * 2- Verificada se cada bloco não gênese tem possuí o hash do bloco anterior
     * 3- Verifica se cada transação contida no bloco está devidamente assinada
     * 4- Recalcula o hash do bloco atual e compara com o hash presente no bloco
     *
     * @returns {boolean}
     */
    isChainValid() {
      // Caso de verificação 1
      const realGenesis = JSON.stringify(this.createGenesisBlock());
  
      if (realGenesis !== JSON.stringify(this.chain[0])) {
        return false;
      }
  
      
      for (let i = 1; i < this.chain.length; i++) {
        const currentBlock = this.chain[i];
        const previousBlock = this.chain[i - 1];
        // Caso de verificação 2 
        if (previousBlock.hash !== currentBlock.previousHash) {
          return false;
        }
        // Caso de verificação 3
        if (!currentBlock.hasValidTransactions()) {
          return false;
        }
        // Caso de verificação 4
        if (currentBlock.hash !== currentBlock.calculateHash()) {
          return false;
        }
      }
  
      return true;
    }
    /**
     * Função para fins de testes apenas:
     * Ira pegar algum bloco aleatório  da blockchain e comrromper seu hash
     * Isso irá tornar toda blockchain initilizável 
     */
    corruptChain(){
        const position = getRandomInt(0,this.chain.length-1)
        this.chain[position].hash = "junk_value"
    }
    /**
     * Método para aumentar ou diminuir a dificuldade 
     * @param {int}
     */
    setDificulty(difficulty){
        difficulty = Math.floor(difficulty);
        if(difficulty<1){
            throw new Error('A dificuldade não pode ser menor que 1');
        }
        this.difficulty = difficulty
    }
    /**
     * Metódo que retorna e exibe todos os blocos atuais da blockchain
     * @returns {Block[]}
     */
    getCurrentBlocks(){
    console.log("Blocos da blockchain: ")
    console.log("----------------------------------------------------")
    for(const [index,block] of this.chain.entries()){
      console.log("{\n")
      if(index === 0 && block.previousHash === ""){
        console.log("(Bloco Gênese)\n")
      }
      console.log(`Hash: ${block.hash} \n`)
      console.log(`Hash Anterior: ${block.previousHash? block.previousHash : "Nenhum"}\n`)
      console.log(`Nonce: ${block.nonce}\n`)
      console.log(`Transações válidas: ${block.hasValidTransactions()? "Sim" : "Não"}\n`)
      console.log(`Criação: ${block.timestamp}\n`)
      console.log("\n}")
    }    
  
    return this.chain


    }
  }
  
  module.exports.Blockchain = Blockchain;