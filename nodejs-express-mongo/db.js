const { MongoClient, ObjectId } = require("mongodb");

const connectionUrl = "mongodb://localhost:27017";

const dbName = "store";
let db;

const init = () =>
  MongoClient.connect(connectionUrl).then(
    (client) => {
      db = client.db(dbName);
    }
  );


const insertItem = (item) => {
  return db.collection('items').insertOne(item)
}

const getItems = () => {
  return db.collection('items').find({}).toArray()
}

const getItem = (_id) => {
  return db.collection('items').findOne({ _id: new ObjectId(_id) })
}

const updateQuantityOrName = (_id, { quantity, name }) => {
  const updateObj = {};

  if (quantity !== undefined) {
    updateObj['$inc'] = { quantity };
  }

  if (name !== undefined) {
    updateObj['$set'] = { name };
  }

  return db.collection('items').updateOne({ _id: new ObjectId(_id) }, updateObj);
}


module.exports = {
  init,
  insertItem,
  getItem,
  getItems,
  updateQuantityOrName
}