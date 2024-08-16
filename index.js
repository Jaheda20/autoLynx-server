const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.al6znur.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {

    const carsCollection = client.db('autolynxDB').collection('allCars');

    // cars related api
    app.get('/cars', async(req, res)=>{
        const search = req.query.search;
        const sort = req.query.sort;
        let query = {
            name: { $regex: search, $options: 'i' }
        }
        let options = {}
        if(sort) options = { sort: { price: sort === 'asc' ? 1 : -1 } }
        // const cursor = carsCollection.find()
        // const result = await cursor.toArray()
        const result = await carsCollection
            .find(query, options).toArray()
        res.send(result)
    })

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res)=>{
    res.send('autolynx is running')
})

app.listen(port, ()=>{
    console.log(`AutoLynx is running on port ${port}`)
})