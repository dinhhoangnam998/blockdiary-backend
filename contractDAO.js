import Web3 from 'web3'
const MyBlockDiary = require("./MyBlockDiary.json");

const publicKey = process.env.PUBLIC_KEY;
const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.CONTRACT_ADDRESS;
const provider = process.env.WEB3_PROVIDER;

const web3 = new Web3(provider);
web3.eth.accounts.wallet.add(privateKey);
web3.eth.defaultAccount = publicKey;

const instance = new web3.eth.Contract(MyBlockDiary.abi, contractAddress, { from: publicKey });

const sendTx = async (tx) => {
  const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
  return web3.eth.sendSignedTransaction(signedTx.rawTransaction);
}

const addCid = async (cid) => {
  const tx = {
    to: contractAddress,
    data: instance.methods.addCid(cid).encodeABI(),
    gas: '1000000',
    nonce: web3.eth.getTransactionCount(publicKey)
  };
  return sendTx(tx);
}

const getCids = async () => {
  return instance.methods.getCids().call();
}

module.exports = { addCid, getCids };