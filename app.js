// const MongoClient = require("mongodb").MongoClient;
import MongoClient from "mongodb"
const express = require("express")
const cors = require('cors')

const contractDao = require('./contractDao');
const ipfsDao = require('./ipfsDao')

const app = express()
app.use(express.json())
app.use(cors())

const main = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  const clt = db.collection('diaries');

  app.get('/diaries', (req, res) => {
    clt.find({}).toArray().then(docs => res.json(docs));
  });

  app.post('/diaries', (req, res) => {
    const diary = req.body;
    ipfsDao.addData(JSON.stringify(diary))
      .then(cid => contractDao.addCid(cid))
      .then(receipt => {
        diary.cid = cid;
        diary.transactionHash = receipt.transactionHash;
        diary.blockHash = receipt.blockHash;
        const result = await clt.insertOne(JSON.stringify(diary));
        res.json(diary);
      });
  });

  app.listen(process.env.PORT)
}

main();


