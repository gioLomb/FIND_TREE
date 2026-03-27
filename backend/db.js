const {MongoClient, ObjectId}=require('mongodb')
const client= new MongoClient('mongodb://localhost:27017/')
let connectionPromise = null;
let collection;

async function connectDb(){
    if(!connectionPromise){
        connectionPromise = client.connect().then(()=>{
            const db = client.db('find_tree')
            collection = db.collection('trees')
            console.log('CONNESSO')
        })
    }
    await connectionPromise
    return collection
}
async function deleteTreeFromDb(id){
    try{
        const treesCollection=await connectDb()
        const result=await treesCollection.deleteOne({"_id":new ObjectId(id)})
        return result
    }catch(err){throw err}
}
async function getFilteredTree(id){
    try{
        const treesCollection=await connectDb()
        let result=await treesCollection.findOne({"_id": new ObjectId(id)})
        return result;
    }catch(err){
        throw err;
    }
}

async function addTreeInDb(formDataObject){
    try{
        const treesCollection=await connectDb()
let ris=await treesCollection.insertOne(formDataObject)
//console.log(await collection.find().toArray())
return ris

    }catch(err){console.log('error adding a tree on db:',err);return err;}

}
async function getAllTreesFromDb(){
    try{
        const treesCollection=await connectDb()
        const trees=treesCollection.find()
        return trees.toArray()
    }catch(err){console.log('error getting the trees from db:',err);return err;}
}
async function closeDb(client){
await client.close()
console.log('conn chiusa')
}
module.exports={connectDb, addTreeInDb,getAllTreesFromDb,closeDb,getFilteredTree,deleteTreeFromDb}