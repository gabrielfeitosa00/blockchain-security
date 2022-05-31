const { Transaction } = require('./transactions');
class Block {
    /**
     * Método construtor que recebe como parâmetro uma timestamp, 
     * Um array de transações,
     * O hash do bloco anterior
     * @param {number} timestamp
     * @param {Transaction[]} transactions
     * @param {string} previousHash
     */
    constructor(timestamp, transactions, previousHash = '') {
      this.previousHash = previousHash;
      this.timestamp = timestamp;
      this.transactions = transactions;
      this.nonce = 0;
      this.hash = this.calculateHash();
    }
  
    /**
     * Calcula o hash do bloco usando o algoritmo sha256 
     * em cima da concatenação do hash anterior, timestamp do bloco, array de transações,
     * e o nonce do bloco
     *
     * @returns {string}
     */
    calculateHash() {
      return crypto.createHash('sha256').update(this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).digest('hex');
    }
  
    /**
     * Minera o bloco baseado na dificulade passada por parâmetro
     * No processo de mineração nonce do bloco é alterado e o hash é refeito
     * até que o hash tenha um número de zeros no seu ínicio que é igual a dificuldade
     * Ex: Se a dificuldade é 5 o nonce é alterado até que o hash começe com 5 zeros
     *
     * @param {number} difficulty
     */
    mineBlock(difficulty) {
      while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
        this.nonce++;
        this.hash = this.calculateHash();
      }
  
      debug(`Bloco minerado: ${this.hash}`);
      debug(`Nonce do bloco após a mineração: ${this.nonce}`)
    }
  
    /**
     * Verifica o array de transações do bloco
     * caso alguma das trasações não seja valida o bloco não é válido
     *
     * @returns {boolean}
     */
    hasValidTransactions() {
      for (const tx of this.transactions) {
        if (!tx.isValid()) {
          return false;
        }
      }
  
      return true;
    }
  }

  module.exports.Block = Block;