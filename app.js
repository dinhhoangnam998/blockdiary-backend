// const MongoClient = require("mongodb").MongoClient;
import MongoClient from "mongodb"
const express = require("express")
const cors = require('cors')

const main = async () => {
  const client = await MongoClient.connect(process.env.MONGODB_URI);
  const db = client.db();
  const clt = db.collection('...')

  const app = express()
  app.use(express.json())
  app.use(cors())



  app.listen(process.env.PORT)
}

main();


