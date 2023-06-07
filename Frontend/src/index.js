const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('mongodb');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyParser.json());

const uri = "mongodb+srv://sean-root:SeanSeanTele@app.nonly3s.mongodb.net/app?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    await client.connect();
    const database = client.db('test');
    const users = database.collection('users');
    
    const user = await users.findOne({ username: username });

    if(user && bcrypt.compareSync(password, user.password)){
      res.send({ login: true });
    } else {
      res.send({ login: false });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send({ error: 'An error occurred during login' });
  } finally {
    await client.close();
  }
});

app.listen(5000, () => console.log('Server is running on port 5000'));
