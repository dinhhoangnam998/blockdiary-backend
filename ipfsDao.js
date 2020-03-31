const ipfsClient = require('ipfs-http-client')
const { CID } = ipfsClient;
const ipfs = ipfsClient(process.env.IPFS_PROVIDER)

const addData = async (data) => {
  for await (const file of ipfs.add(data)) {
    return file.cid.toString();
  }
}

const catData = async (cid) => {
  let chunk = []
  for await (const buf of ipfs.cat(new CID(cid))) {
    chunk.push(buf);
  }
  return Buffer.concat(chunk).toString();
}

module.exports = {addData, catData};