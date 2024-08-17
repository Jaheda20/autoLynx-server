const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


app.use(express.json())
app.use(cors())


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
        // for featured items
        app.get('/allCars', async (req, res)=>{
            const result = await carsCollection.find().toArray()
            res.send(result)
        })

        // for all cars page
        app.get('/cars', async (req, res) => {
            const size = parseInt(req.query.size) || 5
            const page = parseInt(req.query.page) - 1
            const search = req.query.search || '';
            const sortField = req.query.sortField;
            const sortOrder = req.query.sortOrder;
            const brand = req.query.brand;
            const type = req.query.type;
            const fuelType = req.query.fuel_type;
            const searchPattern = String(search)
            let query = {
                name: { $regex: searchPattern, $options: 'i' }
            }

            if(brand) {
                query.brand = brand
            }

            if(type) {
                query.type = type
            }

            if(fuelType) {
                query.fuel_type = fuelType
            }
            let sortOptions = {}
            if (sortField) {
                sortOptions[sortField] = sortOrder === 'asc' ? 1 : -1
            }

            const options = { sort: sortOptions }

            const totalCars = await carsCollection.countDocuments(query)
            const cars = await carsCollection
                .find(query, options)
                .skip(page * size)
                .limit(size)
                .toArray()

            const totalPages = Math.ceil(totalCars / size)

            res.send(
                {
                    cars: cars || [],
                    totalCars,
                    totalPages
                }
            )
        })

        // single car data api
        app.get('/car/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)}
            const result = await carsCollection.findOne(query)
            res.send(result)
        })

        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection       
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('autolynx is running')
})

app.listen(port, () => {
    console.log(`AutoLynx is running on port ${port}`)
})