const {verifySignature,signWithKey} = require("../utils/publicKeyUtil")
const crypto = require('crypto');
class Transaction {
    /**
     * Método construtor recebe os parâmetros
     * @param {*} fromAddress 
     * @param {*} toAddress 
     * @param {*} amount 
     */
    constructor(fromAddress, toAddress, amount,isFromMining=false) {
      
      this.fromAddress = fromAddress;
      this.toAddress = toAddress;
      this.amount = amount;
      this.timestamp = Date.now();
      this.isFromMining = isFromMining;
    }
    /**
     * Gera o hash da transação usando o algoritmo sha256 
     * em cima da concatenação do endereço de origem, endereço de destino,
     * valor da transação e timestamp
     * @returns {string}
     */
    calculateHash() {
      return crypto.createHash('sha256').update(this.fromAddress + this.toAddress + this.amount + this.timestamp).digest('hex');
    }
  
    /**
     * Recebe como parâmetro a chave pública gerada pela função de gerar pares de 
     * chaves
     *
     * @param {string} signingKey
     */
    signTransaction(signingKey) {
    /**  
     * Verifica se a chave recebida para assinatura é a mesma chave no endeço de
     * origem
    */
      if (signingKey !== this.fromAddress) {
        throw new Error('Não é possível assinar transactions para outras carteiras!');
      }
      
  
 /**
  * Calcula o hash da transaction, assina o hash utilizando a chave passada por
  * parâmetro seta a assinatura da classe
  */
      const hashTx = this.calculateHash();
      const sig = signWithKey(signingKey,hashTx) 
  
      this.signature = sig
    }
  
    /**
     * Verifica a validade da transação pelo endereço de origem
     * O endeço de origem é passado para o módulo de geração de chaves
     * que irá realizar o trabalho de parsear a string para um objeto de
     * chave utilizá
     *
     * @returns {boolean}
     */
    isValid() {
      /**
       * Se o endereço de origem for nulo se considera que a transaction é resultado do
       * provcesso de mineração de bloco
       * Além disso a propriedade isFromMining deve ser verdadeira para confirmar que a transaction
       * surgiu do processo de mineração de um novo bloco não da transferência entre dois endereços
       */
      if (this.fromAddress === null&&this.isFromMining=== true) return true;
  
      if (!this.signature || this.signature.length === 0) {
        throw new Error('Essa transação não é confiável, pois não tem assinatura');
      }
  
   
      return verifySignature(this.fromAddress,this.calculateHash(),this.signature) 
    }
  }
module.exports.Transaction = Transaction;