const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

const dbName = 'relatedProducts';

const main = async (command, info) => {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('products');
  collection.createIndex({current_product_id:1});

  console.log('command', command, 'id,', info)
  // the following code examples can be pasted here...
 

//now do different things based on the input command
if (command === 'findRelated') {
    //now find all the related for the given id
    let findResult = await collection.find({current_product_id: parseInt(info)}).toArray();

console.log('Found documents =>', findResult);
return findResult;
// } else if (command === 'findAllProductInfo') {
//     let result = [];
//     info.forEach(item => {
//         //now find the item product id in mongo
//     })

//     console.log('Found documents =>', findResult);
 }

  return 'done.';
}
//calling function to grab all of a certain ID
exports.mongo = main;