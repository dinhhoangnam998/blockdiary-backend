import MongoClient from "mongodb"
const express = require("express")
const cors = require('cors')

const ipfsDao = require('./ipfsdao');
const contractDao = require('./contractdao');

const app = express()
app.use(express.json())
app.use(cors())

const fillDiary = (receipt, diary) => {
  diary.blockNumber = receipt.blockNumber;
  diary.cid = cid;
  diary.transactionHash = receipt.transactionHash;
  diary.blockHash = receipt.blockHash;
  diary.status = true;
  diary.timestamp = new Date();
  return diary;
}

const main = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  const clt = db.collection('diaries');

  app.get('/diaries', async (req, res) => {
    const docs = await clt.find({}).toArray();
    res.json(docs);
  });

  app.post('/diaries', async (req, res) => {
    const diary = req.body;
    const cid = await ipfsDao.addData(JSON.stringify(diary));
    const receipt = await contractDao.addCid(cid);
    fillDiary(receipt, diary);
    const result = await clt.insertOne(diary);
    res.json(diary);
  })

  app.listen(process.env.PORT)
}

main();
 

