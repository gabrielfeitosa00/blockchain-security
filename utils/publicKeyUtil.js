const EC = require('elliptic').ec;
const ec = new EC('secp256k1');
const generateKeyPair = () =>{
    const key = ec.genKeyPair();
    const publicKey = key.getPublic('hex');
    const privateKey = key.getPrivate('hex');
    return {publicKey,privateKey}

}

const signWithKey= (key,content)=>{
    const signature = key.sign(content, 'base64');
    return signature.toDER('hex');
}

const verifySignature=(key,content,sign)=>{
    const parsedKey = ec.keyFromPublic(key, 'hex');
    return parsedKey.verify(content,sign)
}

const getPublic = (key)=>{
    return key.getPublic('hex')
}

exports.generateKeyPair = generateKeyPair
exports.signWithKey = signWithKey
exports.verifySignature = verifySignature