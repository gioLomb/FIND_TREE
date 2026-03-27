const { MongoClient, ObjectId } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017/');

// Connessione condivisa: viene inizializzata una sola volta
let connectionPromise = null;
let collection;

// Restituisce la collection, aprendo la connessione se non ancora attiva
async function connectDb() {
  if (!connectionPromise) {
    connectionPromise = client.connect().then(() => {
      const db = client.db('find_tree');
      collection = db.collection('trees');
      console.log('CONNESSO');
    });
  }
  await connectionPromise;
  return collection;
}

// Elimina un albero per ObjectId
async function deleteTreeFromDb(id) {
  try {
    const treesCollection = await connectDb();
    const result = await treesCollection.deleteOne({ "_id": new ObjectId(id) });
    return result;
  } catch (err) { throw err; }
}

// Cerca un singolo albero per ObjectId
async function getFilteredTree(id) {
  try {
    const treesCollection = await connectDb();
    const result = await treesCollection.findOne({ "_id": new ObjectId(id) });
    return result;
  } catch (err) { throw err; }
}

// Inserisce un nuovo albero { tree, lat, lng }
async function addTreeInDb(formDataObject) {
  try {
    const treesCollection = await connectDb();
    const ris = await treesCollection.insertOne(formDataObject);
    return ris;
  } catch (err) {
    console.log('error adding a tree on db:', err);
    return err;
  }
}

// Restituisce tutti gli alberi come array
async function getAllTreesFromDb() {
  try {
    const treesCollection = await connectDb();
    const trees = treesCollection.find();
    return trees.toArray();
  } catch (err) {
    console.log('error getting the trees from db:', err);
    return err;
  }
}

// Chiude la connessione al database
async function closeDb(client) {
  await client.close();
  console.log('conn chiusa');
}

module.exports = { connectDb, addTreeInDb, getAllTreesFromDb, closeDb, getFilteredTree, deleteTreeFromDb };