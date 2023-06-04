const express = require('express');
import { eCollections } from './enums';
import { ItemsDataBase } from './items';

const { MongoClient } = require('mongodb');

// MongoDB Atlas connection string
const uri = 'mongodb+srv://sean-root:SeanSeanTele@app.nonly3s.mongodb.net/app?retryWrites=true&w=majority';

const collectionName = 'billing';
let itemsDataBase: ItemsDataBase = new ItemsDataBase(undefined);


// Create Express app
const app = express();

app.listen(3000, function () {
  console.log("Server is listening on port 3000!");
});

// Function to connect to MongoDB Atlas and retrieve collections
async function connectToMongoDb() {
  try {
    // Connect to MongoDB Atlas
    const client = await MongoClient.connect(uri);
    console.log('Connected to MongoDB Atlas');
    itemsDataBase = new ItemsDataBase(client);

  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error);
  }
}

// Call the function to connect and retrieve collections
connectToMongoDb();


app.post("/getUsersProfile", async function (req, res) {
  const collection = await itemsDataBase.getCollection(eCollections.eUserProfiles);


});